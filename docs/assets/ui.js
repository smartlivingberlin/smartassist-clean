/* Mini-Helpers */
export function qs(s,root=document){return root.querySelector(s)}
export function qsa(s,root=document){return [...root.querySelectorAll(s)]}
export const on=(el,ev,fn)=>el&&el.addEventListener(ev,fn);

/* Slider (autoplay) */
export function slider(rootSel, interval=5000){
  const root=qs(rootSel); if(!root) return;
  const slides=qsa('.slide',root); let i=0; const show=idx=>{
    slides.forEach((s,k)=>s.style.display= k===idx ? 'grid':'none');
    qsa('[data-dot]',root).forEach((d,k)=>d.classList.toggle('active',k===idx));
  };
  show(0);
  qsa('[data-dot]',root).forEach((d,k)=> on(d,'click',()=>{i=k;show(i)}));
  setInterval(()=>{i=(i+1)%slides.length;show(i)}, interval);
}

/* Modal-Video (YouTube) */
export function videoModal(){
  const m=qs('#videoModal'); if(!m) return;
  const frame=qs('iframe',m);
  on(document,'click',e=>{
    const a=e.target.closest('[data-yt]'); if(!a) return;
    e.preventDefault(); m.style.display='flex';
    const id=a.dataset.yt; frame.src=`https://www.youtube.com/embed/${id}?autoplay=1`;
  });
  on(m,'click',e=>{ if(e.target===m || e.target.id==='closeModal'){ m.style.display='none'; frame.src='' }});
}
