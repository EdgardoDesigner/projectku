document.addEventListener('DOMContentLoaded', () => {
    const store = window.VegetaleStore;
    const grid = document.getElementById('featured-plants-grid');
    if (!store || !grid) return;

    const featured = store.CATALOG.slice(0, 4);
    grid.innerHTML = featured.map((p) => store.renderProductCardHTML(p, '')).join('');
    store.bindProductCards(grid);
});
