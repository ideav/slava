// Конфигурация API endpoint
// Укажите путь к вашему PHP скрипту
const API_ENDPOINT = 'api/send-notification.php';

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

        // Отправка данных на PHP backend
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || '',
                    artwork: artworkInfo,
                    message: formData.message
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showSuccess();
                document.getElementById('contact-form').reset();
                document.getElementById('selected-artwork').classList.remove('show');
                console.log('Уведомление отправлено:', result.details);
            } else {
                const errorMessage = result.message || 'Не удалось отправить сообщение';
                showError(errorMessage);
                console.error('Ошибка:', result);
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            showError('Произошла ошибка при отправке сообщения. Проверьте подключение к интернету.');
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
