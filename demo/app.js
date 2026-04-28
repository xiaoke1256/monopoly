"use strict";

const SAVE_KEY = "monopoly-demo-save-v1";
const START_BONUS = 200;
const MAX_LEVEL = 3;
const QUIZ_TIME_LIMIT = 12;
const PLAYER_NAMES = ["玩家A", "玩家B", "玩家C", "玩家D"];

const boardTemplate = [
  { type: "start", name: "起点" },
  { type: "property", name: "风车镇", price: 260 },
  { type: "event", name: "事件格" },
  { type: "property", name: "港湾区", price: 320 },
  { type: "tax", name: "税收格" },
  { type: "property", name: "古堡区", price: 360 },
  { type: "quiz", name: "问答格" },
  { type: "property", name: "森林路", price: 420 },
  { type: "jail", name: "监狱" },
  { type: "property", name: "星光街", price: 480 },
  { type: "event", name: "事件格" },
  { type: "property", name: "学院城", price: 560 },
  { type: "quiz", name: "问答格" },
  { type: "property", name: "彩虹湾", price: 620 },
  { type: "tax", name: "税收格" },
  { type: "property", name: "贸易港", price: 700 },
  { type: "event", name: "事件格" },
  { type: "property", name: "云顶区", price: 760 },
  { type: "quiz", name: "问答格" },
  { type: "property", name: "王冠大道", price: 820 }
];

const eventCards = [
  { text: "意外奖金 +150", run: (s, p) => addCash(s, p.id, 150) },
  { text: "缴纳维护费 -120", run: (s, p) => payCash(s, p.id, 120) },
  { text: "前进 2 格", run: (s, p) => movePlayer(s, p, 2) },
  { text: "后退 2 格", run: (s, p) => movePlayer(s, p, -2) },
  { text: "获得税收护盾 1 次", run: (s, p) => { p.status.taxShield += 1; } },
  { text: "下回合跳过", run: (s, p) => { p.status.skipTurns += 1; } },
  {
    text: "随机地产升级",
    run: (s, p) => {
      const ids = p.properties.filter((id) => s.tiles[id].level < MAX_LEVEL);
      if (!ids.length) {
        addCash(s, p.id, 80);
        return;
      }
      const randomId = ids[Math.floor(Math.random() * ids.length)];
      s.tiles[randomId].level += 1;
      pushLog(s, `${p.name} 的 ${s.tiles[randomId].name} 免费升级到 ${s.tiles[randomId].level} 级`);
    }
  },
  {
    text: "全城维修费 -100",
    run: (s, p) => payCash(s, p.id, 100)
  }
];

const questionBank = [
  { category: "历史", q: "秦始皇统一中国后使用的文字主要是？", options: ["甲骨文", "小篆", "楷书", "行书"], answer: 1 },
  { category: "历史", q: "“文景之治”发生在中国哪个朝代？", options: ["秦朝", "汉朝", "唐朝", "宋朝"], answer: 1 },
  { category: "历史", q: "郑和下西洋主要发生在？", options: ["元朝", "明朝", "清朝", "唐朝"], answer: 1 },
  { category: "历史", q: "《资治通鉴》的作者是？", options: ["司马迁", "司马光", "班固", "欧阳修"], answer: 1 },
  { category: "历史", q: "丝绸之路连接东西方，起点常被认为是？", options: ["洛阳", "长安", "开封", "临安"], answer: 1 },
  { category: "地理自然", q: "世界上面积最大的洋是？", options: ["大西洋", "印度洋", "太平洋", "北冰洋"], answer: 2 },
  { category: "地理自然", q: "中国最长的河流是？", options: ["黄河", "珠江", "黑龙江", "长江"], answer: 3 },
  { category: "地理自然", q: "地球自转一周约需要？", options: ["12小时", "24小时", "30小时", "48小时"], answer: 1 },
  { category: "地理自然", q: "气候最寒冷的大洲是？", options: ["欧洲", "北美洲", "南极洲", "大洋洲"], answer: 2 },
  { category: "地理自然", q: "火山喷发主要来自地球哪一层活动？", options: ["地壳与上地幔", "外核", "内核", "大气层"], answer: 0 }
];

const state = {
  stage: "start",
  round: 1,
  maxTurns: 30,
  currentIdx: 0,
  diceValue: null,
  rolled: false,
  gameOver: false,
  players: [],
  tiles: [],
  logs: [],
  quizStats: [],
  uiLock: false
};

