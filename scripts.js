const canvas = document.querySelector('#gameCanvas');
const context = canvas.getContext('2d');
const creatureScale = 1.4;
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
const levelModal = document.querySelector('#levelModal');
const levelTitle = document.querySelector('#levelTitle');
const levelText = document.querySelector('#levelText');
const levelButton = document.querySelector('#levelButton');
const quizModal = document.querySelector('#quizModal');
const quizPrompt = document.querySelector('#quizPrompt');
const quizOptions = document.querySelector('#quizOptions');
const memoryModal = document.querySelector('#memoryModal');
const memoryBoard = document.querySelector('#memoryBoard');
const grassWarningModal = document.querySelector('#grassWarningModal');
const challengeOneModal = document.querySelector('#challengeOneModal');
const challengeOneBoard = document.querySelector('#challengeOneBoard');
const challengeOneProgress = document.querySelector('#challengeOneProgress');
const challengeTwoNoticeModal = document.querySelector('#challengeTwoNoticeModal');
const storyModal = document.querySelector('#storyModal');
const storyContent = document.querySelector('#storyContent');
const factsModal = document.querySelector('#factsModal');
const factsText = document.querySelector('#factsText');
const keys = new Set();
const pointerInput = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
const sessionScores = [];

const facts = [
  'Dugong có thể sống từ 40 đến 70 năm, tùy khu vực và điều kiện môi trường sống.',
  'Dugong tiêu thụ rất nhiều cỏ biển mỗi ngày, giúp lan tỏa hạt giống và giữ cho bãi cỏ biển khỏe mạnh.',
  'Dugong là động vật có vú biển, không phải cá, và có thể bơi ở vùng nước nông và biển kín.',
  'Rác nhựa, lưới đánh cá và tàu thuyền là những nguy cơ trực tiếp khiến dugong bị thương hoặc chết.',
  'Các bãi cỏ biển còn là nơi trú ẩn, sinh sản và ăn của vô số loài biển khác.',
  'Dugong di chuyển chậm nhưng rất nhạy cảm với thay đổi môi trường, đặc biệt là ô nhiễm và mất nơi cư trú.',
  'Môi trường sống của dugong phụ thuộc mạnh vào hệ sinh thái cỏ biển, một trong những hệ sinh thái có giá trị lớn nhất.',
  'Sự suy giảm cỏ biển do nước dâng, ô nhiễm và đánh bắt không kiểm soát là nguyên nhân quan trọng làm giảm quần thể dugong.',
  'Dugong có thể cảm nhận âm thanh và hướng di chuyển trong vùng biển nông dựa vào môi trường xung quanh.',
  'Mỗi bãi cỏ biển khỏe mạnh là một “rừng biển” chứa nhiều sinh vật và giúp điều hòa khí hậu.'
];

const seaFacts = [
  'Tại Côn Đảo, dugong từng quay lại vùng cỏ biển như một “lời gọi” để tìm lại nơi trú ẩn và nuôi dưỡng con non. Bảo tồn cỏ biển là bảo tồn cả hệ sinh thái nơi chúng sống.',
  'Dugong có thể ăn tới 30 kg cỏ biển mỗi ngày. Mỗi bãi cỏ biển khỏe mạnh giúp giữ nước sạch, ổn định trầm tích và là nơi trú ẩn cho nhiều loài biển khác.',
  'Một số bãi cỏ biển trên thế giới là “rừng biển” dựng nên bởi hàng triệu cành lá mỏng, tạo nơi ẩn nấp, nơi sinh sản và môi trường sống cho cá, sò và các loài thủy sinh khác.'
];

const levelConfig = {
  1: { target: 20, label: 'MÀN 1 · 20', requiredQuiz: 5 },
  2: { target: 25, label: 'MÀN 2 · 25', requiredQuiz: 0 },
  3: { target: 30, label: 'MÀN 3 · 30', requiredQuiz: 0 }
};

const quizBank = [
  { q: 'Dugong thuộc nhóm động vật nào?', options: ['Động vật có vú biển', 'Cá mập', 'Chim biển', 'Bò sát biển'], answer: 0 },
  { q: 'Dugong chủ yếu kiếm ăn ở đâu?', options: ['Bãi cỏ biển', 'Sa mạc cát', 'Rừng nhiệt đới', 'Đỉnh núi'], answer: 0 },
  { q: 'Mục đích chính của cỏ biển trong hệ sinh thái là gì?', options: ['Cung cấp nơi trú ẩn và thức ăn', 'Tạo ra đá núi mới', 'Làm gió biển mạnh hơn', 'Thay đổi mùa'], answer: 0 },
  { q: 'Nguy cơ lớn nhất đối với dugong là gì?', options: ['Mất môi trường sống và ô nhiễm', 'Quá nhiều mưa', 'Lao động trên bờ', 'Khô hạn trên đất liền'], answer: 0 },
  { q: 'Dugong thường di chuyển ở vùng nào?', options: ['Vùng nước nông, bãi cỏ biển', 'Vùng cực bắc sâu', 'Bề mặt sa mạc', 'Dòng sông núi cao'], answer: 0 },
  { q: 'Cỏ biển có vai trò gì trong việc lưu trữ carbon?', options: ['Giữ carbon trong rễ và bùn biển', 'Tạo ra than đá', 'Cắm rễ xuống đất liền', 'Làm nóng nước biển'], answer: 0 },
  { q: 'Tại sao dugong rất nhạy cảm với rác thải?', options: ['Vì có thể gây nghẹt, làm hỏng môi trường sống', 'Vì thích rác nhựa', 'Vì rác làm nó lớn lên', 'Vì người ta bỏ ảnh lẫn vào nước'], answer: 0 },
  { q: 'Lưới đánh cá gây nguy hiểm vì?', options: ['Có thể mắc kẹt và làm thương tích', 'Nó làm đen nước', 'Nó làm xiết không khí', 'Nó khiến cỏ biển mọc sai'], answer: 0 },
  { q: 'Dugong thường hoạt động nhiều nhất ở thời gian nào?', options: ['Khi tìm kiếm thức ăn trong vùng cỏ biển', 'Khi bay giữa trời', 'Khi leo lên bãi biển', 'Khi dựng nhà'], answer: 0 },
  { q: 'Tại sao bảo vệ cỏ biển lại quan trọng?', options: ['Vì nó hỗ trợ nhiều loài và duy trì hệ sinh thái', 'Vì nó làm cho biển trở nên khô', 'Vì nó làm thành bờ biển mới', 'Vì nó làm nước biển tan ra'], answer: 0 },
  { q: 'Điều gì giúp dugong bơi hiệu quả trong vùng nước nông?', options: ['Cơ thể thuôn và khả năng điều hướng ở nơi cỏ biển dày', 'Bộ cánh lớn', 'Đuôi cứng như cánh cửa', 'Mắt phát sáng'], answer: 0 },
  { q: 'Dugong có quan hệ chặt chẽ nhất với loại môi trường nào?', options: ['Hệ sinh thái cỏ biển', 'Đầm lầy khô ráo', 'Rừng nguyên sinh trên núi', 'Bán đảo đá vôi'], answer: 0 }
];

