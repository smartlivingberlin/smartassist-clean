fetch("data/usecases.json")
  .then(r => r.json())
  .then(data => {
    const el = document.getElementById("usecases");
    el.innerHTML = data.map(u => `
      <div class="card">
        <img src="${u.image}" alt="${u.title}" width="300">
        <h2>${u.title}</h2>
        <p>${u.description}</p>
      </div>
    `).join("");
  });
