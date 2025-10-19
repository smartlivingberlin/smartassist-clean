(function(){
  function init(){
    document.querySelectorAll("iframe[data-lazy]").forEach(iframe=>{
      const wrapper=document.createElement("div");
      wrapper.className="video-lazy";
      wrapper.style="position:relative;cursor:pointer;max-width:100%;border-radius:12px;overflow:hidden;background:#000";
      wrapper.innerHTML=`<img src="https://img.youtube.com/vi/${iframe.dataset.id}/hqdefault.jpg" alt="Video" style="width:100%;display:block">
        <button style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2rem;background:rgba(0,0,0,.6);color:#fff;border:0;border-radius:50%;width:60px;height:60px">â–¶</button>`;
      wrapper.onclick=()=>{
        const url=iframe.dataset.src;
        const real=document.createElement("iframe");
        real.src=url+"?autoplay=1";
        real.allow="autoplay;fullscreen";
        real.loading="lazy";
        real.style="width:100%;height:360px;border:0;border-radius:12px";
        wrapper.replaceWith(real);
      };
      iframe.replaceWith(wrapper);
    });
  }
  window.addEventListener("DOMContentLoaded",init);
})();