const storyQuestions = [
  { q: 'Dugong đã từng quay lại Côn Đảo vào năm nào?', options: ['1997', '2005', '1982', '2010'], answer: 0 },
  { q: 'Theo câu chuyện, cỏ biển là gì với dugong?', options: ['Ngôi nhà và nguồn thức ăn chính', 'Nơi trú ngụ trên bờ biển', 'Một loại đá biển', 'Một khu vườn trên cạn'], answer: 0 },
  { q: 'Lý do chính để bảo vệ dugong là gì?', options: ['Để duy trì hệ sinh thái cỏ biển và môi trường sống của nhiều loài', 'Để làm đẹp bãi biển cho du lịch', 'Để cho cá săn mồi dễ hơn', 'Để giảm lượng sóng biển'], answer: 0 }
];

const memoryPairs = [
  { name: 'dugong', icon: '🐬', label: 'Dugong' },
  { name: 'grass', icon: '🌿', label: 'Cỏ biển' },
  { name: 'star', icon: '⭐', label: 'Ngôi sao' },
  { name: 'shell', icon: '🐚', label: 'Vỏ sò' },
  { name: 'ocean', icon: '🌊', label: 'Biển' },
  { name: 'fish', icon: '🐠', label: 'Cá' },
  { name: 'leaf', icon: '🍃', label: 'Lá' },
  { name: 'moon', icon: '🌙', label: 'Trăng' }
];

const state = {
  phase: 'ready',
  level: 1,
  score: 0,
  elapsed: 0,
  mode: 'day',
  selectedMode: 'day',
  target: 20,
  toastTimer: 0,
  factIndex: 0,
  lastTime: 0,
  dayClock: 0,
  dayLength: 40,
  nightLength: 30,
  dugong: { x: 520, y: 310, vx: 0, vy: 0, radius: 30 },
  grasses: [],
  hazards: [],
  stars: [],
  marineLife: [],
  bubbles: [],
  grassSpawnTimer: 0,
  hazardSpawnTimer: 0,
  starSpawnTimer: 0,
  sound: false,
  quizHistory: [],
  questionCount: 0,
  memoryMatchCount: 0,
  memoryCards: [],
  memorySelected: [],
  memoryLocked: false,
  memoryUnlocked: false,
  levelReady: false,
  grassEaten: 0,
  warningShown: false,
  challengeOneCollected: 0,
  challengeOneCompleted: false,
  challengeTwoCompleted: false,
  storyIndex: 0,
  storyScore: 0,
  currentQuizMode: null,
  factModalShown: false,
  shownSeaFacts: [],
  zoom: 1
};