const el = {
  startScreen: document.getElementById("start-screen"),
  gameScreen: document.getElementById("game-screen"),
  resultScreen: document.getElementById("result-screen"),
  board: document.getElementById("board"),
  eventFeed: document.getElementById("event-feed"),
  turnInfo: document.getElementById("turn-info"),
  diceInfo: document.getElementById("dice-info"),
  playerList: document.getElementById("player-list"),
  statsInfo: document.getElementById("stats-info"),
  resultList: document.getElementById("result-list"),
  rollBtn: document.getElementById("roll-btn"),
  buyBtn: document.getElementById("buy-btn"),
  upgradeBtn: document.getElementById("upgrade-btn"),
  endTurnBtn: document.getElementById("end-turn-btn"),
  startGameBtn: document.getElementById("start-game"),
  loadGameBtn: document.getElementById("load-game"),
  restartBtn: document.getElementById("restart-btn"),
  playerCount: document.getElementById("player-count"),
  aiCount: document.getElementById("ai-count"),
  initialCash: document.getElementById("initial-cash"),
  maxTurns: document.getElementById("max-turns"),
  quizModal: document.getElementById("quiz-modal"),
  quizCategory: document.getElementById("quiz-category"),
  quizQuestion: document.getElementById("quiz-question"),
  quizOptions: document.getElementById("quiz-options"),
  quizTimer: document.getElementById("quiz-timer")
};

bindEvents();
render();

function bindEvents() {
  el.startGameBtn.addEventListener("click", () => startNewGame());
  el.loadGameBtn.addEventListener("click", () => loadGame());
  el.rollBtn.addEventListener("click", () => onRollDice());
  el.buyBtn.addEventListener("click", () => onBuyProperty());
  el.upgradeBtn.addEventListener("click", () => onUpgradeProperty());
  el.endTurnBtn.addEventListener("click", () => onEndTurn());
  el.restartBtn.addEventListener("click", () => {
    state.stage = "start";
    render();
  });
}

function startNewGame() {
  const totalPlayers = Number(el.playerCount.value);
  const aiCount = Math.min(Number(el.aiCount.value), totalPlayers - 1);
  const initialCash = Math.max(500, Number(el.initialCash.value) || 2000);
  const maxTurns = Math.max(10, Number(el.maxTurns.value) || 30);
  const humanCount = totalPlayers - aiCount;

  state.stage = "game";
  state.round = 1;
  state.maxTurns = maxTurns;
  state.currentIdx = Math.floor(Math.random() * totalPlayers);
  state.diceValue = null;
  state.rolled = false;
  state.gameOver = false;
  state.logs = [];
  state.quizStats = [];
  state.uiLock = false;

  state.tiles = boardTemplate.map((tile, idx) => ({
    ...tile,
    id: idx,
    ownerId: null,
    level: 0,
    rentBase: tile.price ? Math.round(tile.price * 0.16) : 0,
    upgradeCost: tile.price ? Math.round(tile.price * 0.6) : 0
  }));

  state.players = Array.from({ length: totalPlayers }, (_, idx) => ({
    id: idx,
    name: PLAYER_NAMES[idx],
    isAI: idx >= humanCount,
    cash: initialCash,
    position: 0,
    bankrupt: false,
    properties: [],
    status: {
      skipTurns: 0,
      taxShield: 0
    }
  }));

  pushLog(state, `新对局开始：${totalPlayers} 人，其中 AI ${aiCount} 人`);
  saveGame();
  render();
  maybeRunAI();
}

function onRollDice() {
  if (state.uiLock || state.rolled || state.gameOver) return;
  const p = currentPlayer();
  if (!p || p.bankrupt) return;
  if (p.status.skipTurns > 0) {
    p.status.skipTurns -= 1;
    state.diceValue = null;
    pushLog(state, `${p.name} 本回合被冻结，跳过行动`);
    state.rolled = true;
    checkGameOver();
    saveGame();
    render();
    maybeRunAI();
    return;
  }
  state.diceValue = 1 + Math.floor(Math.random() * 6);
  state.rolled = true;
  pushLog(state, `${p.name} 掷出 ${state.diceValue}`);
  movePlayer(state, p, state.diceValue);
  handleLanding(p);
  checkGameOver();
  saveGame();
  render();
  maybeRunAI();
}

function onBuyProperty() {
  if (!state.rolled || state.uiLock) return;
  const p = currentPlayer();
  const tile = currentTile(p);
  if (!tile || tile.type !== "property" || tile.ownerId !== null) return;
  if (p.cash < tile.price) return;
  p.cash -= tile.price;
  tile.ownerId = p.id;
  tile.level = 1;
  p.properties.push(tile.id);
  pushLog(state, `${p.name} 购买了 ${tile.name}（${tile.price}）`);
  saveGame();
  render();
}

