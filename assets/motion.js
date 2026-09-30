(() => {
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const heading=document.querySelector('.hero h1');
  const language=document.getElementById('languageSelect');
  const phrases={
    en:['Hi, I am Jacky Leong Kin Yin','I am a FinTech Student in APU','I am Jacky Leong Kin Yin'],
    zh:['你好，我是梁健言','我是 APU 的金融科技学生','我是梁健言'],
    ja:['こんにちは、Jacky Leong Kin Yinです','APUで金融テクノロジーを学んでいます','Jacky Leong Kin Yinです'],
    ko:['안녕하세요, Jacky Leong Kin Yin입니다','APU에서 핀테크를 공부하고 있습니다','Jacky Leong Kin Yin입니다'],
    ms:['Hai, saya Jacky Leong Kin Yin','Saya pelajar FinTech di APU','Saya Jacky Leong Kin Yin']
  };
  heading.classList.add('typing-heading');
  heading.setAttribute('translate','no');
  heading.innerHTML='<span class="sr-only" id="introAccessible"></span><span class="typing-reserve" aria-hidden="true"></span><span class="typing-display" aria-hidden="true"><span id="typedIntro"></span><span class="typing-caret"></span></span>';
  const typed=document.getElementById('typedIntro');
  const reserve=heading.querySelector('.typing-reserve');
  const accessible=document.getElementById('introAccessible');
  const toggle=document.createElement('button');
  toggle.className='motion-toggle';toggle.type='button';toggle.setAttribute('translate','no');
  document.querySelector('.hero-copy').append(toggle);
  let paused=false;
  try{paused=localStorage.getItem('jacky-motion-paused')==='true'}catch{}
  let timer,index=0,count=0,deleting=false,lines=[];
  const inactive=()=>paused||reduced.matches;
  function schedule(delay){clearTimeout(timer);if(!inactive()&&!document.hidden)timer=setTimeout(tick,delay)}
  function tick(){
    const chars=Array.from(lines[index]);
    count+=deleting?-1:1;
    typed.textContent=chars.slice(0,count).join('');
    if(!deleting&&count===chars.length){deleting=true;schedule(2300)}
    else if(deleting&&count===0){deleting=false;index=index===0?1:index===1?2:1;schedule(400)}
    else schedule(deleting?35:75);
  }
  function resetIntro(){
    clearTimeout(timer);lines=phrases[language.value]||phrases.en;
    // Overlaid invisible phrases reserve the tallest phrase at every screen width.
    reserve.replaceChildren(...lines.map(line=>{const s=document.createElement('span');s.style.gridArea='1/1';s.textContent=line;return s}));
    reserve.style.display='grid';
    accessible.textContent=lines[0]+'. '+lines[1]+'.';
    index=0;count=Array.from(lines[0]).length;deleting=true;typed.textContent=lines[0];schedule(2300);
  }
  const items=[];
  function add(el,direction){if(!el||items.includes(el))return;items.push(el);el.classList.add('reveal-item');el.style.setProperty('--reveal-x',direction==='right'?'55px':'-55px')}
  document.querySelectorAll('.section-head').forEach(el=>add(el,'left'));
  document.querySelectorAll('.about-grid,.experience-grid,.project-grid,.certificate-grid,.gallery,.music-grid').forEach(grid=>{
    [...grid.children].forEach((el,i)=>add(el,i%2?'right':'left'));
  });
  document.querySelectorAll('.singer-portraits').forEach(grid=>{[...grid.children].forEach((el,i)=>add(el,i%2?'right':'left'))});
  document.querySelectorAll('.singer-intro').forEach(el=>add(el,'left'));
  document.querySelectorAll('.contact-box').forEach(el=>add(el,'left'));
  // Only arm off-screen content; already-visible sections never flash away on load.
  items.forEach(el=>{const r=el.getBoundingClientRect();el.classList.add(r.top>=innerHeight?'reveal-pending':'reveal-visible')});
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('reveal-visible')}
      else if(!inactive()){
        // Re-arm only after the complete card leaves view, preventing flicker on tall cards.
        entry.target.classList.remove('reveal-visible');entry.target.classList.add('reveal-pending');
      }
    }),{threshold:0,rootMargin:'0px 0px -24px 0px'});
    items.forEach(el=>observer.observe(el));
  }else items.forEach(el=>el.classList.remove('reveal-pending'));
  function syncMotion(){
    root.dataset.motionPaused=String(inactive());
    toggle.textContent=reduced.matches?'Reduced motion enabled':paused?'Resume animation':'Pause animation';
    toggle.disabled=reduced.matches;toggle.setAttribute('aria-pressed',String(inactive()));
    resetIntro();
  }
  toggle.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('jacky-motion-paused',String(paused))}catch{}syncMotion()});
  reduced.addEventListener('change',syncMotion);
  language.addEventListener('change',resetIntro);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else schedule(500)});
  syncMotion();
})();
