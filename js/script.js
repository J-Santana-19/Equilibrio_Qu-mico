// ---------- Scrollspy + progress bar ----------
const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('#navlist a');
function onScroll(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progress').style.width = (docHeight>0 ? (scrollTop/docHeight*100) : 0) + '%';

  let current = sections[0].id;
  sections.forEach(s=>{
    if(scrollTop >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === '#'+current);
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

// ---------- Kp/Kc calculator ----------
function updateKp(){
  const kc = parseFloat(document.getElementById('kcIn').value);
  const dn = parseFloat(document.getElementById('dnIn').value);
  const T = parseFloat(document.getElementById('tIn').value);
  const R = 0.0821;
  if(isNaN(kc)||isNaN(dn)||isNaN(T)){ document.getElementById('kpResult').textContent=''; return; }
  const kp = kc * Math.pow(R*T, dn);
  document.getElementById('kpResult').innerHTML = 'K<sub>p</sub> = ' + kp.toExponential(3) + ' &nbsp;(R·T = ' + (R*T).toFixed(2) + ')';
}
['kcIn','dnIn','tIn'].forEach(id=>document.getElementById(id).addEventListener('input', updateKp));
updateKp();

// ---------- Balance scale (Q vs K) ----------
const pRange = document.getElementById('pRange');
const rRange = document.getElementById('rRange');
const kRange = document.getElementById('kRange');
const beam = document.getElementById('beam');
const verdict = document.getElementById('qkVerdict');

function updateBalance(){
  const p = parseFloat(pRange.value);
  const r = parseFloat(rRange.value);
  const k = parseFloat(kRange.value);
  document.getElementById('pVal').textContent = p.toFixed(2);
  document.getElementById('rVal').textContent = r.toFixed(2);
  document.getElementById('kVal').textContent = k.toFixed(2);

  const q = p / r;
  let angle = Math.max(-18, Math.min(18, (Math.log(q/k)) * 10));
  beam.setAttribute('transform', `rotate(${angle} 200 40)`);

  let msg;
  if (Math.abs(q-k) < 0.03*k) {
    msg = `Q ≈ K (Q=${q.toFixed(2)}, K=${k.toFixed(2)}) → el sistema está <b>en equilibrio</b>, sin desplazamiento neto.`;
  } else if (q < k) {
    msg = `Q=${q.toFixed(2)} &lt; K=${k.toFixed(2)} → la reacción avanza <b>hacia los productos</b> (derecha).`;
  } else {
    msg = `Q=${q.toFixed(2)} &gt; K=${k.toFixed(2)} → la reacción avanza <b>hacia los reactivos</b> (izquierda).`;
  }
  verdict.innerHTML = msg;
}
[pRange, rRange, kRange].forEach(el => el.addEventListener('input', updateBalance));
updateBalance();

// ---------- Le Chatelier factor cards ----------
document.querySelectorAll('.factor').forEach(card=>{
  card.addEventListener('click', ()=>{
    card.classList.toggle('open');
    card.querySelector('.toggle-hint').textContent = card.classList.contains('open') ? 'cerrar' : 'tocar';
  });
});

// ---------- ICE step reveal ----------
let iceStep = 0;
const iceSteps = ['iceStep1','iceStep2','iceStep3','iceStep4'];
document.getElementById('iceBtn').addEventListener('click', ()=>{
  if(iceStep < iceSteps.length){
    document.getElementById(iceSteps[iceStep]).classList.add('show');
    iceStep++;
  }
  document.getElementById('iceBtn').textContent = iceStep < iceSteps.length ? 'Mostrar siguiente paso →' : 'Solución completa ✓';
  if(iceStep >= iceSteps.length) document.getElementById('iceBtn').disabled = true;
});

// ---------- Quiz ----------
const quizData = [
  {
    q: "¿Cuál de las siguientes afirmaciones describe mejor el equilibrio químico?",
    opts: [
      "La reacción se detiene por completo",
      "Las velocidades directa e inversa se igualan, aunque la reacción sigue ocurriendo",
      "Solo los reactivos siguen reaccionando",
      "La concentración de productos siempre supera a la de reactivos"
    ],
    correct: 1,
    explain: "El equilibrio es dinámico: ambas reacciones (directa e inversa) continúan, pero a la misma velocidad, por lo que no hay cambio neto observable."
  },
  {
    q: "Para la reacción 2 NO(g) + O₂(g) ⇌ 2 NO₂(g), ¿cuál es la expresión correcta de Kc?",
    opts: [
      "Kc = [NO₂] / ([NO][O₂])",
      "Kc = [NO]²[O₂] / [NO₂]²",
      "Kc = [NO₂]² / ([NO]²[O₂])",
      "Kc = [NO₂] / ([NO]²[O₂])"
    ],
    correct: 2,
    explain: "Productos arriba elevados a su coeficiente, reactivos abajo elevados al suyo: [NO₂]² arriba, [NO]²[O₂] abajo."
  },
  {
    q: "Si Q > K para una reacción, ¿hacia dónde se desplazará el sistema?",
    opts: [
      "Hacia los productos (derecha)",
      "Hacia los reactivos (izquierda)",
      "No se desplaza, ya está en equilibrio",
      "Depende únicamente de la temperatura"
    ],
    correct: 1,
    explain: "Q > K significa que hay demasiado producto en relación al equilibrio, así que la reacción retrocede hacia los reactivos hasta que Q vuelva a igualar a K."
  },
  {
    q: "Para una reacción exotérmica en equilibrio, ¿qué ocurre si aumentas la temperatura?",
    opts: [
      "El equilibrio se desplaza hacia los productos y K aumenta",
      "El equilibrio se desplaza hacia los reactivos y K disminuye",
      "No pasa nada, la temperatura no afecta el equilibrio",
      "Solo cambia la velocidad, nunca la posición del equilibrio"
    ],
    correct: 1,
    explain: "En una reacción exotérmica el calor se comporta como un producto. Aumentar T equivale a 'agregar producto', desplazando el equilibrio hacia los reactivos y disminuyendo K."
  },
  {
    q: "¿Qué efecto tiene un catalizador sobre la posición del equilibrio?",
    opts: [
      "Desplaza el equilibrio hacia los productos",
      "Aumenta el valor de K",
      "Ninguno: solo acelera que se alcance el equilibrio",
      "Desplaza el equilibrio hacia los reactivos"
    ],
    correct: 2,
    explain: "Un catalizador acelera por igual ambas direcciones de la reacción. El sistema llega más rápido al equilibrio, pero su posición final (y K) no cambian."
  },
  {
    q: "Si Kc = 36 y Δn = +1, T = 400 K, ¿cuál es aproximadamente el valor de Kp? (R = 0.0821)",
    opts: [
      "Kp ≈ 1.10",
      "Kp ≈ 1182",
      "Kp ≈ 36",
      "Kp ≈ 0.03"
    ],
    correct: 1,
    explain: "Kp = Kc·(RT)^Δn = 36 × (0.0821×400)^1 = 36 × 32.84 ≈ 1182."
  }
];

const quizContainer = document.getElementById('quizContainer');
let score = 0;
let answered = 0;

quizData.forEach((item, qi)=>{
  const card = document.createElement('div');
  card.className = 'quiz-card';
  card.innerHTML = `
    <div class="q">${qi+1}. ${item.q}</div>
    <div class="opts">
      ${item.opts.map((o,oi)=>`<button class="opt" data-oi="${oi}">${o}</button>`).join('')}
    </div>
    <div class="explain" id="explain-${qi}">${item.explain}</div>
  `;
  quizContainer.appendChild(card);

  const buttons = card.querySelectorAll('.opt');
  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(card.dataset.done) return;
      card.dataset.done = "1";
      const oi = parseInt(btn.dataset.oi);
      buttons.forEach(b=>b.disabled = true);
      if(oi === item.correct){
        btn.classList.add('correct');
        score++;
      } else {
        btn.classList.add('wrong');
        buttons[item.correct].classList.add('correct');
      }
      document.getElementById(`explain-${qi}`).classList.add('show');
      answered++;
      document.getElementById('scoreText').textContent = `${score} / ${quizData.length}`;
      document.getElementById('scoreBar').style.width = (score/quizData.length*100) + '%';
    });
  });
});