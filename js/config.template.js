// Конфигурация для уведомлений
// Скопируйте этот файл в config.js и заполните своими данными

window.emailjsConfig = {
    // EmailJS конфигурация для работы с Яндекс SMTP
    // Для настройки:
    // 1. Зарегистрируйтесь на https://www.emailjs.com/
    // 2. Создайте Email Service выбрав "Yandex" в качестве провайдера
    //    - SMTP Server: smtp.yandex.ru
    //    - Port: 465 (SSL) или 587 (TLS)
    //    - Укажите ваш яндекс email и пароль приложения
    // 3. Получите Public Key в разделе Account
    // 4. Шаблон письма настраивается ниже в поле emailTemplate
    emailjs: {
        enabled: false, // Установите true после настройки
        serviceId: 'YOUR_SERVICE_ID', // Замените на ваш Service ID из EmailJS
        templateId: 'YOUR_TEMPLATE_ID', // Замените на ваш Template ID из EmailJS
        publicKey: 'YOUR_PUBLIC_KEY' // Замените на ваш Public Key из EmailJS
    },

    // Шаблон письма (текстовый формат)
    // Этот шаблон используется для формирования письма
    // Доступные переменные: {{from_name}}, {{from_email}}, {{phone}}, {{artwork}}, {{message}}
    emailTemplate: `Новый запрос с сайта Вячеслава Пешкина

Контактная информация:
Имя: {{from_name}}
Email: {{from_email}}
Телефон: {{phone}}

Интересующая картина:
{{artwork}}

Сообщение:
{{message}}

---
С уважением,
Форма обратной связи сайта`,

    // Telegram Bot конфигурация
    // Для настройки:
    // 1. Создайте бота через @BotFather в Telegram
    // 2. Получите Bot Token
    // 3. Узнайте ваш Chat ID (можно через @userinfobot)
    telegram: {
        enabled: false, // Установите true после настройки
        botToken: 'YOUR_BOT_TOKEN', // Замените на токен вашего бота
        chatId: 'YOUR_CHAT_ID' // Замените на ваш Chat ID
    }
};

// ВАЖНО: Добавьте config.js в .gitignore чтобы не выложить секретные данные!
