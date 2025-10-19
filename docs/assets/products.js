fetch("data/products.json")
  .then(r => r.json())
  .then(data => {
    const el = document.getElementById("products");
    el.innerHTML = data.map(p => `
      <div class="card">
        <img src="${p.image}" alt="${p.name}" width="200">
        <h2>${p.name}</h2>
        <p><strong>${p.brand}</strong> â€“ ${p.category}</p>
        <p>${p.reason}</p>
        <a href="${p.link}" target="_blank">Zum Produkt</a>
      </div>
    `).join("");
  });
