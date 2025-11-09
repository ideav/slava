// Конфигурация для уведомлений
// Скопируйте этот файл в config.js и заполните своими данными

window.emailjsConfig = {
    // EmailJS конфигурация
    // Для настройки:
    // 1. Зарегистрируйтесь на https://www.emailjs.com/
    // 2. Создайте Email Service
    // 3. Создайте Email Template
    // 4. Получите Public Key в разделе Account
    emailjs: {
        enabled: false, // Установите true после настройки
        serviceId: 'YOUR_SERVICE_ID', // Замените на ваш Service ID
        templateId: 'YOUR_TEMPLATE_ID', // Замените на ваш Template ID
        publicKey: 'YOUR_PUBLIC_KEY' // Замените на ваш Public Key
    },

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
