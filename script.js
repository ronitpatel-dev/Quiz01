
    // ---------------------------
    // Sample Quiz Data
    // ---------------------------
    const QUIZZES = [
      {
        id: 'tech',
        title: 'Technology',
        icon: 'fa-microchip',
        timePerQuestionSec: 15,
        questions: [
          { q: 'What does HTML stand for?',
            options: ['HyperText Markup Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language', 'Hyper Transfer Makeup Language'],
            answer: 0 },
          { q: 'Which CSS property controls text size?', options: ['font-weight','text-style','font-size','text-size'], answer: 2 },
          { q: 'Inside which HTML element do we put the JavaScript?', options:['<js>','<javascript>','<script>','<code>'], answer: 2 },
          { q: 'Which company developed React?', options:['Google','Facebook (Meta)','Microsoft','Twitter'], answer: 1 },
          { q: 'LocalStorage stores data…', options:['On the server','In browser, no expiry','In RAM only','In cookies'], answer: 1 },
          { q: 'Which is NOT a programming language?', options:['Python','Java','HTML','C++'], answer: 2 },
          { q: 'Which HTTP code means Not Found?', options:['200','301','404','500'], answer: 2 },
          { q: 'Git command to create a new branch?', options:['git branch <name>','git new <name>','git checkout -b','Both A and C'], answer: 3 },
          { q: 'CSS Flexbox property to align items along cross-axis?', options:['justify-content','align-items','flex-direction','gap'], answer: 1 },
          { q: 'What does API stand for?', options:['Application Programming Interface','Advanced Program Interaction','Applied Protocol Interface','App Processing Integration'], answer: 0 }
        ]
      },
      {
        id: 'science',
        title: 'Science',
        icon: 'fa-flask',
        timePerQuestionSec: 12,
        questions: [
          { q: 'Water chemical formula is', options:['H2O','CO2','NaCl','O2'], answer: 0 },
          { q: 'Earth is approximately how old?', options:['4.5 billion years','4.5 million years','450 thousand years','45 billion years'], answer: 0 },
          { q: 'Speed of light ~', options:['3×10^8 m/s','3×10^6 m/s','3×10^5 km/s','3×10^3 km/s'], answer: 0 },
          { q: 'The gas used by plants for photosynthesis', options:['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'], answer: 2 },
          { q: 'SI unit of force', options:['Watt','Pascal','Newton','Joule'], answer: 2 },
          { q: 'Human blood pH is around', options:['2','5','7.4','9'], answer: 2 },
          { q: 'Largest planet in solar system', options:['Earth','Jupiter','Saturn','Neptune'], answer: 1 },
          { q: 'DNA stands for', options:['Deoxyribonucleic Acid','Dextroribonucleic Acid','Deoxyribose Nucleic Acid','Dual Nucleic Acid'], answer: 0 },
          { q: 'Boiling point of water at sea level', options:['90°C','95°C','100°C','110°C'], answer: 2 },
          { q: 'Primary source of Sun’s energy', options:['Fission','Fusion','Combustion','Radiation'], answer: 1 }
        ]
      },
      {
        id: 'gk',
        title: 'General Knowledge',
        icon: 'fa-globe',
        timePerQuestionSec: 10,
        questions: [
          { q:'The capital of France is', options:['Berlin','Madrid','Paris','Lisbon'], answer:2 },
          { q:'Which ocean is the largest?', options:['Indian','Pacific','Atlantic','Arctic'], answer:1 },
          { q:'How many continents are there?', options:['5','6','7','8'], answer:2 },
          { q:'Currency of Japan', options:['Yen','Won','Yuan','Ringgit'], answer:0 },
          { q:'Taj Mahal is in', options:['Delhi','Jaipur','Agra','Mumbai'], answer:2 },
          { q:'Largest mammal', options:['Elephant','Blue Whale','Giraffe','Hippopotamus'], answer:1 },
          { q:'Olympics held every', options:['2 years','3 years','4 years','5 years'], answer:2 },
          { q:'Which is a prime number?', options:['21','29','51','77'], answer:1 },
          { q:'Sun rises in the', options:['West','North','East','South'], answer:2 },
          { q:'Largest desert', options:['Sahara','Gobi','Kalahari','Arctic'], answer:0 }
        ]
      }
    ];

    // ---------------------------
    // State & Helpers
    // ---------------------------
    let currentQuiz = null;
    let currentIndex = 0;
    let answers = []; // selected option indices
    let timer = null;
    let timeLeft = 0; // seconds
    let nameOfUser = '';

    const byId = id => document.getElementById(id);
    const screens = {
      home: byId('screen-home'), quiz: byId('screen-quiz'), result: byId('screen-result'),
      leaderboard: byId('screen-leaderboard'), about: byId('screen-about')
    }
    function go(to){
      Object.values(screens).forEach(s=>s.classList.add('hidden'));
      screens[to].classList.remove('hidden');
      if(to==='leaderboard') renderLeaderboard(byId('leaderboard2').querySelector('tbody'));
      if(to==='home') fillCategories();
    }

    function shuffle(arr){
      const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;
    }

    function formatTime(sec){
      const m = String(Math.floor(sec/60)).padStart(2,'0');
      const s = String(sec%60).padStart(2,'0');
      return `${m}:${s}`;
    }

    // ---------------------------
    // Home: categories
    // ---------------------------
    function fillCategories(){
      const grid = byId('category-grid');
      grid.innerHTML='';
      QUIZZES.forEach(qz=>{
        const qCount = qz.questions.length;
        const time = qCount * qz.timePerQuestionSec;
        const el = document.createElement('div');
        el.className='card';
        el.innerHTML = `
          <div class="tag"><i class="fa-solid ${qz.icon}"></i> ${qz.title}</div>
          <div class="muted" style="margin-top:6px">${qCount} questions • ${Math.ceil(time/60)} min</div>
          <div style="display:flex;gap:8px;margin-top:14px">
            <button class="btn pri" data-id="${qz.id}">Start</button>
            <button class="btn ghost" data-id="${qz.id}" data-preview>Preview</button>
          </div>`;
        grid.appendChild(el);
        el.querySelector('.btn.pri').addEventListener('click', ()=>startQuiz(qz.id));
        el.querySelector('[data-preview]').addEventListener('click', ()=>showRules(qz));
      });
    }

    function showRules(qz){
      alert(`${qz.title} Rules:\n• ${qz.questions.length} questions\n• ${qz.timePerQuestionSec}s per question\n• One mark for each correct\n• Pass mark: 60%`);
    }

    // ---------------------------
    // Quiz flow
    // ---------------------------
    function startQuiz(id){
      currentQuiz = JSON.parse(JSON.stringify(QUIZZES.find(x=>x.id===id)));
      // shuffle questions but keep answer mapping
      currentQuiz.questions = shuffle(currentQuiz.questions);
      currentIndex = 0;
      answers = new Array(currentQuiz.questions.length).fill(null);
      const totalTime = currentQuiz.questions.length * currentQuiz.timePerQuestionSec;
      timeLeft = totalTime;
      byId('quiz-meta').lastElementChild.textContent = currentQuiz.title;
      byId('progress-bar').style.width = '0%';
      byId('status').textContent = '';
      nameOfUser = prompt('Enter your name for the leaderboard (optional):') || 'Player';
      renderMap();
      renderQA();
      go('quiz');
      startTimer();
    }

    function startTimer(){
      updateTime();
      clearInterval(timer);
      timer = setInterval(()=>{
        timeLeft--; updateTime();
        if(timeLeft<=0){
          clearInterval(timer);
          submitQuiz();
        }
      },1000);
    }

    function updateTime(){
      byId('time').textContent = formatTime(Math.max(0,timeLeft));
      const total = currentQuiz.questions.length * currentQuiz.timePerQuestionSec;
      const used = total - timeLeft;
      const pct = Math.min(100, (used/total)*100);
      byId('progress-bar').style.width = pct + '%';
    }

    function renderQA(){
      const qObj = currentQuiz.questions[currentIndex];
      byId('q-index').textContent = `Question ${currentIndex+1} of ${currentQuiz.questions.length}`;
      byId('question').textContent = qObj.q;
      const choices = byId('choices');
      choices.innerHTML='';
      qObj.options.forEach((opt,i)=>{
        const div = document.createElement('label');
        div.className='choice' + (answers[currentIndex]===i? ' selected':'' );
        div.innerHTML = `<input type="radio" name="opt" value="${i}"> <span>${opt}</span>`;
        div.addEventListener('click',()=>selectChoice(i));
        choices.appendChild(div);
      });
      byId('status').textContent = answers[currentIndex]==null? 'No answer selected' : 'Saved';
      renderMapActive();
      byId('next').textContent = currentIndex===currentQuiz.questions.length-1? 'Finish →' : 'Next →';
    }

    function selectChoice(i){
      answers[currentIndex] = i;
      renderQA();
    }

    function renderMap(){
      const map = byId('map'); map.innerHTML='';
      for(let i=0;i<currentQuiz.questions.length;i++){
        const b = document.createElement('button');
        b.className='btn'; b.style.width='100%'; b.textContent=i+1;
        b.addEventListener('click',()=>{currentIndex=i; renderQA();});
        map.appendChild(b);
      }
      renderMapActive();
    }
    function renderMapActive(){
      const map = byId('map');
      [...map.children].forEach((btn,idx)=>{
        btn.style.borderColor = (idx===currentIndex)? '#3b82f6' : (answers[idx]==null? '#233049':'#1f7a55');
      });
    }

    function nextQ(){ if(currentIndex<currentQuiz.questions.length-1){currentIndex++; renderQA();} else {submitQuiz();} }
    function prevQ(){ if(currentIndex>0){currentIndex--; renderQA();} }

    function submitQuiz(){
      clearInterval(timer);
      // compute
      const qs = currentQuiz.questions;
      let correct = 0; const review = [];
      qs.forEach((q,i)=>{
        const chosen = answers[i];
        const isRight = chosen===q.answer;
        if(isRight) correct++;
        review.push({q:q.q, options:q.options, answer:q.answer, chosen});
      });
      const total = qs.length; const scorePct = Math.round((correct/total)*100);
      const grade = scorePct>=90? 'Excellent' : scorePct>=75? 'Great' : scorePct>=60? 'Good' : 'Needs Improvement';
      // Fill result screen
      byId('score-h').textContent = `${correct} / ${total}`;
      byId('accuracy').textContent = `${scorePct}%`;
      byId('grade').innerHTML = `<i class="fa-solid fa-star"></i> ${grade}`;
      const totalTime = total*currentQuiz.timePerQuestionSec;
      byId('time-used').textContent = `Time used: ${formatTime(totalTime-timeLeft)} / ${formatTime(totalTime)}`;
      byId('summary').innerHTML = `<div>Category: <strong>${currentQuiz.title}</strong></div>`;

      const rev = byId('review');
      rev.innerHTML='';
      review.forEach((r,idx)=>{
        const block = document.createElement('div');
        block.className='card';
        const makeChoice = (text, i) => `<div class="choice ${i===r.answer? 'correct':''} ${r.chosen===i && i!==r.answer? 'wrong':''}"><span>${String.fromCharCode(65+i)}.</span> ${text}</div>`;
        block.innerHTML = `<div class="muted" style="margin-bottom:6px">Q${idx+1}</div><div class="question">${r.q}</div><div class="choices">${r.options.map((o,i)=>makeChoice(o,i)).join('')}</div>`
        rev.appendChild(block);
      });

      // Save to leaderboard
      saveScore({ name:nameOfUser, quiz: currentQuiz.title, score:`${correct}/${total} (${scorePct}%)`, pct:scorePct, date: new Date().toLocaleString() });
      renderLeaderboard(byId('leaderboard').querySelector('tbody'));

      // show result screen
      go('result');
      // enable/disable certificate
      byId('btn-certificate').disabled = scorePct < 60;
    }

    // ---------------------------
    // Leaderboard
    // ---------------------------
    function loadScores(){
      try { return JSON.parse(localStorage.getItem('quiz-leaderboard')||'[]'); } catch { return []; }
    }
    function saveScore(entry){
      const data = loadScores();
      data.push(entry);
      // Keep top 50 by percentage desc
      const sorted = data.sort((a,b)=>b.pct-a.pct).slice(0,50);
      localStorage.setItem('quiz-leaderboard', JSON.stringify(sorted));
    }
    function renderLeaderboard(tbody){
      const data = loadScores();
      tbody.innerHTML='';
      data.forEach((row,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td>${row.name}</td><td>${row.quiz}</td><td>${row.score}</td><td>${row.date}</td>`;
        tbody.appendChild(tr);
      });
    }

    // ---------------------------
    // Certificate (PDF)
    // ---------------------------
    async function downloadCertificate(){
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({unit:'pt', format:'a4'});
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();
      // background
      doc.setFillColor(20,24,38); doc.rect(0,0,W,H,'F');
      // border
      doc.setDrawColor(59,130,246); doc.setLineWidth(4); doc.rect(24,24,W-48,H-48);

      // title
      doc.setTextColor(255,255,255);
      doc.setFont('helvetica','bold'); doc.setFontSize(26);
      doc.text('Certificate of Achievement', W/2, 120, {align:'center'});

      doc.setFont('helvetica','normal'); doc.setFontSize(12);
      doc.text('This certifies that', W/2, 160, {align:'center'});

      doc.setFont('helvetica','bold'); doc.setFontSize(22);
      doc.text(nameOfUser || 'Player', W/2, 200, {align:'center'});

      doc.setFont('helvetica','normal'); doc.setFontSize(12);
      doc.text(`has successfully completed the ${currentQuiz.title} quiz with merit.`, W/2, 235, {align:'center'});

      const score = byId('accuracy').textContent;
      doc.text(`Score: ${score}`, W/2, 260, {align:'center'});

      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleString()}`, W/2, 280, {align:'center'});

      // signature line
      doc.setDrawColor(255,255,255); doc.setLineWidth(1);
      doc.line(W/2-120, 330, W/2+120, 330);
      doc.text('Quiz Platform', W/2, 346, {align:'center'});

      doc.save(`Certificate_${nameOfUser || 'Player'}.pdf`);
    }

    // ---------------------------
    // Theme toggle (persist)
    // ---------------------------
    (function initTheme(){
      const key='qp-theme';
      const saved = localStorage.getItem(key) || 'dark';
      document.documentElement.dataset.theme = saved;
      byId('toggle-theme').addEventListener('click',()=>{
        const now = (document.documentElement.dataset.theme==='dark')? 'light':'dark';
        document.documentElement.dataset.theme = now;
        localStorage.setItem(key, now);
      });
    })();

    // ---------------------------
    // Events
    // ---------------------------
    byId('next').addEventListener('click', nextQ);
    byId('prev').addEventListener('click', prevQ);
    byId('submit').addEventListener('click', submitQuiz);
    byId('restart').addEventListener('click', ()=>startQuiz(currentQuiz.id));
    byId('exit').addEventListener('click', ()=>{clearInterval(timer); go('home');});

    byId('btn-home-from-result').addEventListener('click', ()=>go('home'));
    byId('btn-restart-from-result').addEventListener('click', ()=>startQuiz(currentQuiz.id));
    byId('btn-certificate').addEventListener('click', downloadCertificate);

    byId('btn-leaderboard').addEventListener('click', ()=>go('leaderboard'));
    byId('btn-about').addEventListener('click', ()=>go('about'));

    document.addEventListener('keydown', (e)=>{
      if(screens.quiz.classList.contains('hidden')) return;
      if(e.key.toLowerCase()==='n') nextQ();
      if(e.key.toLowerCase()==='p') prevQ();
    });

    // init
    fillCategories();