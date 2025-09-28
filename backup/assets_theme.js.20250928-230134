(function(){
  const key="smartassist-theme";
  const saved=localStorage.getItem(key);
  if(saved) document.documentElement.dataset.theme=saved;
  function toggle(){
    const cur=document.documentElement.dataset.theme==="dark"?"light":"dark";
    document.documentElement.dataset.theme=cur;
    localStorage.setItem(key,cur);
  }
  // apply variables for explicit dark
  const style=document.createElement("style");
  style.textContent=`[data-theme="dark"]{color-scheme:dark}`;
  document.head.appendChild(style);

  // Inject Toggle Button in Navbar
  window.addEventListener("DOMContentLoaded",()=>{
    const nav=document.querySelector(".nav");
    if(!nav) return;
    const btn=document.createElement("button");
    btn.className="btn btn-outline";
    btn.style.marginLeft="auto";
    btn.textContent="🌓";
    btn.title="Theme wechseln (Hell/Dunkel)";
    btn.onclick=toggle;
    // wenn schon eine Suche rechts sitzt → davor einfügen
    const last=nav.lastElementChild;
    if(last && last.tagName==="DIV" && last.querySelector('input[type="search"]')){
      nav.insertBefore(btn,last);
    } else {
      nav.appendChild(btn);
    }
  });
})();
