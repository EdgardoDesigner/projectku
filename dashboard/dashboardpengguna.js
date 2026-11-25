document.addEventListener('DOMContentLoaded', () => {
    const store = window.VegetaleStore;
    if (!store) return;

    let currentOrderFilter = 'all';

    // Helpers
    const getProduct = (id) => store.CATALOG.find((p) => p.id === id) || store.CATALOG[0];
    const resolveImg = (relPath) => '../' + relPath;

    function getInitials(name) {
        return (name || 'VG')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('');
    }

    // =========================================================================
    // 1. TAB SWITCHING
    // =========================================================================
    function switchTab(tabName) {
        document.querySelectorAll('.nav-btn[data-tab]').forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-panel[data-panel]').forEach((panel) => {
            panel.classList.toggle('is-active', panel.dataset.panel === tabName);
        });
        if (tabName === 'cart') renderCart();
        if (tabName === 'orders') renderOrdersList();
        if (tabName === 'address') renderAddressViews();
    }

    document.querySelectorAll('.nav-btn[data-tab]').forEach((btn) => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.querySelectorAll('[data-switch-tab]').forEach((btn) => {
        btn.addEventListener('click', () => switchTab(btn.dataset.switchTab));
    });

    const navCartBtn = document.getElementById('nav-cart-btn');
    if (navCartBtn) {
        navCartBtn.addEventListener('click', () => switchTab('cart'));
    }

    // =========================================================================
    // 2. RENDER USER & STATS
    // =========================================================================
    function renderUserAndStats() {
        const user = store.getUser();
        const orders = store.getOrders();
        const activeOrders = orders.filter((o) => o.active);
        const cartCount = store.getCartCount();

        document.getElementById('user-initials').textContent = getInitials(user.name);
        document.getElementById('sidebar-user-name').textContent = user.name;
        document.getElementById('sidebar-user-email').textContent = user.email;
        document.getElementById('welcome-user-name').textContent = user.name.split(' ')[0];

        document.getElementById('stat-plants').textContent = user.plantsCared || 6;
        document.getElementById('stat-active-orders').textContent = activeOrders.length;
        document.getElementById('stat-cart-items').textContent = cartCount;

        const navOrdersBadge = document.getElementById('nav-orders-count');
        if (navOrdersBadge) {
            navOrdersBadge.textContent = activeOrders.length;
            navOrdersBadge.style.display = activeOrders.length ? 'inline-flex' : 'none';
        }

        const subtitle = document.getElementById('welcome-subtitle');
        if (subtitle) {
            subtitle.textContent = activeOrders.length
                ? `Kebun indoor Anda dalam kondisi optimal. ${activeOrders.length} pesanan tanaman sedang diproses menuju rumah Anda.`
                : 'Kebun indoor Anda dalam kondisi optimal. Jelajahi koleksi tanaman hias baru untuk memperindah ruangan.';
        }

        // Render active order card
        const activeOrder = activeOrders[0];
        const activeSection = document.getElementById('active-order-section');
        if (activeOrder && activeSection) {
            const product = getProduct(activeOrder.productId);
            document.getElementById('active-order-status').textContent = activeOrder.status;
            document.getElementById('active-order-id').textContent = '#' + activeOrder.orderId;
            document.getElementById('active-order-img').src = resolveImg(product.image);
            document.getElementById('active-order-img').alt = activeOrder.name;
            document.getElementById('active-order-cat').textContent = activeOrder.category;
            document.getElementById('active-order-name').textContent = activeOrder.name;
            document.getElementById('active-order-qty').textContent = `${activeOrder.qty} Item · Dikemas dengan media lembap khusus`;
            document.getElementById('active-order-price').textContent = store.formatIDR(activeOrder.price * activeOrder.qty);
            document.getElementById('active-order-estimate').innerHTML =
                `<i class="fa-regular fa-calendar"></i> ${activeOrder.estimate || 'Estimasi tiba 2-3 hari kerja'}`;

            const fillPercent = Math.min(100, Math.max(0, ((activeOrder.step || 1) - 1) * 33.3));
            document.getElementById('progress-fill').style.width = `${fillPercent}%`;
        }
    }

    // =========================================================================
    // 3. RENDER OVERVIEW HISTORY & FULL ORDERS
    // =========================================================================
    function renderOverviewHistory() {
        const container = document.getElementById('overview-history-list');
        if (!container) return;

        const completed = store.getOrders().filter((o) => !o.active).slice(0, 3);
        container.innerHTML = completed
            .map((order) => {
                const product = getProduct(order.productId);
                return `
                    <article class="history-item">
                        <div class="history-left">
                            <div class="item-thumb">
                                <img src="${resolveImg(product.image)}" alt="${order.name}">
                            </div>
                            <div class="item-desc">
                                <h4>${order.name}</h4>
                                <p>Diterima · ${order.date || 'Baru saja'}</p>
                            </div>
                        </div>
                        <div class="item-action">
                            <span class="item-price">${store.formatIDR(order.price)}</span>
                            <button type="button" class="btn-buy-again" data-buy-again="${order.productId}">
                                Beli Lagi
                            </button>
                        </div>
                    </article>
                `;
            })
            .join('');

        bindBuyAgainButtons(container);
    }

    function renderOrdersList() {
        const container = document.getElementById('orders-full-list');
        if (!container) return;

        const orders = store.getOrders().filter((o) => {
            if (currentOrderFilter === 'active') return o.active;
            if (currentOrderFilter === 'done') return !o.active;
            return true;
        });

        if (!orders.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Belum ada pesanan di kategori ini</h3>
                    <p>Jelajahi katalog Vegetale untuk menemukan tanaman hias pilihan Anda.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = orders
            .map((order) => {
                const product = getProduct(order.productId);
                return `
                    <article class="order-row-card">
                        <div class="product-info">
                            <div class="product-thumb">
                                <img src="${resolveImg(product.image)}" alt="${order.name}">
                            </div>
                            <div class="product-text">
                                <span class="${order.active ? 'tag-clay' : 'tag-moss'}">${order.status}</span>
                                <h3 style="margin-top: 0.35rem;">${order.name}</h3>
                                <p>#${order.orderId} · ${order.qty} Item · ${order.active ? order.estimate : order.date}</p>
                            </div>
                        </div>
                        <div class="price-info">
                            <span class="price-label">Total</span>
                            <div class="price-amount">${store.formatIDR(order.price * order.qty)}</div>
                            <button type="button" class="btn-buy-again" style="margin-top: 0.45rem;" data-buy-again="${order.productId}">
                                Beli Lagi
                            </button>
                        </div>
                    </article>
                `;
            })
            .join('');

        bindBuyAgainButtons(container);
    }

    function bindBuyAgainButtons(root) {
        root.querySelectorAll('[data-buy-again]').forEach((btn) => {
            btn.addEventListener('click', () => {
                store.addToCart(btn.dataset.buyAgain, 1);
                renderUserAndStats();
            });
        });
    }

    document.querySelectorAll('[data-order-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentOrderFilter = btn.dataset.orderFilter;
            document.querySelectorAll('[data-order-filter]').forEach((b) => {
                b.classList.toggle('active', b === btn);
            });
            renderOrdersList();
        });
    });

    // =========================================================================
    // 4. RENDER ADDRESS & EDIT MODAL
    // =========================================================================
    function renderAddressViews() {
        const addr = store.getAddress();
        const badge = document.getElementById('addr-label-badge');
        if (badge) badge.textContent = addr.label;

        const markup = `
            <div class="addr-recipient">${addr.recipient}</div>
            <div class="addr-phone">${addr.phone}</div>
            <div class="addr-line">${addr.street}</div>
            <div class="addr-line">${addr.district}</div>
            ${addr.notes ? `<div class="addr-note"><i class="fa-regular fa-note-sticky"></i> Catatan: ${addr.notes}</div>` : ''}
        `;

        const overviewBox = document.getElementById('overview-address-box');
        if (overviewBox) overviewBox.innerHTML = markup;

        const fullView = document.getElementById('full-address-view');
        if (fullView) {
            fullView.innerHTML = `
                <div class="card-title-row">
                    <div class="card-title-group">
                        <span class="mini-icon clay"><i class="fa-solid fa-house-chimney"></i></span>
                        <h2>${addr.label}</h2>
                    </div>
                    <span class="tag-moss">Alamat Utama</span>
                </div>
                <div class="address-preview" style="margin-bottom: 0;">${markup}</div>
            `;
        }
    }

    const addressModal = document.getElementById('address-modal');
    const addressForm = document.getElementById('address-form');

    document.querySelectorAll('[data-open-address-modal]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const addr = store.getAddress();
            document.getElementById('input-addr-label').value = addr.label;
            document.getElementById('input-addr-recipient').value = addr.recipient;
            document.getElementById('input-addr-phone').value = addr.phone;
            document.getElementById('input-addr-street').value = addr.street;
            document.getElementById('input-addr-district').value = addr.district;
            document.getElementById('input-addr-notes').value = addr.notes || '';
            addressModal.showModal();
        });
    });

    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            store.saveAddress({
                label: document.getElementById('input-addr-label').value.trim(),
                recipient: document.getElementById('input-addr-recipient').value.trim(),
                phone: document.getElementById('input-addr-phone').value.trim(),
                street: document.getElementById('input-addr-street').value.trim(),
                district: document.getElementById('input-addr-district').value.trim(),
                notes: document.getElementById('input-addr-notes').value.trim()
            });
            addressModal.close();
            renderAddressViews();
            store.showToast('Alamat pengiriman berhasil diperbarui', 'success');
        });
    }

    // =========================================================================
    // 5. RENDER CART & CHECKOUT
    // =========================================================================
    function renderCart() {
        const listEl = document.getElementById('cart-items-list');
        const subtotalEl = document.getElementById('cart-subtotal');
        const shippingEl = document.getElementById('cart-shipping');
        const totalEl = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('btn-checkout');
        if (!listEl) return;

        const cart = store.getCart();
        if (!cart.length) {
            listEl.innerHTML = `
                <div class="empty-state">
                    <h3>Keranjang masih kosong</h3>
                    <p style="margin-bottom: 1rem;">Tambahkan tanaman hias favorit Anda dari katalog Vegetale.</p>
                    <a href="../search/index.html" class="vg-btn vg-btn-primary">Buka Katalog</a>
                </div>
            `;
            subtotalEl.textContent = store.formatIDR(0);
            shippingEl.textContent = store.formatIDR(0);
            totalEl.textContent = store.formatIDR(0);
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            return;
        }

        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';

        let subtotal = 0;
        listEl.innerHTML = cart
            .map((item) => {
                const product = getProduct(item.id);
                const lineTotal = product.price * item.qty;
                subtotal += lineTotal;
                return `
                    <article class="cart-row">
                        <div class="product-info">
                            <div class="product-thumb">
                                <img src="${resolveImg(product.image)}" alt="${product.name}">
                            </div>
                            <div class="product-text">
                                <span class="category-text">${product.category} · ${product.potSize}</span>
                                <h3>${product.name}</h3>
                                <p>${store.formatIDR(product.price)} / item</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div class="qty-control">
                                <button type="button" class="qty-btn" data-qty-minus="${item.id}" aria-label="Kurangi">−</button>
                                <span class="qty-value">${item.qty}</span>
                                <button type="button" class="qty-btn" data-qty-plus="${item.id}" aria-label="Tambah">+</button>
                            </div>
                            <strong style="min-width: 96px; text-align: right;">${store.formatIDR(lineTotal)}</strong>
                        </div>
                    </article>
                `;
            })
            .join('');

        const shipping = 15000;
        subtotalEl.textContent = store.formatIDR(subtotal);
        shippingEl.textContent = store.formatIDR(shipping);
        totalEl.textContent = store.formatIDR(subtotal + shipping);

        listEl.querySelectorAll('[data-qty-minus]').forEach((btn) => {
            btn.addEventListener('click', () => {
                store.updateCartQty(btn.dataset.qtyMinus, -1);
                renderCart();
                renderUserAndStats();
            });
        });

        listEl.querySelectorAll('[data-qty-plus]').forEach((btn) => {
            btn.addEventListener('click', () => {
                store.updateCartQty(btn.dataset.qtyPlus, 1);
                renderCart();
                renderUserAndStats();
            });
        });
    }

    const checkoutBtn = document.getElementById('btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = store.getCart();
            if (!cart.length) return;
            const first = getProduct(cart[0].id);
            const totalQty = cart.reduce((s, i) => s + i.qty, 0);
            const totalPrice = cart.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0);

            const orders = store.getOrders();
            orders.unshift({
                orderId: 'VGT-2026-' + String(Math.floor(1000 + Math.random() * 9000)),
                productId: first.id,
                name: cart.length > 1 ? `${first.name} (+${cart.length - 1} lainnya)` : first.name,
                category: `${first.category} · Pengemasan Khusus`,
                qty: totalQty,
                price: Math.round(totalPrice / totalQty),
                status: 'Sedang Dikemas',
                step: 2,
                estimate: 'Estimasi tiba 30 November 2026',
                active: true
            });
            store.saveOrders(orders);
            store.saveCart([]);
            renderCart();
            renderUserAndStats();
            renderOrdersList();
            store.showToast('Pesanan berhasil dibuat! Sedang disiapkan di kebun kami.', 'success');
            switchTab('overview');
        });
    }

    // =========================================================================
    // 6. LOGOUT MODAL & CLOSE HANDLERS
    // =========================================================================
    const logoutModal = document.getElementById('logout-modal');
    const btnOpenLogout = document.getElementById('btn-open-logout');
    if (btnOpenLogout && logoutModal) {
        btnOpenLogout.addEventListener('click', () => logoutModal.showModal());
    }

    document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const dlg = btn.closest('dialog');
            if (dlg) dlg.close();
        });
    });

    // Support URL hash #cart or #orders
    const initialHash = window.location.hash.replace('#', '');
    if (['overview', 'orders', 'address', 'cart'].includes(initialHash)) {
        switchTab(initialHash);
    }

    // Initial Render
    renderUserAndStats();
    renderOverviewHistory();
    renderAddressViews();
    renderOrdersList();
});
