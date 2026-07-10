/* ============================================
   Tourist Destination Manager - Application
   ============================================ */

// --- Data Store ---
const STORAGE_KEY = 'touristDestinations';

function loadDestinations() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveDestinations(destinations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
}

let destinations = loadDestinations();
let deleteTargetId = null;

// --- DOM References ---
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const searchInput = $('#searchInput');
const categoryFilter = $('#categoryFilter');
const addBtn = $('#addBtn');
const emptyAddBtn = $('#emptyAddBtn');
const destinationsGrid = $('#destinationsGrid');
const emptyState = $('#emptyState');
const statsBar = $('#statsText');
const modalOverlay = $('#modalOverlay');
const modal = $('#modal');
const modalTitle = $('#modalTitle');
const destinationForm = $('#destinationForm');
const destinationId = $('#destinationId');
const nameInput = $('#name');
const locationInput = $('#location');
const categoryInput = $('#category');
const descriptionInput = $('#description');
const ratingInput = $('#rating');
const ratingValue = $('#ratingValue');
const bestSeasonInput = $('#bestSeason');
const imageUrlInput = $('#imageUrl');
const submitBtn = $('#submitBtn');
const closeModalBtn = $('#closeModalBtn');
const cancelBtn = $('#cancelBtn');
const descCount = $('#descCount');
const deleteModalOverlay = $('#deleteModalOverlay');
const deleteItemName = $('#deleteItemName');
const confirmDeleteBtn = $('#confirmDeleteBtn');
const closeDeleteModalBtn = $('#closeDeleteModalBtn');
const cancelDeleteBtn = $('#cancelDeleteBtn');
const toastContainer = $('#toastContainer');

// --- Helper: Generate Unique ID ---
function generateId() {
    return 'dest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// --- Helper: Category Emoji ---
function getCategoryEmoji(category) {
    const map = {
        Beach: '🏖️', Mountain: '🏔️', Historical: '🏛️', City: '🏙️',
        Nature: '🌿', Adventure: '🧗', Cultural: '🎭', Island: '🏝️'
    };
    return map[category] || '📍';
}

// --- Helper: Season Emoji ---
function getSeasonEmoji(season) {
    const map = { Spring: '🌸', Summer: '☀️', Autumn: '🍂', Winter: '❄️' };
    return map[season] || '';
}

// --- Helper: Stars ---
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < full) stars += '★';
        else if (i === full && half) stars += '⯨';
        else stars += '☆';
    }
    return stars;
}

// --- Toast Notifications ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}

// --- Modal Management ---
function openModal(mode = 'add', destination = null) {
    destinationForm.reset();
    clearErrors();
    destinationId.value = '';

    if (mode === 'edit' && destination) {
        modalTitle.textContent = 'Edit Destination';
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <path d="M12 5v14M5 12h14"/>
            </svg>
            Update Destination`;
        destinationId.value = destination.id;
        nameInput.value = destination.name;
        locationInput.value = destination.location;
        categoryInput.value = destination.category;
        descriptionInput.value = destination.description;
        ratingInput.value = destination.rating;
        ratingValue.textContent = `⭐ ${destination.rating}`;
        bestSeasonInput.value = destination.bestSeason || '';
        imageUrlInput.value = destination.imageUrl || '';
        descCount.textContent = `${destination.description.length}/500`;
    } else {
        modalTitle.textContent = 'Add Destination';
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Destination`;
        ratingInput.value = 4;
        ratingValue.textContent = '⭐ 4.0';
        descCount.textContent = '0/500';
    }

    modalOverlay.classList.add('active');
    nameInput.focus();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    destinationForm.reset();
    clearErrors();
}

function openDeleteModal(id) {
    const dest = destinations.find(d => d.id === id);
    if (!dest) return;
    deleteTargetId = id;
    deleteItemName.textContent = dest.name;
    deleteModalOverlay.classList.add('active');
}

function closeDeleteModal() {
    deleteModalOverlay.classList.remove('active');
    deleteTargetId = null;
}

// --- Form Validation ---
function clearErrors() {
    ['name', 'location', 'category', 'description', 'imageUrl'].forEach(field => {
        const el = $(`#${field}`);
        if (el) el.classList.remove('error');
        const errEl = $(`#${field}Error`);
        if (errEl) errEl.textContent = '';
    });
}

function showFieldError(fieldId, message) {
    const el = $(`#${fieldId}`);
    const errEl = $(`#${fieldId}Error`);
    if (el) el.classList.add('error');
    if (errEl) errEl.textContent = message;
}