function randomPosition(margin = 55) {
  return { x: margin + Math.random() * (canvas.width - margin * 2), y: margin + Math.random() * (canvas.height - margin * 2) };
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setMode(mode) {
  state.selectedMode = mode;
  state.mode = mode;
  state.dayClock = 0;
  document.querySelectorAll('.mode-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  showToast(mode === 'day' ? 'Chế độ ban ngày' : 'Chế độ ban đêm');
}

function getCurrentTarget() {
  return levelConfig[state.level].target;
}

function getRequiredQuiz() {
  return levelConfig[state.level].requiredQuiz || 0;
}

function updateHud() {
  const target = getCurrentTarget();
  document.querySelector('#scoreValue').textContent = String(state.score).padStart(2, '0');
  document.querySelector('#timeValue').textContent = formatTime(state.elapsed);
  document.querySelector('#goalValue').textContent = `${levelConfig[state.level].label}`;
  document.querySelector('#goalMeter').style.width = `${Math.min(100, (state.score / target) * 100)}%`;
  document.querySelector('#scoreMeter').style.width = `${Math.min(100, (state.score / target) * 100)}%`;

  const phase = document.querySelector('#phaseValue');
  phase.innerHTML = `<span class="status-dot"></span> ${state.mode === 'day' ? 'BAN NGÀY' : 'BAN ĐÊM'}`;
  document.querySelector('#objectiveValue').textContent = state.level === 1
    ? 'Ăn đủ 20 điểm và trả lời 5 câu hỏi' : state.level === 2
      ? 'Ăn đủ 25 điểm và tìm sao bí ẩn' : 'Ăn đủ 30 điểm và trả lời câu hỏi quiz';
  document.querySelector('#fullnessHint').textContent = state.level === 1
    ? 'Màn 1: trả lời đủ 5 câu hỏi về dugong để tiến lên.'
    : state.level === 2
      ? 'Màn 2: thu thập sao biển để mở trò chơi ghép cặp.'
      : 'Màn 3: mỗi 2 cỏ biển sẽ xuất hiện câu hỏi trắc nghiệm.';
}

function resetLevelState() {
  state.score = 0;
  state.elapsed = 0;
  state.toastTimer = 0;
  state.grasses = [];
  state.hazards = [];
  state.stars = [];
  state.marineLife = [];
  state.bubbles = [];
  state.grassSpawnTimer = 0;
  state.hazardSpawnTimer = 0;
  state.starSpawnTimer = 0;
  state.quizHistory = [];
  state.questionCount = 0;
  state.memoryMatchCount = 0;
  state.memoryCards = [];
  state.memorySelected = [];
  state.memoryLocked = false;
  state.memoryUnlocked = false;
  state.dugong = { x: 520, y: 310, vx: 0, vy: 0, radius: 30 };
  state.dayClock = 0;
  state.mode = state.selectedMode;
  state.grassEaten = 0;
  state.warningShown = false;
  state.challengeOneCollected = 0;
  state.challengeOneCompleted = false;
  state.challengeTwoCompleted = false;
  state.storyIndex = 0;
  state.storyScore = 0;
  state.currentQuizMode = null;
  state.factModalShown = false;
  state.shownSeaFacts = [];
  for (let i = 0; i < 22; i += 1) spawnGrass();
  for (let i = 0; i < 14; i += 1) spawnMarineLife();
  updateHud();
}

function startGame() {
  state.level = 1;
  state.target = getCurrentTarget();
  state.phase = 'playing';
  state.levelReady = false;
  state.zoom = 1;
  updateCanvasZoom();
  startCard.style.display = 'none';
  gameOverModal.hidden = true;
  levelModal.hidden = true;
  quizModal.hidden = true;
  memoryModal.hidden = true;
  grassWarningModal.hidden = true;
  challengeOneModal.hidden = true;
  challengeTwoNoticeModal.hidden = true;
  storyModal.hidden = true;
  factsModal.hidden = true;
  resetLevelState();
  state.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
  announce('Chuyến lặn bắt đầu. Hãy giữ dugong an toàn và tìm thức ăn.');
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function showToast(message, duration = 2.2) {
  toast.textContent = message;
  toast.classList.add('show');
  state.toastTimer = duration;
}

function announce(message) {
  document.querySelector('#liveStatus').textContent = message;
}

function spawnGrass() {
  const position = randomPosition(45);
  const qualityScore = Math.random() < 0.45 ? 'high' : 'low';
  const nitrogen = qualityScore === 'high' ? 70 + Math.random() * 25 : 35 + Math.random() * 25;
  const fiber = qualityScore === 'high' ? 15 + Math.random() * 20 : 30 + Math.random() * 30;
  state.grasses.push({
    ...position,
    radius: 19,
    phase: Math.random() * Math.PI * 2,
    quality: qualityScore,
    nitrogen,
    fiber
  });
}

function spawnMarineLife() {
  const typeRoll = ['fish', 'fish', 'fish', 'fish', 'coral', 'star', 'shell'][Math.floor(Math.random() * 7)];
  const position = randomPosition(30);
  const fishColors = ['#ffd166', '#ff6b6b', '#7ae582', '#90dbf4', '#ffafcc', '#f77f00', '#7b2cbf', '#f4d35e'];
  const fishKinds = ['tropical', 'striped', 'round', 'long', 'mini'];
  const item = {
    type: typeRoll,
    x: position.x,
    y: position.y,
    radius: typeRoll === 'coral' ? 22 : 15,
    drift: Math.random() * 2 - 1,
    phase: Math.random() * Math.PI * 2,
    scale: 0.7 + Math.random() * 0.8,
    vx: (Math.random() * 38 + 26) * (Math.random() < 0.5 ? -1 : 1),
    vy: (Math.random() * 22 + 8) * (Math.random() < 0.5 ? -1 : 1),
    color: fishColors[Math.floor(Math.random() * fishColors.length)],
    kind: fishKinds[Math.floor(Math.random() * fishKinds.length)],
    size: 12 + Math.random() * 16
  };

  if (typeRoll === 'coral' || typeRoll === 'star' || typeRoll === 'shell') {
    item.vx = 0;
    item.vy = 0;
  }

  state.marineLife.push(item);
}

function spawnHazard() {
  const options = ['ship', 'waste', 'net', 'net', 'waste', 'ship', 'ship'];
  const type = options[Math.floor(Math.random() * options.length)];
  const x = 60 + Math.random() * (canvas.width - 120);
  const y = 60 + Math.random() * (canvas.height - 120);
  const size = type === 'ship' ? (Math.random() * 1.2 + 0.7) : 1;
  const wasteType = type === 'waste' ? ['bag', 'bottle', 'foam'][Math.floor(Math.random() * 3)] : 'bag';
  state.hazards.push({
    type,
    subtype: wasteType,
    x,
    y,
    radius: type === 'ship' ? 32 * size : 23,
    scale: size,
    drift: Math.random() * 2 - 1
  });
}

function spawnStar() {
  const p = randomPosition(55);
  state.stars.push({ ...p, radius: 15, phase: Math.random() * Math.PI * 2 });
}

function nextFact() {
  state.factIndex = (state.factIndex + 1) % facts.length;
  document.querySelector('#factText').textContent = facts[state.factIndex];
}

function setDirectionKey(key, pressed) {
  if (pressed) keys.add(key);
  else keys.delete(key);
}

function updatePointerInputFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const pointX = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const pointY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  const dx = pointX - pointerInput.startX;
  const dy = pointY - pointerInput.startY;
  const distance = Math.hypot(dx, dy);
  pointerInput.active = true;
  if (distance < 6) {
    pointerInput.x = 0;
    pointerInput.y = 0;
    return;
  }
  pointerInput.x = (dx / distance) * 1.25;
  pointerInput.y = (dy / distance) * 1.25;
}

function clearPointerInput() {
  pointerInput.active = false;
  pointerInput.x = 0;
  pointerInput.y = 0;
  pointerInput.startX = 0;
  pointerInput.startY = 0;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getGrassValue(grass) {
  return grass.quality === 'high' ? 2 : 1;
}

function showDugongFact() {
  if (state.level > 3) return;
  const availableFacts = seaFacts.filter((fact) => !state.shownSeaFacts.includes(fact));
  if (!availableFacts.length) state.shownSeaFacts = [];
  const factsToChoose = availableFacts.length ? availableFacts : seaFacts;
  const fact = factsToChoose[Math.floor(Math.random() * factsToChoose.length)];
  state.shownSeaFacts.push(fact);
  factsText.textContent = fact;
  factsModal.hidden = false;
  state.factModalShown = true;
  state.phase = 'paused';
}

function restartGameplayPhase() {
  state.phase = 'playing';
  if (!factsModal.hidden) {
    factsModal.hidden = true;
  }
  if (state.level === 1 || state.level === 2 || state.level === 3) {
    state.lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }
}

function eatGrass(grass, index) {
  if (state.level === 3 && state.questionCount % 2 === 0) {
    state.questionCount += 1;
  }
  const points = getGrassValue(grass);
  state.score += points;
  state.grassEaten += 1;
  state.grasses.splice(index, 1);
  nextFact();
  showToast(`+${points} điểm · ${grass.quality === 'high' ? 'cỏ biển chất lượng cao' : 'cỏ biển chất lượng thấp'}`);

  if (state.grassEaten % 7 === 0) {
    showDugongFact();
  }

  if (state.grasses.length <= 7 && !state.warningShown) {
    state.warningShown = true;
    showGrassWarning();
  }

  if (state.level === 3 && state.score >= 0 && state.questionCount % 2 === 0) {
    askUniqueQuestion();
  }
  if (state.level === 2 && state.score >= getCurrentTarget()) {
    showLevelTransition('Màn 3');
  }
  if (state.level === 1 && state.score >= getCurrentTarget()) {
    if (state.questionCount >= getRequiredQuiz()) {
      showLevelTransition('Màn 2');
    } else {
      askUniqueQuestion();
    }
  }
  if (state.level === 3 && state.score >= getCurrentTarget() && state.questionCount >= 5) {
    showWinModal();
  }
}

function handleHazardCollision(hazardIndex) {
  const hazard = state.hazards[hazardIndex];
  if (!hazard) return;
  state.score = Math.max(0, state.score - 3);
  state.hazards.splice(hazardIndex, 1);
  showToast('Va chạm! -3 điểm');
}

function handleStarCollision(starIndex) {
  state.stars.splice(starIndex, 1);
  showToast('Bạn tìm thấy sao biển!');
  startMemoryGame();
}

function cycleMode(dt) {
  state.dayClock += dt;
  const activeCycle = state.mode === 'day' ? state.dayLength : state.nightLength;
  if (state.dayClock >= activeCycle) {
    state.mode = state.mode === 'day' ? 'night' : 'day';
    state.dayClock = 0;
    showToast(state.mode === 'day' ? 'Ban ngày bắt đầu' : 'Ban đêm bắt đầu');
  }
}

function update(dt) {
  state.elapsed += dt;
  cycleMode(dt);

  const keyboardX = (keys.has('ArrowRight') || keys.has('d') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('a') ? 1 : 0);
  const keyboardY = (keys.has('ArrowDown') || keys.has('s') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('w') ? 1 : 0);
  const pointerX = pointerInput.active ? pointerInput.x : 0;
  const pointerY = pointerInput.active ? pointerInput.y : 0;
  const inputX = keyboardX + pointerX;
  const inputY = keyboardY + pointerY;

  const speedMultiplier = state.mode === 'day' ? 1.12 : 0.78;
  const acceleration = 330 * speedMultiplier;
  state.dugong.vx += inputX * acceleration * dt;
  state.dugong.vy += inputY * acceleration * dt;

  const drag = Math.pow(.001, dt);
  state.dugong.vx *= drag;
  state.dugong.vy *= drag;

  const maxSpeed = 185 * speedMultiplier;
  const speed = Math.hypot(state.dugong.vx, state.dugong.vy);
  if (speed > maxSpeed) {
    state.dugong.vx = state.dugong.vx / speed * maxSpeed;
    state.dugong.vy = state.dugong.vy / speed * maxSpeed;
  }

  state.dugong.x = Math.max(30, Math.min(canvas.width - 30, state.dugong.x + state.dugong.vx * dt));
  state.dugong.y = Math.max(40, Math.min(canvas.height - 42, state.dugong.y + state.dugong.vy * dt));

  state.marineLife.forEach((item) => {
    if (item.type === 'coral' || item.type === 'star' || item.type === 'shell') return;
    item.x += item.vx * dt;
    item.y += item.vy * dt;
    if (item.x < 20 || item.x > canvas.width - 20) item.vx *= -1;
    if (item.y < 30 || item.y > canvas.height - 30) item.vy *= -1;
  });

  state.hazardSpawnTimer += dt;
  if (state.hazardSpawnTimer > 4.8 && state.hazards.length < 8) {
    state.hazardSpawnTimer = 0;
    spawnHazard();
  }

  if (state.level >= 2) {
    state.starSpawnTimer += dt;
    if (state.starSpawnTimer > 12 && state.stars.length < 2) {
      state.starSpawnTimer = 0;
      spawnStar();
    }
  }

  state.bubbles = state.bubbles.filter((bubble) => {
    bubble.y -= bubble.speed * dt;
    bubble.life -= dt;
    return bubble.life > 0;
  });

  if (Math.random() < dt * 4) {
    state.bubbles.push({
      x: state.dugong.x - 25,
      y: state.dugong.y + 5,
      radius: 2 + Math.random() * 3,
      speed: 15 + Math.random() * 18,
      life: 1.5
    });
  }

  for (let i = state.grasses.length - 1; i >= 0; i -= 1) {
    if (distance(state.dugong, state.grasses[i]) < state.dugong.radius + state.grasses[i].radius) {
      eatGrass(state.grasses[i], i);
    }
  }

  for (let i = state.hazards.length - 1; i >= 0; i -= 1) {
    const h = state.hazards[i];
    if (distance(state.dugong, h) < state.dugong.radius + h.radius) {
      handleHazardCollision(i);
    }
  }

  for (let i = state.stars.length - 1; i >= 0; i -= 1) {
    const star = state.stars[i];
    if (distance(state.dugong, star) < state.dugong.radius + star.radius) {
      handleStarCollision(i);
    }
  }

  if (state.score < 0) state.score = 0;

  if (state.level === 1 && state.score >= getCurrentTarget() && state.questionCount >= getRequiredQuiz()) {
    showLevelTransition('Màn 2');
  }

  if (state.level === 2 && state.score >= getCurrentTarget()) {
    showLevelTransition('Màn 3');
  }

  if (state.level === 3 && state.score >= getCurrentTarget() && state.questionCount >= 5) {
    showWinModal();
  }

  if (state.toastTimer > 0) {
    state.toastTimer -= dt;
    if (state.toastTimer <= 0) toast.classList.remove('show');
  }

  updateHud();
}

function drawBackground() {
  const isNight = state.mode === 'night';
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, isNight ? '#021a2d' : '#087c87');
  gradient.addColorStop(1, isNight ? '#041f2d' : '#075b70');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (isNight) {
    context.fillStyle = 'rgba(255, 220, 120, 0.18)';
    for (let i = 0; i < 28; i += 1) {
      context.beginPath();
      context.arc((i * 79 + 21) % canvas.width, (i * 53 + 16) % 240, 1.4 + (i % 3), 0, Math.PI * 2);
      context.fill();
    }
  }

  context.globalAlpha = .11;
  for (let y = 70; y < canvas.height; y += 76) {
    context.beginPath();
    context.moveTo(0, y);
    for (let x = 0; x < canvas.width; x += 80) {
      context.quadraticCurveTo(x + 40, y - 12, x + 80, y);
    }
    context.strokeStyle = '#d7f3dc';
    context.lineWidth = 2;
    context.stroke();
  }
  context.globalAlpha = 1;

  for (let i = 0; i < state.marineLife.length; i += 1) {
    const item = state.marineLife[i];
    if (item.type === 'fish') {
      const size = item.size || 12;
      context.save();
      context.translate(item.x, item.y);
      context.scale(creatureScale, creatureScale);
      if (item.vx < 0) context.scale(-1, 1);
      context.fillStyle = item.color || '#7ae582';
      context.beginPath();
      context.ellipse(0, 0, size * 1.4, size, 0, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(size * 1.3, 0);
      context.lineTo(size * 2.2, -size * 0.7);
      context.lineTo(size * 2.2, size * 0.7);
      context.closePath();
      context.fill();
      context.fillStyle = 'rgba(255,255,255,0.8)';
      context.beginPath();
      context.arc(size * 0.4, -size * 0.2, size * 0.18, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = '#083344';
      context.fillRect(size * 0.52, -size * 0.15, 2, 2);
      if (item.kind === 'striped') {
        context.strokeStyle = 'rgba(255,255,255,0.45)';
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(-size * 0.5, 0);
        context.lineTo(size * 0.8, 0);
        context.moveTo(-size * 0.1, -size * 0.4);
        context.lineTo(size * 0.5, -size * 0.4);
        context.moveTo(-size * 0.1, size * 0.4);
        context.lineTo(size * 0.5, size * 0.4);
        context.stroke();
      }
      context.restore();
    } else if (item.type === 'coral') {
      context.fillStyle = '#efb47d';
      for (let branch = 0; branch < 6; branch += 1) {
        context.save();
        context.translate(item.x, item.y);
        context.scale(creatureScale, creatureScale);
        context.rotate(((Math.PI * 2) / 6) * branch + item.phase);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(8, -18);
        context.lineTo(4, -24);
        context.lineTo(0, -8);
        context.closePath();
        context.fill();
        context.restore();
      }
    } else if (item.type === 'star') {
      context.fillStyle = '#ffbf69';
      context.save();
      context.translate(item.x, item.y);
      context.scale(creatureScale, creatureScale);
      context.rotate(item.phase);
      context.beginPath();
      for (let starIndex = 0; starIndex < 5; starIndex += 1) {
        const outerX = Math.cos(((starIndex * 2 * Math.PI) / 5) - Math.PI / 2) * 11;
        const outerY = Math.sin(((starIndex * 2 * Math.PI) / 5) - Math.PI / 2) * 11;
        const innerX = Math.cos((((starIndex * 2 * Math.PI) / 5) + Math.PI / 5) - Math.PI / 2) * 5;
        const innerY = Math.sin((((starIndex * 2 * Math.PI) / 5) + Math.PI / 5) - Math.PI / 2) * 5;
        if (starIndex === 0) context.moveTo(outerX, outerY);
        else context.lineTo(outerX, outerY);
        context.lineTo(innerX, innerY);
      }
      context.closePath();
      context.fill();
      context.restore();
    } else if (item.type === 'shell') {
      context.save();
      context.translate(item.x, item.y);
      context.scale(creatureScale, creatureScale);
      context.fillStyle = '#dce7e7';
      context.beginPath();
      context.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = '#90b7c1';
      context.beginPath();
      context.moveTo(-6, 0);
      context.quadraticCurveTo(0, -10, 6, 0);
      context.stroke();
      context.restore();
    }
  }
}

function drawGrass(grass) {
  context.save();
  context.translate(grass.x, grass.y);
  context.scale(1.15, 1.15);
  context.rotate(Math.sin(state.elapsed * 1.4 + grass.phase) * .12);
  const good = grass.quality === 'high';
  context.strokeStyle = good ? '#93d75c' : '#8ac29f';
  context.lineWidth = 4;
  context.lineCap = 'round';

  for (let i = -1; i <= 1; i += 1) {
    context.beginPath();
    context.moveTo(i * 4, 12);
    context.quadraticCurveTo(i * 8 - 4, -3, i * 10, -17);
    context.stroke();
  }

  context.fillStyle = good ? 'rgba(129, 195, 72, 0.28)' : 'rgba(138, 194, 159, 0.2)';
  context.beginPath();
  context.arc(0, 0, 22, 0, Math.PI * 2);
  context.fill();

  if (state.mode === 'night') {
    context.fillStyle = '#ffd76b';
    context.beginPath();
    context.arc(0, -18, 3.5, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawHazard(hazard) {
  context.save();
  context.translate(hazard.x, hazard.y);
  context.scale(creatureScale, creatureScale);
  const scale = hazard.scale || 1;
  if (hazard.type === 'ship') {
    const width = 40 * scale;
    const height = 20 * scale;
    context.fillStyle = '#f9d6a8';
    context.fillRect(-width / 2, -height / 2, width, height);
    context.fillStyle = '#6d4d33';
    context.fillRect(-width * 0.7, -height * 0.2, width * 1.4, height * 0.4);
    context.fillStyle = '#e76f51';
    context.fillRect(-width * 0.2, -height * 1.1, width * 0.4, height * 0.5);
    context.fillStyle = '#8bb7ff';
    context.fillRect(-width * 0.45, -height * 0.08, width * 0.2, height * 0.18);
    context.fillRect(width * 0.25, -height * 0.08, width * 0.2, height * 0.18);
  } else if (hazard.type === 'waste') {
    if (hazard.subtype === 'bag') {
      context.fillStyle = '#a7d88d';
      context.beginPath();
      context.moveTo(-16, -18);
      context.quadraticCurveTo(-20, 18, 0, 22);
      context.quadraticCurveTo(20, 18, 16, -18);
      context.closePath();
      context.fill();
      context.strokeStyle = '#6e9d66';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-8, -16);
      context.lineTo(-8, 12);
      context.moveTo(8, -16);
      context.lineTo(8, 12);
      context.stroke();
    } else if (hazard.subtype === 'bottle') {
      context.fillStyle = '#9ad7ff';
      context.fillRect(-9, -18, 18, 36);
      context.fillStyle = '#dff3ff';
      context.fillRect(-5, -12, 10, 18);
      context.fillStyle = '#f0f3f9';
      context.fillRect(-7, -24, 14, 8);
      context.fillStyle = '#8ebdff';
      context.fillRect(-3, -28, 6, 6);
    } else {
      context.fillStyle = '#d9b98a';
      context.fillRect(-16, -14, 32, 28);
      context.fillStyle = '#c9a077';
      context.fillRect(-10, -8, 20, 14);
      context.strokeStyle = '#9d7758';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-12, -4); context.lineTo(12, -4);
      context.moveTo(-12, 6); context.lineTo(12, 6);
      context.moveTo(-8, -14); context.lineTo(-8, 14);
      context.moveTo(8, -14); context.lineTo(8, 14);
      context.stroke();
    }
  } else {
    context.strokeStyle = '#dfe9ec';
    context.lineWidth = 2;
    for (let i = -2; i <= 2; i += 1) {
      context.beginPath();
      context.moveTo(-18 + i * 8, -18);
      context.lineTo(0 + i * 4, 18);
      context.stroke();
    }
    context.beginPath();
    context.arc(0, 0, 12, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
}

function drawStar(star) {
  context.save();
  context.translate(star.x, star.y);
  context.scale(creatureScale, creatureScale);
  context.rotate(star.phase);
  context.fillStyle = '#ffd76b';
  context.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const outerX = Math.cos(((i * 2 * Math.PI) / 5) - Math.PI / 2) * 12;
    const outerY = Math.sin(((i * 2 * Math.PI) / 5) - Math.PI / 2) * 12;
    const innerX = Math.cos((((i * 2 * Math.PI) / 5) + Math.PI / 5) - Math.PI / 2) * 5;
    const innerY = Math.sin((((i * 2 * Math.PI) / 5) + Math.PI / 5) - Math.PI / 2) * 5;
    if (i === 0) context.moveTo(outerX, outerY);
    else context.lineTo(outerX, outerY);
    context.lineTo(innerX, innerY);
  }
  context.closePath();
  context.fill();
  context.restore();
}

function drawDugong() {
  const d = state.dugong;
  context.save();
  context.translate(d.x, d.y);
  context.scale(1.3, 1.3);
  if (d.vx < -5) context.scale(-1, 1);
  context.rotate(Math.max(-.18, Math.min(.18, d.vy / 900)));
  context.fillStyle = 'rgba(199,239,128,.18)';
  context.beginPath();
  context.ellipse(0, 3, 48, 35, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#b7a78e';
  context.beginPath();
  context.ellipse(0, 0, 34, 21, -.05, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.moveTo(-28, -1);
  context.quadraticCurveTo(-53, -19, -53, 0);
  context.quadraticCurveTo(-53, 19, -28, 7);
  context.fill();
  context.fillStyle = '#d4c4a6';
  context.beginPath();
  context.ellipse(27, 10, 12, 7, .35, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#123e4b';
  context.beginPath();
  context.arc(28, -7, 2.5, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = 'rgba(18,62,75,.4)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(7, 13);
  context.quadraticCurveTo(16, 20, 25, 14);
  context.stroke();
  context.fillStyle = '#968c7c';
  context.beginPath();
  context.ellipse(-5, 20, 7, 14, -.5, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function draw() {
  drawBackground();
  state.grasses.forEach(drawGrass);
  state.stars.forEach(drawStar);
  state.hazards.forEach(drawHazard);
  state.bubbles.forEach((bubble) => {
    context.globalAlpha = Math.max(0, bubble.life);
    context.strokeStyle = '#d9f6e0';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    context.stroke();
    context.globalAlpha = 1;
  });
  drawDugong();
}

function gameLoop(timestamp) {
  if (state.phase !== 'playing') {
    draw();
    return;
  }

  const dt = Math.min(.05, (timestamp - state.lastTime) / 1000 || 0);
  state.lastTime = timestamp;
  update(dt);
  draw();
  requestAnimationFrame(gameLoop);
}

function getUnusedQuestion() {
  const unused = quizBank.filter((q) => !state.quizHistory.includes(q.q));
  if (!unused.length) {
    state.quizHistory = [];
    return quizBank[0];
  }
  const choice = unused[Math.floor(Math.random() * unused.length)];
  state.quizHistory.push(choice.q);
  return choice;
}

function askUniqueQuestion() {
  if (state.phase !== 'playing') return;
  const question = getUnusedQuestion();
  quizPrompt.textContent = question.q;
  quizOptions.innerHTML = '';
  state.currentQuizMode = 'level';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = option;
    button.addEventListener('click', () => {
      const correct = index === question.answer;
      state.questionCount += 1;
      showToast(correct ? 'Đáp án đúng!' : 'Không phải đáp án đúng.');
      quizModal.hidden = true;
      if (state.level === 1 && state.score >= getCurrentTarget() && state.questionCount >= getRequiredQuiz()) {
        showLevelTransition('Màn 2');
      }
      if (state.level === 3 && state.score >= getCurrentTarget() && state.questionCount >= 5) {
        showWinModal();
      }
    });
    quizOptions.appendChild(button);
  });
  quizModal.hidden = false;
}

function showGrassWarning() {
  grassWarningModal.hidden = false;
  state.phase = 'paused';
}

function startChallengeOne() {
  grassWarningModal.hidden = true;
  challengeOneModal.hidden = false;
  state.phase = 'challenge1';
  state.challengeOneCollected = 0;
  challengeOneBoard.innerHTML = '';
  challengeOneBoard.style.background = 'linear-gradient(180deg, #f7ecd4 0%, #d9f1d9 42%, #a3d0c5 100%)';
  challengeOneBoard.style.borderRadius = '20px';
  challengeOneBoard.style.padding = '18px';
  challengeOneBoard.style.minHeight = '320px';
  challengeOneBoard.style.position = 'relative';

  const challengePool = Array.from({ length: 30 }, (_, index) => (index % 3 === 0 ? 'net' : 'plastic'));
  const items = shuffle(challengePool);
  items.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'challenge-item';
    card.dataset.type = item;
    card.dataset.id = String(index);
    card.textContent = item === 'plastic' ? '🧴' : '🪝';
    card.setAttribute('aria-label', item === 'plastic' ? 'Rác nhựa' : 'Lưới đánh cá');
    card.addEventListener('click', () => {
      if (card.disabled) return;
      card.disabled = true;
      card.classList.add('collected');
      card.textContent = '✓';
      state.challengeOneCollected += 1;
      challengeOneProgress.textContent = `${state.challengeOneCollected} / 15`;
      if (state.challengeOneCollected >= 15) {
        challengeOneModal.hidden = true;
        state.challengeOneCompleted = true;
        showToast('Bạn đã dọn sạch bãi biển!');
        challengeTwoNoticeModal.hidden = false;
        state.phase = 'paused';
      }
    });
    challengeOneBoard.appendChild(card);
  });
  challengeOneProgress.textContent = '0 / 15';
}

function startStoryQuiz() {
  storyModal.hidden = true;
  state.storyIndex = 0;
  state.storyScore = 0;
  state.currentQuizMode = 'story';
  showStoryQuestion();
}

function showStoryQuestion() {
  if (state.storyIndex >= storyQuestions.length) {
    quizModal.hidden = true;
    state.challengeTwoCompleted = true;
    showToast('Bạn đã hoàn thành thử thách 2!');
    showLevelTransition('Màn 3');
    return;
  }
  const question = storyQuestions[state.storyIndex];
  quizPrompt.textContent = question.q;
  quizOptions.innerHTML = '';
  question.options.forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = option;
    button.addEventListener('click', () => {
      const correct = optionIndex === question.answer;
      if (correct) state.storyScore += 1;
      state.storyIndex += 1;
      showToast(correct ? 'Đúng rồi!' : 'Sai rồi, hãy xem lại truyện.');
      quizModal.hidden = true;
      setTimeout(() => {
        showStoryQuestion();
      }, 250);
    });
    quizOptions.appendChild(button);
  });
  quizModal.hidden = false;
}

function showChallengeTwoNotice() {
  challengeTwoNoticeModal.hidden = false;
  state.phase = 'paused';
}

function showDugongFactsPopup() {
  const fact = seaFacts[Math.floor(Math.random() * seaFacts.length)];
  factsText.textContent = fact;
  factsModal.hidden = false;
  state.phase = 'paused';
}

function showLevelTransition(nextLabel) {
  state.phase = 'paused';
  if (nextLabel === 'Màn 2') {
    state.level = 2;
    state.target = getCurrentTarget();
    levelTitle.textContent = 'Màn 2';
    levelText.textContent = 'Bạn đã hoàn thành Màn 1. Bắt đầu màn 2 với mục tiêu 25 điểm và tìm sao biển.';
  } else if (nextLabel === 'Màn 3') {
    state.level = 3;
    state.target = getCurrentTarget();
    levelTitle.textContent = 'Màn 3';
    levelText.textContent = 'Bạn đã hoàn thành Màn 2. Màn 3 yêu cầu 30 điểm và câu hỏi trắc nghiệm mới.';
  }
  levelButton.textContent = `Bắt đầu ${nextLabel}`;
  levelModal.hidden = false;
  levelButton.onclick = () => {
    levelModal.hidden = true;
    state.phase = 'playing';
    state.score = 0;
    state.elapsed = 0;
    state.quizHistory = [];
    state.questionCount = 0;
    state.grasses = [];
    state.hazards = [];
    state.stars = [];
    state.marineLife = [];
    state.warningShown = false;
    state.grassEaten = 0;
    state.dugong = { x: 520, y: 310, vx: 0, vy: 0, radius: 25 };
    for (let i = 0; i < 22; i += 1) spawnGrass();
    for (let i = 0; i < 14; i += 1) spawnMarineLife();
    state.lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    showToast(`${nextLabel} bắt đầu`);
  };
}

function showWinModal() {
  state.phase = 'paused';
  document.querySelector('#deathReason').textContent = 'Bạn đã hoàn thành tất cả 3 màn! Dugong đã cứu được hệ sinh thái biển.';
  document.querySelector('#finalScore').textContent = String(state.score).padStart(2, '0');
  gameOverModal.hidden = false;
  restartButton.textContent = 'Chơi lại';
}

function startMemoryGame() {
  if (state.memoryUnlocked) return;
  state.memoryUnlocked = true;
  const deck = shuffle([...memoryPairs, ...memoryPairs]).map((card, index) => ({ ...card, id: `${card.name}-${index}` }));
  memoryBoard.innerHTML = '';
  deck.forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'memory-card';
    button.dataset.name = card.name;
    button.dataset.index = String(index);
    button.textContent = '?';
    button.addEventListener('click', () => flipMemoryCard(button, card));
    memoryBoard.appendChild(button);
  });

  memoryModal.hidden = false;
  const cards = [...memoryBoard.querySelectorAll('.memory-card')];
  cards.forEach((card) => {
    card.textContent = card.dataset.name ? card.dataset.name : '?';
  });
  setTimeout(() => {
    cards.forEach((card) => { card.textContent = '?'; });
  }, 3000);
}

function flipMemoryCard(cardElement, cardData) {
  if (state.memoryLocked || state.memorySelected.some((item) => item.card === cardElement)) return;
  cardElement.textContent = cardData.icon;
  state.memorySelected.push({ card: cardElement, value: cardData.name });

  if (state.memorySelected.length === 2) {
    state.memoryLocked = true;
    const [first, second] = state.memorySelected;
    if (first.value === second.value) {
      state.memoryMatchCount += 1;
      first.card.classList.add('matched');
      second.card.classList.add('matched');
      state.memorySelected = [];
      state.memoryLocked = false;
      if (state.memoryMatchCount === memoryPairs.length) {
        showToast('Hoàn thành trò chơi ghép cặp! +5 điểm');
        state.score += 5;
        memoryModal.hidden = true;
        state.memoryUnlocked = false;
      }
    } else {
      setTimeout(() => {
        first.card.textContent = '?';
        second.card.textContent = '?';
        state.memorySelected = [];
        state.memoryLocked = false;
      }, 700);
    }
  }
}

window.addEventListener('keydown', (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
    event.preventDefault();
    setDirectionKey(key, true);
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  setDirectionKey(key, false);
});

document.querySelector('#grassWarningStart').addEventListener('click', startChallengeOne);
document.querySelector('#challengeTwoStart').addEventListener('click', () => {
  challengeTwoNoticeModal.hidden = true;
  storyModal.hidden = false;
});
document.querySelector('#storyStartQuiz').addEventListener('click', startStoryQuiz);
document.querySelector('#closeFactButton').addEventListener('click', () => {
  factsModal.hidden = true;
  state.factModalShown = false;
  state.phase = 'playing';
  state.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

howButton.addEventListener('click', () => {
  howModal.hidden = false;
  closeHow.focus();
});

closeHow.addEventListener('click', () => { howModal.hidden = true; howButton.focus(); });
closeHowAction.addEventListener('click', () => { howModal.hidden = true; howButton.focus(); });
soundButton.addEventListener('click', () => {
  state.sound = !state.sound;
  soundButton.setAttribute('aria-pressed', String(state.sound));
  soundButton.textContent = state.sound ? '♫' : '♪';
});

document.querySelectorAll('.mode-btn').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
});

function updateCanvasZoom() {
  canvas.style.transform = `scale(${state.zoom})`;
  canvas.style.transformOrigin = 'center center';
}

canvas.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  if (state.phase === 'ready') {
    startGame();
    return;
  }
  const rect = canvas.getBoundingClientRect();
  pointerInput.startX = ((event.clientX - rect.left) / rect.width) * canvas.width;
  pointerInput.startY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  pointerInput.active = true;
  pointerInput.x = 0;
  pointerInput.y = 0;
});

canvas.addEventListener('pointermove', (event) => {
  if (!pointerInput.active) return;
  updatePointerInputFromEvent(event);
});

canvas.addEventListener('pointerup', clearPointerInput);
canvas.addEventListener('pointerleave', clearPointerInput);
canvas.addEventListener('pointercancel', clearPointerInput);

canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  const direction = event.deltaY > 0 ? -0.08 : 0.08;
  state.zoom = Math.min(1.8, Math.max(0.8, state.zoom + direction));
  updateCanvasZoom();
}, { passive: false });

function updateCanvasZoom() {
  canvas.style.transform = `scale(${state.zoom})`;
  canvas.style.transformOrigin = 'center center';
  canvas.style.transition = 'transform 0.18s ease';
}

canvas.addEventListener('click', () => {
  if (state.phase === 'ready') startGame();
});

updateCanvasZoom();
updateHud();
draw();
