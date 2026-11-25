/* ==========================================================================
   VEGETALE STORE — Shared State, Catalog, Pot Swatches & Slide-Over Cart Drawer
   ========================================================================== */
(function () {
    const STORAGE_KEYS = {
        USER: 'vegetale_user_v1',
        CART: 'vegetale_cart_v1',
        ADDRESS: 'vegetale_address_v1',
        ORDERS: 'vegetale_orders_v1'
    };

    const FREE_SHIPPING_THRESHOLD = 150000;

    const POT_SWATCHES = [
        { name: 'Terracotta', color: '#B85D3E' },
        { name: 'Cream', color: '#E8E0D2' },
        { name: 'Pine', color: '#2E5A42' }
    ];

    const CATALOG = [
        {
            id: 'monstera-adansonii',
            name: 'Monstera Adansonii',
            subtitle: 'Janda Bolong',
            category: 'Tanaman Daun',
            care: 'Easy Care',
            light: 'Indoor',
            watering: '2-7 Hari Sekali',
            potSize: '14-20 cm',
            price: 65000,
            rating: 4.9,
            reviews: 214,
            tag: 'Terlaris',
            image: 'media/sample1.jpeg',
            desc: 'Daun berlubang eksotis yang cocok untuk meja kerja maupun rak ruang tamu.'
        },
        {
            id: 'ficus-lyrata',
            name: 'Ficus Lyrata',
            subtitle: 'Ketapang Biola',
            category: 'Tanaman Daun',
            care: 'Medium',
            light: 'Semi-Outdoor',
            watering: '2-7 Hari Sekali',
            potSize: '>20 cm',
            price: 185000,
            rating: 4.8,
            reviews: 128,
            tag: 'Favorit',
            image: 'media/forest.jpg',
            desc: 'Pohon indoor berdaun lebar berbentuk biola yang memberi aksen arsitektural.'
        },
        {
            id: 'bonsai-ficus-mini',
            name: 'Bonsai Beringin Korea',
            subtitle: 'Pot Keramik Minimalis',
            category: 'Tanaman Daun',
            care: 'Medium',
            light: 'Semi-Outdoor',
            watering: '<2 Hari Sekali',
            potSize: '14-20 cm',
            price: 250000,
            rating: 4.9,
            reviews: 96,
            tag: 'Koleksi',
            image: 'media/gardener.jpg',
            desc: 'Bonsai karakter batang kokoh dalam pot keramik minimalis siap pajang.'
        },
        {
            id: 'sansevieria-laurentii',
            name: 'Sansevieria Laurentii',
            subtitle: 'Lidah Mertua',
            category: 'Kaktus & Sukulen',
            care: 'Easy Care',
            light: 'Indoor',
            watering: '>7 Hari Sekali',
            potSize: '14-20 cm',
            price: 55000,
            rating: 4.9,
            reviews: 310,
            tag: 'Easy Care',
            image: 'media/pexels-enisahalidi-17735286.jpg',
            desc: 'Sangat tahan banting, minim siram, dan efektif menyaring udara dalam ruangan.'
        },
        {
            id: 'calathea-orbifolia',
            name: 'Calathea Orbifolia',
            subtitle: 'Silver Striped',
            category: 'Tanaman Daun',
            care: 'Advanced',
            light: 'Indoor',
            watering: '<2 Hari Sekali',
            potSize: '14-20 cm',
            price: 135000,
            rating: 4.7,
            reviews: 74,
            tag: 'Bermotif',
            image: 'media/herobg.jpg',
            desc: 'Corak garis perak alami yang lembut, menyukai kelembapan stabil.'
        },
        {
            id: 'echeveria-terracotta',
            name: 'Sukulen Echeveria',
            subtitle: 'Set Pot Tanah Liat',
            category: 'Kaktus & Sukulen',
            care: 'Easy Care',
            light: 'Full Sun',
            watering: '>7 Hari Sekali',
            potSize: '<14 cm',
            price: 48000,
            rating: 4.8,
            reviews: 162,
            tag: 'Pemula',
            image: 'media/stocksnap-house-2606818_1920.jpg',
            desc: 'Roset daun tebal warna hijau kebiruan lengkap dengan pot terracotta mini.'
        },
        {
            id: 'peace-lily-spathiphyllum',
            name: 'Peace Lily',
            subtitle: 'Spathiphyllum',
            category: 'Tanaman Bunga',
            care: 'Easy Care',
            light: 'Indoor',
            watering: '2-7 Hari Sekali',
            potSize: '14-20 cm',
            price: 78000,
            rating: 4.8,
            reviews: 145,
            tag: 'Berbunga',
            image: 'media/sample1.jpeg',
            desc: 'Bunga putih bersih yang menenangkan dan mudah berbunga di cahaya teduh.'
        },
        {
            id: 'string-of-pearls',
            name: 'String of Pearls',
            subtitle: 'Senecio Rowleyanus',
            category: 'Tanaman Gantung',
            care: 'Medium',
            light: 'Semi-Outdoor',
            watering: '>7 Hari Sekali',
            potSize: '<14 cm',
            price: 92000,
            rating: 4.7,
            reviews: 88,
            tag: 'Gantung',
            image: 'media/forest.jpg',
            desc: 'Sulur mutiara hijau menjuntai cantik untuk rak tinggi atau pot gantung.'
        }
    ];

    const DEFAULT_USER = {
        name: 'Farhan Pratama',
        email: 'farhan@vegetale.id',
        memberSince: '2025',
        plantsCared: 6
    };

    const DEFAULT_ADDRESS = {
        label: 'Rumah Utama',
        recipient: 'Farhan Pratama',
        phone: '0812-3456-7890',
        street: 'Jl. Melati Botanika No. 18, RT 04 / RW 02',
        district: 'Lowokwaru, Kota Malang, Jawa Timur 65141',
        notes: 'Pagar kayu cokelat, titip di teras teduh jika sedang keluar.'
    };

    const DEFAULT_CART = [
        { id: 'sansevieria-laurentii', qty: 1, pot: 'Terracotta' },
        { id: 'echeveria-terracotta', qty: 2, pot: 'Cream' }
    ];

    const DEFAULT_ORDERS = [
        {
            orderId: 'VGT-2026-0842',
            productId: 'monstera-adansonii',
            name: 'Monstera Adansonii',
            category: 'Tanaman Daun · Pot 18 cm (Terracotta)',
            qty: 1,
            price: 65000,
            status: 'Sedang Dikirim',
            step: 3,
            estimate: 'Estimasi tiba 28 November 2026',
            active: true
        },
        {
            orderId: 'VGT-2026-0791',
            productId: 'bonsai-ficus-mini',
            name: 'Bonsai Beringin Korea',
            category: 'Koleksi · Pot Keramik',
            qty: 1,
            price: 250000,
            status: 'Selesai',
            date: '14 November 2026',
            active: false
        },
        {
            orderId: 'VGT-2026-0714',
            productId: 'peace-lily-spathiphyllum',
            name: 'Peace Lily',
            category: 'Tanaman Bunga · Pot 16 cm',
            qty: 1,
            price: 78000,
            status: 'Selesai',
            date: '02 November 2026',
            active: false
        },
        {
            orderId: 'VGT-2026-0650',
            productId: 'ficus-lyrata',
            name: 'Ficus Lyrata',
            category: 'Tanaman Daun · Pot 24 cm',
            qty: 1,
            price: 185000,
            status: 'Selesai',
            date: '19 Oktober 2026',
            active: false
        }
    ];

    function getBasePrefix() {
        const path = window.location.pathname;
        if (path.includes('/dashboard/') || path.includes('/search/') || path.includes('/register/')) {
            return '../';
        }
        return '';
    }

    function readJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Ignore private mode storage limits
        }
    }

    function formatIDR(amount) {
        return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
    }

    function getUser() { return readJSON(STORAGE_KEYS.USER, DEFAULT_USER); }
    function saveUser(user) { writeJSON(STORAGE_KEYS.USER, { ...getUser(), ...user }); }
    function getAddress() { return readJSON(STORAGE_KEYS.ADDRESS, DEFAULT_ADDRESS); }
    function saveAddress(addr) { writeJSON(STORAGE_KEYS.ADDRESS, { ...getAddress(), ...addr }); }
    function getCart() { return readJSON(STORAGE_KEYS.CART, DEFAULT_CART); }
    function getOrders() { return readJSON(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS); }
    function saveOrders(orders) { writeJSON(STORAGE_KEYS.ORDERS, orders); }

    function saveCart(cart) {
        writeJSON(STORAGE_KEYS.CART, cart);
        updateCartBadges();
        renderDrawer();
    }

    function getCartCount() {
        return getCart().reduce((sum, item) => sum + item.qty, 0);
    }

    function addToCart(productId, qty = 1, pot = 'Terracotta', openDrawerAfter = false) {
        const product = CATALOG.find((p) => p.id === productId);
        if (!product) return;
        const cart = getCart();
        const existing = cart.find((item) => item.id === productId && (item.pot || 'Terracotta') === pot);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ id: productId, qty, pot });
        }
        saveCart(cart);
        if (openDrawerAfter) {
            openCartDrawer();
        } else {
            showToast(`${product.name} (${pot}) ditambahkan ke keranjang`, 'success');
        }
    }

    function updateCartQty(productId, delta, pot) {
        const cart = getCart();
        const idx = cart.findIndex((item) => item.id === productId && (!pot || (item.pot || 'Terracotta') === pot));
        if (idx === -1) return;
        cart[idx].qty += delta;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        saveCart(cart);
    }

    function updateCartBadges() {
        const count = getCartCount();
        document.querySelectorAll('[data-cart-count]').forEach((el) => {
            el.textContent = count;
            el.classList.toggle('is-empty', count === 0);
        });
    }

    function showToast(message, type = 'info') {
        let stack = document.querySelector('.vg-toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.className = 'vg-toast-stack';
            stack.setAttribute('aria-live', 'polite');
            document.body.appendChild(stack);
        }
        const toast = document.createElement('div');
        toast.className = `vg-toast ${type === 'success' ? 'is-success' : ''}`;
        toast.innerHTML = `<span class="vg-toast-dot"></span><span></span>`;
        toast.querySelector('span:last-child').textContent = message;
        stack.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('is-visible'));
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 260);
        }, 2600);
    }

    // =========================================================================
    // SHARED PRODUCT CARD RENDERER (The Sill / Bloomscape Style)
    // =========================================================================
    function renderProductCardHTML(product, imgPrefix = '') {
        const swatchesHtml = POT_SWATCHES.map(
            (s, i) => `
            <button type="button"
                class="vg-swatch ${i === 0 ? 'is-active' : ''}"
                style="background-color: ${s.color};"
                title="Pot ${s.name}"
                aria-label="Pilih pot ${s.name}"
                data-swatch="${s.name}">
            </button>`
        ).join('');

        return `
            <article class="vg-product-card" data-product-id="${product.id}" data-selected-pot="Terracotta">
                <div class="vg-product-media">
                    <img src="${imgPrefix}${product.image}" alt="${product.name}" loading="lazy">
                    <span class="vg-product-badge">${product.tag}</span>
                    <button type="button" class="vg-quick-add" data-quick-add="${product.id}">
                        + Tambah ke Keranjang
                    </button>
                </div>
                <div class="vg-product-info">
                    <div class="vg-swatches">${swatchesHtml}</div>
                    <div class="vg-product-row">
                        <h3 class="vg-product-title">${product.name}</h3>
                        <span class="vg-product-price">${formatIDR(product.price)}</span>
                    </div>
                    <div class="vg-product-meta">
                        <span>${product.light}</span>
                        <span>·</span>
                        <span>${product.potSize}</span>
                        <span>·</span>
                        <span><i class="fa-solid fa-star"></i> ${product.rating}</span>
                    </div>
                </div>
            </article>
        `;
    }

    function bindProductCards(root) {
        if (!root) return;
        root.querySelectorAll('.vg-product-card').forEach((card) => {
            card.querySelectorAll('.vg-swatch').forEach((sw) => {
                sw.addEventListener('click', () => {
                    card.querySelectorAll('.vg-swatch').forEach((s) => s.classList.remove('is-active'));
                    sw.classList.add('is-active');
                    card.dataset.selectedPot = sw.dataset.swatch;
                });
            });

            const quickAdd = card.querySelector('[data-quick-add]');
            if (quickAdd) {
                quickAdd.addEventListener('click', () => {
                    const pot = card.dataset.selectedPot || 'Terracotta';
                    addToCart(quickAdd.dataset.quickAdd, 1, pot, true);
                });
            }
        });
    }

    // =========================================================================
    // SLIDE-OVER MINI CART DRAWER
    // =========================================================================
    function ensureDrawerDOM() {
        if (document.getElementById('vg-cart-drawer')) return;
        const prefix = getBasePrefix();

        const backdrop = document.createElement('div');
        backdrop.className = 'vg-drawer-backdrop';
        backdrop.id = 'vg-drawer-backdrop';

        const drawer = document.createElement('aside');
        drawer.className = 'vg-cart-drawer';
        drawer.id = 'vg-cart-drawer';
        drawer.setAttribute('aria-label', 'Keranjang Belanja');
        drawer.innerHTML = `
            <div class="drawer-head">
                <h2>Keranjang Anda</h2>
                <button type="button" class="drawer-close" id="vg-drawer-close" aria-label="Tutup Keranjang">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="drawer-shipping-bar" id="vg-drawer-shipping"></div>
            <div class="drawer-body" id="vg-drawer-body"></div>
            <div class="drawer-foot">
                <div class="drawer-subtotal">
                    <span>Subtotal</span>
                    <span id="vg-drawer-subtotal">Rp 0</span>
                </div>
                <a href="${prefix}dashboard/dashboardpengguna.html#cart" class="vg-btn vg-btn-primary" style="width:100%;">
                    Lanjut ke Checkout
                </a>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(drawer);

        backdrop.addEventListener('click', closeCartDrawer);
        document.getElementById('vg-drawer-close').addEventListener('click', closeCartDrawer);
    }

    function renderDrawer() {
        const body = document.getElementById('vg-drawer-body');
        const subEl = document.getElementById('vg-drawer-subtotal');
        const shipEl = document.getElementById('vg-drawer-shipping');
        if (!body) return;

        const prefix = getBasePrefix();
        const cart = getCart();
        let subtotal = 0;

        if (!cart.length) {
            body.innerHTML = `
                <div style="text-align:center; padding: 3rem 1rem; color: var(--ink-500);">
                    <p style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--ink-900); margin-bottom: 0.4rem;">Keranjang masih kosong</p>
                    <p style="font-size: 0.86rem;">Tambahkan tanaman pilihan Anda untuk mulai menata ruang hijau.</p>
                </div>
            `;
        } else {
            body.innerHTML = cart
                .map((item) => {
                    const p = CATALOG.find((x) => x.id === item.id) || CATALOG[0];
                    const line = p.price * item.qty;
                    subtotal += line;
                    return `
                        <div class="drawer-item">
                            <img src="${prefix}${p.image}" alt="${p.name}">
                            <div class="drawer-item-info">
                                <h4>${p.name}</h4>
                                <p class="drawer-item-meta">Pot ${item.pot || 'Terracotta'} · ${p.potSize}</p>
                                <div class="drawer-item-bottom">
                                    <div class="drawer-qty">
                                        <button type="button" data-d-minus="${item.id}" data-d-pot="${item.pot || 'Terracotta'}" aria-label="Kurangi">−</button>
                                        <span>${item.qty}</span>
                                        <button type="button" data-d-plus="${item.id}" data-d-pot="${item.pot || 'Terracotta'}" aria-label="Tambah">+</button>
                                    </div>
                                    <strong style="font-size:0.88rem;">${formatIDR(line)}</strong>
                                </div>
                            </div>
                        </div>
                    `;
                })
                .join('');

            body.querySelectorAll('[data-d-minus]').forEach((btn) => {
                btn.addEventListener('click', () => updateCartQty(btn.dataset.dMinus, -1, btn.dataset.dPot));
            });
            body.querySelectorAll('[data-d-plus]').forEach((btn) => {
                btn.addEventListener('click', () => updateCartQty(btn.dataset.dPlus, 1, btn.dataset.dPot));
            });
        }

        subEl.textContent = formatIDR(subtotal);

        const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
        const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
        shipEl.innerHTML = remaining > 0
            ? `Tambahkan <strong>${formatIDR(remaining)}</strong> lagi untuk gratis pengemasan &amp; ongkir`
            : `<strong>Selamat!</strong> Pesanan Anda memenuhi syarat gratis ongkir.`;
        shipEl.innerHTML += `<div class="shipping-meter"><div class="shipping-meter-fill" style="width:${pct}%"></div></div>`;
    }

    function openCartDrawer() {
        ensureDrawerDOM();
        renderDrawer();
        document.getElementById('vg-drawer-backdrop').classList.add('is-open');
        document.getElementById('vg-cart-drawer').classList.add('is-open');
    }

    function closeCartDrawer() {
        const bd = document.getElementById('vg-drawer-backdrop');
        const dr = document.getElementById('vg-cart-drawer');
        if (bd) bd.classList.remove('is-open');
        if (dr) dr.classList.remove('is-open');
    }

    function initSharedNav() {
        updateCartBadges();

        const mobileBtn = document.querySelector('[data-mobile-menu-btn]');
        const navLinks = document.querySelector('[data-nav-links]');
        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', () => {
                const open = navLinks.classList.toggle('is-open');
                mobileBtn.setAttribute('aria-expanded', String(open));
            });
        }

        document.querySelectorAll('[data-open-cart]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openCartDrawer();
            });
        });
    }

    window.VegetaleStore = {
        CATALOG,
        POT_SWATCHES,
        formatIDR,
        getUser,
        saveUser,
        getAddress,
        saveAddress,
        getCart,
        saveCart,
        getCartCount,
        addToCart,
        updateCartQty,
        getOrders,
        saveOrders,
        updateCartBadges,
        showToast,
        renderProductCardHTML,
        bindProductCards,
        openCartDrawer,
        closeCartDrawer
    };

    document.addEventListener('DOMContentLoaded', initSharedNav);
})();