function validateForm() {
    clearErrors();
    let isValid = true;

    const name = nameInput.value.trim();
    if (!name) {
        showFieldError('name', 'Destination name is required.');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters.');
        isValid = false;
    }

    const location = locationInput.value.trim();
    if (!location) {
        showFieldError('location', 'Location is required.');
        isValid = false;
    }

    const category = categoryInput.value;
    if (!category) {
        showFieldError('category', 'Please select a category.');
        isValid = false;
    }

    const description = descriptionInput.value.trim();
    if (!description) {
        showFieldError('description', 'Description is required.');
        isValid = false;
    } else if (description.length < 10) {
        showFieldError('description', 'Description must be at least 10 characters.');
        isValid = false;
    }

    const imageUrl = imageUrlInput.value.trim();
    if (imageUrl && !isValidUrl(imageUrl)) {
        showFieldError('imageUrl', 'Please enter a valid URL.');
        isValid = false;
    }

    return isValid;
}

function isValidUrl(str) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

// --- CRUD Operations ---
function addDestination(data) {
    const destination = {
        id: generateId(),
        name: data.name.trim(),
        location: data.location.trim(),
        category: data.category,
        description: data.description.trim(),
        rating: parseFloat(data.rating),
        bestSeason: data.bestSeason || '',
        imageUrl: data.imageUrl.trim() || '',
        createdAt: new Date().toISOString()
    };
    destinations.unshift(destination);
    saveDestinations(destinations);
    render();
    showToast(`"${destination.name}" added successfully!`, 'success');
}

function updateDestination(id, data) {
    const index = destinations.findIndex(d => d.id === id);
    if (index === -1) return;

    destinations[index] = {
        ...destinations[index],
        name: data.name.trim(),
        location: data.location.trim(),
        category: data.category,
        description: data.description.trim(),
        rating: parseFloat(data.rating),
        bestSeason: data.bestSeason || '',
        imageUrl: data.imageUrl.trim() || '',
        updatedAt: new Date().toISOString()
    };
    saveDestinations(destinations);
    render();
    showToast(`"${destinations[index].name}" updated successfully!`, 'success');
}

function deleteDestination(id) {
    const dest = destinations.find(d => d.id === id);
    if (!dest) return;
    destinations = destinations.filter(d => d.id !== id);
    saveDestinations(destinations);
    render();
    showToast(`"${dest.name}" has been deleted.`, 'info');
}

// --- Search & Filter ---
function getFilteredDestinations() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const categoryTerm = categoryFilter.value;

    return destinations.filter(dest => {
        const matchesSearch = !searchTerm ||
            dest.name.toLowerCase().includes(searchTerm) ||
            dest.location.toLowerCase().includes(searchTerm) ||
            dest.category.toLowerCase().includes(searchTerm) ||
            dest.description.toLowerCase().includes(searchTerm);

        const matchesCategory = !categoryTerm || dest.category === categoryTerm;

        return matchesSearch && matchesCategory;
    });
}

// --- Render ---
function render() {
    const filtered = getFilteredDestinations();

    // Update stats
    const total = destinations.length;
    const showing = filtered.length;
    if (total === 0) {
        statsBar.textContent = '0 destinations';
    } else if (showing === total) {
        statsBar.textContent = `${total} destination${total !== 1 ? 's' : ''}`;
    } else {
        statsBar.textContent = `Showing ${showing} of ${total} destination${total !== 1 ? 's' : ''}`;
    }

    // Render cards or empty state
    if (filtered.length === 0) {
        destinationsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
        if (total > 0 && showing === 0) {
            emptyState.querySelector('h2').textContent = 'No matches found';
            emptyState.querySelector('p').textContent = 'Try adjusting your search or filter criteria.';
            emptyState.querySelector('button').style.display = 'none';
        } else {
            emptyState.querySelector('h2').textContent = 'No destinations yet';
            emptyState.querySelector('p').textContent = 'Start by adding your first tourist destination!';
            emptyState.querySelector('button').style.display = '';
        }
    } else {
        emptyState.classList.add('hidden');
        destinationsGrid.innerHTML = filtered.map(dest => createCardHTML(dest)).join('');
    }
}

