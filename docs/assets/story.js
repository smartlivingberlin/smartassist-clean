let stories=[],storyIndex=0,storyTimer=null,storyDur=5000;
let currentTag="all";

async function loadStories(tag="all"){
  const d=await fetch("data/news.json").then(r=>r.json());
  stories=d.items.map(x=>{
    let media="";
    if(x.video){
      if(x.video.type==="youtube") media=`<iframe src="https://www.youtube.com/embed/${x.video.id}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
      if(x.video.type==="vimeo") media=`<iframe src="https://player.vimeo.com/video/${x.video.id}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
    } else {
      const thumb=x.thumb||"https://picsum.photos/seed/"+encodeURIComponent(x.id)+"/600/400";
      media=`<img src="${thumb}" alt="">`;
    }
    // einfache Tag-Simulation (Titel enthÃ¤lt Wort)
    let tags=[];
    if(/sport/i.test(x.title)) tags.push("sport");
    if(/pflege|health|care/i.test(x.title)) tags.push("pflege");
    if(/smart.?home/i.test(x.title)) tags.push("smarthome");
    if(/vr|ar|mixed/i.test(x.title)) tags.push("vr");
    return {media,title:x.title,info:x.source+" â€“ "+x.published,tags};
  });
  if(tag!=="all"){ stories=stories.filter(s=>s.tags.includes(tag)); }
}

function startStories(force=false,tag="all"){
  currentTag=tag;
  loadStories(tag).then(()=>{
    if(!stories.length) return;
    const ov=document.querySelector(".story-overlay");
    ov.style.display="flex";
    storyIndex=0; showStory();
  });
}

function showStory(){
  const s=stories[storyIndex]; if(!s)return;
  const ov=document.querySelector(".story-overlay");
  ov.querySelector(".story-content").innerHTML=`${s.media}<h3>${s.title}</h3><p>${s.info}</p><div id="poll-here" style="margin-top:.5rem"></div><p><a class="btn" href="news.html">Weitere News</a></p>`;
  const bars=ov.querySelectorAll(".story-progress span");
  bars.forEach((b,i)=>{b.style.width=i<storyIndex?"100%":(i===storyIndex?"0":"0");});
  animateProgress(bars[storyIndex]);
  try{ const spot=document.getElementById("poll-here"); if(spotclearTimeout(storyTimer);clearTimeout(storyTimer);window.renderPoll){ renderPoll(spot,"news-"+storyIndex,["ðŸ‘ Hilfreich","ðŸ‘Ž Nicht relevant"]); } }catch(e){}
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

window.addEventListener("DOMContentLoaded",()=>{
  const ov=document.querySelector(".story-overlay");
  const bars=ov.querySelector(".bars");
  bars.innerHTML="";
  for(let i=0;i<10;i++){
    const div=document.createElement("div");
    div.className="story-progress";div.innerHTML="<span></span>";
    bars.appendChild(div);
  }
  ov.querySelector(".prev").onclick=()=>{ prevStory(); };
  ov.querySelector(".next").onclick=()=>{ nextStory(); };
  startStories(true,"all");
});
