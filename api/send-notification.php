<?php
/**
 * API endpoint для отправки уведомлений
 * Поддерживает отправку через Email (SMTP) и Telegram Bot API
 *
 * PHP Version: 7.4.33
 */

// Разрешаем CORS для локальной разработки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit();
}

// Загружаем конфигурацию
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Файл конфигурации не найден. Создайте api/config.php из api/config.template.php']);
    exit();
}

require_once $configFile;

// Получаем данные из запроса
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректные данные запроса']);
    exit();
}

// Валидация обязательных полей
$requiredFields = ['name', 'email', 'message'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Поле '{$field}' обязательно для заполнения"]);
        exit();
    }
}

// Подготовка данных
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
$phone = isset($data['phone']) ? htmlspecialchars($data['phone'], ENT_QUOTES, 'UTF-8') : 'не указан';
$message = htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8');
$artwork = isset($data['artwork']) ? htmlspecialchars($data['artwork'], ENT_QUOTES, 'UTF-8') : 'Общий запрос';

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректный email адрес']);
    exit();
}

// Результаты отправки
$results = [
    'email' => false,
    'telegram' => false,
    'errors' => []
];

// Отправка Email
if ($config['email']['enabled']) {
    try {
        $emailSent = sendEmail($config, $name, $email, $phone, $artwork, $message);
        $results['email'] = $emailSent;
        if (!$emailSent) {
            $results['errors'][] = 'Не удалось отправить email';
        }
    } catch (Exception $e) {
        $results['errors'][] = 'Email ошибка: ' . $e->getMessage();
        error_log('Email error: ' . $e->getMessage());
    }
}

// Отправка в Telegram
if ($config['telegram']['enabled']) {
    try {
        $telegramSent = sendTelegram($config, $name, $email, $phone, $artwork, $message);
        $results['telegram'] = $telegramSent;
        if (!$telegramSent) {
            $results['errors'][] = 'Не удалось отправить в Telegram';
        }
    } catch (Exception $e) {
        $results['errors'][] = 'Telegram ошибка: ' . $e->getMessage();
        error_log('Telegram error: ' . $e->getMessage());
    }
}

// Проверяем результат
$success = $results['email'] || $results['telegram'];

if ($success) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Сообщение успешно отправлено',
        'details' => $results
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Не удалось отправить уведомления',
        'details' => $results
    ]);
}

/**
 * Отправка email через SMTP
 */
function sendEmail($config, $name, $email, $phone, $artwork, $message) {
    $emailConfig = $config['email'];

    // Формируем текст письма из шаблона
    $emailBody = $config['emailTemplate'];
    $emailBody = str_replace('{{from_name}}', $name, $emailBody);
    $emailBody = str_replace('{{from_email}}', $email, $emailBody);
    $emailBody = str_replace('{{phone}}', $phone, $emailBody);
    $emailBody = str_replace('{{artwork}}', $artwork, $emailBody);
    $emailBody = str_replace('{{message}}', $message, $emailBody);

    // Заголовки письма
    $headers = [
        'From: ' . $emailConfig['from_email'],
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    // Если настроен SMTP, используем его
    if (!empty($emailConfig['smtp_host'])) {
        return sendEmailViaSMTP($emailConfig, $emailBody, $headers);
    }

    // Иначе используем стандартную функцию mail()
    $subject = 'Новый запрос с сайта Вячеслава Пешкина';
    return mail($emailConfig['to_email'], $subject, $emailBody, implode("\r\n", $headers));
}

/**
 * Отправка email через SMTP (для Яндекс, Gmail и др.)
 */
function sendEmailViaSMTP($emailConfig, $body, $headers) {
    $smtpHost = $emailConfig['smtp_host'];
    $smtpPort = $emailConfig['smtp_port'];
    $smtpUser = $emailConfig['smtp_user'];
    $smtpPass = $emailConfig['smtp_pass'];
    $toEmail = $emailConfig['to_email'];
    $fromEmail = $emailConfig['from_email'];

    // Подключение к SMTP серверу
    $socket = @fsockopen($smtpHost, $smtpPort, $errno, $errstr, 10);
    if (!$socket) {
        error_log("SMTP connection failed: $errstr ($errno)");
        return false;
    }

    // Функция для чтения ответа
    $read = function() use ($socket) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $response;
    };

    // Функция для отправки команды
    $send = function($cmd) use ($socket, $read) {
        fputs($socket, $cmd . "\r\n");
        return $read();
    };

    try {
        // SMTP диалог
        $read(); // Приветствие сервера
        $send("EHLO " . $smtpHost);
        $send("AUTH LOGIN");
        $send(base64_encode($smtpUser));
        $send(base64_encode($smtpPass));
        $send("MAIL FROM: <{$fromEmail}>");
        $send("RCPT TO: <{$toEmail}>");
        $send("DATA");

        // Формируем письмо
        $email = "From: {$fromEmail}\r\n";
        $email .= "To: {$toEmail}\r\n";
        $email .= "Subject: =?UTF-8?B?" . base64_encode('Новый запрос с сайта Вячеслава Пешкина') . "?=\r\n";
        $email .= "MIME-Version: 1.0\r\n";
        $email .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $email .= "Content-Transfer-Encoding: 8bit\r\n";
        $email .= "\r\n";
        $email .= $body;
        $email .= "\r\n.\r\n";

        $response = $send($email);
        $send("QUIT");

        fclose($socket);

        // Проверяем успешность отправки (код 250)
        return strpos($response, '250') !== false;

    } catch (Exception $e) {
        if (is_resource($socket)) {
            fclose($socket);
        }
        error_log("SMTP error: " . $e->getMessage());
        return false;
    }
}

/**
 * Отправка сообщения в Telegram
 */
function sendTelegram($config, $name, $email, $phone, $artwork, $message) {
    $telegramConfig = $config['telegram'];

    // Формируем текст сообщения
    $text = "🎨 Новый запрос с сайта Вячеслава Пешкина\n\n";
    $text .= "👤 Имя: {$name}\n";
    $text .= "📧 Email: {$email}\n";
    $text .= "📱 Телефон: {$phone}\n\n";
    $text .= "🖼 Картина: {$artwork}\n\n";
    $text .= "💬 Сообщение:\n{$message}";

    // Отправка через Telegram Bot API
    $url = "https://api.telegram.org/bot{$telegramConfig['bot_token']}/sendMessage";

    $data = [
        'chat_id' => $telegramConfig['chat_id'],
        'text' => $text,
        'parse_mode' => 'HTML'
    ];

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data),
            'timeout' => 10
        ]
    ];

    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);

    if ($result === false) {
        error_log('Telegram API request failed');
        return false;
    }

    $response = json_decode($result, true);
    return isset($response['ok']) && $response['ok'] === true;
}