function onUpgradeProperty() {
  if (!state.rolled || state.uiLock) return;
  const p = currentPlayer();
  const tile = currentTile(p);
  if (!tile || tile.type !== "property" || tile.ownerId !== p.id || tile.level >= MAX_LEVEL) return;
  const cost = tile.upgradeCost * tile.level;
  if (p.cash < cost) return;
  p.cash -= cost;
  tile.level += 1;
  pushLog(state, `${p.name} 将 ${tile.name} 升级到 ${tile.level} 级（花费 ${cost}）`);
  saveGame();
  render();
}

function onEndTurn() {
  if (!state.rolled || state.uiLock || state.gameOver) return;
  doSwitchToNextPlayer();
  checkGameOver();
  saveGame();
  render();
  maybeRunAI();
}

function doSwitchToNextPlayer() {
  const alive = state.players.filter((p) => !p.bankrupt).length;
  if (alive <= 1) return;
  let loop = 0;
  do {
    state.currentIdx = (state.currentIdx + 1) % state.players.length;
    loop += 1;
    if (state.currentIdx === 0) {
      state.round += 1;
    }
  } while (state.players[state.currentIdx].bankrupt && loop <= state.players.length + 1);
  state.rolled = false;
  state.diceValue = null;
}

function handleLanding(player) {
  const tile = currentTile(player);
  if (!tile) return;
  if (tile.type === "start") {
    addCash(state, player.id, START_BONUS);
    pushLog(state, `${player.name} 停留在起点，获得 ${START_BONUS}`);
    return;
  }
  if (tile.type === "property") {
    if (tile.ownerId !== null && tile.ownerId !== player.id) {
      const owner = state.players[tile.ownerId];
      const rent = Math.round(tile.rentBase * tile.level);
      transferCash(player, owner, rent, `${player.name} 向 ${owner.name} 支付租金 ${rent}`);
    }
    return;
  }
  if (tile.type === "event") {
    const card = eventCards[Math.floor(Math.random() * eventCards.length)];
    pushLog(state, `${player.name} 触发事件：${card.text}`);
    card.run(state, player);
    return;
  }
  if (tile.type === "quiz") {
    askQuestion(player);
    return;
  }
  if (tile.type === "tax") {
    if (player.status.taxShield > 0) {
      player.status.taxShield -= 1;
      pushLog(state, `${player.name} 使用税收护盾，免税一次`);
      return;
    }
    const tax = Math.min(220, Math.round(player.cash * 0.08));
    payCash(state, player.id, tax);
    pushLog(state, `${player.name} 缴税 ${tax}`);
    return;
  }
  if (tile.type === "jail") {
    player.status.skipTurns += 1;
    pushLog(state, `${player.name} 进入监狱，下回合跳过`);
  }
}

function movePlayer(s, player, step) {
  const old = player.position;
  const len = s.tiles.length;
  let next = old + step;
  while (next >= len) {
    next -= len;
    addCash(s, player.id, START_BONUS);
    pushLog(s, `${player.name} 经过起点，奖励 ${START_BONUS}`);
  }
  while (next < 0) {
    next += len;
  }
  player.position = next;
}

function askQuestion(player) {
  state.uiLock = true;
  const question = questionBank[Math.floor(Math.random() * questionBank.length)];
  const startedAt = Date.now();
  let remain = QUIZ_TIME_LIMIT;
  el.quizCategory.textContent = `${question.category} | 答对 +100，答错 -50`;
  el.quizQuestion.textContent = question.q;
  el.quizOptions.innerHTML = "";
  el.quizTimer.textContent = `剩余 ${remain}s`;
  el.quizModal.classList.remove("hidden");

  const finish = (chosen) => {
    if (!state.uiLock) return;
    clearInterval(timer);
    const used = Math.max(0, QUIZ_TIME_LIMIT - remain);
    const correct = chosen === question.answer;
    if (correct) {
      addCash(state, player.id, 100);
      pushLog(state, `${player.name} 答题正确，奖励 +100`);
    } else {
      payCash(state, player.id, 50);
      pushLog(state, `${player.name} 答题错误，扣除 -50`);
    }
    state.quizStats.push({
      playerId: player.id,
      category: question.category,
      correct,
      timeSpent: used
    });
    el.quizModal.classList.add("hidden");
    state.uiLock = false;
    checkGameOver();
    saveGame();
    render();
    maybeRunAI();
  };

  question.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "secondary";
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
    btn.addEventListener("click", () => finish(idx), { once: true });
    el.quizOptions.appendChild(btn);
  });

  // AI 自动答题，玩家可手动答题。
  if (player.isAI) {
    setTimeout(() => {
      const rate = 0.55;
      const randomPick = Math.floor(Math.random() * question.options.length);
      const pick = Math.random() < rate ? question.answer : randomPick;
      finish(pick);
    }, 1000);
  }

  const timer = setInterval(() => {
    remain -= 1;
    el.quizTimer.textContent = `剩余 ${remain}s`;
    if (remain <= 0) {
      finish(-1);
    }
  }, 1000);
}

