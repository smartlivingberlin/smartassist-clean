// Produkte laden + Filter + Vergleich
let allProducts = [];

function renderProducts(list) {
  const el = document.getElementById("products");
  el.innerHTML = list.map(p => `
    <div class="card">
      <input type="checkbox" class="compare" value="${p.name}">
      <img src="${p.image}" alt="${p.name}" width="200">
      <h2>${p.name}</h2>
      <p><strong>${p.brand}</strong> â€“ ${p.category}</p>
      <p>${p.reason}</p>
      <span>${p.price_eur} â‚¬</span>
    </div>
  `).join("");
}

function renderCompare() {
  const selected = [...document.querySelectorAll(".compare:checked")]
    .map(cb => cb.value);
  if (selected.length < 2) {
    document.getElementById("compare").innerHTML = "<p>Bitte mindestens 2 Produkte auswÃ¤hlen</p>";
    return;
  }
  const products = allProducts.filter(p => selected.includes(p.name));
  const features = ["price_eur", "battery_wh", "range_km"];
  document.getElementById("compare").innerHTML = `
    <table border="1">
      <tr><th>Feature</th>${products.map(p => `<th>${p.name}</th>`).join("")}</tr>
      ${features.map(f => `
        <tr><td>${f}</td>${products.map(p => `<td>${p[f] ?? "-"}</td>`).join("")}</tr>
      `).join("")}
    </table>
  `;
}

function filterProducts(tag) {
  if (tag === "all") return renderProducts(allProducts);
  renderProducts(allProducts.filter(p => p.tags.includes(tag)));
}

fetch("data/products.json")
  .then(r => r.json())
  .then(data => {
    allProducts = data;
    renderProducts(data);

    // Vergleich-Button aktivieren
    document.getElementById("compare-btn").onclick = renderCompare;

    // Filterchips generieren
    const tags = [...new Set(data.flatMap(p => p.tags))];
    document.getElementById("filters").innerHTML =
      `<button onclick="filterProducts('all')">Alle</button>` +
      tags.map(t => `<button onclick="filterProducts('${t}')">${t}</button>`).join("");
  });
