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
	grasses: [], hazards: [], bubbles: [], escape: null, spawnTimer: 0, hazardTimer: 0, lastTime: 0, sound: false
};

function resetState() {
	state.phase = 'playing'; state.score = 0; state.elapsed = 0; state.fullness = 100; state.grace = 150;
	state.factIndex = 0; state.toastTimer = 0; state.spawnTimer = 0; state.hazardTimer = 0; state.escape = null;
	state.dugong = { x: 480, y: 310, vx: 0, vy: 0, radius: 25 };
	state.grasses = []; state.hazards = []; state.bubbles = [];
	for (let i = 0; i < 10; i += 1) spawnGrass();
	startCard.style.display = 'none'; gameOverModal.hidden = true; updateHud(); announce('Chuyến lặn bắt đầu. Hãy tìm cỏ biển chất lượng cao.');
}

function randomPosition(margin = 55) { return { x: margin + Math.random() * (canvas.width - margin * 2), y: margin + Math.random() * (canvas.height - margin * 2) }; }
function spawnGrass() {
	const position = randomPosition(45); const nitrogen = Math.round(35 + Math.random() * 62); const fiber = Math.round(18 + Math.random() * 60);
	state.grasses.push({ ...position, nitrogen, fiber, radius: 16, phase: Math.random() * Math.PI * 2 });
}
function spawnHazard() {
	const position = randomPosition(80); const kindRoll = Math.random();
	const kind = kindRoll < .35 ? 'trash' : kindRoll < .62 ? 'boat' : kindRoll < .82 ? 'net' : 'shark';
	state.hazards.push({ ...position, kind, radius: kind === 'boat' ? 34 : kind === 'net' ? 55 : 20, vx: (Math.random() - .5) * 12, vy: (Math.random() - .5) * 8, angle: Math.random() * 6 });
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
	phase.innerHTML = `<span class="status-dot"></span> ${state.phase === 'playing' ? (state.escape ? 'ĐANG THOÁT LƯỚI' : 'ĐANG LẶN') : state.phase === 'dead' ? 'KẾT THÚC' : 'SẴN SÀNG'}`;
	document.querySelector('#fullnessHint').textContent = state.escape ? `Bơi để thoát lưới · ${Math.round(state.escape.progress)}%` : state.grace > 0 ? `Đang trong thời gian no · còn ${Math.ceil(state.grace)} giây` : state.fullness < 25 ? 'Độ no thấp! Tìm cỏ biển ngay.' : 'Độ no đang giảm dần theo thời gian.';
	document.querySelector('#objectiveValue').textContent = state.escape ? 'Thoát khỏi lưới đánh cá!' : 'Tìm cỏ biển chất lượng cao';
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
function hitHazard(hazard, index) {
	if (hazard.kind === 'net') {
		if (!state.escape) { state.escape = { progress: 12, duration: 0 }; showToast('Mắc lưới! Bơi liên tục để thoát!', 3); nextFact(3); announce('Dugong mắc lưới. Hãy tiếp tục bơi để thoát.'); }
		return;
	}
	state.hazards.splice(index, 1);
	if (hazard.kind === 'trash') { state.fullness = Math.max(0, state.fullness - 14); showToast('Rác thải làm giảm độ no · hãy tránh xa!'); nextFact(2); }
	if (hazard.kind === 'boat') { state.fullness = Math.max(0, state.fullness - 20); showToast('Va chạm tàu thuyền · hãy giữ khoảng cách!'); nextFact(3); }
	if (hazard.kind === 'shark') { state.fullness = Math.max(0, state.fullness - 30); showToast('Động vật nguy hiểm! Bơi tránh các vùng săn mồi.'); }
	if (state.fullness <= 0) endGame('Độ no đã giảm về 0 sau quá nhiều va chạm.');
}

function update(dt) {
	state.elapsed += dt; state.grace = Math.max(0, state.grace - dt);
	const inputX = (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0);
	const inputY = (keys.has('ArrowDown') || keys.has('s') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('w') ? 1 : 0);
	const acceleration = state.escape ? 420 : 330; state.dugong.vx += inputX * acceleration * dt; state.dugong.vy += inputY * acceleration * dt;
	const drag = Math.pow(.001, dt); state.dugong.vx *= drag; state.dugong.vy *= drag;
	const maxSpeed = state.escape ? 240 : 185; const speed = Math.hypot(state.dugong.vx, state.dugong.vy); if (speed > maxSpeed) { state.dugong.vx = state.dugong.vx / speed * maxSpeed; state.dugong.vy = state.dugong.vy / speed * maxSpeed; }
	state.dugong.x = Math.max(30, Math.min(canvas.width - 30, state.dugong.x + state.dugong.vx * dt)); state.dugong.y = Math.max(40, Math.min(canvas.height - 42, state.dugong.y + state.dugong.vy * dt));
	if (state.grace === 0) state.fullness = Math.max(0, state.fullness - dt * 1.45);
	if (state.fullness <= 0) { endGame('Dugong đã hết năng lượng vì không tìm được thức ăn.'); return; }
	state.spawnTimer += dt; state.hazardTimer += dt; if (state.spawnTimer > 3.2 && state.grasses.length < 13) { state.spawnTimer = 0; spawnGrass(); } if (state.hazardTimer > 3.8 && state.hazards.length < 10) { state.hazardTimer = 0; spawnHazard(); }
	state.hazards.forEach((hazard) => { hazard.x += hazard.vx * dt; hazard.y += hazard.vy * dt; hazard.angle += dt; if (hazard.x < 20 || hazard.x > canvas.width - 20) hazard.vx *= -1; if (hazard.y < 25 || hazard.y > canvas.height - 25) hazard.vy *= -1; });
	state.bubbles = state.bubbles.filter((bubble) => { bubble.y -= bubble.speed * dt; bubble.life -= dt; return bubble.life > 0; });
	if (Math.random() < dt * 4) state.bubbles.push({ x: state.dugong.x - 25, y: state.dugong.y + 5, radius: 2 + Math.random() * 3, speed: 15 + Math.random() * 18, life: 1.5 });
	for (let index = state.grasses.length - 1; index >= 0; index -= 1) if (distance(state.dugong, state.grasses[index]) < state.dugong.radius + state.grasses[index].radius) eatGrass(state.grasses[index], index);
	for (let index = state.hazards.length - 1; index >= 0; index -= 1) if (distance(state.dugong, state.hazards[index]) < state.dugong.radius + state.hazards[index].radius * .55) hitHazard(state.hazards[index], index);
	if (state.escape) { state.escape.duration += dt; if (speed > 35) state.escape.progress += dt * 27; else state.escape.progress -= dt * 4; if (state.escape.progress >= 100) { state.escape = null; showToast('Thoát lưới thành công!'); } if (state.escape && state.escape.duration > 8 && Math.random() < dt * .14) endGame('Dugong không thể thoát khỏi lưới đánh cá.'); }
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
function drawHazard(hazard) {
	context.save(); context.translate(hazard.x, hazard.y); context.rotate(hazard.angle); context.lineWidth = 3;
	if (hazard.kind === 'boat') { context.fillStyle = '#e56e59'; context.beginPath(); context.moveTo(-35, 5); context.lineTo(28, 5); context.lineTo(17, 20); context.lineTo(-24, 20); context.closePath(); context.fill(); context.fillStyle = '#f4d8a6'; context.fillRect(-12, -15, 25, 20); context.fillStyle = '#114d5d'; context.fillRect(-7, -27, 4, 13); }
	if (hazard.kind === 'trash') { context.fillStyle = '#f4be78'; context.fillRect(-9, -15, 18, 27); context.fillStyle = '#e6f0d5'; context.fillRect(-7, -10, 14, 3); context.strokeStyle = '#f8ddbd'; context.strokeRect(-9, -15, 18, 27); }
	if (hazard.kind === 'shark') { context.fillStyle = '#e9ab8b'; context.beginPath(); context.moveTo(25, 0); context.lineTo(-12, -14); context.lineTo(-24, 0); context.lineTo(-12, 14); context.closePath(); context.fill(); context.fillStyle = '#f4d8b2'; context.beginPath(); context.moveTo(-3, 0); context.lineTo(-13, 8); context.lineTo(-9, -1); context.closePath(); context.fill(); }
	if (hazard.kind === 'net') { context.strokeStyle = 'rgba(231,220,168,.82)'; context.setLineDash([5, 5]); for (let i = -45; i <= 45; i += 15) { context.beginPath(); context.moveTo(i, -25); context.lineTo(i, 25); context.stroke(); context.beginPath(); context.moveTo(-50, i / 2); context.lineTo(50, i / 2); context.stroke(); } context.setLineDash([]); context.strokeStyle = 'rgba(240,120,92,.8)'; context.beginPath(); context.arc(0, 0, 54, 0, Math.PI * 2); context.stroke(); }
	context.restore();
}
function drawDugong() {
	const d = state.dugong; context.save(); context.translate(d.x, d.y); if (d.vx < -5) context.scale(-1, 1); context.rotate(Math.max(-.18, Math.min(.18, d.vy / 900)));
	context.fillStyle = 'rgba(199,239,128,.18)'; context.beginPath(); context.ellipse(0, 3, 48, 35, 0, 0, Math.PI * 2); context.fill(); context.fillStyle = '#b7a78e'; context.beginPath(); context.ellipse(0, 0, 34, 21, -.05, 0, Math.PI * 2); context.fill(); context.beginPath(); context.moveTo(-28, -1); context.quadraticCurveTo(-53, -19, -53, 0); context.quadraticCurveTo(-53, 19, -28, 7); context.fill(); context.fillStyle = '#d4c4a6'; context.beginPath(); context.ellipse(27, 10, 12, 7, .35, 0, Math.PI * 2); context.fill(); context.fillStyle = '#123e4b'; context.beginPath(); context.arc(28, -7, 2.5, 0, Math.PI * 2); context.fill(); context.strokeStyle = 'rgba(18,62,75,.4)'; context.lineWidth = 2; context.beginPath(); context.moveTo(7, 13); context.quadraticCurveTo(16, 20, 25, 14); context.stroke(); context.fillStyle = '#968c7c'; context.beginPath(); context.ellipse(-5, 20, 7, 14, -.5, 0, Math.PI * 2); context.fill(); context.restore();
}
function draw() { drawBackground(); state.grasses.forEach(drawGrass); state.hazards.forEach(drawHazard); state.bubbles.forEach((bubble) => { context.globalAlpha = Math.max(0, bubble.life); context.strokeStyle = '#d9f6e0'; context.lineWidth = 1; context.beginPath(); context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2); context.stroke(); context.globalAlpha = 1; }); drawDugong(); if (state.escape) { context.fillStyle = 'rgba(239,119,93,.9)'; context.fillRect(state.dugong.x - 38, state.dugong.y - 45, 76 * Math.max(0, state.escape.progress) / 100, 4); } }
function gameLoop(timestamp) { if (state.phase !== 'playing') { draw(); return; } const dt = Math.min(.05, (timestamp - state.lastTime) / 1000 || 0); state.lastTime = timestamp; update(dt); draw(); requestAnimationFrame(gameLoop); }

window.addEventListener('keydown', (event) => { const key = event.key.length === 1 ? event.key.toLowerCase() : event.key; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) { event.preventDefault(); keys.add(key); } });
window.addEventListener('keyup', (event) => { const key = event.key.length === 1 ? event.key.toLowerCase() : event.key; keys.delete(key); });
startButton.addEventListener('click', startGame); restartButton.addEventListener('click', startGame);
howButton.addEventListener('click', () => { howModal.hidden = false; closeHow.focus(); }); closeHow.addEventListener('click', () => { howModal.hidden = true; howButton.focus(); }); closeHowAction.addEventListener('click', () => { howModal.hidden = true; howButton.focus(); });
soundButton.addEventListener('click', () => { state.sound = !state.sound; soundButton.setAttribute('aria-pressed', String(state.sound)); soundButton.textContent = state.sound ? '♫' : '♪'; });
canvas.addEventListener('click', () => { if (state.phase === 'ready') startGame(); });
draw(); updateHud();