function maybeRunAI() {
  const p = currentPlayer();
  if (!p || !p.isAI || p.bankrupt || state.uiLock || state.gameOver) return;
  if (!state.rolled) {
    setTimeout(() => onRollDice(), 650);
    return;
  }
  setTimeout(() => {
    if (!state.rolled || state.uiLock || state.gameOver) return;
    const tile = currentTile(p);
    if (tile && tile.type === "property") {
      if (tile.ownerId === null && p.cash >= tile.price && p.cash > 500) {
        onBuyProperty();
      } else if (tile.ownerId === p.id && tile.level < MAX_LEVEL) {
        const cost = tile.upgradeCost * tile.level;
        if (p.cash - cost > 450) onUpgradeProperty();
      }
    }
    setTimeout(() => onEndTurn(), 500);
  }, 700);
}

function checkGameOver() {
  state.players.forEach((p) => handleDebtAndBankruptcy(p));
  const alive = state.players.filter((p) => !p.bankrupt);
  if (alive.length <= 1) {
    state.gameOver = true;
    showResult();
    return true;
  }
  if (state.round > state.maxTurns) {
    state.gameOver = true;
    showResult();
    return true;
  }
  return false;
}

function handleDebtAndBankruptcy(player) {
  if (player.bankrupt || player.cash >= 0) return;
  const owned = [...player.properties];
  owned.forEach((id) => {
    const tile = state.tiles[id];
    if (!tile) return;
    player.cash += Math.round(tile.price * 0.6);
    tile.ownerId = null;
    tile.level = 0;
  });
  player.properties = [];
  if (player.cash < 0) {
    player.bankrupt = true;
    player.cash = 0;
    pushLog(state, `${player.name} 破产出局`);
    if (state.currentIdx === player.id) {
      doSwitchToNextPlayer();
    }
  } else {
    pushLog(state, `${player.name} 卖出地产以偿债`);
  }
}

function transferCash(from, to, amount, logText) {
  if (from.bankrupt) return;
  from.cash -= amount;
  to.cash += amount;
  pushLog(state, logText);
}

function addCash(s, playerId, amount) {
  const p = s.players[playerId];
  if (!p || p.bankrupt) return;
  p.cash += amount;
}

function payCash(s, playerId, amount) {
  const p = s.players[playerId];
  if (!p || p.bankrupt) return;
  p.cash -= amount;
}

function showResult() {
  state.stage = "result";
  removeSave();
  render();
}

function currentPlayer() {
  return state.players[state.currentIdx];
}

function currentTile(player) {
  return state.tiles[player.position];
}

function getAsset(player) {
  const propertyValue = player.properties.reduce((sum, id) => {
    const t = state.tiles[id];
    return sum + Math.round((t?.price || 0) * 0.6) + (t?.level || 0) * 40;
  }, 0);
  return player.cash + propertyValue;
}

function pushLog(s, text) {
  s.logs.unshift(`[R${s.round}] ${text}`);
  if (s.logs.length > 30) s.logs.length = 30;
}

function saveGame() {
  if (state.stage !== "game") return;
  const payload = {
    stage: state.stage,
    round: state.round,
    maxTurns: state.maxTurns,
    currentIdx: state.currentIdx,
    diceValue: state.diceValue,
    rolled: state.rolled,
    gameOver: state.gameOver,
    players: state.players,
    tiles: state.tiles,
    logs: state.logs,
    quizStats: state.quizStats
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    alert("没有找到可恢复的存档");
    return;
  }
  try {
    const data = JSON.parse(raw);
    Object.assign(state, data);
    state.uiLock = false;
    render();
    maybeRunAI();
  } catch (err) {
    alert("存档已损坏，无法恢复");
  }
}

function removeSave() {
  localStorage.removeItem(SAVE_KEY);
}

