// 홈 첫 화면: 흑백 장면에 색이 번지듯 차오르고, 다 차면 다음 장면으로 넘어간다.
(function(){
  var root=document.querySelector('.stage-hero'); if(!root) return;
  var slides=[].slice.call(root.querySelectorAll('.slide'));
  var ticks=root.querySelector('.ticks-row');
  var noEl=root.querySelector('.hero-rec .no'), tEl=root.querySelector('.hero-rec .t'),
      sceneEl=root.querySelector('.hero-rec .scene'), recLink=root.querySelector('.hero-rec');
  var pauseBtn=root.querySelector('.pause');
  var SEEP=5600, HOLD=1600, DUR=SEEP+HOLD;
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var maskOK=window.CSS && CSS.supports && (CSS.supports('mask-image','radial-gradient(circle,#000,transparent)')||CSS.supports('-webkit-mask-image','radial-gradient(circle,#000,transparent)'));
  if(!maskOK) root.classList.add('nomask');
  var cur=0, t=0, last=null, paused=reduce;

  slides.forEach(function(s,i){
    s.style.setProperty('--x',s.dataset.x||'50%'); s.style.setProperty('--y',s.dataset.y||'50%');
    var li=document.createElement('li'), b=document.createElement('button');
    b.type='button'; b.setAttribute('aria-label','장면 '+(i+1)+': '+s.dataset.scene);
    b.appendChild(document.createElement('i'));
    b.addEventListener('click',function(){ go(i); });
    li.appendChild(b); ticks.appendChild(li);
  });
  var btns=[].slice.call(ticks.querySelectorAll('button'));

  function paint(p){ // p: 0~1 진행
    var col=slides[cur].querySelector('.col');
    var k=Math.min(1,p*DUR/SEEP); var e=k*k*(3-2*k); // 부드럽게
    if(maskOK) col.style.setProperty('--r',(e*150).toFixed(2)+'%'); else col.style.setProperty('--o',e.toFixed(3));
    btns[cur].firstChild.style.width=(p*100).toFixed(1)+'%';
  }
  function go(i){
    var prev=slides[cur]; var prevNo=prev.dataset.no;
    prev.classList.remove('on'); btns[cur].removeAttribute('aria-current'); btns[cur].firstChild.style.width='0';
    var pc=prev.querySelector('.col'), pidx=cur; setTimeout(function(){ if(pidx!==cur){ pc.style.setProperty('--r','0%'); pc.style.setProperty('--o','0'); } },1500);
    cur=(i+slides.length)%slides.length; t=0;
    var s=slides[cur]; s.classList.add('on'); btns[cur].setAttribute('aria-current','true');
    if(s.dataset.no!==prevNo){ noEl.classList.remove('flip'); void noEl.offsetWidth; noEl.classList.add('flip'); }
    noEl.textContent='No. '+s.dataset.no; tEl.textContent=s.dataset.title; sceneEl.textContent=s.dataset.scene;
    recLink.href=s.dataset.href||'archive.html';
    paint(reduce?1:0);
  }
  function frame(ts){
    if(last===null) last=ts;
    var dt=Math.min(100,ts-last); last=ts;
    if(!paused){ t+=dt; if(t>=DUR){ go(cur+1); } else paint(t/DUR); }
    requestAnimationFrame(frame);
  }
  pauseBtn.addEventListener('click',function(){
    paused=!paused; pauseBtn.textContent=paused?'재생':'멈춤'; pauseBtn.setAttribute('aria-pressed',paused);
  });
  if(reduce){ pauseBtn.textContent='재생'; pauseBtn.setAttribute('aria-pressed','true'); }
  go(0);
  requestAnimationFrame(frame);
})();