function createCardHTML(dest) {
    const stars = renderStars(dest.rating);
    const categoryEmoji = getCategoryEmoji(dest.category);
    const seasonEmoji = getSeasonEmoji(dest.bestSeason);
    const seasonText = dest.bestSeason ? `${seasonEmoji} ${dest.bestSeason}` : '';

    const imageHTML = dest.imageUrl
        ? `<img src="${escapeHTML(dest.imageUrl)}" alt="${escapeHTML(dest.name)}" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="card-image-placeholder" style="display:none;">${categoryEmoji}</div>`
        : `<div class="card-image-placeholder">${categoryEmoji}</div>`;

    return `
        <article class="destination-card">
            ${imageHTML}
            <div class="card-body">
                <div class="card-header">
                    <h3 class="card-title">${escapeHTML(dest.name)}</h3>
                    <span class="card-category cat-${escapeHTML(dest.category)}">${categoryEmoji} ${escapeHTML(dest.category)}</span>
                </div>
                <div class="card-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    ${escapeHTML(dest.location)}
                </div>
                <p class="card-description">${escapeHTML(dest.description)}</p>
                <div class="card-meta">
                    <span class="card-rating" title="${dest.rating} out of 5">${stars} ${dest.rating}</span>
                    ${seasonText ? `<span class="card-season">${seasonText}</span>` : ''}
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary edit-btn" data-id="${dest.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    </svg>
                    Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${dest.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"/>
                    </svg>
                    Delete
                </button>
            </div>
        </article>
    `;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- Event Listeners ---

// Open add modal
addBtn.addEventListener('click', () => openModal('add'));
emptyAddBtn.addEventListener('click', () => openModal('add'));

// Close modal
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Close delete modal
closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
deleteModalOverlay.addEventListener('click', (e) => {
    if (e.target === deleteModalOverlay) closeDeleteModal();
});

// Form submission
destinationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
        name: nameInput.value,
        location: locationInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        rating: ratingInput.value,
        bestSeason: bestSeasonInput.value,
        imageUrl: imageUrlInput.value
    };

    const id = destinationId.value;
    if (id) {
        updateDestination(id, data);
    } else {
        addDestination(data);
    }
    closeModal();
});

// Confirm delete
confirmDeleteBtn.addEventListener('click', () => {
    if (deleteTargetId) {
        deleteDestination(deleteTargetId);
    }
    closeDeleteModal();
});

// Search input
searchInput.addEventListener('input', () => {
    render();
});

// Category filter
categoryFilter.addEventListener('change', () => {
    render();
});

// Rating slider update
ratingInput.addEventListener('input', () => {
    ratingValue.textContent = `⭐ ${parseFloat(ratingInput.value).toFixed(1)}`;
});

// Description character count
descriptionInput.addEventListener('input', () => {
    descCount.textContent = `${descriptionInput.value.length}/500`;
});

// Delegate card button clicks
destinationsGrid.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
        const id = editBtn.dataset.id;
        const dest = destinations.find(d => d.id === id);
        if (dest) openModal('edit', dest);
    }

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        openDeleteModal(id);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        if (deleteModalOverlay.classList.contains('active')) {
            closeDeleteModal();
        } else if (modalOverlay.classList.contains('active')) {
            closeModal();
        }
    }
    // Ctrl+K / Cmd+K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    // Ctrl+N / Cmd+N to add new
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal('add');
    }
});

// --- Initialize ---
function init() {
    render();
    // Load sample data if empty (first-time users)
    if (destinations.length === 0) {
        destinations = [
            {
                id: generateId(),
                name: 'Santorini, Greece',
                location: 'Aegean Sea, Greece',
                category: 'Island',
                description: 'Famous for its stunning white-washed buildings with blue domes, breathtaking sunsets, and crystal-clear waters. A perfect romantic getaway with volcanic beaches and delicious Mediterranean cuisine.',
                rating: 4.5,
                bestSeason: 'Summer',
                imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600',
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                name: 'Machu Picchu',
                location: 'Cusco Region, Peru',
                category: 'Historical',
                description: 'An ancient Incan citadel set high in the Andes Mountains. One of the most iconic archaeological wonders of the world, offering incredible trekking routes and mystical history.',
                rating: 5.0,
                bestSeason: 'Spring',
                imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600',
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                name: 'Banff National Park',
                location: 'Alberta, Canada',
                category: 'Nature',
                description: 'Canada\'s oldest national park featuring stunning turquoise glacial lakes, majestic mountain peaks, and abundant wildlife. Home to the iconic Lake Louise and Moraine Lake.',
                rating: 4.8,
                bestSeason: 'Summer',
                imageUrl: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?w=600',
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                name: 'Tokyo',
                location: 'Honshu, Japan',
                category: 'City',
                description: 'A dazzling blend of ultramodern technology and ancient traditions. From neon-lit Shibuya to serene temples, Tokyo offers world-class food, fashion, and culture in every corner.',
                rating: 4.6,
                bestSeason: 'Spring',
                imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
                createdAt: new Date().toISOString()
            }
        ];
        saveDestinations(destinations);
        render();
    }
}

init();
