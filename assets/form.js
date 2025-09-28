document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('form[data-form]').forEach(f=>{
    const url=f.getAttribute('data-action')||"#";
    f.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const btn=f.querySelector('button'); if(btn) btn.disabled=true;
      try{
        if(url && url.startsWith('http')){
          const r=await fetch(url,{method:"POST",headers:{"Accept":"application/json"},body:new FormData(f)});
          alert(r.ok?"Danke! Wir melden uns.":"Fehler – bitte später erneut."); if(r.ok) f.reset();
        }else{ alert("Gesendet (Demo-Modus ohne Server)."); f.reset(); }
      }catch{ alert("Netzwerkfehler – später erneut."); }
      if(btn) btn.disabled=false;
    });
  });
});
