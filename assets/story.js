let stories=[],storyIndex=0,storyTimer=null,storyDur=5000;

function loadStories(){
  fetch("data/news.json").then(r=>r.json()).then(d=>{
    stories=d.items.map(x=>{
      let media="";
      if(x.video){
        if(x.video.type==="youtube") media=`<iframe src="https://www.youtube.com/embed/${x.video.id}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
        if(x.video.type==="vimeo") media=`<iframe src="https://player.vimeo.com/video/${x.video.id}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
      } else {
        const thumb=x.thumb||"https://picsum.photos/seed/"+encodeURIComponent(x.id)+"/600/400";
        media=`<img src="${thumb}" alt="">`;
      }
      return {media,title:x.title,info:x.source+" – "+x.published};
    });
  });
}
function startStories(){
  if(!stories.length){loadStories();setTimeout(startStories,1000);return;}
  const ov=document.querySelector(".story-overlay");
  ov.style.display="flex";
  storyIndex=0; showStory();
}
function showStory(){
  const s=stories[storyIndex]; if(!s)return;
  const ov=document.querySelector(".story-overlay");
  ov.querySelector(".story-content").innerHTML=`${s.media}<h3>${s.title}</h3><p>${s.info}</p>`;
  const bars=ov.querySelectorAll(".story-progress span");
  bars.forEach((b,i)=>{b.style.width=i<storyIndex?"100%":(i===storyIndex?"0":"0");});
  animateProgress(bars[storyIndex]);
  clearTimeout(storyTimer);
  storyTimer=setTimeout(()=>{ nextStory(); },storyDur);
}
function animateProgress(bar){
  let start=null;
  function step(ts){
    if(!start) start=ts;
    let p=Math.min((ts-start)/storyDur,1);
    bar.style.width=(p*100)+"%";
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function nextStory(){ storyIndex=(storyIndex+1)%stories.length; showStory(); }
function prevStory(){ storyIndex=(storyIndex-1+stories.length)%stories.length; showStory(); }
function closeStories(){ document.querySelector(".story-overlay").style.display="none"; clearTimeout(storyTimer); }

window.addEventListener("DOMContentLoaded",()=>{
  const ov=document.createElement("div");
  ov.className="story-overlay";
  ov.innerHTML=`
    <div class="story-content"></div>
    <div class="story-controls">
      <button class="story-btn prev">◀</button>
      <div class="bars"></div>
      <button class="story-btn next">▶</button>
      <button class="story-btn close">×</button>
    </div>`;
  document.body.appendChild(ov);

  // Progress bars
  const bars=ov.querySelector(".bars");
  for(let i=0;i<10;i++){ // max 10 Stories sichtbar
    const div=document.createElement("div");div.className="story-progress";div.innerHTML="<span></span>";
    bars.appendChild(div);
  }

  ov.querySelector(".prev").onclick=()=>{ prevStory(); };
  ov.querySelector(".next").onclick=()=>{ nextStory(); };
  ov.querySelector(".close").onclick=()=>{ closeStories(); };

  // Start-Button einfügen
  const btn=document.createElement("button");
  btn.innerText="📖 Stories ansehen";
  btn.className="btn";
  btn.style.position="fixed";btn.style.bottom="1rem";btn.style.right="1rem";btn.style.zIndex="100";
  btn.onclick=startStories;
  document.body.appendChild(btn);

  loadStories();
});
