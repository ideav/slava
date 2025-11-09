// Функция для форматирования цены
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// Функция для отображения картин
function displayArtworks(artworksToDisplay) {
    const container = document.getElementById('gallery-container');

    if (artworksToDisplay.length === 0) {
        container.innerHTML = '<div class="no-results">Картины не найдены. Попробуйте изменить фильтры.</div>';
        return;
    }

    let html = '<div class="gallery-grid">';

    artworksToDisplay.forEach(artwork => {
        html += `
            <div class="artwork-card">
                <img src="images/gallery/${artwork.filename}"
                     alt="${artwork.title}"
                     class="artwork-image"
                     onclick="openModal('images/gallery/${artwork.filename}')">
                <div class="artwork-info">
                    <div class="artwork-title">${artwork.title}</div>
                    <div class="artwork-details">${artwork.material}</div>
                    <div class="artwork-details">${artwork.size}</div>
                    <div class="artwork-details">Год: ${artwork.year}</div>
                    <div class="artwork-price">${formatPrice(artwork.price)}</div>
                    <button class="btn contact-btn" onclick="contactAboutArtwork(${artwork.id})">
                        Связаться по этой картине
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Функция для заполнения фильтра по годам
function populateYearFilter() {
    const years = [...new Set(artworks.map(a => a.year))].sort((a, b) => b - a);
    const yearFilter = document.getElementById('year-filter');

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

// Функция применения фильтров
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const year = document.getElementById('year-filter').value;
    const priceMin = parseFloat(document.getElementById('price-min').value) || 0;
    const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity;

    let filtered = artworks.filter(artwork => {
        const categoryMatch = category === 'all' || artwork.category === category;
        const yearMatch = year === 'all' || artwork.year === parseInt(year);
        const priceMatch = artwork.price >= priceMin && artwork.price <= priceMax;

        return categoryMatch && yearMatch && priceMatch;
    });

    displayArtworks(filtered);
}

// Функция сброса фильтров
function resetFilters() {
    document.getElementById('category-filter').value = 'all';
    document.getElementById('year-filter').value = 'all';
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    displayArtworks(artworks);
}

// Функция открытия модального окна
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modal-image');
    modal.style.display = 'block';
    modalImg.src = imageSrc;
}

// Функция закрытия модального окна
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Закрытие модального окна при клике вне изображения
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Функция для перехода к форме контакта с выбранной картиной
function contactAboutArtwork(artworkId) {
    // Сохраняем ID выбранной картины в localStorage
    localStorage.setItem('selectedArtworkId', artworkId);
    // Переходим на страницу контактов
    window.location.href = 'contact.html';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    populateYearFilter();
    displayArtworks(artworks);
});
