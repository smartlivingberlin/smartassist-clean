fetch("data/news.json")
  .then(r => r.json())
  .then(data => {
    const el = document.getElementById("news");
    el.innerHTML = data.map(n => `
      <div class="card">
        <img src="${n.image}" alt="${n.title}" width="300">
        <h2>${n.title}</h2>
        <p>${n.summary}</p>
        <a href="${n.link}" target="_blank">Mehr lesen</a>
      </div>
    `).join("");
  });
