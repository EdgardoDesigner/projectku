document.addEventListener('DOMContentLoaded', () => {
    const store = window.VegetaleStore;
    if (!store) return;

    const state = {
        query: '',
        category: 'Semua',
        care: [],
        light: [],
        watering: [],
        potSize: [],
        sort: 'popular'
    };

    const grid = document.getElementById('catalog-product-grid');
    const countEl = document.getElementById('result-count');
    const titleEl = document.getElementById('collection-title');
    const searchInput = document.getElementById('catalog-search-input');
    const searchForm = document.getElementById('catalog-search-form');
    const sortSelect = document.getElementById('sort-select');
    const filterSidebar = document.getElementById('filter-sidebar');
    const toggleFilterBtn = document.getElementById('toggle-filter-btn');

    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
        state.query = params.get('q').trim();
        if (searchInput) searchInput.value = state.query;
    }
    if (params.get('kategori')) {
        const cat = params.get('kategori');
        state.category = cat;
        document.querySelectorAll('.cat-tab').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.category === cat);
        });
    }

    function getFilteredCatalog() {
        const q = state.query.toLowerCase();
        let items = store.CATALOG.filter((p) => {
            if (state.category !== 'Semua' && p.category !== state.category) return false;
            if (q && !`${p.name} ${p.subtitle} ${p.category} ${p.desc} ${p.tag}`.toLowerCase().includes(q)) return false;
            if (state.care.length && !state.care.includes(p.care)) return false;
            if (state.light.length && !state.light.includes(p.light)) return false;
            if (state.watering.length && !state.watering.includes(p.watering)) return false;
            if (state.potSize.length && !state.potSize.includes(p.potSize)) return false;
            return true;
        });

        if (state.sort === 'price-asc') items.sort((a, b) => a.price - b.price);
        else if (state.sort === 'price-desc') items.sort((a, b) => b.price - a.price);
        else if (state.sort === 'rating') items.sort((a, b) => b.rating - a.rating);
        else items.sort((a, b) => b.reviews - a.reviews);

        return items;
    }

    function renderProducts() {
        const items = getFilteredCatalog();
        countEl.textContent = `${items.length} Tanaman`;
        if (titleEl) {
            titleEl.textContent = state.category === 'Semua' ? 'Semua Tanaman' : state.category;
        }

        if (!items.length) {
            grid.innerHTML = `
                <div class="empty-catalog">
                    <h3>Tidak ada tanaman yang cocok</h3>
                    <p>Coba kurangi filter atau cari dengan kata kunci lain.</p>
                    <button type="button" class="vg-btn vg-btn-primary" id="inline-reset-btn">Reset Semua Filter</button>
                </div>
            `;
            const inlineReset = document.getElementById('inline-reset-btn');
            if (inlineReset) inlineReset.addEventListener('click', resetFilters);
            return;
        }

        grid.innerHTML = items.map((p) => store.renderProductCardHTML(p, '../')).join('');
        store.bindProductCards(grid);
    }

    function resetFilters() {
        state.query = '';
        state.category = 'Semua';
        state.care = [];
        state.light = [];
        state.watering = [];
        state.potSize = [];
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.cat-tab').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.category === 'Semua');
        });
        document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach((cb) => {
            cb.checked = false;
        });
        renderProducts();
    }

    document.querySelectorAll('.cat-tab').forEach((btn) => {
        btn.addEventListener('click', () => {
            state.category = btn.dataset.category;
            document.querySelectorAll('.cat-tab').forEach((b) => b.classList.toggle('active', b === btn));
            renderProducts();
        });
    });

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener('change', () => {
            const group = cb.name;
            state[group] = Array.from(document.querySelectorAll(`input[name="${group}"]:checked`)).map((el) => el.value);
            renderProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            state.query = searchInput.value.trim();
            renderProducts();
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            state.query = searchInput.value.trim();
            renderProducts();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            state.sort = sortSelect.value;
            renderProducts();
        });
    }

    const resetBtn = document.getElementById('btn-reset-filter');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    if (toggleFilterBtn && filterSidebar) {
        toggleFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.toggle('is-open');
        });
    }

    renderProducts();
});
