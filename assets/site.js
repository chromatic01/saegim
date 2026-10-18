// 휴대폰: 흑백 사진이 화면 가운데에 오면 색이 돌아온다
(function(){
  if(!window.matchMedia || !window.matchMedia('(hover: none)').matches || !('IntersectionObserver' in window)) return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ e.target.classList.toggle('seen', e.isIntersecting); });
  },{rootMargin:'-35% 0px -35% 0px'});
  document.querySelectorAll('.mono').forEach(function(img){ io.observe(img); });
})();
