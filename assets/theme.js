(function(){
  const KEY="theme"; const root=document.documentElement;
  function apply(t){ root.dataset.theme=t; localStorage.setItem(KEY,t); }
  const saved=localStorage.getItem(KEY);
  if(saved){ apply(saved); }
  else if(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches){ apply('dark'); }
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('[data-toggle-theme]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        apply(root.dataset.theme==='dark'?'light':'dark');
      });
    });
  });
})();
