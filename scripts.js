const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');
const startCard = document.querySelector('#startCard');
const startButton = document.querySelector('#startButton');
const restartButton = document.querySelector('#restartButton');
const howButton = document.querySelector('#howButton');
const howModal = document.querySelector('#howModal');
const closeHow = document.querySelector('#closeHow');
const closeHowAction = document.querySelector('#closeHowAction');
const gameOverModal = document.querySelector('#gameOverModal');
const toast = document.querySelector('#toast');
const soundButton = document.querySelector('#soundButton');
const keys = new Set();
const sessionScores = [];
const facts = [
	'Dugong có thể ăn đến 30 kg cỏ biển mỗi ngày. Mỗi bữa ăn giúp phát tán hạt giống và giữ đồng cỏ khỏe mạnh.',
	'Cỏ biển lưu trữ carbon trong rễ và bùn đáy biển, góp phần giảm tác động của biến đổi khí hậu.',
	'Rác nhựa có thể làm dugong mắc nghẹn hoặc bị thương. Giữ biển sạch là bảo vệ cả một chuỗi thức ăn.',
	'Lưới ma và lưới đánh cá là mối đe dọa lớn. Lưới có thiết bị thoát giúp giảm nguy cơ mắc kẹt cho động vật biển.',
	'Bảo vệ vùng cỏ biển là bảo vệ nơi kiếm ăn, sinh sản và trú ẩn của nhiều loài ven bờ.'
];
const state = {
	phase: 'ready', score: 0, elapsed: 0, fullness: 100, grace: 150, factIndex: 0, toastTimer: 0,
	dugong: { x: 480, y: 310, vx: 0, vy: 0, radius: 25 },
	grasses: [], bubbles: [], spawnTimer: 0, lastTime: 0, sound: false
};

function resetState() {
	state.phase = 'playing'; state.score = 0; state.elapsed = 0; state.fullness = 100; state.grace = 150;
	state.factIndex = 0; state.toastTimer = 0; state.spawnTimer = 0;
	state.dugong = { x: 480, y: 310, vx: 0, vy: 0, radius: 25 };
	state.grasses = []; state.bubbles = [];
	for (let i = 0; i < 10; i += 1) spawnGrass();
	startCard.style.display = 'none'; gameOverModal.hidden = true; updateHud(); announce('Chuyến lặn bắt đầu. Hãy tìm cỏ biển chất lượng cao.');
}

