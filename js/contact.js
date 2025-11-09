// Загрузка конфигурации (если существует)
let config = {
    emailjs: {
        enabled: false,
        serviceId: '',
        templateId: '',
        publicKey: ''
    },
    telegram: {
        enabled: false,
        botToken: '',
        chatId: ''
    }
};

// Попытка загрузить config.js если он существует
try {
    if (typeof window.emailjsConfig !== 'undefined') {
        config = window.emailjsConfig;
    }
} catch (e) {
    console.log('Config file not found, using defaults');
}

// Заполнение select с картинами
function populateArtworkSelect() {
    const select = document.getElementById('artwork-select');

    artworks.forEach(artwork => {
        const option = document.createElement('option');
        option.value = artwork.id;
        option.textContent = `${artwork.title} (${artwork.year})`;
        select.appendChild(option);
    });

    // Проверяем, была ли выбрана картина из галереи
    const selectedId = localStorage.getItem('selectedArtworkId');
    if (selectedId) {
        select.value = selectedId;
        showSelectedArtwork(parseInt(selectedId));
        localStorage.removeItem('selectedArtworkId');
    }
}

// Отображение выбранной картины
function showSelectedArtwork(artworkId) {
    if (!artworkId) {
        document.getElementById('selected-artwork').classList.remove('show');
        return;
    }

    const artwork = artworks.find(a => a.id === parseInt(artworkId));
    if (!artwork) return;

    const container = document.getElementById('selected-artwork');
    const img = document.getElementById('artwork-image');
    const info = document.getElementById('artwork-info');

    img.src = `images/gallery/${artwork.filename}`;
    img.alt = artwork.title;

    info.innerHTML = `
        <strong>${artwork.title}</strong><br>
        ${artwork.material}, ${artwork.size}<br>
        Год: ${artwork.year}<br>
        Цена: ${artwork.price.toLocaleString('ru-RU')} ₽
    `;

    container.classList.add('show');
}

// Обработчик изменения выбора картины
document.addEventListener('DOMContentLoaded', function() {
    populateArtworkSelect();

    document.getElementById('artwork-select').addEventListener('change', function(e) {
        const artworkId = e.target.value;
        showSelectedArtwork(artworkId);
    });

    // Обработчик отправки формы
    document.getElementById('contact-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            artworkId: document.getElementById('artwork-select').value
        };

        // Получаем информацию о выбранной картине
        let artworkInfo = 'Общий запрос';
        if (formData.artworkId) {
            const artwork = artworks.find(a => a.id === parseInt(formData.artworkId));
            if (artwork) {
                artworkInfo = `${artwork.title} (${artwork.year}, ${artwork.price.toLocaleString('ru-RU')} ₽)`;
            }
        }

        // Формируем текст сообщения
        const messageText = `
🎨 Новый запрос с сайта Вячеслава Пешкина

👤 Имя: ${formData.name}
📧 Email: ${formData.email}
📱 Телефон: ${formData.phone || 'не указан'}

🖼 Картина: ${artworkInfo}

💬 Сообщение:
${formData.message}
        `.trim();

        try {
            // Отправка через EmailJS (если настроено)
            let emailSent = false;
            if (config.emailjs.enabled && typeof emailjs !== 'undefined') {
                try {
                    await emailjs.send(
                        config.emailjs.serviceId,
                        config.emailjs.templateId,
                        {
                            from_name: formData.name,
                            from_email: formData.email,
                            phone: formData.phone,
                            artwork: artworkInfo,
                            message: formData.message,
                            full_message: messageText
                        },
                        config.emailjs.publicKey
                    );
                    emailSent = true;
                    console.log('Email sent successfully');
                } catch (emailError) {
                    console.error('Email error:', emailError);
                }
            }

            // Отправка в Telegram (если настроено)
            let telegramSent = false;
            if (config.telegram.enabled && config.telegram.botToken && config.telegram.chatId) {
                try {
                    const telegramUrl = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
                    const response = await fetch(telegramUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: config.telegram.chatId,
                            text: messageText,
                            parse_mode: 'HTML'
                        })
                    });

                    if (response.ok) {
                        telegramSent = true;
                        console.log('Telegram message sent successfully');
                    }
                } catch (telegramError) {
                    console.error('Telegram error:', telegramError);
                }
            }

            // Показываем результат
            if (emailSent || telegramSent || (!config.emailjs.enabled && !config.telegram.enabled)) {
                showSuccess();
                document.getElementById('contact-form').reset();
                document.getElementById('selected-artwork').classList.remove('show');
            } else {
                showError('Не удалось отправить сообщение. Проверьте настройки уведомлений.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Произошла ошибка при отправке сообщения.');
        }
    });
});

// Функции для отображения сообщений
function showSuccess() {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    errorMsg.classList.remove('show');
    successMsg.classList.add('show');

    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);

    // Прокрутка к сообщению
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(message) {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    successMsg.classList.remove('show');
    errorText.textContent = message;
    errorMsg.classList.add('show');

    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 5000);

    // Прокрутка к сообщению
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
