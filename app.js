// Starfield background generator
function createStarfield() {
    const starfield = document.getElementById('starfield');
    const stars = 100;
    
    for (let i = 0; i < stars; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = Math.random() * 2 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.backgroundColor = 'white';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random() * 0.7 + 0.3;
        starfield.appendChild(star);
    }
}

// Data management
let allPatches = [];
let filteredPatches = [];

// Fetch and load patches
async function loadPatches() {
    try {
        const response = await fetch('downloads/patches/metadata.json');
        if (!response.ok) throw new Error('Failed to load patches');
        allPatches = await response.json();
        populateFilters();
        filterAndDisplayPatches();
        document.getElementById('loadingState').style.display = 'none';
    } catch (error) {
        console.error('Error loading patches:', error);
        document.getElementById('loadingState').innerHTML = '<p>Error loading patches. Please check the metadata file.</p>';
    }
}

// Populate filter dropdowns
function populateFilters() {
    const agencies = [...new Set(allPatches.map(p => p.agency))].sort();
    const years = [...new Set(allPatches.map(p => p.year))].sort((a, b) => b - a);
    
    const agencySelect = document.getElementById('agencyFilter');
    const yearSelect = document.getElementById('yearFilter');
    
    agencies.forEach(agency => {
        const option = document.createElement('option');
        option.value = agency;
        option.textContent = agency;
        agencySelect.appendChild(option);
    });
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Filter and display patches
function filterAndDisplayPatches() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedAgency = document.getElementById('agencyFilter').value;
    const selectedYear = document.getElementById('yearFilter').value;
    
    filteredPatches = allPatches.filter(patch => {
        const matchesSearch = patch.name.toLowerCase().includes(searchTerm) || 
                             patch.agency.toLowerCase().includes(searchTerm);
        const matchesAgency = !selectedAgency || patch.agency === selectedAgency;
        const matchesYear = !selectedYear || patch.year === parseInt(selectedYear);
        
        return matchesSearch && matchesAgency && matchesYear;
    });
    
    displayPatches();
}

// Display patches in grid
function displayPatches() {
    const grid = document.getElementById('patchGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredPatches.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    grid.innerHTML = '';
    
    filteredPatches.forEach(patch => {
        const card = document.createElement('div');
        card.className = 'patch-card';
        card.innerHTML = `
            <div class="patch-image-wrapper">
                <img src="downloads/patches/${patch.filename}" alt="${patch.name}" class="patch-image" loading="lazy">
            </div>
            <div class="patch-info">
                <div class="patch-name">${patch.name}</div>
                <div>
                    <div class="patch-agency">${patch.agency}</div>
                    <div class="patch-meta patch-year">${patch.year}</div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(patch));
        grid.appendChild(card);
    });
}

// Modal functions
function openModal(patch) {
    const modal = document.getElementById('modal');
    document.getElementById('modalImage').src = `downloads/patches/${patch.filename}`;
    document.getElementById('modalTitle').textContent = patch.name;
    document.getElementById('modalAgency').textContent = patch.agency;
    document.getElementById('modalYear').textContent = patch.year;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterAndDisplayPatches);
document.getElementById('agencyFilter').addEventListener('change', filterAndDisplayPatches);
document.getElementById('yearFilter').addEventListener('change', filterAndDisplayPatches);
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});
document.querySelector('.modal-close').addEventListener('click', closeModal);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Initialize
createStarfield();
loadPatches();
