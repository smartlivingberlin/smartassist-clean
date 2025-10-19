fetch("data/partners.json")
  .then(r => r.json())
  .then(data => {
    const el = document.getElementById("partners");
    el.innerHTML = data.map(p => `
      <div class="card">
        <img src="${p.logo}" alt="${p.name}" width="150">
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <a href="${p.link}" target="_blank">Zur Website</a>
      </div>
    `).join("");
  });