function render() {
  el.startScreen.classList.toggle("hidden", state.stage !== "start");
  el.gameScreen.classList.toggle("hidden", state.stage !== "game");
  el.resultScreen.classList.toggle("hidden", state.stage !== "result");

  if (state.stage === "game") {
    renderBoard();
    renderPlayers();
    renderTopInfo();
    renderEvents();
    updateActionButtons();
  } else if (state.stage === "result") {
    renderResult();
  }
}

function renderBoard() {
  el.board.innerHTML = "";
  state.tiles.forEach((tile) => {
    const wrap = document.createElement("div");
    wrap.className = "tile";
    const ownerName = tile.ownerId === null ? "-" : state.players[tile.ownerId].name;
    const rent = tile.type === "property" ? Math.round(tile.rentBase * Math.max(1, tile.level)) : 0;
    wrap.innerHTML = `
      <div class="tile-head">
        <span class="tile-name">${tile.name}</span>
        <span class="tile-type">${tile.type}</span>
      </div>
      <div class="owner">
        ${tile.type === "property" ? `所有者: ${ownerName} | Lv.${tile.level} | 租金 ${rent}` : ""}
      </div>
      <div class="tokens"></div>
    `;
    const tokenArea = wrap.querySelector(".tokens");
    state.players.forEach((p) => {
      if (p.bankrupt) return;
      if (p.position === tile.id) {
        const token = document.createElement("span");
        token.className = `token token-${p.id}`;
        token.title = p.name;
        tokenArea.appendChild(token);
      }
    });
    el.board.appendChild(wrap);
  });
}

function renderPlayers() {
  el.playerList.innerHTML = "";
  const current = currentPlayer();
  state.players.forEach((p) => {
    const li = document.createElement("li");
    li.className = "player-card";
    if (current && p.id === current.id) li.classList.add("current");
    if (p.bankrupt) li.classList.add("bankrupt");
    li.innerHTML = `
      <strong>${p.name}${p.isAI ? " (AI)" : ""}</strong>
      <div>现金: ${p.cash}</div>
      <div>总资产: ${getAsset(p)}</div>
      <div>地产: ${p.properties.length} | 位置: ${p.position}</div>
      <div>状态: 跳过${p.status.skipTurns} / 护盾${p.status.taxShield}</div>
    `;
    el.playerList.appendChild(li);
  });
}

function renderTopInfo() {
  const p = currentPlayer();
  el.turnInfo.textContent = `第 ${state.round}/${state.maxTurns} 回合 | 当前：${p.name}${p.isAI ? " (AI)" : ""}`;
  if (!state.rolled) {
    el.diceInfo.textContent = "等待掷骰";
  } else {
    el.diceInfo.textContent = Number.isInteger(state.diceValue)
      ? `本回合点数：${state.diceValue}`
      : "本回合跳过（冻结）";
  }
  const totalQuiz = state.quizStats.length;
  const correct = state.quizStats.filter((x) => x.correct).length;
  const rate = totalQuiz ? Math.round((correct / totalQuiz) * 100) : 0;
  el.statsInfo.textContent = `存活玩家：${state.players.filter((x) => !x.bankrupt).length} | 问答正确率：${rate}% (${correct}/${totalQuiz})`;
}

function renderEvents() {
  el.eventFeed.innerHTML = "";
  state.logs.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    el.eventFeed.appendChild(p);
  });
}

function updateActionButtons() {
  const p = currentPlayer();
  const tile = currentTile(p);
  const myTurnAndHuman = !p.isAI && !p.bankrupt;
  const canBuy = myTurnAndHuman && state.rolled && tile.type === "property" && tile.ownerId === null && p.cash >= tile.price;
  const canUpgrade = myTurnAndHuman && state.rolled && tile.type === "property" && tile.ownerId === p.id && tile.level < MAX_LEVEL && p.cash >= tile.upgradeCost * tile.level;
  const canEnd = myTurnAndHuman && state.rolled && !state.uiLock;
  const canRoll = myTurnAndHuman && !state.rolled && !state.uiLock;
  el.rollBtn.disabled = !canRoll;
  el.buyBtn.disabled = !canBuy;
  el.upgradeBtn.disabled = !canUpgrade;
  el.endTurnBtn.disabled = !canEnd;
}

function renderResult() {
  const sorted = [...state.players].sort((a, b) => getAsset(b) - getAsset(a));
  el.resultList.innerHTML = "";
  sorted.forEach((p, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `${idx + 1}. ${p.name} ${p.bankrupt ? '<span class="danger">(破产)</span>' : ""} - 现金 ${p.cash} / 总资产 ${getAsset(p)} / 地产 ${p.properties.length}`;
    el.resultList.appendChild(li);
  });
}