function randomPosition(margin = 55) { return { x: margin + Math.random() * (canvas.width - margin * 2), y: margin + Math.random() * (canvas.height - margin * 2) }; }
function spawnGrass() {
	const position = randomPosition(45); const nitrogen = Math.round(35 + Math.random() * 62); const fiber = Math.round(18 + Math.random() * 60);
	state.grasses.push({ ...position, nitrogen, fiber, radius: 16, phase: Math.random() * Math.PI * 2 });
}
function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function quality(grass) { return Math.max(1, Math.round((grass.nitrogen * 1.4) - grass.fiber * .65)); }
function showToast(message, duration = 2.8) { toast.textContent = message; toast.classList.add('show'); state.toastTimer = duration; }
function announce(message) { document.querySelector('#liveStatus').textContent = message; }
function nextFact(index = null) { state.factIndex = index === null ? (state.factIndex + 1) % facts.length : index; document.querySelector('#factText').textContent = facts[state.factIndex]; }
function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`; }

function updateHud() {
	document.querySelector('#scoreValue').textContent = String(state.score).padStart(4, '0');
	document.querySelector('#timeValue').textContent = formatTime(state.elapsed);
	document.querySelector('#fullnessValue').textContent = `${Math.round(state.fullness)}%`;
	document.querySelector('#fullnessBar').style.width = `${Math.max(0, state.fullness)}%`;
	document.querySelector('#fullnessBar').style.background = state.fullness < 25 ? 'var(--coral)' : 'var(--lime)';
	const phase = document.querySelector('#phaseValue');
	phase.innerHTML = `<span class="status-dot"></span> ${state.phase === 'playing' ? 'ĐANG LẶN' : state.phase === 'dead' ? 'KẾT THÚC' : 'SẴN SÀNG'}`;
	document.querySelector('#fullnessHint').textContent = state.grace > 0 ? `Đang trong thời gian no · còn ${Math.ceil(state.grace)} giây` : state.fullness < 25 ? 'Độ no thấp! Tìm cỏ biển ngay.' : 'Độ no đang giảm dần theo thời gian.';
	document.querySelector('#objectiveValue').textContent = 'Tìm cỏ biển chất lượng cao';
}

function startGame() { resetState(); state.lastTime = performance.now(); requestAnimationFrame(gameLoop); }
function endGame(reason) {
	if (state.phase === 'dead') return;
	state.phase = 'dead'; sessionScores.push(state.score); sessionScores.sort((a, b) => b - a); sessionScores.splice(5);
	document.querySelector('#deathReason').textContent = reason;
	document.querySelector('#finalScore').textContent = String(state.score).padStart(4, '0');
	const list = document.querySelector('#leaderboardList'); list.innerHTML = sessionScores.map((score, index) => `<li><span>${index === 0 ? '01  ·  KỶ LỤC MỚI' : `${String(index + 1).padStart(2, '0')}  ·  CHUYẾN LẶN`}</span><strong>${String(score).padStart(4, '0')}</strong></li>`).join('');
	updateHud(); gameOverModal.hidden = false; announce(`Trò chơi kết thúc. ${reason} Điểm ${state.score}.`);
}

function eatGrass(grass, index) {
	if (state.fullness >= 100) { showToast('Độ no đã đầy · hãy khám phá tiếp!'); return; }
	const points = quality(grass); state.score += points; state.fullness = Math.min(100, state.fullness + 8 + points / 10);
	state.grasses.splice(index, 1); spawnGrass(); nextFact(); showToast(`+${points} điểm · Cỏ biển N ${grass.nitrogen}% / xơ ${grass.fiber}%`); announce(`Đã ăn cỏ biển chất lượng ${points}.`);
}
function update(dt) {
	state.elapsed += dt; state.grace = Math.max(0, state.grace - dt);
	const inputX = (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0);
	const inputY = (keys.has('ArrowDown') || keys.has('s') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('w') ? 1 : 0);
	const acceleration = 330; state.dugong.vx += inputX * acceleration * dt; state.dugong.vy += inputY * acceleration * dt;
	const drag = Math.pow(.001, dt); state.dugong.vx *= drag; state.dugong.vy *= drag;
	const maxSpeed = 185; const speed = Math.hypot(state.dugong.vx, state.dugong.vy); if (speed > maxSpeed) { state.dugong.vx = state.dugong.vx / speed * maxSpeed; state.dugong.vy = state.dugong.vy / speed * maxSpeed; }
	state.dugong.x = Math.max(30, Math.min(canvas.width - 30, state.dugong.x + state.dugong.vx * dt)); state.dugong.y = Math.max(40, Math.min(canvas.height - 42, state.dugong.y + state.dugong.vy * dt));
	if (state.grace === 0) state.fullness = Math.max(0, state.fullness - dt * 1.45);
	if (state.fullness <= 0) { endGame('Dugong đã hết năng lượng vì không tìm được thức ăn.'); return; }
	state.spawnTimer += dt; if (state.spawnTimer > 3.2 && state.grasses.length < 13) { state.spawnTimer = 0; spawnGrass(); }
	state.bubbles = state.bubbles.filter((bubble) => { bubble.y -= bubble.speed * dt; bubble.life -= dt; return bubble.life > 0; });
	if (Math.random() < dt * 4) state.bubbles.push({ x: state.dugong.x - 25, y: state.dugong.y + 5, radius: 2 + Math.random() * 3, speed: 15 + Math.random() * 18, life: 1.5 });
	for (let index = state.grasses.length - 1; index >= 0; index -= 1) if (distance(state.dugong, state.grasses[index]) < state.dugong.radius + state.grasses[index].radius) eatGrass(state.grasses[index], index);
	if (state.toastTimer > 0) { state.toastTimer -= dt; if (state.toastTimer <= 0) toast.classList.remove('show'); }
	updateHud();
}

function drawBackground() {
	const gradient = context.createLinearGradient(0, 0, 0, canvas.height); gradient.addColorStop(0, '#087c87'); gradient.addColorStop(1, '#075b70'); context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
	context.globalAlpha = .11; for (let y = 70; y < canvas.height; y += 76) { context.beginPath(); context.moveTo(0, y); for (let x = 0; x < canvas.width; x += 80) context.quadraticCurveTo(x + 40, y - 12, x + 80, y); context.strokeStyle = '#d7f3dc'; context.lineWidth = 2; context.stroke(); } context.globalAlpha = 1;
	context.fillStyle = 'rgba(207,247,203,.15)'; for (let i = 0; i < 12; i += 1) { const x = (i * 137 + 50) % canvas.width; context.beginPath(); context.arc(x, 55 + (i * 67) % 400, 2 + i % 3, 0, Math.PI * 2); context.fill(); }
}
function drawGrass(grass) {
	context.save(); context.translate(grass.x, grass.y); context.rotate(Math.sin(state.elapsed * 1.4 + grass.phase) * .12); const good = quality(grass) > 70; context.strokeStyle = good ? '#b8ed83' : '#75c48d'; context.lineWidth = 4; context.lineCap = 'round';
	for (let i = -1; i <= 1; i += 1) { context.beginPath(); context.moveTo(i * 4, 12); context.quadraticCurveTo(i * 8 - 4, -3, i * 10, -17); context.stroke(); } context.fillStyle = good ? 'rgba(199,239,128,.22)' : 'rgba(117,196,141,.17)'; context.beginPath(); context.arc(0, 0, 22, 0, Math.PI * 2); context.fill(); context.restore();
}
function drawDugong() {
	const d = state.dugong; context.save(); context.translate(d.x, d.y); if (d.vx < -5) context.scale(-1, 1); context.rotate(Math.max(-.18, Math.min(.18, d.vy / 900)));
	context.fillStyle = 'rgba(199,239,128,.18)'; context.beginPath(); context.ellipse(0, 3, 48, 35, 0, 0, Math.PI * 2); context.fill(); context.fillStyle = '#b7a78e'; context.beginPath(); context.ellipse(0, 0, 34, 21, -.05, 0, Math.PI * 2); context.fill(); context.beginPath(); context.moveTo(-28, -1); context.quadraticCurveTo(-53, -19, -53, 0); context.quadraticCurveTo(-53, 19, -28, 7); context.fill(); context.fillStyle = '#d4c4a6'; context.beginPath(); context.ellipse(27, 10, 12, 7, .35, 0, Math.PI * 2); context.fill(); context.fillStyle = '#123e4b'; context.beginPath(); context.arc(28, -7, 2.5, 0, Math.PI * 2); context.fill(); context.strokeStyle = 'rgba(18,62,75,.4)'; context.lineWidth = 2; context.beginPath(); context.moveTo(7, 13); context.quadraticCurveTo(16, 20, 25, 14); context.stroke(); context.fillStyle = '#968c7c'; context.beginPath(); context.ellipse(-5, 20, 7, 14, -.5, 0, Math.PI * 2); context.fill(); context.restore();
}
function draw() { drawBackground(); state.grasses.forEach(drawGrass); state.bubbles.forEach((bubble) => { context.globalAlpha = Math.max(0, bubble.life); context.strokeStyle = '#d9f6e0'; context.lineWidth = 1; context.beginPath(); context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2); context.stroke(); context.globalAlpha = 1; }); drawDugong(); }
function gameLoop(timestamp) { if (state.phase !== 'playing') { draw(); return; } const dt = Math.min(.05, (timestamp - state.lastTime) / 1000 || 0); state.lastTime = timestamp; update(dt); draw(); requestAnimationFrame(gameLoop); }

window.addEventListener('keydown', (event) => { const key = event.key.length === 1 ? event.key.toLowerCase() : event.key; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) { event.preventDefault(); keys.add(key); } });
window.addEventListener('keyup', (event) => { const key = event.key.length === 1 ? event.key.toLowerCase() : event.key; keys.delete(key); });
startButton.addEventListener('click', startGame); restartButton.addEventListener('click', startGame);
howButton.addEventListener('click', () => { howModal.hidden = false; closeHow.focus(); }); closeHow.addEventListener('click', () => { howModal.hidden = true; howButton.focus(); }); closeHowAction.addEventListener('click', () => { howModal.hidden = true; howButton.focus(); });
soundButton.addEventListener('click', () => { state.sound = !state.sound; soundButton.setAttribute('aria-pressed', String(state.sound)); soundButton.textContent = state.sound ? '♫' : '♪'; });
canvas.addEventListener('click', () => { if (state.phase === 'ready') startGame(); });
draw(); updateHud();
