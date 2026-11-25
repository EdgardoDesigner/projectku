document.addEventListener('DOMContentLoaded', () => {
    const store = window.VegetaleStore;
    let mode = 'register';

    const titleEl = document.getElementById('auth-title');
    const subtitleEl = document.getElementById('auth-subtitle');
    const groupUsername = document.getElementById('group-username');
    const groupConfirm = document.getElementById('group-confirm');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchNote = document.getElementById('auth-switch-note');
    const errorEl = document.getElementById('auth-error');
    const form = document.getElementById('auth-form');

    function setMode(nextMode) {
        mode = nextMode;
        const isRegister = mode === 'register';

        document.querySelectorAll('.mode-btn').forEach((btn) => {
            const active = btn.dataset.mode === mode;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-selected', String(active));
        });

        groupUsername.hidden = !isRegister;
        groupConfirm.hidden = !isRegister;
        document.getElementById('reg-username').required = isRegister;
        document.getElementById('reg-confirm').required = isRegister;

        titleEl.textContent = isRegister ? 'Buat Akun Baru' : 'Selamat Datang Kembali';
        subtitleEl.textContent = isRegister
            ? 'Mulai perjalanan ruang hijau Anda bersama Vegetale.'
            : 'Masuk untuk memantau pesanan dan keranjang tanaman Anda.';

        submitBtn.innerHTML = isRegister
            ? 'Daftar Sekarang <i class="fa-solid fa-arrow-right"></i>'
            : 'Masuk ke Akun <i class="fa-solid fa-arrow-right"></i>';

        switchNote.innerHTML = isRegister
            ? 'Sudah memiliki akun? <button type="button" class="inline-link" data-switch-mode="login">Masuk di sini</button>'
            : 'Belum punya akun Vegetale? <button type="button" class="inline-link" data-switch-mode="register">Daftar sekarang</button>';

        errorEl.hidden = true;
        bindSwitchLinks();
    }

    function bindSwitchLinks() {
        document.querySelectorAll('[data-switch-mode]').forEach((btn) => {
            btn.addEventListener('click', () => setMode(btn.dataset.switchMode));
        });
    }

    document.querySelectorAll('.mode-btn').forEach((btn) => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // Toggle password visibility
    document.querySelectorAll('[data-toggle-pass]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.togglePass);
            if (!input) return;
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.innerHTML = show
                ? '<i class="fa-regular fa-eye-slash"></i>'
                : '<i class="fa-regular fa-eye"></i>';
        });
    });

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.hidden = false;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorEl.hidden = true;

        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (mode === 'register' && username.length < 2) {
            return showError('Silakan masukkan nama atau username minimal 2 karakter.');
        }
        if (!email || !email.includes('@')) {
            return showError('Masukkan alamat e-mail yang valid.');
        }
        if (password.length < 6) {
            return showError('Kata sandi minimal harus 6 karakter.');
        }
        if (mode === 'register' && password !== confirm) {
            return showError('Konfirmasi kata sandi tidak cocok.');
        }

        if (store) {
            const existing = store.getUser();
            store.saveUser({
                name: mode === 'register' ? username : existing.name || email.split('@')[0],
                email
            });
            store.showToast(
                mode === 'register' ? 'Akun berhasil dibuat! Mengalihkan ke dashboard...' : 'Berhasil masuk! Mengalihkan...',
                'success'
            );
        }

        setTimeout(() => {
            window.location.href = '../dashboard/dashboardpengguna.html';
        }, 550);
    });

    bindSwitchLinks();
});
