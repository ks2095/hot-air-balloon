// ================= Firebase 설정 ================= //
const firebaseConfig = {
    apiKey: "AIzaSyCMxIph1RVrJw4V8l03OyWTTNfFzvEsKVE",
    authDomain: "hot-air-balloon-game-3945f.firebaseapp.com",
    projectId: "hot-air-balloon-game-3945f",
    storageBucket: "hot-air-balloon-game-3945f.firebasestorage.app",
    messagingSenderId: "761893772746",
    appId: "1:761893772746:web:9f3129a8dc04e95a6c0333",
    measurementId: "G-4SRRNRZSV5"
};

try {
    firebase.initializeApp(firebaseConfig);
} catch(e) {
    if(!/already exists/.test(e.message)) console.error("Firebase init error", e);
}
const db = firebase.firestore();
// =============================================== //

const gameContainer = document.getElementById('game-container');
const balloon = document.getElementById('balloon');
const restartBtn = document.getElementById('restart-btn');
const clearScreen = document.getElementById('clear-screen');
const mainActionBtn = document.getElementById('main-action-btn');
const gasValEl = document.getElementById('gas-val');
const timeValEl = document.getElementById('time-val');
const failScreen = document.getElementById('fail-screen');
const targetLineEl = document.querySelector('.target-line');
const gasFillEl = document.getElementById('gas-fill');
const timeFillEl = document.getElementById('time-fill');
const gasTextEl = document.getElementById('gas-text');
const timeTextEl = document.getElementById('time-text');
const coordDebugger = document.getElementById('coord-debugger');
const prevLevelBtn = document.getElementById('prev-level-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const levelIndicator = document.getElementById('level-indicator');
const levelHintEl = document.getElementById('level-hint');
const resultGasEl = document.getElementById('result-gas');
const resultTimeEl = document.getElementById('result-time');
const resultScoreEl = document.getElementById('result-score');
const resultFormulaEl = document.getElementById('result-formula');
const openStoreBtn = document.getElementById('open-store-btn');
const closeStoreBtn = document.getElementById('close-store-btn');
const storeScreen = document.getElementById('store-screen');
const totalCreditsEl = document.getElementById('total-credits');
const storeDecorator = document.getElementById('store-decorator');
const editStoreTitle = document.getElementById('edit-store-title');
const editStoreColor = document.getElementById('edit-store-color');
const editItemsContainer = document.getElementById('edit-items-container');
const saveDecoBtn = document.getElementById('save-decoration');
const closeDecoBtn = document.getElementById('close-decorator');
const itemLabelBtn = document.getElementById('item-label-btn');
const storeLabelBtn = document.getElementById('store-label-btn');
const storeTitleEl = document.getElementById('store-title');
const storeCurrencyEl = document.getElementById('store-currency');
const failReasonBubble = document.getElementById('fail-reason-bubble');
const buyModeBtn = document.getElementById('btn-buy-mode');
const sellModeBtn = document.getElementById('btn-sell-mode');
const clearTitleEl = document.getElementById('clear-title');
const livesCountEl = document.getElementById('lives-count');
const lifeBalloonIcon = document.getElementById('life-balloon-icon');
const adsBtn = document.getElementById('ads-btn');
const adOverlay = document.getElementById('ad-overlay');
const getLifeAdBtn = document.getElementById('get-life-ad-btn');
const eventClearScreen = document.getElementById('event-clear-screen');
const eventResultScoreEl = document.getElementById('event-result-score');
const eventCounterEl = document.getElementById('event-credit-counter');
const eventCreditsValEl = document.getElementById('event-credits-val');
const eventCloseBtn = document.getElementById('event-close-btn');
const eventAccumulatedTotalEl = document.getElementById('event-accumulated-total-credits');
const settingsBtn = document.getElementById('settings-btn');
const settingsScreen = document.getElementById('settings-screen');
const windToggleSettingsBtn = document.getElementById('wind-toggle-settings-btn');
const musicToggleSettingsBtn = document.getElementById('music-toggle-settings-btn');
const resetRecordSettingsBtn = document.getElementById('reset-record-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const windLabels = document.querySelectorAll('.wind-label');
const steakContainer = document.getElementById('steak-cooking-container');
const steakCanvas = document.getElementById('steak-canvas');
const steakCtx = steakCanvas ? steakCanvas.getContext('2d', { willReadFrequently: true }) : null;
const cornContainer = document.getElementById('corn-container');
const windCountdownEl = document.getElementById('wind-countdown');
const seaOverlayEl = document.getElementById('sea-overlay');
const fishingGearEl = document.getElementById('fishing-gear');

const event2FloatingScore = document.getElementById('event2-floating-score');
const event2CookedPctEl = document.getElementById('event2-cooked-pct');
const event2CookedScoreEl = document.getElementById('event2-cooked-score');
const event3FloatingScore = document.getElementById('event3-floating-score');
const event3PopcornScore = document.getElementById('event3-popcorn-score');
const event4FloatingScore = document.getElementById('event4-floating-score');
const event4FishScore = document.getElementById('event4-fish-score');

const rankBtn = document.getElementById('rank-btn');
const rankScreen = document.getElementById('rank-screen');
const closeRankBtn = document.getElementById('close-rank-btn');
const submitRankBtn = document.getElementById('submit-rank-btn');
const myRankScoreEl = document.getElementById('my-rank-score');
const myRankPosEl = document.getElementById('my-rank-pos');
const rankListEl = document.getElementById('rank-list');
const rankNicknameInput = document.getElementById('rank-nickname');

let popcornGatheredScore = 0;
let event4FishCaughtScore = 0;
let popcornDepositTimer = null;

let steak1Img = new Image();
steak1Img.src = '스테이크1.png';
let steak2Img = new Image();
steak2Img.src = '스테이크2.png';
let steakMaskCanvas = document.createElement('canvas');
let steakMaskCtx = steakMaskCanvas.getContext('2d');
let isSteakLoaded = false;
let cookedPercentage = 0;

Promise.all([
    new Promise(res => steak1Img.onload = res),
    new Promise(res => steak2Img.onload = res)
]).then(() => {
    isSteakLoaded = true;
});

let showWindLabels = false;
let isMusicEnabled = (localStorage.getItem('balloon_music_enabled') !== 'false'); // Default true

let storeOperationMode = null; // 'buy', 'sell' or null

let totalCredits = parseInt(localStorage.getItem('balloon_credits')) || 0;
let upgrades = JSON.parse(localStorage.getItem('balloon_upgrades')) || {
    clock: 0,
    fan_left: 0,
    fan_right: 0,
    gas_item: 0,
    weight: 0
};
let lives = parseInt(localStorage.getItem('balloon_lives')) || 7;
if (lives > 7) lives = 7; // Cap at 7
let lastLifeUpdate = parseInt(localStorage.getItem('balloon_last_life_update')) || Date.now();
let clearedLevels = JSON.parse(localStorage.getItem('balloon_cleared_levels')) || [];
let myLevelBestScores = JSON.parse(localStorage.getItem('balloon_level_best_scores')) || {};
let currentLevel = parseInt(localStorage.getItem('balloon_current_level')) || 0;

function saveLevelBestScore(scoreEarned) {
    if (scoreEarned <= 0) return;
    if (currentLevel === 0 || (LEVEL_CONFIGS[currentLevel] && LEVEL_CONFIGS[currentLevel].displayName === "튜토리얼")) return;
    if (LEVEL_CONFIGS[currentLevel] && LEVEL_CONFIGS[currentLevel].displayName.includes('EVENT')) return;
    myLevelBestScores[currentLevel] = Math.max((myLevelBestScores[currentLevel] || 0), scoreEarned);
    localStorage.setItem('balloon_level_best_scores', JSON.stringify(myLevelBestScores));
}

function calculateMyOverallScore() {
    let total = 0;
    for (let lvl in LEVEL_CONFIGS) {
        if (lvl === "0" || (LEVEL_CONFIGS[lvl] && LEVEL_CONFIGS[lvl].displayName === "튜토리얼")) continue;
        if (LEVEL_CONFIGS[lvl] && LEVEL_CONFIGS[lvl].displayName.includes('EVENT')) continue;
        total += (myLevelBestScores[lvl] || 0);
    }
    return total;
}


// Check if old store data exists and force update to new PNG items
let savedStoreData = localStorage.getItem('balloon_store_data');
let defaultStoreData = {
    title: "AERO STORE",
    themeColor: "#3498db",
    items: {
        life: { name: "생명", desc: "+1 Life", price: 100, icon: "balloon.png" },
        fan_left: { name: "선풍기좌측", desc: "+3m/s for 5s left wind power", price: 100, icon: "선풍기좌측.png" },
        fan_right: { name: "선풍기우측", desc: "+3m/s for 5s right wind power", price: 100, icon: "선풍기우측.png" },
        gas_item: { name: "가스통", desc: "+100 extra gas", price: 100, icon: "가스통.png" },
        clock: { name: "자명종시계", desc: "+10s time extention", price: 100, icon: "자명종시계.png" },
        weight: { name: "무게추", desc: "x5 gravity control", price: 100, icon: "무게추.png" }
    }
};

let storeData = defaultStoreData;
if (savedStoreData) {
    try {
        let parsed = JSON.parse(savedStoreData);
        // If the data is from the old version (doesn't have 'clock'), use default
        if (!parsed.items.clock) {
            storeData = defaultStoreData;
            savePlayerData();
        } else {
            storeData = parsed;
            // Force update descriptions from defaultStoreData to reflect latest changes
            Object.keys(defaultStoreData.items).forEach(key => {
                if (storeData.items[key]) {
                    storeData.items[key].desc = defaultStoreData.items[key].desc;
                    storeData.items[key].price = defaultStoreData.items[key].price;
                }
            });
        }
    } catch (e) {
        storeData = defaultStoreData;
    }
} else {
    savePlayerData();
}

// Ensure 'life' item exists even if using saved data from previous version
if (!storeData.items.life) {
    storeData.items.life = defaultStoreData.items.life;
    savePlayerData();
}

function canReceiveEventPoints() {
    const hasNoItems = (upgrades.clock === 0 && upgrades.fan_left === 0 && upgrades.fan_right === 0 && upgrades.gas_item === 0 && upgrades.weight === 0);
    return (lives <= 1 && hasNoItems && totalCredits <= 99);
}

function savePlayerData() {
    localStorage.setItem('balloon_credits', totalCredits);
    localStorage.setItem('balloon_upgrades', JSON.stringify(upgrades));
    localStorage.setItem('balloon_store_data', JSON.stringify(storeData));
    localStorage.setItem('balloon_cleared_levels', JSON.stringify(clearedLevels));
    localStorage.setItem('balloon_lives', lives);
    localStorage.setItem('balloon_last_life_update', lastLifeUpdate);
    localStorage.setItem('balloon_music_enabled', isMusicEnabled);
    localStorage.setItem('balloon_current_level', currentLevel);

    // Update ground credit display
    const groundCredits = document.getElementById('ground-credits-display');
    if (groundCredits) groundCredits.innerText = `${totalCredits}C`;
}

// --- Sound Management (Optimized for performance/iOS) ---
class SoundManager {
    constructor() {
        this.context = null;
        this.buffers = {};
        this.activeSources = {};
        this.isInitialized = false;
    }

    init() {
        if (this.context) return;
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioContext initialized (suspended)");
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    async loadSound(name, url) {
        if (!this.context) this.init();
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.buffers[name] = audioBuffer;
            console.log(`Sound buffered: ${name}`);
        } catch (e) {
            // Fallback for file:// or load failure
            console.warn(`Failed to buffer ${name}, sound may not play.`, e);
        }
    }

    async resume() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }

    play(name, loop = false, volume = 1.0) {
        if (!this.context || !this.buffers[name]) return null;

        // Auto-resume for iOS on playback attempt
        if (this.context.state === 'suspended') this.resume();

        const source = this.context.createBufferSource();
        source.buffer = this.buffers[name];
        source.loop = loop;

        const gainNode = this.context.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        source.start(0);

        if (loop) {
            this.activeSources[name] = { source, gainNode };
        }
        return source;
    }

    stop(name) {
        if (this.activeSources[name]) {
            try {
                this.activeSources[name].source.stop();
            } catch (e) { }
            delete this.activeSources[name];
        }
    }
}

const soundMgr = new SoundManager();

// Initial load (Note: AudioContext needs user interaction to start, but we can load buffers early)
// However, creating context itself should be deferred to first touch for some browsers.
// We'll init in the start handler.

// BGM is long, keep it as Audio element for streaming
const bgmFiles = [
    '열기구음악1.mp3', '열기구음악2.mp3', '열기구음악3.mp3', '열기구음악4.mp3',
    '열기구음악5.MP3', '열기구음악6.MP3', '열기구음악7.mp3', '열기구음악8.mp3',
    '열기구음악9.mp3', '열기구음악10.mp3'
];

let bgmAudio = new Audio();
bgmAudio.loop = false; // 곡이 끝나고 'ended' 이벤트가 발생하도록 false로 설정

// 음악이 끝나면 자동으로 다음 랜덤 곡 재생
bgmAudio.addEventListener('ended', () => {
    playRandomBGM(true);
});

// --- Sound Logic ---
let isSoundPreloaded = false;

async function startSoundSystem() {
    if (isSoundPreloaded) return;
    soundMgr.init();
    await soundMgr.resume();
    await preloadSounds();
    isSoundPreloaded = true;
}

async function preloadSounds() {
    soundMgr.init();
    const effects = [
        { name: 'burner', url: '열기구소리.MP3' },
        { name: 'burner_alt', url: '열기구소리..MP3' },
        { name: 'success', url: '미션성공.MP3' },
        { name: 'explosion', url: '폭발.MP3' },
        { name: 'coin', url: '코인소리.mp3' },
        { name: 'life', url: '생명소리.MP3' },
        { name: 'popcorn', url: '팝콘소리.MP3' }
    ];
    // Parallel decode-into-memory
    await Promise.all(effects.map(effect => soundMgr.loadSound(effect.name, effect.url)));
    console.log("All SFX pre-decoded and ready");
}

function playCoinSound() {
    if (!isSoundPreloaded) startSoundSystem();
    soundMgr.play('coin', false, 0.5);
}

function playRandomBGM(force = false) {
    if (!isMusicEnabled) {
        bgmAudio.pause();
        return;
    }
    if (!force && !bgmAudio.paused && bgmAudio.src) return; // 이미 재생 중이면 다시 시작하지 않음
    const randomIndex = Math.floor(Math.random() * bgmFiles.length);
    bgmAudio.src = bgmFiles[randomIndex];
    bgmAudio.play().catch(e => console.log("BGM play failed:", e));
}

// Game constants
const GRAVITY = 0.006012; // 0.00501 * 1.2
const BURNER_FORCE = 0.0806105664; // 0.115157952 * 0.7 (추가 30% 감소)
const FRICTION = 0.98;
const MAX_UPWARD_VELOCITY = 0.3; // 속도 제한 하향 (0.5에서 0.3으로)
const SCREEN_RATIO_W = 9;
const SCREEN_RATIO_H = 20;

// Zone Wind Settings (7 zones, 0 is bottom, 6 is top)
// Positive is right, Negative is left
const ZONE_WINDS = [1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5]; // Adjusted initial values as requested
const MAX_GAS = 1000;
const MAX_TIME = 60;
let particles = [];
const PARTICLE_COUNT = 30;
let activeFish = [];
let attachedFish = null;
let draggingOffset = { x: 0, y: 0 };

const LEVEL_CONFIGS = {
    0: {
        displayName: "튜토리얼",
        winds: [1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    1: {
        displayName: "1",
        winds: [1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    2: {
        displayName: "2",
        winds: [-1.5, 1.5, 2.5, -2.0, 1.5, -1.25, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    3: {
        displayName: "3",
        winds: [1, 1.5, -1.5, -3, 1.5, -2.5, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    4: {
        displayName: "4",
        winds: [2, -5, 5, -5, 5, -5, 2],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    5: {
        displayName: "5",
        winds: [2, -4.75, 2, -4.75, 3, -3, 3],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    6: {
        displayName: "EVENT 1",
        winds: [-2, 2, -2, 2, -2, 2, -2],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    7: {
        displayName: "6",
        winds: [-2, 4.75, -1.75, 4.75, -1.75, 4.75, -1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    8: {
        displayName: "7",
        winds: [-1, -1, -1, 4.75, -2, 4.75, -1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    9: {
        displayName: "8",
        winds: [1.75, 1.75, 1.75, -1.75, -1.75, -1.75, 1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    10: {
        displayName: "9",
        winds: [-2, 2, -5, -4.75, 4.75, -4.75, 3],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    11: {
        displayName: "10",
        winds: [-1, -1, -1, -1, -1, 5, -8],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    12: {
        displayName: "EVENT 2",
        winds: [1, -1, -2, 2, -2, 0, 1],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.5
    },
    13: {
        displayName: "11",
        winds: [1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    14: {
        displayName: "12",
        winds: [-1.5, 1.5, 2.5, -2.0, 1.5, -1.25, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    15: {
        displayName: "13",
        winds: [2, -4.75, 2, -4.75, 3, -3, 3],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    16: {
        displayName: "14",
        winds: [1, 1.5, -1.5, -3, 1.5, -2.5, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    17: {
        displayName: "15",
        winds: [-2, 4.75, -1.75, 4.75, -1.75, 4.75, -1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    18: {
        displayName: "EVENT 3",
        winds: [2, -1, -2, 2, -2, 0, 1],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.5
    },
    19: {
        displayName: "16",
        winds: [2, -5, 5, -5, 5, -5, 2],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    20: {
        displayName: "17",
        winds: [-1, -1, -1, 4.75, -1.75, 4.75, -1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    21: {
        displayName: "18",
        winds: [1.75, 1.75, 1.75, -1.75, -1.75, -1.75, 1.0],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    22: {
        displayName: "19",
        winds: [-1, -1, -1, -1, -1, 5, -8],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    23: {
        displayName: "20",
        winds: [-2, 2, -5, -4.75, 4.75, -4.75, 3],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    24: {
        displayName: "EVENT 4",
        winds: [1, -1, -2, 2, -2, 2, -1],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.5
    }
};

let currentMaxGas = LEVEL_CONFIGS[0].maxGas;
let currentMaxTime = LEVEL_CONFIGS[0].maxTime;

// 이벤트 레벨 기록 정리 (이전 버전 사용자 대비)
let changedBestScores = false;
for (let lvl in myLevelBestScores) {
    if (LEVEL_CONFIGS[lvl] && LEVEL_CONFIGS[lvl].displayName.includes('EVENT')) {
        delete myLevelBestScores[lvl];
        changedBestScores = true;
    }
}
if (changedBestScores) {
    localStorage.setItem('balloon_level_best_scores', JSON.stringify(myLevelBestScores));
}

// Game state
let gameState = 'START';
let balloonX = 50; // Percentage (50% is center)
let balloonY = 0;  // Starts at 0 relative to the play area (above ground)
let velX = 0;
let velY = 0;
let isBurning = false;
let hasEnteredZone7 = false;
let gas = 0; // 소모된 가스양
let missionStartTime = 0;
let elapsedTime = 0;
let currentBurnerForce = BURNER_FORCE;
let continuousBurnStartTime = 0;
let targetLineX = 50;
let pauseStartTime = 0; // 아이템 확인 시 일시정지 시작 시간
let tempWindBoosts = [0, 0, 0, 0, 0, 0, 0]; // 선풍기 아이템 사용 시 임시 풍속 추가량
let activeGravityMultiplier = 1; // 무게추 활성화 시 중력 배수
let activeCoins = []; // 현재 화면에 존재하는 코인들
let sessionEventCredits = 0; // 이번 세션(이벤트 레벨)에서 획득한 크레딧
let droppedItems = []; // 화면에 드롭된 아이템들
let sessionItemsUsed = 0; // 이번 세션에서 실제로 사용한 아이템 개수
let lastUpdate = 0; // FPS 캡을 위한 시간 기록
let accumulator = 0; // 추가: 물리 연산 보정을 위한 누적 시간
let level11WindMultiplier = 1;
let windCycleStartTime = 0;
let lastParticleUpdate = 0; // 파티클 애니메이션 FPS 캡
let particleAccumulator = 0; // 추가: 파티클 연산 보정을 위한 누적 시간
let initialItemCount = 0; // 게임 시작 직전 보유한 아이템 총 갯수

// 보너스 점수 레벨 그룹 (표시 이름 기준)
const BONUS_G1_LEVELS = ["6", "7", "14", "15"];
const BONUS_G2_LEVELS = ["8", "9", "10", "16", "17", "18", "19", "20"];

function getTotalItemsCount() {
    let total = 0;
    for (let key in upgrades) {
        if (key !== 'life') {
            total += (upgrades[key] || 0);
        }
    }
    total += droppedItems.length;
    return total;
}

// Initialize
function init() {
    // restartBtn.addEventListener('click', () => {
    //     resetGame();
    //     startGame();
    // });
    createParticles();
    createStars();

    if (itemLabelBtn) {
        itemLabelBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!isSoundPreloaded) await startSoundSystem();
            if (!settingsScreen.classList.contains('hidden')) return;
            if (gameState === 'PLAY') return; // 게임 도중에는 클릭 안되게

            const container = document.querySelector('.store-container');
            const isVisible = !storeScreen.classList.contains('hidden');
            const isInventory = container ? container.classList.contains('inventory-mode') : false;

            if (isVisible && isInventory) {
                resumeGame(); // 이미 인벤토리라면 닫기
            } else {
                if (gameState === 'PLAY') {
                    gameState = 'PAUSED';
                    pauseStartTime = Date.now();
                    mainActionBtn.innerText = 'PAUSE';
                    mainActionBtn.classList.add('item-paused');
                }
                if (clearScreen) clearScreen.classList.add('hidden'); // Hide score window
                if (levelHintEl) levelHintEl.classList.add('hidden'); // Hide mission hint
                storeScreen.classList.remove('hidden');
                updateStoreUI(true); // 인벤토리 모드로 열기/전환
            }
        });
    }

    if (storeLabelBtn) {
        storeLabelBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!isSoundPreloaded) await startSoundSystem();
            if (!settingsScreen.classList.contains('hidden')) return;
            if (gameState === 'PLAY') return; // 게임 도중에는 클릭 안되게

            const container = document.querySelector('.store-container');
            const isVisible = !storeScreen.classList.contains('hidden');
            const isInventory = container ? container.classList.contains('inventory-mode') : false;

            if (isVisible && !isInventory) {
                resumeGame(); // 이미 상점이라면 닫기
            } else {
                if (gameState === 'PLAY') {
                    gameState = 'PAUSED';
                    pauseStartTime = Date.now();
                    mainActionBtn.innerText = 'PAUSE';
                    mainActionBtn.classList.add('item-paused');
                }
                if (clearScreen) clearScreen.classList.add('hidden'); // Hide score window
                if (levelHintEl) levelHintEl.classList.add('hidden'); // Hide mission hint
                storeScreen.classList.remove('hidden');
                storeOperationMode = null;
                updateStoreUI(false); // 상점 모드로 열기/전환
            }
        });
    }

    if (buyModeBtn) {
        buyModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (storeOperationMode === 'buy') storeOperationMode = null;
            else storeOperationMode = 'buy';
            updateStoreUI(false);
        });
    }

    if (sellModeBtn) {
        sellModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (storeOperationMode === 'sell') storeOperationMode = null;
            else storeOperationMode = 'sell';
            updateStoreUI(false);
        });
    }

    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextLv = currentLevel + 1;
            if (LEVEL_CONFIGS[nextLv]) {
                currentLevel = nextLv;
                resetGame();
                if (rankScreen && !rankScreen.classList.contains('hidden')) {
                    updateRankUI();
                }
            }
        });
    }

    if (prevLevelBtn) {
        prevLevelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prevLv = currentLevel - 1;
            if (LEVEL_CONFIGS[prevLv]) {
                currentLevel = prevLv;
                resetGame();
                if (rankScreen && !rankScreen.classList.contains('hidden')) {
                    updateRankUI();
                }
            }
        });
    }

    if (openStoreBtn) {
        openStoreBtn.addEventListener('click', () => {
            storeScreen.classList.remove('hidden');
            clearScreen.classList.add('hidden');
            storeOperationMode = null; // Reset mode
            updateStoreUI(false); // Open in Shop Mode
        });
    }

    if (closeStoreBtn) {
        closeStoreBtn.addEventListener('click', () => {
            resumeGame();
        });
    }

    if (eventCloseBtn) {
        eventCloseBtn.addEventListener('click', () => {
            eventClearScreen.classList.add('hidden');
            resetGame();
        });
    }

    const closeClearBtn = document.getElementById('close-clear-btn');
    if (closeClearBtn) {
        closeClearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearScreen.classList.add('hidden');
            resetGame();
        });
    }

    const eventCloseClearBtn = document.getElementById('event-close-clear-btn');
    if (eventCloseClearBtn) {
        eventCloseClearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            eventClearScreen.classList.add('hidden');
            resetGame();
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (gameState === 'PLAY') {
                gameState = 'PAUSED';
                pauseStartTime = Date.now();
                mainActionBtn.innerText = 'PAUSE';
                mainActionBtn.classList.add('item-paused');
            }
            settingsScreen.classList.remove('hidden');
            updateSettingsUI();
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsScreen.classList.add('hidden');
            if (gameState === 'PAUSED' && !storeScreen.classList.contains('hidden') === false) {
                resumeGame(); // Ensure it doesn't resume if store is still open
            }
        });
    }

    if (windToggleSettingsBtn) {
        windToggleSettingsBtn.addEventListener('click', () => {
            showWindLabels = !showWindLabels;
            windLabels.forEach(label => {
                label.classList.toggle('hidden', !showWindLabels);
            });
            if (showWindLabels) updateWindLabels();
            updateSettingsUI();
        });
    }

    if (musicToggleSettingsBtn) {
        musicToggleSettingsBtn.addEventListener('click', () => {
            isMusicEnabled = !isMusicEnabled;
            if (isMusicEnabled) {
                playRandomBGM(true);
            } else {
                bgmAudio.pause();
            }
            savePlayerData();
            updateSettingsUI();
        });
    }

    if (resetRecordSettingsBtn) {
        resetRecordSettingsBtn.addEventListener('click', () => {
            if (confirm("모든 기록(크레딧, 아이템, 진행 상황, 랭킹)을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
                // Clear localStorage
                localStorage.removeItem('balloon_credits');
                localStorage.removeItem('balloon_upgrades');
                localStorage.removeItem('balloon_store_data');
                localStorage.removeItem('balloon_cleared_levels');
                localStorage.removeItem('balloon_lives');
                localStorage.removeItem('balloon_last_life_update');
                localStorage.removeItem('balloon_music_enabled');
                localStorage.removeItem('balloon_level_best_scores');
                localStorage.removeItem('balloon_leaderboard_profiles');

                // Reset variables
                totalCredits = 0;
                upgrades = { clock: 0, fan_left: 0, fan_right: 0, gas_item: 0, weight: 0 };
                lives = 7;
                clearedLevels = [];
                currentLevel = 0;
                lastLifeUpdate = Date.now();
                isMusicEnabled = true;
                storeData = defaultStoreData;
                myLevelBestScores = {};

                // Update UI and Save
                savePlayerData();
                updateLivesUI();
                if (typeof updateCreditsUI === 'function') updateCreditsUI();
                else if (groundCredits) groundCredits.innerText = "0C";

                updateSettingsUI();

                // Reset game state
                resetGame();

                alert("기록이 성공적으로 초기화되었습니다.");
                location.reload(); // Reload to ensure everything is fresh
            }
        });
    }



    if (saveDecoBtn) {
        saveDecoBtn.addEventListener('click', () => {
            storeData.title = editStoreTitle.value;
            storeData.themeColor = editStoreColor.value;

            // Update items
            Object.keys(storeData.items).forEach(key => {
                const block = document.querySelector(`.item-editor-block[data-key="${key}"]`);
                if (block) {
                    storeData.items[key].name = block.querySelector('.edit-name').value;
                    storeData.items[key].desc = block.querySelector('.edit-desc').value;
                    storeData.items[key].price = parseInt(block.querySelector('.edit-price').value);
                }
            });

            savePlayerData();
            applyStoreDecoration();
            storeDecorator.classList.add('hidden');
        });
    }

    if (closeDecoBtn) {
        closeDecoBtn.addEventListener('click', () => {
            storeDecorator.classList.add('hidden');
        });
    }

    if (closeDecoBtn) {
        closeDecoBtn.addEventListener('click', () => {
            storeDecorator.classList.add('hidden');
        });
    }

    // Controls
    mainActionBtn.addEventListener('mousedown', async (e) => {
        if (!isSoundPreloaded) await startSoundSystem();
        soundMgr.init();
        await soundMgr.resume();

        if (!settingsScreen.classList.contains('hidden')) return;
        if (mainActionBtn.classList.contains('overheated')) return; // 대기 시간 동안 클릭 방지
        if (gameState === 'START' || gameState === 'CLEAR' || gameState === 'GAMEOVER' || mainActionBtn.classList.contains('restart-mode')) {
            if (lives <= 0) {
                const now = Date.now();
                const nextRegenTime = lastLifeUpdate + (5 * 60 * 1000);
                const waitMs = nextRegenTime - now;
                const waitMin = Math.ceil(waitMs / 60000);
                alert(`생명이 없습니다! 충전될 때까지 약 ${waitMin}분 더 기다려야 합니다.`);
                return;
            }
            resetGame();
            startGame();
        } else if (gameState === 'PLAY') {
            isBurning = true;
            if (!soundMgr.activeSources['burner']) {
                soundMgr.play('burner', true, 1.0);
            }
        }
    });

    mainActionBtn.addEventListener('touchstart', async (e) => {
        if (e.cancelable) e.preventDefault();
        if (!isSoundPreloaded) await startSoundSystem();
        soundMgr.init();
        await soundMgr.resume();

        if (mainActionBtn.classList.contains('overheated')) return; // 대기 시간 동안 클릭 방지
        if (gameState === 'START' || gameState === 'CLEAR' || gameState === 'GAMEOVER' || mainActionBtn.classList.contains('restart-mode')) {
            if (lives <= 0) {
                const now = Date.now();
                const nextRegenTime = lastLifeUpdate + (5 * 60 * 1000);
                const waitMs = nextRegenTime - now;
                const waitMin = Math.ceil(waitMs / 60000);
                alert(`생명이 없습니다! 충전될 때까지 약 ${waitMin}분 더 기다려야 합니다.`);
                return;
            }
            resetGame();
            startGame();
        } else if (gameState === 'PLAY') {
            isBurning = true;
            if (!soundMgr.activeSources['burner']) {
                soundMgr.play('burner', true, 1.0);
            }
        }
    }, { passive: false });

    window.addEventListener('mouseup', () => {
        isBurning = false;
        soundMgr.stop('burner');
        soundMgr.stop('burner_alt');
    });
    window.addEventListener('touchend', () => {
        isBurning = false;
        soundMgr.stop('burner');
        soundMgr.stop('burner_alt');
    });
    // dev controls
    document.querySelectorAll('.wind-slider').forEach(slider => {
        // 초기 값 동기화
        const zoneIdx = parseInt(slider.dataset.zone);
        const val = parseFloat(slider.value);
        ZONE_WINDS[zoneIdx] = val;

        slider.addEventListener('input', (e) => {
            const zoneIdx = parseInt(e.target.dataset.zone);
            const val = parseFloat(e.target.value);
            ZONE_WINDS[zoneIdx] = val; // Physics update
            // Persist the change to the current level config so it stays after reset
            LEVEL_CONFIGS[currentLevel].winds[zoneIdx] = val;

            if (e.target.nextElementSibling) {
                e.target.nextElementSibling.innerText = val.toFixed(2);
            }
        });
    });



    // Toggle Dev Mode (Ctrl + A)
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'a') {
            e.preventDefault(); // Prevent default browser "Select All"
            document.body.classList.toggle('dev-mode-active');
        }
        if (e.ctrlKey && e.key.toLowerCase() === 's') {
            e.preventDefault(); // 브라우저 저장 방지
            document.body.classList.toggle('show-markers');
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            coordDebugger.classList.toggle('hidden');
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'q') {
            e.preventDefault();
            storeScreen.classList.remove('hidden');
            updateStoreUI();
        }
        // 개발자용 레벨 이동 (Ctrl + L: 다음, Ctrl + K: 이전)
        // 개발자용 레벨 이동 (Ctrl + L: 다음, Ctrl + K: 이전)
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            const maxLevel = Object.keys(LEVEL_CONFIGS).length - 1;
            if (currentLevel < maxLevel) {
                currentLevel++;
                resetGame();
                console.log(`Switched to Level ${currentLevel}`);
            }
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (currentLevel > 0) {
                currentLevel--;
                resetGame();
                console.log(`Switched to Level ${currentLevel}`);
            }
        }
        // 개발자용 데이터 초기화 (Alt + Z)
        if (e.altKey && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            totalCredits = 0;
            clearedLevels = [];
            lives = 7;
            lastLifeUpdate = Date.now();
            Object.keys(upgrades).forEach(key => upgrades[key] = 0);
            savePlayerData();
            updateStoreUI();
            console.log("Developer: Data reset to 0 (Alt+Z)");
        }
        // 개발자용 아이템 추가 (Alt + X)
        if (e.altKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            Object.keys(upgrades).forEach(key => upgrades[key] = (upgrades[key] || 0) + 5);
            lives = 7;
            lastLifeUpdate = Date.now();
            savePlayerData();
            updateStoreUI();
            updateLivesUI();
            console.log("Developer: Added 5 of each item (Alt+X)");
        }
        // 관리자 전용: 서버 랭킹 초기화 (Alt + Ctrl + M)
        if (e.altKey && e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            const pw = prompt("관리자 비밀번호를 입력하세요:");
            if (pw === "ydp3200@@") {
                if (confirm("정말로 서버의 모든 랭킹 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
                    const deleteServerRankings = async () => {
                        try {
                            const snapshot = await db.collection("leaderboard").get();
                            if (snapshot.empty) {
                                alert("삭제할 기록이 없습니다.");
                                return;
                            }
                            const batch = db.batch();
                            snapshot.docs.forEach((doc) => {
                                batch.delete(doc.ref);
                            });
                            await batch.commit();
                            alert("서버의 모든 랭킹 기록이 성공적으로 삭제되었습니다.");
                            if (rankScreen && !rankScreen.classList.contains('hidden')) {
                                updateRankUI();
                            }
                        } catch (err) {
                            console.error("서버 랭킹 삭제 중 오류 발생:", err);
                            alert("서버 기록 삭제 중 오류가 발생했습니다.");
                        }
                    };
                    deleteServerRankings();
                }
            } else if (pw !== null) {
                alert("비밀번호가 틀렸습니다.");
            }
        }
    });

    // Coordinate tracking
    gameContainer.addEventListener('mousemove', (e) => {
        if (coordDebugger.classList.contains('hidden')) return;

        const rect = gameContainer.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = 100 - ((e.clientY - rect.top) / rect.height) * 100;

        // Game logic relative Y (offset by 8.05% ground)
        const gameY = (mouseY - 8.05) / 0.9195;

        coordDebugger.style.left = `${e.clientX - rect.left + 15}px`;
        coordDebugger.style.top = `${e.clientY - rect.top + 15}px`;
        coordDebugger.innerText = `X: ${mouseX.toFixed(2)}%\nY: ${mouseY.toFixed(2)}%\nGameY: ${gameY.toFixed(2)}`;
    });

    gameContainer.addEventListener('click', (e) => {
        if (!coordDebugger.classList.contains('hidden')) {
            const textToCopy = coordDebugger.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                const originalColor = coordDebugger.style.color;
                coordDebugger.style.color = '#ffffff';
                const originalText = coordDebugger.innerText;
                coordDebugger.innerText = "COPIED!\n" + originalText;

                setTimeout(() => {
                    coordDebugger.style.color = originalColor;
                    coordDebugger.innerText = originalText;
                }, 500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    });

    requestAnimationFrame(update);
    applyStoreDecoration();
}


function startGame() {
    balloonX = 50;
    const config = LEVEL_CONFIGS[currentLevel];
    const isSpecialStart = config.displayName === "EVENT 2" || config.displayName === "EVENT 4";

    if (isSpecialStart) {
        // EVENT 2: Start on top of the landing pad
        const skyHeight = gameContainer.clientHeight * 0.9195;
        const platformY = config.platformY;
        const pixelOffset = 12 - 50; // -38 (User requested 50px lower from original 12)
        const targetYBottom = (100 / 7) * platformY + (pixelOffset / skyHeight) * 100;
        const platformHeightPercentage = (9 / skyHeight) * 100;
        const targetYTop = targetYBottom + platformHeightPercentage;
        balloonY = targetYTop - getBasketOffset() + 0.1; // Add 0.1 to avoid immediate touch
    } else {
        balloonY = -getBasketOffset();
    }

    velX = 0;
    velY = 0;
    isBurning = false;
    gameState = 'PLAY';
    clearScreen.classList.add('hidden');
    updateNextLevelButtonVisibility(); // Hide next level button when game starts
    mainActionBtn.innerText = 'BURNER';
    mainActionBtn.classList.add('burner-mode');
    mainActionBtn.classList.remove('restart-mode');
    hasEnteredZone7 = false;
    if (levelHintEl) levelHintEl.classList.add('hidden');
    // const config = LEVEL_CONFIGS[currentLevel]; // 이미 상단에서 선언됨

    // 아이템 효과는 이제 인벤토리에서 직접 사용할 때만 발동되므로
    // 시작 시에는 기본 설정값만 사용합니다. (자동 적용 안 함)
    currentMaxGas = config.maxGas;
    currentMaxTime = config.maxTime;

    gas = currentMaxGas;
    elapsedTime = 0;
    sessionItemsUsed = 0;
    initialItemCount = getTotalItemsCount();
    missionStartTime = Date.now();
    windCycleStartTime = missionStartTime;
    playRandomBGM();
}

function resumeGame() {
    // 아이템창 닫힐 때 미션 힌트 다시 표시
    if (levelHintEl) {
        const config = LEVEL_CONFIGS[currentLevel];
        const displayName = config.displayName;
        if (displayName === "5" || displayName === "6" || displayName === "7" || displayName === "8" || displayName === "14" || displayName === "15") {
            levelHintEl.classList.remove('hidden');
        }
    }

    if (gameState === 'PAUSED') {
        const now = Date.now();
        const pauseElapsed = now - pauseStartTime;
        missionStartTime += pauseElapsed;
        windCycleStartTime += pauseElapsed;

        gameState = 'PLAY';

        mainActionBtn.innerText = 'BURNER';
        mainActionBtn.classList.remove('item-paused');
        mainActionBtn.style.setProperty('--fill', '0%');
    }

    storeScreen.classList.add('hidden');
}

// 아이템 배치 관련 변수
let isPlacingItem = false;
let currentPlacingKey = null;
let placementPreviewEl = null;

function startDragPlacement(key, initialEvent) {
    if (upgrades[key] <= 0) return;

    // 인벤토리 숨기기
    storeScreen.classList.add('hidden');

    // 배치 미리보기 요소 생성
    if (placementPreviewEl) placementPreviewEl.remove();
    const itemData = storeData.items[key];
    placementPreviewEl = document.createElement('div');
    placementPreviewEl.className = 'dropped-item placement-preview dragging';
    placementPreviewEl.innerHTML = `<img src="${itemData.icon}" alt="${itemData.name}">`;
    placementPreviewEl.style.opacity = "0.7";
    placementPreviewEl.style.pointerEvents = "none"; // 마우스 이벤트 방해 금지
    placementPreviewEl.style.zIndex = "3000";
    gameContainer.appendChild(placementPreviewEl);

    const updatePreview = (e) => {
        const ev = e.touches ? e.touches[0] : e;
        const rect = gameContainer.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * 100;
        const y = 100 - ((ev.clientY - rect.top) / rect.height) * 100;

        placementPreviewEl.style.left = `${x}%`;
        placementPreviewEl.style.bottom = `calc(8.05% + ${(y - 8.05) / 0.9195 * 0.9195}%)`;
    };

    const dropItem = (e) => {
        // 모든 리스너 즉시 제거
        window.removeEventListener('mousemove', updatePreview);
        window.removeEventListener('touchmove', updatePreview);
        window.removeEventListener('mouseup', dropItem);
        window.removeEventListener('touchend', dropItem);

        const ev = e.changedTouches ? e.changedTouches[0] : e;
        const rect = gameContainer.getBoundingClientRect();

        // 마우스를 놓은 위치가 게임 화면 범위 내인지 확인
        if (ev.clientX >= rect.left && ev.clientX <= rect.right &&
            ev.clientY >= rect.top && ev.clientY <= rect.bottom) {

            const dropX = ((ev.clientX - rect.left) / rect.width) * 100;
            const dropY = 100 - ((ev.clientY - rect.top) / rect.height) * 100;
            const gameY = (dropY - 8.05) / 0.9195;

            placeItemOnScreen(key, dropX, gameY);
            upgrades[key]--;
            // sessionItemsUsed++; // 구 버전 로직용 변수, 새 로직에선 직접 개수 비교하므로 주석 처리하거나 맞춰줌
            savePlayerData();
            updateStoreUI(true);
            if (showWindLabels) updateWindLabels();
        }

        // 미리보기 제거
        if (placementPreviewEl) {
            placementPreviewEl.remove();
            placementPreviewEl = null;
        }

        if (gameState === 'PAUSED') resumeGame();
    };

    // 초기 위치 업데이트
    updatePreview(initialEvent);
    if (initialEvent.cancelable) initialEvent.preventDefault();

    window.addEventListener('mousemove', updatePreview);
    window.addEventListener('touchmove', updatePreview, { passive: false });
    window.addEventListener('mouseup', dropItem);
    window.addEventListener('touchend', dropItem);
}

function cancelItemPlacement() {
    isPlacingItem = false;
    currentPlacingKey = null;
    if (placementPreviewEl) {
        placementPreviewEl.remove();
        placementPreviewEl = null;
    }
}

function placeItemOnScreen(key, x, y) {
    const itemData = storeData.items[key];
    const itemEl = document.createElement('div');
    itemEl.className = `dropped-item item-${key}`;
    itemEl.innerHTML = `<img src="${itemData.icon}" alt="${itemData.name}">`;

    itemEl.style.left = `${x}%`;
    itemEl.style.bottom = `calc(8.05% + ${y * 0.9195}%)`;

    let startX, startY;
    let initialItemX, initialItemY;
    let isMoving = false;
    let dragThreshold = 5; // 픽셀 단위 임계값

    const onTouchDown = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return; // 왼쪽 클릭만 허용

        // 게임 진행 중에는 아이템 조작 금지
        if (gameState === 'PLAY') return;

        e.stopPropagation();
        if (e.cancelable) e.preventDefault(); // 브라우저 기본 드래그(금지 아이콘) 및 텍스트 선택 방지

        const ev = e.touches ? e.touches[0] : e;
        startX = ev.clientX;
        startY = ev.clientY;

        const index = droppedItems.findIndex(item => item.el === itemEl);
        if (index === -1) return;

        initialItemX = droppedItems[index].x;
        initialItemY = droppedItems[index].y;
        isMoving = false;

        window.addEventListener('mousemove', onTouchMove);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('mouseup', onTouchUp);
        window.addEventListener('touchend', onTouchUp);
    };

    const onTouchMove = (e) => {
        const ev = e.touches ? e.touches[0] : e;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        if (!isMoving && Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
            isMoving = true;
            itemEl.classList.add('dragging');
            itemEl.style.opacity = "0.7";
            itemEl.style.zIndex = "2000";
        }

        if (isMoving) {
            const rect = gameContainer.getBoundingClientRect();
            // 화면 밖으로 나가지 않도록 좌표 제한 가능 (선택 사항)
            const currentX = ((ev.clientX - rect.left) / rect.width) * 100;
            const currentY = 100 - ((ev.clientY - rect.top) / rect.height) * 100;
            const gameY = (currentY - 8.05) / 0.9195;

            itemEl.style.left = `${currentX}%`;
            itemEl.style.bottom = `calc(8.05% + ${gameY * 0.9195}%)`;

            // 데이터 실시간 업데이트
            const index = droppedItems.findIndex(item => item.el === itemEl);
            if (index !== -1) {
                droppedItems[index].x = currentX;
                droppedItems[index].y = gameY;
            }
            if (showWindLabels) updateWindLabels();
        }
        if (e.type === 'touchmove') e.preventDefault();
    };

    const onTouchUp = (e) => {
        window.removeEventListener('mousemove', onTouchMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('mouseup', onTouchUp);
        window.removeEventListener('touchend', onTouchUp);

        itemEl.classList.remove('dragging');
        itemEl.style.opacity = "1";
        itemEl.style.zIndex = "100";

        if (!isMoving) {
            // "잠깐 누르면 삭제" (움직이지 않았을 때 회수)
            deleteItem();
        } else {
            // 위치 확정
            savePlayerData();
            updateStoreUI(true);
        }
    };

    const deleteItem = () => {
        itemEl.classList.add('item-collected');
        const index = droppedItems.findIndex(item => item.el === itemEl);
        if (index !== -1) {
            const itemKey = droppedItems[index].key;
            upgrades[itemKey] = (upgrades[itemKey] || 0) + 1; // 개수 복구
            droppedItems.splice(index, 1);
        }

        savePlayerData();
        updateStoreUI(true);
        if (showWindLabels) updateWindLabels();
        setTimeout(() => itemEl.remove(), 300);
    };

    itemEl.addEventListener('mousedown', onTouchDown);
    itemEl.addEventListener('touchstart', onTouchDown, { passive: false });
    itemEl.addEventListener('dragstart', (e) => e.preventDefault()); // img 태그 기본 드래그 방지

    gameContainer.appendChild(itemEl);

    droppedItems.push({
        key: key,
        x: x,
        y: y,
        el: itemEl
    });
    if (showWindLabels) updateWindLabels();
}


function updateStoreUI(isInventoryMode = false) {
    if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;

    const container = document.querySelector('.store-container');
    if (container) {
        if (isInventoryMode) {
            container.classList.remove('buy-mode', 'sell-mode');
            container.classList.add('inventory-mode');
        } else {
            container.classList.remove('inventory-mode');
            container.classList.toggle('buy-mode', storeOperationMode === 'buy');
            container.classList.toggle('sell-mode', storeOperationMode === 'sell');
        }
    }

    // Update Mode Buttons
    if (buyModeBtn) buyModeBtn.classList.toggle('active', storeOperationMode === 'buy');
    if (sellModeBtn) sellModeBtn.classList.toggle('active', storeOperationMode === 'sell');

    // Toggle title and currency based on mode
    if (storeTitleEl) storeTitleEl.classList.toggle('hidden', isInventoryMode);
    if (storeCurrencyEl) storeCurrencyEl.classList.toggle('hidden', isInventoryMode);

    // Change Back button text depending on entry point
    if (closeStoreBtn) {
        closeStoreBtn.innerText = 'CLOSE';
    }

    const itemsList = document.getElementById('store-items-list');
    if (itemsList) {
        itemsList.innerHTML = '';
        const storeOrder = ['life', 'fan_left', 'fan_right', 'gas_item', 'clock', 'weight'];
        const inventoryOrder = ['fan_left', 'empty', 'fan_right', 'clock', 'gas_item', 'weight'];
        const orderedKeys = isInventoryMode ? inventoryOrder : storeOrder;
        const displayName = LEVEL_CONFIGS[currentLevel].displayName;

        orderedKeys.forEach(key => {
            if (key === 'empty') {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'store-mini-item empty-slot';
                itemsList.appendChild(emptyDiv);
                return;
            }
            const data = storeData.items[key];
            if (!data) return;
            const count = (key === 'life') ? lives : (upgrades[key] || 0);

            // Life item is special: shown only in store, not in inventory
            if (key === 'life' && isInventoryMode) return;

            // Define labels for each item
            const labelMap = {
                life: "Life +1",
                clock: "+10s",
                fan_left: "+3m/s for 5s",
                fan_right: "+3m/s for 5s",
                gas_item: "+100 gas",
                weight: "1Ton"
            };
            const topLabel = labelMap[key] || "";

            const itemDiv = document.createElement('div');
            itemDiv.className = `store-mini-item item-${key}`;
            if (isInventoryMode) {
                const allItemLevels = [...BONUS_G1_LEVELS, ...BONUS_G2_LEVELS, "EVENT 3"];
                let isItemDisabled = (count === 0);

                // 아이템 미션이 없는 레벨이라면 비활성화
                if (!allItemLevels.includes(displayName)) {
                    isItemDisabled = true;
                } else if (BONUS_G1_LEVELS.includes(displayName)) {
                    if (droppedItems.length >= 1) {
                        isItemDisabled = true;
                    }
                } else if (BONUS_G2_LEVELS.includes(displayName) || displayName === "EVENT 3") {
                    if (droppedItems.length >= 2) {
                        isItemDisabled = true;
                    }
                }


                if (isItemDisabled) {
                    itemDiv.classList.add('disabled-item');
                    itemDiv.style.opacity = "0.3";
                }
            }

            // Conditional footer: Price for store (hidden by CSS if no mode), Count for inventory/Buy/Sell mode
            const footerContent = (isInventoryMode || storeOperationMode) ? `${count}ea` : `${data.price}C`;
            let footerStyle = '';
            if (!isInventoryMode) {
                if (storeOperationMode === 'buy' && totalCredits < data.price) {
                    footerStyle = 'style="color: #666;"'; // Gray out if can't buy
                } else if (storeOperationMode === 'sell' && count === 0) {
                    footerStyle = 'style="color: #666;"'; // Gray out if nothing to sell
                } else if (!storeOperationMode && totalCredits < data.price) {
                    footerStyle = 'style="color: #666;"'; // Default store view
                }
            }

            itemDiv.innerHTML = `
                <div class="item-label-mini">${topLabel}</div>
                <img src="${data.icon || ''}" alt="${data.name}" class="item-icon-mini">
                <div class="item-price-mini" ${footerStyle}>${footerContent}</div>
            `;

            // Only allow buying when in Store Mode and a mode is selected
            if (!isInventoryMode) {
                itemDiv.addEventListener('click', () => {
                    if (storeOperationMode === 'buy') {
                        if (totalCredits >= data.price) {
                            if (key === 'life') {
                                if (lives < 7) {
                                    totalCredits -= data.price;
                                    lives++;
                                    savePlayerData();
                                    updateLivesUI();
                                    updateStoreUI(false);
                                } else {
                                    alert("이미 최대 생명(7개)을 보유하고 있습니다.");
                                }
                            } else {
                                totalCredits -= data.price;
                                upgrades[key] = (upgrades[key] || 0) + 1;
                                savePlayerData();
                                updateStoreUI(false);
                            }
                        }
                    } else if (storeOperationMode === 'sell') {
                        if (key === 'life') {
                            if (lives > 1) { // 최소 1개의 생명은 유지
                                totalCredits += data.price;
                                lives--;
                                savePlayerData();
                                updateLivesUI();
                                updateStoreUI(false);
                            } else {
                                alert("최소 1개의 생명은 남겨두어야 합니다.");
                            }
                        } else if (upgrades[key] > 0) {
                            totalCredits += data.price; // Selling for full price as no other specified
                            upgrades[key]--;
                            savePlayerData();
                            updateStoreUI(false);
                        }
                    }
                    // If no mode selected, do nothing as requested
                });
            } else {
                // 인벤토리 모드: 누른 채로 이동하여 마우스를 놓을 때 한 개 배치
                itemDiv.addEventListener('mousedown', (e) => {
                    const displayName = LEVEL_CONFIGS[currentLevel].displayName;

                    if (BONUS_G1_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 1) return;
                    } else if (BONUS_G2_LEVELS.includes(displayName) || displayName === "EVENT 3") {
                        if (droppedItems.length >= 2) return;
                    } else {
                        // 아이템 미션이 없는 레벨
                        return;
                    }

                    if (upgrades[key] > 0) {
                        startDragPlacement(key, e);
                    }
                });
                itemDiv.addEventListener('touchstart', (e) => {
                    const displayName = LEVEL_CONFIGS[currentLevel].displayName;

                    if (BONUS_G1_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 1) return;
                    } else if (BONUS_G2_LEVELS.includes(displayName) || displayName === "EVENT 3") {
                        if (droppedItems.length >= 2) return;
                    } else {
                        // 아이템 미션이 없는 레벨
                        return;
                    }

                    if (upgrades[key] > 0) {
                        startDragPlacement(key, e.touches[0]);
                    }
                }, { passive: false });
            }

            itemsList.appendChild(itemDiv);
        });
    }
}

function applyItemEffect(key, itemSource = null) {
    const now = Date.now();
    if (key === 'clock') {
        const diffSeconds = (now - missionStartTime) / 1000;
        if (diffSeconds < 30) {
            console.log("Clock item used too early - No effect (less than 30s passed)");
            return;
        }
        // 시간 10초 추가
        missionStartTime += 10000;

        // 잔여 시간 40초로 제한
        const maxTimeLimit = 40;
        const currentDiffSeconds = (now - missionStartTime) / 1000;
        const timeLeft = currentMaxTime - currentDiffSeconds;

        if (timeLeft > maxTimeLimit) {
            missionStartTime = now - (currentMaxTime - maxTimeLimit) * 1000;
        }
        console.log("Item used: Clock - 10s added (Limited to 40s max)");
    } else if (key === 'gas_item') {
        if (currentMaxGas - gas < 300) {
            console.log("Gas item used too early - No effect (less than 300 gas used)");
            return;
        }
        // 가스 100 충전 (현재 가스에 추가, 최대 400으로 제한)
        gas = Math.min(400, gas + 100);
        console.log("Item used: Gas Item - 100 gas refilled (Limited to 400 max)");
    } else if (key === 'weight') {
        // 5초 동안 중력 5배 강화
        activeGravityMultiplier = 5;
        console.log("Item used: Weight - 5x Gravity for 5s");
        setTimeout(() => {
            activeGravityMultiplier = 1;
        }, 5000);
    } else if (key === 'fan_left' || key === 'fan_right') {
        let zoneIndex;
        const zoneHeight = 100 / 7;

        if (itemSource && typeof itemSource.y === 'number') {
            // 아이템이 위치한 구역 찾기
            zoneIndex = Math.min(6, Math.max(0, Math.floor(itemSource.y / zoneHeight)));
        } else {
            // (예외 처리) 열기구 위치 기준
            const skyHeight = gameContainer.clientHeight * 0.9195;
            const markerOffsetPercentage = (79 / skyHeight) * 100;
            const markerY = balloonY + markerOffsetPercentage;
            zoneIndex = Math.min(6, Math.max(0, Math.floor(markerY / zoneHeight)));
        }

        const boostAmount = (key === 'fan_left') ? -3 : 3;

        // 해당 구역에 5초간 풍속 추가
        tempWindBoosts[zoneIndex] += boostAmount;
        console.log(`Item used: ${key} - Wind ${boostAmount} added to Zone ${zoneIndex + 1}`);
        if (showWindLabels) updateWindLabels();

        setTimeout(() => {
            tempWindBoosts[zoneIndex] -= boostAmount;
            console.log(`Wind boost expired: Zone ${zoneIndex + 1}`);
            if (showWindLabels) updateWindLabels();
        }, 5000);
    }
}

function openDecorator() {
    storeDecorator.classList.remove('hidden');
    editStoreTitle.value = storeData.title;
    editStoreColor.value = storeData.themeColor;

    editItemsContainer.innerHTML = '';
    Object.entries(storeData.items).forEach(([key, data]) => {
        const block = document.createElement('div');
        block.className = 'item-editor-block';
        block.dataset.key = key;
        block.innerHTML = `
            <h3>${key.toUpperCase()} Settings</h3>
            <div class="decorator-field">
                <label>Name</label>
                <input type="text" class="edit-name" value="${data.name}">
            </div>
            <div class="decorator-field">
                <label>Description</label>
                <input type="text" class="edit-desc" value="${data.desc}">
            </div>
            <div class="decorator-field">
                <label>Price (CP)</label>
                <input type="number" class="edit-price" value="${data.price}">
            </div>
        `;
        editItemsContainer.appendChild(block);
    });
}

function applyStoreDecoration() {
    const titleEl = document.getElementById('store-title-display');
    if (titleEl) {
        titleEl.innerText = storeData.title;
        titleEl.style.color = storeData.themeColor;
    }
    const container = document.querySelector('.store-container');
    if (container) {
        container.style.borderColor = storeData.themeColor;
        container.style.boxShadow = `0 0 40px ${storeData.themeColor}4d`;
    }
    document.querySelectorAll('.store-container h2:not(.store-title-main)').forEach(h => h.style.color = storeData.themeColor);
    updateStoreUI();
}

function update(timestamp) {
    if (!timestamp) timestamp = performance.now();
    if (!lastUpdate) lastUpdate = timestamp;
    
    let delta = timestamp - lastUpdate;
    lastUpdate = timestamp;

    // 고주사율(120Hz 등) 대응 및 저주사율(30Hz 이하) 보정
    // delta가 너무 크면(탭 전환 등) 한꺼번에 너무 많이 이동하므로 100ms로 제한
    if (delta > 100) delta = 100;
    accumulator += delta;

    const targetDelta = 16.66; // 60FPS 기준 (약 16.66ms)

    // 물리 및 상태 로직 업데이트 (누적된 시간만큼 고정 단계 실행)
    while (accumulator >= targetDelta) {
        if (gameState === 'PLAY') {
            handleMovement();
            checkBoundaries();
            updateTargetLine();
            updateSteakCooking();
            updateCornPopping();
            checkFishing();
        }
        updateFish();
        accumulator -= targetDelta;
    }

    // --- 렌더링 및 UI 업데이트 (실제 모니터 주사율에 맞춰 1회 실행) ---
    balloon.style.bottom = `calc(8.05% + ${balloonY * 0.9195}%)`;
    balloon.style.left = `${balloonX}%`;

    if (isBurning) {
        balloon.classList.add('burning');
    } else {
        balloon.classList.remove('burning');
    }

    // UI 및 시간 제한 체크
    if (gameState === 'PLAY') {
        const now = Date.now();
        const diffSeconds = (now - missionStartTime) / 1000;
        const timeLeft = Math.max(0, currentMaxTime - diffSeconds);

        const currentGas = Math.floor(gas);
        const currentTime = Math.ceil(timeLeft);

        // 풍향 반전 로직 (LV-11 ~ LV-20)
        const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
        if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") {
            const windElapsedSeconds = (now - windCycleStartTime) / 1000;
            const windCycle = windElapsedSeconds % 13;
            if (windCycle >= 10) {
                const count = Math.ceil(13 - windCycle);
                if (windCountdownEl) {
                    windCountdownEl.innerText = count;
                    windCountdownEl.classList.remove('hidden');
                }
            } else {
                if (windCountdownEl) windCountdownEl.classList.add('hidden');
            }
            const newMultiplier = Math.floor(windElapsedSeconds / 13) % 2 === 0 ? 1 : -1;
            if (newMultiplier !== level11WindMultiplier) {
                level11WindMultiplier = newMultiplier;
                if (showWindLabels) updateWindLabels();
            }
        } else {
            if (windCountdownEl) windCountdownEl.classList.add('hidden');
        }

        if (gasTextEl.innerText != currentGas) {
            gasTextEl.innerText = currentGas;
            gasFillEl.style.width = `${Math.max(0, (gas / currentMaxGas) * 100)}%`;
        }
        if (timeTextEl.innerText != currentTime) {
            timeTextEl.innerText = currentTime;
            timeFillEl.style.width = `${Math.max(0, (timeLeft / currentMaxTime) * 100)}%`;
        }

        // 개발용 좌표/시간 표시
        if (gasValEl) gasValEl.innerText = Math.floor(currentMaxGas - gas);
        if (timeValEl) timeValEl.innerText = Math.floor(diffSeconds);

        // 실패 조건 체크 (가스 0 또는 시간 종료)
        if (timeLeft <= 0 || gas <= 0) {
            gameOver(timeLeft <= 0 ? 'TIME OUT' : 'NO GAS');
        }

        // 버너 버튼 색상 업데이트
        if (isBurning && continuousBurnStartTime !== 0) {
            const fillPercent = Math.min(100, (now - continuousBurnStartTime) / 2000 * 100);
            mainActionBtn.style.setProperty('--fill', `${fillPercent}%`);
        } else {
            mainActionBtn.style.setProperty('--fill', '0%');
        }
    } else if (gameState === 'PAUSED') {
        mainActionBtn.style.setProperty('--fill', '0%');
    } else {
        mainActionBtn.style.setProperty('--fill', '0%');
    }

    requestAnimationFrame(update);
}


function updateTargetLine() {
    // 모든 레벨에서 착륙 패드가 가로로 움직이지 않도록 고정 (0~24레벨 공통)
    if (currentLevel >= 0 && currentLevel <= 24) {
        targetLineX = 50;
        targetLineEl.style.left = `${targetLineX}%`;

        // 레벨별 플랫폼 높이 반영 (비주얼)
        const config = LEVEL_CONFIGS[currentLevel];
        const platformY = config.platformY;
        const targetYBottom = (100 / 7) * platformY;
        let pixelOffset = 12;
        if (config.displayName === "9") pixelOffset = 7;
        if (config.displayName === "10") pixelOffset = -3; // Raised by 20px from -23
        targetLineEl.style.bottom = `calc(8.05% + ${targetYBottom * 0.9195}% + ${pixelOffset}px)`;

        // EVENT 레벨들에서 착륙 패드 숨기기
        if (config.displayName.startsWith("EVENT")) {
            targetLineEl.classList.add('hidden');
        } else {
            targetLineEl.classList.remove('hidden');
        }

        return;
    }

    const zone7Wind = ZONE_WINDS[6];
    // 바람 세기에 따라 타겟 라인 이동 (가중치 0.2)
    targetLineX += zone7Wind * 0.2;

    // 화면 끝에서 끝으로 이동 (Wrap around)
    if (targetLineX < 0) targetLineX = 100;
    if (targetLineX > 100) targetLineX = 0;

    targetLineEl.style.left = `${targetLineX}%`;
}

function handleMovement() {
    // Vertical logic (Burner + Gravity)
    if (isBurning) {
        if (continuousBurnStartTime === 0) continuousBurnStartTime = Date.now();
        const burnDuration = Date.now() - continuousBurnStartTime;

        if (burnDuration > 2000) {
            gameOver();
            return;
        }

        velY += currentBurnerForce;

        // 가스 소모 (버너 사용 시 매 프레임 소모)
        gas -= 0.45;
    } else {
        continuousBurnStartTime = 0;
    }
    velY -= GRAVITY * activeGravityMultiplier;
    velY *= FRICTION;

    // Limit upward speed
    if (velY > MAX_UPWARD_VELOCITY) velY = MAX_UPWARD_VELOCITY;

    balloonY += velY * 0.2; // Scaling factor for smoothness

    // Horizontal logic (Wind triggered by the center marker dot)
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const markerOffsetPercentage = (79 / skyHeight) * 100;
    let markerY = balloonY + markerOffsetPercentage;

    const zoneHeight = 100 / 7;
    const zoneIndex = Math.min(6, Math.max(0, Math.floor(markerY / zoneHeight)));

    let windForce = ZONE_WINDS[zoneIndex];
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") windForce *= level11WindMultiplier;
    windForce += tempWindBoosts[zoneIndex];

    velX += windForce * 0.00165; // Reduced from 0.0033 (half of previous effect)
    velX *= FRICTION;

    balloonX += velX;

    // Platform Dimensions
    const platformHeightPercentage = (9 / skyHeight) * 100;
    const config = LEVEL_CONFIGS[currentLevel];
    const platformY = config.platformY;
    let pixelOffset = 12;
    if (config.displayName === "9") pixelOffset = 7;
    if (config.displayName === "10") pixelOffset = -3;
    if (config.displayName === "19") pixelOffset = 12 - 20; // 20px down
    if (config.displayName === "EVENT 2" || config.displayName === "EVENT 3" || config.displayName === "EVENT 4") pixelOffset = 12 - 50; // 50px down
    const targetYBottom = (100 / 7) * platformY + (pixelOffset / skyHeight) * 100; // Visual bottom of the platform
    const targetYTop = targetYBottom + platformHeightPercentage; // Top of the grass

    const platHalfWidth = (100 / 12) / 2;
    const platLeft = targetLineX - platHalfWidth;
    const platRight = targetLineX + platHalfWidth;
    const platTop = targetYTop;
    const platBottom = targetYBottom;

    // Platform Collision logic (Skip for all EVENT levels)
    if (!config.displayName.startsWith("EVENT")) {
        // 1. Balloon Body (Blue circle) Collision
        const balloonCenterY = balloonY + getMarkerOffset();
        const balloonRadius = (32.5 / skyHeight) * 100 / 2; // Approximate radius in %

        // Check if blue circle touches any part of the platform box
        const bodyWithinH = balloonX > platLeft - balloonRadius && balloonX < platRight + balloonRadius;
        const bodyWithinV = balloonCenterY > platBottom - balloonRadius && balloonCenterY < platTop + balloonRadius;

        if (bodyWithinH && bodyWithinV) {
            gameOver('CRASH');
            return;
        }

        // 2. Red Dot (Basket) Collision and Landing logic
        const basketY = balloonY + getBasketOffset();
        const basketWithinH = balloonX >= platLeft && balloonX <= platRight;

        if (basketWithinH) {
            // Check for top-down landing on the Yellow line (platTop)
            const isTouchingTop = basketY <= platTop + 0.3 && basketY >= platTop - 0.7;

            if (isTouchingTop) {
                // 게임 시작 직후 바로 클리어 방지 (최소 2초 비행 필요)
                const isFreshStart = (Date.now() - missionStartTime) < 2000;
                if (velY < 0 && !isFreshStart) { // Moving Top -> Bottom
                    winGame();
                    return;
                }
                // velY > 0 (상승) 시에는 크래시 없이 패드에서 벗어날 수 있도록 함
            }
            // If inside the platform but not at the very top -> Crash
            else if (basketY < platTop && basketY > platBottom) {
                gameOver('CRASH');
                return;
            }
        } else {
            // Check for hitting sides with the red dot
            const basketNearV = basketY > platBottom && basketY < platTop;
            const basketNearH = balloonX > platLeft - 1 && balloonX < platRight + 1;
            if (basketNearV && basketNearH) {
                gameOver('CRASH');
                return;
            }
        }
    }

    // 3. Coin Collision (EVENT LEVEL only)
    if (activeCoins.length > 0) {
        checkCoinCollisions();
    }

    // 4. Dropped Item Collision
    if (droppedItems.length > 0) {
        checkDroppedItemCollisions();
    }
}

function checkDroppedItemCollisions() {
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const skyWidth = gameContainer.clientWidth;

    const markerXPx = (balloonX / 100) * skyWidth;
    const markerYPx = ((balloonY + getMarkerOffset()) / 100) * skyHeight;

    const balloonRadius = 32.5 / 2;
    const itemRadius = 30 / 2; // 아이템 크기 대략 30px
    const combinedRadiusSq = Math.pow(balloonRadius + itemRadius, 2);

    for (let i = droppedItems.length - 1; i >= 0; i--) {
        const item = droppedItems[i];
        const itemXPx = (item.x / 100) * skyWidth;
        const itemYPx = (item.y / 100) * skyHeight;

        const dx = markerXPx - itemXPx;
        const dy = markerYPx - itemYPx;
        const distSq = dx * dx + dy * dy;

        if (distSq < combinedRadiusSq) {
            applyItemEffect(item.key, item);
            item.el.classList.add('item-collected'); // 효과 애니메이션
            setTimeout(() => item.el.remove(), 500);
            droppedItems.splice(i, 1);
            if (showWindLabels) updateWindLabels();
        }
    }
}


function checkCoinCollisions() {
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const skyWidth = gameContainer.clientWidth;

    // Balloon marker center in pixels (from bottom-left of sky area)
    const markerXPx = (balloonX / 100) * skyWidth;
    const markerYPx = ((balloonY + getMarkerOffset()) / 100) * skyHeight;

    // Dimensions for collision (radii)
    const markerRadius = 32.5 / 2; // Blue circle diameter is 32.5px
    const coinRadius = 20 / 2;   // Coin diameter is 20px
    const combinedRadius = markerRadius + coinRadius;
    const combinedRadiusSq = combinedRadius * combinedRadius;

    activeCoins.forEach(coin => {
        if (coin.collected) return;

        const zoneH_pct = 100 / 7;
        // Coin center in pixels
        const coinXPx = (coin.x / 100) * skyWidth + coinRadius;
        const coinYPc = (coin.zoneIndex * zoneH_pct) + (coin.y * zoneH_pct / 100);
        const coinYPx = (coinYPc / 100) * skyHeight + coinRadius;

        const dx = markerXPx - coinXPx;
        const dy = markerYPx - coinYPx;

        const distSq = dx * dx + dy * dy;

        if (distSq < combinedRadiusSq) {
            collectCoin(coin);
        }
    });
}

function collectCoin(coin) {
    coin.collected = true;
    coin.el.classList.add('collected');

    // 이미 클리어한 레벨이면 코인 포인트 적립 안함 (이벤트 레벨은 예외로 항상 적립 가능하도록 수정 제안 가능하나 현재는 기존 로직 유지)
    // 단, 이번 세션 획득량은 항상 표시
    sessionEventCredits += 10;
    if (eventCreditsValEl) eventCreditsValEl.innerText = sessionEventCredits;

    const isAlreadyCleared = clearedLevels.includes(currentLevel);
    if (!isAlreadyCleared || canReceiveEventPoints()) {
        totalCredits += 10;
        savePlayerData();
        if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;
        console.log("Credits added:", totalCredits);
    } else {
        console.log("Already cleared level - coin points not added to total");
    }

    playCoinSound();

    setTimeout(() => {
        coin.el.remove();
    }, 500);
}

function getMarkerOffset() {
    const skyHeight = gameContainer.clientHeight * 0.9195;
    return (79 / skyHeight) * 100;
}

function getBasketOffset() {
    const skyHeight = gameContainer.clientHeight * 0.9195;
    // Calculate based on style.css: bottom: calc(58% - 30px) of 140px height
    const basketPixels = (140 * 0.58) - 30;
    return (basketPixels / skyHeight) * 100;
}

function checkBoundaries() {
    // Basket offset needed to allow the red dot to reach the ground
    const basketOffsetPercentage = getBasketOffset();

    // Allow balloon to go slightly "below" 0 so the red dot can touch the ground line
    if (balloonY < -basketOffsetPercentage) {
        balloonY = -basketOffsetPercentage;
        velY = 0;
    }

    if (balloonX < 5) {
        balloonX = 5;
        gameOver('CRASH');
    }
    if (balloonX > 95) {
        balloonX = 95;
        gameOver('CRASH');
    }

    // Top boundary check
    if (balloonY > 105) { // Allow bottom to go slightly off screen before failing
        balloonY = 105;
        gameOver();
    }
}

function clearDroppedItems() {
    droppedItems.forEach(item => {
        if (item.el && item.el.parentNode) {
            item.el.remove();
        }
    });
    droppedItems = [];
}

function gameOver(msg = 'OVERHEAT') {
    if (gameState !== 'PLAY') return;
    gameState = 'GAMEOVER';
    isBurning = false;
    soundMgr.stop('burner');
    attachedFish = null;
    updateNextLevelButtonVisibility(); // 즉시 화살표 표시

    // 11~20레벨 실패 시 바람 방향을 처음 시작 방향(multiplier=1)으로 복구
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") {
        level11WindMultiplier = 1;
        if (showWindLabels) updateWindLabels();
        if (windCountdownEl) windCountdownEl.classList.add('hidden');
    }

    const config = LEVEL_CONFIGS[currentLevel];
    const isEventLevel = config && config.displayName.startsWith("EVENT");
    const isEvent2 = config && config.displayName === "EVENT 2";

    if (isEvent2) {
        // 미션 실패해도 EVENT 2에서 얻은 요리 점수는 합산
        const displayCookedPct = Math.floor(cookedPercentage * 2);
        const earnedScore = displayCookedPct * 10;
        const isAlreadyCleared = clearedLevels.includes(currentLevel);
        if (earnedScore > 0) {
            if (!isAlreadyCleared || canReceiveEventPoints()) {
                totalCredits += earnedScore;
                console.log(`EVENT 2 Failed: Added ${earnedScore}C from cooking.`);
            }
        }
    }

    if (!isEventLevel) {
        lives--;
        if (lives < 7 && lives >= 0) {
            // 생명이 깎인 시점부터 충전 타이머 시작 (이미 충전 중이 아니라면)
            if (lives === 6) lastLifeUpdate = Date.now();
        }
    } else {
        console.log("Life reduction skipped: Event Level.");
    }

    savePlayerData();
    updateLivesUI();

    // UI 업데이트
    const groundCredits = document.getElementById('ground-credits-display');
    if (groundCredits) groundCredits.innerText = `${totalCredits}C`;
    if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;
    const totalEl = document.getElementById('accumulated-total-credits');
    if (totalEl) totalEl.innerText = totalCredits;
    clearDroppedItems(); // 실패 시 배치된 아이템 소모 (삭제)

    if (lives < 0) {
        // All lives lost logic
        const now = Date.now();
        const nextRegenTime = lastLifeUpdate + (5 * 60 * 1000);
        const waitMs = nextRegenTime - now;
        const waitMin = Math.ceil(waitMs / 60000);

        alert(`모든 생명을 잃었습니다! 1개가 충전될 때까지 약 ${waitMin}분 기다려야 합니다.`);

        // 생명 0개 상태로 유지하고 게임 시작 방지 로직 필요시 추가
        lives = 0;
        savePlayerData();
        location.reload();
        return;
    }
    // bgmAudio.pause(); // BGM은 중단 없이 계속 재생되도록 주석 처리

    // 폭발 효과
    balloon.classList.add('explosion');
    gameContainer.classList.add('shake');

    // 버튼 회색으로 변경 (과열 상태)
    mainActionBtn.classList.add('overheated');
    mainActionBtn.innerText = msg;

    // 폭발 사운드
    soundMgr.play('explosion');

    // 실패 사유 말풍선 표시
    if (failReasonBubble) {
        failReasonBubble.innerText = msg;
        // 풍선 위치에 맞춰 말풍선 위치 조정 (ballonX, balloonY 사용)
        // 화면 밖으로 나가지 않도록 Clamp 처리 (좌우 10% 여유)
        let clampedX = Math.min(90, Math.max(10, balloonX));
        failReasonBubble.style.left = `${clampedX}%`;

        // 상단 화면 밖으로 나가지 않도록 처리
        // balloonY가 높을 경우 (약 60% 이상) 말풍선을 아래쪽으로 배치
        if (balloonY > 60) {
            failReasonBubble.style.bottom = `calc(8.05% + ${balloonY * 0.9195}% - 50px)`; // 풍선 아래로
        } else {
            failReasonBubble.style.bottom = `calc(8.05% + ${balloonY * 0.9195}% + 140px)`; // 기존처럼 풍선 위로
        }

        failReasonBubble.classList.remove('hidden');
        setTimeout(() => {
            failReasonBubble.classList.add('hidden');
        }, 500); // 0.5초만 보이게 수정
    }

    setTimeout(() => {
        // 3-second delay passed
        mainActionBtn.classList.remove('overheated');
        mainActionBtn.classList.add('restart-mode');
        mainActionBtn.innerText = 'START';
        gameContainer.classList.remove('shake');

        // 생명이 남아있다면 열기구를 시작 위치(버너 위)에 다시 보이게 함
        if (lives > 0) {
            balloon.classList.remove('explosion');
            balloon.style.opacity = "1";
            balloon.style.transform = "translateX(-50%) scale(1)";

            // 시작 위치로 살짝 이동 (resetGame의 로직 반영)
            balloonX = 50;
            const config = LEVEL_CONFIGS[currentLevel];
            if (config.displayName === "EVENT 2" || config.displayName === "EVENT 4") {
                const skyHeight = gameContainer.clientHeight * 0.9195;
                const platformY = config.platformY;
                const pixelOffset = 12 - 50;
                const targetYBottom = (100 / 7) * platformY + (pixelOffset / skyHeight) * 100;
                const platformHeightPercentage = (9 / skyHeight) * 100;
                const targetYTop = targetYBottom + platformHeightPercentage;
                balloonY = targetYTop - getBasketOffset() + 0.1;
            } else {
                balloonY = -getBasketOffset();
            }

            balloon.style.bottom = `calc(8.05% + ${balloonY * 0.9195}%)`;
            balloon.style.left = `${balloonX}%`;
        }

        if (levelHintEl) {

            const displayName = LEVEL_CONFIGS[currentLevel].displayName;
            if (displayName === "5" || displayName === "6" || displayName === "7" || displayName === "8" || displayName === "14" || displayName === "15") {
                levelHintEl.classList.remove('hidden');
            }
        }
    }, 2000); // 2-second wait
    
    // 랭킹에 실패 시 획득한 부분 점수 기록 (주로 이벤트 레벨)
    let failScore = 0;
    if (isEvent2) {
        failScore = Math.floor(cookedPercentage * 2) * 10;
    } else if (config && (config.displayName === "EVENT 1" || config.displayName === "EVENT 3")) {
        failScore = sessionEventCredits;
    } else if (config && config.displayName === "EVENT 4") {
        failScore = event4FishCaughtScore;
    }
    saveLevelBestScore(failScore);
}

function winGame() {
    const isEventLevel = LEVEL_CONFIGS[currentLevel] && LEVEL_CONFIGS[currentLevel].displayName.startsWith("EVENT");
    const isSteakEvent = LEVEL_CONFIGS[currentLevel] && LEVEL_CONFIGS[currentLevel].displayName === "EVENT 2";

    gameState = 'CLEAR';
    attachedFish = null;
    
    // 11~20레벨 클리어 시 바람 방향을 처음 시작 방향(multiplier=1)으로 복구
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") {
        level11WindMultiplier = 1;
        if (showWindLabels) updateWindLabels();
        if (windCountdownEl) windCountdownEl.classList.add('hidden');
    }

    mainActionBtn.innerText = 'START';
    mainActionBtn.classList.remove('burner-mode');
    mainActionBtn.classList.add('restart-mode');

    // 점수 및 보너스 계산
    const now = Date.now();
    const diffSeconds = (now - missionStartTime) / 1000;
    const timeLeft = Math.max(0, currentMaxTime - diffSeconds);

    const platHalfWidth = (100 / 12) / 2;
    const distance = Math.abs(balloonX - targetLineX);
    const ratio = distance / platHalfWidth;
    let landingBonus = 0;
    let bonusText = "";

    if (isSteakEvent) {
        landingBonus = 0;
        bonusText = "STAKE EVENT";
    } else if (ratio <= 0.2) { landingBonus = 50; bonusText = "PERFECT"; }
    else if (ratio <= 0.4) { landingBonus = 40; bonusText = "GREAT"; }
    else if (ratio <= 0.6) { landingBonus = 30; bonusText = "GOOD"; }
    else if (ratio <= 0.8) { landingBonus = 20; bonusText = "NICE"; }
    else { landingBonus = 10; bonusText = "LANDED"; }

    const score = Math.floor(gas) + Math.floor(timeLeft * 10) + landingBonus;

    let itemBonus = 0;
    const currentItemCount = getTotalItemsCount();
    const actualItemsDecreased = Math.max(0, initialItemCount - currentItemCount);

    if (BONUS_G1_LEVELS.includes(currentDisplayName)) {
        // Group 1: 0개 줄면 200점, 1개 이상 줄면 0점
        if (actualItemsDecreased === 0) {
            itemBonus = 200;
        } else {
            itemBonus = 0;
        }
    } else if (BONUS_G2_LEVELS.includes(currentDisplayName)) {
        // Group 2: 0개 줄면 400점, 1개 줄면 200점, 2개 이상 줄면 0점
        if (actualItemsDecreased === 0) {
            itemBonus = 400;
        } else if (actualItemsDecreased === 1) {
            itemBonus = 200;
        } else {
            itemBonus = 0;
        }
    }

    if (itemBonus > 0) {
        // Show bonus text
        setTimeout(() => {
            showFloatingText(`+${itemBonus} (ITEM BONUS)`, "#2ecc71");
        }, 500);
    }

    const isAlreadyCleared = clearedLevels.includes(currentLevel);
    const displayCookedPct = Math.floor(cookedPercentage * 2);
    let finalScore = isSteakEvent ? (displayCookedPct * 10) : (score + itemBonus);

    // 점수창 UI 업데이트 (상세 정보 표시)
    if (isSteakEvent) {
        if (resultScoreEl) resultScoreEl.innerText = finalScore;
        if (resultFormulaEl) {
            resultFormulaEl.innerHTML = `COOKED: ${displayCookedPct}% * 10`;
        }
    } else {
        if (resultScoreEl) resultScoreEl.innerText = isSteakEvent ? (displayCookedPct * 10) : (score + itemBonus);
        if (resultFormulaEl) {
            let formula = `(${Math.floor(gas)} + (${Math.floor(timeLeft)} * 10) + <span style="color: #ffd32a;">${landingBonus}</span>)`;
            if (itemBonus > 0) {
                formula += ` + <span style="color: #2ecc71;">${itemBonus}(ITEM BONUS)</span>`;
            }
            resultFormulaEl.innerHTML = formula;
        }
    }

    let scoreForRank = isSteakEvent ? (displayCookedPct * 10) : (score + itemBonus);

    if (isEventLevel) {
        if (!isAlreadyCleared || canReceiveEventPoints()) {
            if (isSteakEvent) {
                finalScore = (displayCookedPct * 10);
            } else {
                finalScore = score;
            }
        } else {
            finalScore = 0;
        }
        // Removed showEventBonusText call
    } else {
        // 일반 레벨: 최고기록 경신 시에만 (새로운 점수 - 기존 최고기록) 만큼의 크레딧을 추가로 지급
        const oldBest = myLevelBestScores[currentLevel] || 0;
        if (scoreForRank > oldBest) {
            finalScore = scoreForRank - oldBest;
            if (isAlreadyCleared && resultFormulaEl) {
                resultFormulaEl.innerHTML += `<br><span style="color: #ffd32a; font-size: 0.8em;">(신기록 달성! +${finalScore}C 추가 획득)</span>`;
            }
        } else {
            finalScore = 0;
            if (isAlreadyCleared && resultFormulaEl) {
                resultFormulaEl.innerHTML += `<br><span style="color: #666; font-size: 0.7em;">(최고기록 미달성 - 기존: ${oldBest})</span>`;
            }
        }
    }


    // 랭킹용 점수 계산 (클리어 보너스나 누적 점수 포함하여 그 레벨만의 점수 기록)
    if (isEventLevel) {
        // Changed: Removed +200 clear bonus for rank
        const evtName = LEVEL_CONFIGS[currentLevel].displayName;
        if(evtName === "EVENT 1" || evtName === "EVENT 3") scoreForRank += sessionEventCredits;
        if(evtName === "EVENT 4") scoreForRank += event4FishCaughtScore;
    }
    saveLevelBestScore(scoreForRank);

    if (finalScore > 0) {
        totalCredits += finalScore;
    }

    if (!isAlreadyCleared) {
        clearedLevels.push(currentLevel);
    }

    savePlayerData();

    // 점수 합산 정보 업데이트
    const totalEl = document.getElementById('accumulated-total-credits');
    if (totalEl) totalEl.innerText = totalCredits;
    const groundCredits = document.getElementById('ground-credits-display');
    if (groundCredits) groundCredits.innerText = `${totalCredits}C`;
    if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;

    // currentDisplayName already defined above
    if (clearTitleEl) clearTitleEl.innerText = currentDisplayName.startsWith("EVENT") ? "EVENT LEVEL CLEAR!" : `LEVEL-${currentDisplayName} CLEAR`;

    if (currentDisplayName.startsWith("EVENT") && !isSteakEvent) {
        console.log("Event Level Cleared: Score stored quietly.");
    } else {
        if (eventClearScreen) eventClearScreen.classList.add('hidden'); // 이벤트 결과창과 겹침 방지
        clearScreen.classList.remove('hidden'); // 클리어 여부 상관없이 점수판 노출
    }

    updateNextLevelButtonVisibility();

    soundMgr.play('success');

}

function createParticles() {
    const particlesPerZone = 5; // 구역당 5개씩 균일하게 생성
    for (let zoneId = 1; zoneId <= 7; zoneId++) {
        const zone = document.getElementById(`zone-${zoneId}`);
        if (!zone) continue;

        for (let i = 0; i < particlesPerZone; i++) {
            const p = document.createElement('div');
            p.className = 'wind-particle';
            zone.appendChild(p);

            const particle = {
                el: p,
                x: Math.random() * 100,
                y: Math.random() * 100,
                zoneIndex: zoneId - 1
            };

            particles.push(particle);
            updateParticlePos(particle);
        }
    }
    animateParticles();
}

function createCoins() {
    clearCoins(); // 기존 코인 제거
    const coinsPerZone = 10; // 구역당 10개

    for (let zoneId = 1; zoneId <= 7; zoneId++) {
        const zone = document.getElementById(`zone-${zoneId}`);
        if (!zone) continue;

        for (let i = 0; i < coinsPerZone; i++) {
            const c = document.createElement('div');
            c.className = 'coin';
            zone.appendChild(c);

            // Spaced out horizontally: 10% to 90%
            const horizontalPos = 10 + (i * (80 / (coinsPerZone - 1)));
            // Fixed vertical position at the center of the zone (50%)
            const verticalPos = 50;

            const coin = {
                el: c,
                x: horizontalPos,
                y: verticalPos,
                zoneIndex: zoneId - 1,
                collected: false
            };

            c.style.left = `${coin.x}%`;
            c.style.bottom = `${coin.y}%`;
            activeCoins.push(coin);
        }
    }
}

function clearCoins() {
    activeCoins.forEach(coin => {
        if (coin.el && coin.el.parentNode) {
            coin.el.remove();
        }
    });
    activeCoins = [];
}

function updateParticlePos(p) {
    p.el.style.left = `${p.x}%`;
    p.el.style.top = `${p.y}%`;
    let currentWind = ZONE_WINDS[p.zoneIndex];
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") currentWind *= level11WindMultiplier;
    currentWind += tempWindBoosts[p.zoneIndex];
    p.el.style.width = `${Math.abs(currentWind) * 5 + 5}px`;
}

function animateParticles(timestamp) {
    if (!timestamp) timestamp = performance.now();
    if (!lastParticleUpdate) lastParticleUpdate = timestamp;
    
    let delta = timestamp - lastParticleUpdate;
    lastParticleUpdate = timestamp;

    if (delta > 100) delta = 100;
    particleAccumulator += delta;

    const targetDelta = 16.66;

    while (particleAccumulator >= targetDelta) {
        particles.forEach(p => {
            let wind = ZONE_WINDS[p.zoneIndex];
            const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
            if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") wind *= level11WindMultiplier;
            wind += tempWindBoosts[p.zoneIndex];
            p.x += wind * 0.12;

            if (p.x > 110) p.x = -10;
            if (p.x < -10) p.x = 110;
        });
        particleAccumulator -= targetDelta;
    }

    // 렌더링은 프레임당 1회
    particles.forEach(p => {
        p.el.style.left = `${p.x}%`;
        
        let wind = ZONE_WINDS[p.zoneIndex];
        const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
        if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") wind *= level11WindMultiplier;
        wind += tempWindBoosts[p.zoneIndex];
        p.el.style.width = `${Math.abs(wind) * 5 + 5}px`;
    });

    requestAnimationFrame(animateParticles);
}


function createStars() {
    const sky = document.getElementById('sky-background');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        const isYellow = Math.random() > 0.7;
        star.style.background = isYellow ? '#fff9c4' : 'white';
        star.style.boxShadow = isYellow ? '0 0 5px rgba(255, 249, 196, 0.8)' : '0 0 3px rgba(255, 255, 255, 0.5)';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        star.style.animationDelay = `${Math.random() * 5}s`;
        sky.appendChild(star);
    }
}

function resetGame() {
    gameState = 'START';
    const config = LEVEL_CONFIGS[currentLevel];

    // Sync winds with config
    for (let i = 0; i < 7; i++) {
        ZONE_WINDS[i] = config.winds[i];
    }
    // Update wind sliders UI if they exist (dev mode)
    document.querySelectorAll('.wind-slider').forEach(slider => {
        const zoneIdx = parseInt(slider.dataset.zone);
        slider.value = ZONE_WINDS[zoneIdx];
        if (slider.nextElementSibling) {
            slider.nextElementSibling.innerText = ZONE_WINDS[zoneIdx].toFixed(2);
        }
    });

    updateWindLabels();

    balloonX = 50;
    targetLineX = 50; // 리셋 시 타겟 라인 위치 초기화

    // EVENT 2: Start on top of the landing pad even before clicking start
    const isSteakEvent = config.displayName === "EVENT 2";
    const isSpecialStart = config.displayName === "EVENT 2" || config.displayName === "EVENT 4";
    if (isSpecialStart) {
        const skyHeight = gameContainer.clientHeight * 0.9195;
        const platformY = config.platformY;
        const pixelOffset = 12 - 50; // Use same adjusted offset as in handleMovement
        const targetYBottom = (100 / 7) * platformY + (pixelOffset / skyHeight) * 100;
        const platformHeightPercentage = (9 / skyHeight) * 100;
        const targetYTop = targetYBottom + platformHeightPercentage;
        balloonY = targetYTop - getBasketOffset() + 0.1;
    } else {
        balloonY = -getBasketOffset();
    }

    velX = 0;
    velY = 0;
    isBurning = false;
    hasEnteredZone7 = false;
    // 아이템 효과는 이제 인벤토리에서 직접 사용할 때만 발동되므로
    // 시작 시에는 기본 설정값만 사용합니다.
    currentMaxGas = config.maxGas;
    currentMaxTime = config.maxTime;
    gas = currentMaxGas;
    sessionItemsUsed = 0;
    level11WindMultiplier = 1;
    if (windCountdownEl) windCountdownEl.classList.add('hidden');

    if (gasFillEl) gasFillEl.style.width = "100%";
    if (timeFillEl) timeFillEl.style.width = "100%";
    if (gasTextEl) gasTextEl.innerText = currentMaxGas;
    if (timeTextEl) timeTextEl.innerText = currentMaxTime;
    if (gasValEl) gasValEl.innerText = "0";
    if (timeValEl) timeValEl.innerText = "0";

    // Update Level Indicator
    if (levelIndicator) {
        const displayName = config.displayName;
        levelIndicator.innerText = (displayName.startsWith("EVENT")) ? displayName : `LV-${displayName}`;
    }
    updateTargetLine();

    // EVENT 2 전용: 스테이크 굽기 연출
    if (isSteakEvent) {
        steakContainer.classList.remove('hidden');
        initSteakCanvas();
    } else {
        steakContainer.classList.add('hidden');
    }

    // EVENT 3 전용: 옥수수 표시
    if (config.displayName === "EVENT 3") {
        if (cornContainer) cornContainer.classList.remove('hidden');
    } else {
        if (cornContainer) cornContainer.classList.add('hidden');
    }

    console.log(`Resetting to Level ${currentLevel}`);
    savePlayerData();

    if (lives <= 0) {
        balloon.style.opacity = "0";
    } else {
        balloon.classList.remove('explosion');
        balloon.style.opacity = "1";
        balloon.style.transform = "translateX(-50%) scale(1)";
    }

    mainActionBtn.style.setProperty('--fill', '0%');
    mainActionBtn.classList.remove('overheated', 'burner-mode');
    mainActionBtn.classList.add('restart-mode');
    const currentDisplayName = config.displayName;
    mainActionBtn.innerText = currentLevel === 0 ? 'START' : (currentDisplayName.startsWith("EVENT") ? 'START EVENT LEVEL' : `START LEVEL ${currentDisplayName}`);
    clearScreen.classList.add('hidden');
    failScreen.classList.add('hidden');
    if (failReasonBubble) failReasonBubble.classList.add('hidden');
    updateNextLevelButtonVisibility();

    // EVENT LEVEL 특수 기믹: 코인 생성 및 UI 처리
    if (LEVEL_CONFIGS[currentLevel].displayName === "EVENT 1") {
        createCoins();
        sessionEventCredits = 0;
        if (eventCreditsValEl) eventCreditsValEl.innerText = "0";
        if (eventCounterEl) {
            eventCounterEl.classList.remove('hidden');
            // Reset to default icon for EVENT 1
            const coinIcon = eventCounterEl.querySelector('img');
            if (coinIcon) coinIcon.style.display = 'inline-block';
        }
    } else if (config.displayName === "EVENT 3") {
        clearCoins();
        if (eventCounterEl) {
            eventCounterEl.classList.remove('hidden');
            const coinIcon = eventCounterEl.querySelector('img');
            if (coinIcon) coinIcon.style.display = 'inline-block';
        }
        if (event2FloatingScore) event2FloatingScore.classList.add('hidden');
        if (event3FloatingScore) {
            event3FloatingScore.classList.remove('hidden');
            if (event3PopcornScore) event3PopcornScore.innerText = "0";
        }
        sessionEventCredits = 0;
        popcornGatheredScore = 0;
        if (eventCreditsValEl) eventCreditsValEl.innerText = "0";
        if (popcornDepositTimer) {
            clearTimeout(popcornDepositTimer);
            popcornDepositTimer = null;
        }
    } else if (config.displayName === "EVENT 2") {
        clearCoins();
        if (eventCounterEl) eventCounterEl.classList.add('hidden');
        if (event2FloatingScore) {
            event2FloatingScore.classList.remove('hidden');
            if (event2CookedPctEl) event2CookedPctEl.innerText = "COOKED: 0%";
            if (event2CookedScoreEl) event2CookedScoreEl.innerText = "0";
        }
    } else {
        clearCoins();
        if (eventCounterEl) eventCounterEl.classList.add('hidden');
        if (event2FloatingScore) event2FloatingScore.classList.add('hidden');
        if (event3FloatingScore) event3FloatingScore.classList.add('hidden');
        if (event4FloatingScore) event4FloatingScore.classList.add('hidden');
    }

    // EVENT 4: 바다 표현 및 낚싯대 추가
    if (config.displayName === "EVENT 4") {
        if (seaOverlayEl) seaOverlayEl.classList.remove('hidden');
        if (fishingGearEl) fishingGearEl.classList.remove('hidden');
        if (event4FloatingScore) {
            event4FloatingScore.classList.remove('hidden');
            if (event4FishScore) event4FishScore.innerText = "0";
        }
        event4FishCaughtScore = 0;
        createFish();
    } else {
        if (seaOverlayEl) seaOverlayEl.classList.add('hidden');
        if (fishingGearEl) fishingGearEl.classList.add('hidden');
        clearFish();
    }
    attachedFish = null;

    // Clear accumulated popcorn
    document.querySelectorAll('.settled-popcorn').forEach(p => p.remove());
    settledPopcornItems = [];

    if (levelHintEl) {
        levelHintEl.classList.remove('level-8-hint');
        const displayName = config.displayName;
        if (BONUS_G1_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = `Use 1 item or less`;
            levelHintEl.classList.remove('hidden');
        } else if (BONUS_G2_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = `Use 2 items or less`;
            levelHintEl.classList.remove('hidden');
        } else if (displayName === "EVENT 3") {
            levelHintEl.innerHTML = `Use 2 items`;
            levelHintEl.classList.remove('hidden');
        } else {
            levelHintEl.classList.add('hidden');
        }

        // Position level-hint at the bottom center of Zone 2
        if (!levelHintEl.classList.contains('hidden')) {
            levelHintEl.style.top = 'auto';
            levelHintEl.style.bottom = `calc(8.05% + (91.95% / 7) + 10px)`; // Bottom of Zone 2
            levelHintEl.style.transform = 'translateX(-50%)';
            levelHintEl.style.left = '50%';
            levelHintEl.style.width = '100.0%';
            levelHintEl.style.textAlign = 'center';
            levelHintEl.style.position = 'absolute';
        }
    }
}


function initSteakCanvas() {
    if (!isSteakLoaded || !steakCanvas) return;

    const containerRect = steakContainer.getBoundingClientRect();
    const maxWidth = containerRect.width * 0.8;
    const maxHeight = containerRect.height * 0.6;

    const imgRatio = steak1Img.width / steak1Img.height || 1.5;
    let canvasWidth = maxWidth;
    let canvasHeight = maxWidth / imgRatio;

    if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = maxHeight * imgRatio;
    }

    steakCanvas.width = canvasWidth;
    steakCanvas.height = canvasHeight;
    steakMaskCanvas.width = canvasWidth;
    steakMaskCanvas.height = canvasHeight;

    steakMaskCtx.fillStyle = 'black';
    steakMaskCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    cookedPercentage = 0;
    renderSteak();
}

function renderSteak() {
    if (!steakCtx) return;

    steakCtx.clearRect(0, 0, steakCanvas.width, steakCanvas.height);
    steakCtx.drawImage(steak2Img, 0, 0, steakCanvas.width, steakCanvas.height);

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = steakCanvas.width;
    tempCanvas.height = steakCanvas.height;
    let tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(steak1Img, 0, 0, steakCanvas.width, steakCanvas.height);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(steakMaskCanvas, 0, 0, steakCanvas.width, steakCanvas.height);

    steakCtx.drawImage(tempCanvas, 0, 0);
}

function updateSteakCooking() {
    const displayName = LEVEL_CONFIGS[currentLevel].displayName;
    if (gameState !== 'PLAY' || !isBurning || displayName !== "EVENT 2") return;
    if (!steakCanvas) return;

    const rect = steakCanvas.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();
    const flameX = balloonRect.left + balloonRect.width / 2;
    const flameY = balloonRect.bottom - (balloonRect.height * 0.1);

    const canvasX = ((flameX - rect.left) / rect.width) * steakCanvas.width;
    const canvasY = ((flameY - rect.top) / rect.height) * steakCanvas.height;

    steakMaskCtx.globalCompositeOperation = 'destination-out';
    steakMaskCtx.beginPath();
    steakMaskCtx.arc(canvasX, canvasY, 17.5, 0, Math.PI * 2);
    steakMaskCtx.fill();
    steakMaskCtx.globalCompositeOperation = 'source-over';

    renderSteak();
    calculateCookedPercentage();
}

function calculateCookedPercentage() {
    if (!steakMaskCtx) return;
    const imageData = steakMaskCtx.getImageData(0, 0, steakMaskCanvas.width, steakMaskCanvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentCount++;
    }

    cookedPercentage = (transparentCount / (steakMaskCanvas.width * steakMaskCanvas.height)) * 100;

    // 실시간 UI 업데이트
    const displayName = LEVEL_CONFIGS[currentLevel].displayName;
    if (displayName === "EVENT 2") {
        const displayPct = Math.floor(cookedPercentage * 2);

        // 새로운 플로팅 점수판 업데이트
        if (event2CookedPctEl) event2CookedPctEl.innerText = `COOKED: ${displayPct}%`;
        if (event2CookedScoreEl) event2CookedScoreEl.innerText = displayPct * 10;
    }
}

let lastPopTime = 0;
function updateCornPopping() {
    const displayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (gameState !== 'PLAY' || displayName !== "EVENT 3") return;

    // Check collisions with settled popcorn
    if (gameState === 'PLAY') checkPopcornCollisions();

    if (!isBurning) return;
    if (!cornContainer) return;

    const rect = cornContainer.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();

    // Flame position (bottom center of the balloon)
    const flameX = balloonRect.left + balloonRect.width / 2;
    const flameY = balloonRect.bottom;

    // Check if flame is hitting the corn area
    const cornImg = document.getElementById('corn-img');
    if (!cornImg) return;
    const cornRect = cornImg.getBoundingClientRect();

    if (flameX >= cornRect.left && flameX <= cornRect.right &&
        flameY >= cornRect.top && flameY <= cornRect.bottom) {

        const now = Date.now();
        if (now - lastPopTime > 150) { // Limit popping frequency
            spawnPopcorn(flameX, flameY);
            lastPopTime = now;
            soundMgr.play('popcorn', false, 0.4);
        }
    }
}

function spawnPopcorn(x, y) {
    const p = document.createElement('img');
    p.src = '팝콘.png';
    p.className = 'popcorn-particle';

    // Convert clientX/Y to gameContainer relative
    const gameRect = gameContainer.getBoundingClientRect();
    const relativeX = ((x - gameRect.left) / gameRect.width) * 100;
    const relativeY = 100 - ((y - gameRect.top) / gameRect.height) * 100;

    p.style.left = `${relativeX}%`;
    p.style.bottom = `${relativeY}%`;
    gameContainer.appendChild(p);

    // Animation: fly up and then down
    const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30 to 30 degrees
    const speed = 3 + Math.random() * 5;
    let vx = Math.sin(angle) * speed * 0.2;
    let vy = (5 + Math.random() * 5) * 0.2;
    const gravity = 0.015;

    let posX = relativeX;
    let posY = (relativeY - 8.05) / 0.9195; // Game Y coordinate

    function animatePop() {
        vy -= gravity;
        posX += vx;
        posY += vy;

        // Bounce off walls (0% and 100%)
        if (posX <= 2) { // 2% margin for particle width
            posX = 2;
            vx *= -0.6; // Bounce back with some energy loss
        } else if (posX >= 98) { // 98% margin for particle width
            posX = 98;
            vx *= -0.6;
        }

        p.style.left = `${posX}%`;
        p.style.bottom = `calc(8.05% + ${posY * 0.9195}%)`;

        // If popcorn hits the ground (posY <= 0)
        if (posY <= 0) {
            const randomHeightOffset = Math.random() * 10 - 5; // -5px to +5px variance
            const randomRotation = Math.random() * 360;

            p.style.bottom = `calc(8.05% - 20px + ${randomHeightOffset}px)`;
            p.style.transform = `rotate(${randomRotation}deg)`;
            p.classList.add('settled-popcorn');

            // Track settled popcorn with its coordinates for collision
            settledPopcornItems.push({
                el: p,
                x: posX,
                y: 8.05 + posY * 0.9195, // Effective bottom % position
                collected: false
            });
            return;
        }

        if (posY > -20) { // Keep animating until it hits ground or falls far below
            requestAnimationFrame(animatePop);
        } else {
            p.remove();
        }
    }
    requestAnimationFrame(animatePop);
}

let settledPopcornItems = []; // Track actual objects for better performance
function checkPopcornCollisions() {
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const skyWidth = gameContainer.clientWidth;

    // Use balloon marker (blue dot) for precise collision
    const markerXPx = (balloonX / 100) * skyWidth;
    const markerYPx = ((balloonY + getMarkerOffset()) / 100) * skyHeight;
    const markerXPct = (markerXPx / skyWidth) * 100;
    const markerYPct = (markerYPx / skyHeight) * 100;

    // Even smaller radius for marker (approx 10px)
    const markerRadiusPct = (10 / skyWidth) * 100;

    for (let i = settledPopcornItems.length - 1; i >= 0; i--) {
        const pop = settledPopcornItems[i];
        if (pop.collected) continue;

        // Even tighter popcorn hitbox (approx 16px diameter)
        const popRadiusPct = (8 / skyWidth) * 100; // 16px / 2

        const dx = markerXPct - pop.x;
        const dy = markerYPct - pop.y;
        const distSq = dx * dx + dy * dy;
        const combinedRadiusPct = markerRadiusPct + popRadiusPct;

        if (distSq < combinedRadiusPct * combinedRadiusPct) {
            pop.collected = true;

            // Floating +20 text
            const plusText = document.createElement('div');
            plusText.className = 'popcorn-plus-text';
            plusText.innerText = '+20';
            plusText.style.left = `${pop.x}%`;
            plusText.style.bottom = `${pop.y}%`;
            gameContainer.appendChild(plusText);
            setTimeout(() => plusText.remove(), 800);

            // Visual effect - Much slower removal to match transition
            pop.el.classList.add('item-collected');
            setTimeout(() => pop.el.remove(), 2000);
            settledPopcornItems.splice(i, 1);

            // Add to temporary gathered bucket
            popcornGatheredScore += 20;
            if (event3PopcornScore) {
                event3PopcornScore.innerText = sessionEventCredits + popcornGatheredScore;
                event3PopcornScore.classList.remove('score-pulse');
                void event3PopcornScore.offsetWidth;
                event3PopcornScore.classList.add('score-pulse');
            }

            // Reset deposit timer
            if (popcornDepositTimer) clearTimeout(popcornDepositTimer);
            popcornDepositTimer = setTimeout(depositPopcornCredits, 1000);

            soundMgr.play('coin', false, 0.4);
        }
    }
}

function depositPopcornCredits() {
    if (popcornGatheredScore === 0) return;

    // Add credits to session and total
    sessionEventCredits += popcornGatheredScore;
    const isAlreadyCleared = clearedLevels.includes(currentLevel);
    if (!isAlreadyCleared || canReceiveEventPoints()) {
        totalCredits += popcornGatheredScore;
    }

    // Update UI
    if (eventCreditsValEl) {
        eventCreditsValEl.innerText = sessionEventCredits;
        // Sparkle effect
        eventCreditsValEl.classList.remove('credit-sparkle');
        void eventCreditsValEl.offsetWidth;
        eventCreditsValEl.classList.add('credit-sparkle');
    }

    if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;
    const groundCredits = document.getElementById('ground-credits-display');
    if (groundCredits) groundCredits.innerText = `${totalCredits}C`;

    // Keep showing cumulative total instead of resetting to 0
    if (event3PopcornScore) event3PopcornScore.innerText = sessionEventCredits;

    popcornGatheredScore = 0;
    popcornDepositTimer = null;

    savePlayerData();
}

function updateWindLabels() {
    const zoneHeight = 100 / 7;
    windLabels.forEach(label => {
        const zoneIdx = parseInt(label.dataset.zone);

        let currentWind = ZONE_WINDS[zoneIdx];
        const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
        if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3") currentWind *= level11WindMultiplier;
        currentWind += tempWindBoosts[zoneIdx];

        let displayWind = currentWind;
        const absWind = Math.abs(currentWind);
        const frac = parseFloat((absWind % 1).toFixed(2));

        if (frac === 0.75) {
            // 0.75 단위는 0.25 더함
            displayWind = (currentWind > 0) ? currentWind + 0.25 : currentWind - 0.25;
        } else if (frac === 0.25) {
            // 0.25 단위는 0.25 뺌
            displayWind = (currentWind > 0) ? currentWind - 0.25 : currentWind + 0.25;
        }

        label.innerText = `${displayWind.toFixed(2)}m/s`;
    });
}

function createFish() {
    clearFish();
    const config = LEVEL_CONFIGS[currentLevel];
    if (config.displayName !== "EVENT 4") return;

    for (let type = 1; type <= 5; type++) {
        let count = 2;
        if (type === 1) count = 1;
        else if (type === 3) count = 3;
        else if (type >= 4) count = 4;

        for (let i = 0; i < count; i++) {
            const fishEl = document.createElement('img');
            fishEl.src = `물고기${type}.png`;
            fishEl.className = 'fish';
            // 초기 위치 및 스타일 설정
            fishEl.style.position = 'absolute';
            
            let fishSize = 70;
            if (type === 1) fishSize = 70 * 1.56; // 1.3 * 1.2
            else if (type === 2) fishSize = 70 * 1.15; // 1.0 * 1.15
            else if (type === 3) fishSize = 70 * 0.8;
            else if (type === 4) fishSize = 70 * 0.75;
            else if (type === 5) fishSize = 70 * 0.7;

            fishEl.style.width = `${fishSize}px`;
            fishEl.style.height = `${fishSize}px`;
            fishEl.style.objectFit = 'contain';
            fishEl.style.zIndex = '2';
            fishEl.style.pointerEvents = 'none';
            // fishEl.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'; 
            
            gameContainer.appendChild(fishEl);

            const fishHeightPct = (fishSize / (gameContainer.clientHeight * 0.9195)) * 100;
            const maxSurface = (100 / 7) * 2.5; // 3구역 중간 (약 35.7%)
            const maxBodyY = maxSurface - fishHeightPct;

            const fish = {
                el: fishEl,
                x: Math.random() * 90 + 5, // 5% to 95%
                y: Math.random() * maxBodyY, 
                baseY: 0,
                heightPct: fishHeightPct,
                swimOffset: Math.random() * Math.PI * 2,
                velX: (Math.random() * 0.15 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
                type: type
            };
            fish.baseY = fish.y;
            activeFish.push(fish);
        }
    }
}

function updateFish() {
    const now = Date.now();
    activeFish.forEach(fish => {
        let currentY;
        let flip;

        if (fish === attachedFish) {
            if (fish.type === 1) {
                // 물고기1은 미끼를 끌고 다님 (정상 이동 루틴 유지)
                fish.x += fish.velX;
                if (fish.x < 2 || fish.x > 98) {
                    fish.velX *= -1;
                }
                const bob = Math.sin(now * 0.0015 + fish.swimOffset) * 1.5; 
                currentY = fish.baseY + bob;
                
                const maxSurface = (100 / 7) * 2.5;
                const maxBodyY = maxSurface - fish.heightPct;
                currentY = Math.max(0, Math.min(maxBodyY, currentY));
                
                // 열기구를 물고기 위치에 맞춰 이동 (미끼 오프셋 고려)
                balloonX = fish.x - draggingOffset.x;
                balloonY = currentY - draggingOffset.y;
                
                flip = fish.velX > 0 ? 'scaleX(-1)' : 'scaleX(1)';
                fish.el.style.zIndex = "10";
            } else {
                const baitEl = document.querySelector('.fishing-bait');
                if (baitEl) {
                    const gameRect = gameContainer.getBoundingClientRect();
                    const baitRect = baitEl.getBoundingClientRect();
                    const centerX = baitRect.left + baitRect.width/2;
                    const centerY = baitRect.top + baitRect.height/2;
                    
                    fish.x = (centerX - gameRect.left) / gameRect.width * 100;
                    const skyHeight = gameRect.height * 0.9195;
                    const yPxFromBottom = gameRect.bottom - centerY - (gameRect.height * 0.0805);
                    fish.y = (yPxFromBottom / skyHeight) * 100;
                }
                currentY = fish.y;

                // 일반 물고기도 낚인 상태에서 수면 위로 못 올라오게 제한
                const maxSurface = (100 / 7) * 2.5;
                const maxBodyY = maxSurface - fish.heightPct;
                currentY = Math.max(0, Math.min(maxBodyY, currentY));

                const wiggle = Math.sin(now * 0.01) * 10;
                flip = `scaleX(1) rotate(${90 + wiggle}deg)`;
                fish.el.style.zIndex = "10";
            }
        } else {
            fish.x += fish.velX;
            if (fish.x < 2 || fish.x > 98) {
                fish.velX *= -1;
            }
            const bob = Math.sin(now * 0.0015 + fish.swimOffset) * 1.5; 
            currentY = fish.baseY + bob;
            
            // 수면 높이 제한 적용 (물고기 머리가 3구역 중간을 넘지 않게)
            const maxSurface = (100 / 7) * 2.5;
            const maxBodyY = maxSurface - (fish.heightPct || 0);
            currentY = Math.max(0, Math.min(maxBodyY, currentY));
            flip = fish.velX > 0 ? 'scaleX(-1)' : 'scaleX(1)';
            fish.el.style.zIndex = "2";
        }
        
        fish.el.style.left = `${fish.x}%`;
        fish.el.style.bottom = `calc(8.05% + ${currentY * 0.9195}%)`;
        fish.el.style.transform = `translateX(-50%) ${flip}`;
    });
}

function checkFishing() {
    if (gameState !== 'PLAY') return;
    if (Date.now() - missionStartTime < 1000) return;
    if (LEVEL_CONFIGS[currentLevel].displayName !== "EVENT 4") return;

    const baitEl = document.querySelector('.fishing-bait');
    if (!baitEl) return;
    const baitRect = baitEl.getBoundingClientRect();

    if (attachedFish) {
        if (attachedFish.type === 1) return; // 물고기1은 안 잡힘

        if (isBurning && continuousBurnStartTime !== 0) {
            let catchThreshold = 500; // 기본 (물고기 2: 0.5초)
            if (attachedFish.type === 3) catchThreshold = 400;      // 물고기 3: 0.4초
            else if (attachedFish.type === 4) catchThreshold = 300; // 물고기 4: 0.3초
            else if (attachedFish.type === 5) catchThreshold = 200; // 물고기 5: 0.2초

            if (Date.now() - continuousBurnStartTime >= catchThreshold) {
                catchFish(attachedFish);
            }
        }
    } else {
        const baitCenterX = baitRect.left + baitRect.width / 2;
        const baitCenterY = baitRect.top + baitRect.height / 2;

        for (let fish of activeFish) {
            if (fish.caught) continue;
            const fishRect = fish.el.getBoundingClientRect();
            const fishCenterX = fishRect.left + fishRect.width / 2;
            const fishCenterY = fishRect.top + fishRect.height / 2;

            const dx = baitCenterX - fishCenterX;
            const dy = baitCenterY - fishCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < fishRect.width * 0.35) {
                // 미끼에 닿은 상태에서 버너를 눌러야 낚임
                if (isBurning) {
                    attachedFish = fish;
                    if (fish.type === 1) {
                        draggingOffset = getBaitOffset();
                    }
                    break;
                }
            }
        }
    }
}

function getBaitOffset() {
    const baitEl = document.querySelector('.fishing-bait');
    if (!baitEl) return { x: 0, y: 0 };
    
    const gameRect = gameContainer.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();
    const baitRect = baitEl.getBoundingClientRect();
    
    const skyHeight = gameRect.height * 0.9195;
    
    // Balloon position in % (center)
    const bCenterX = balloonRect.left + balloonRect.width / 2;
    const bCenterY = balloonRect.top + balloonRect.height / 2;
    
    // Bait center
    const btCenterX = baitRect.left + baitRect.width / 2;
    const btCenterY = baitRect.top + baitRect.height / 2;
    
    return {
        x: (btCenterX - bCenterX) / gameRect.width * 100,
        y: (bCenterY - btCenterY) / skyHeight * 100
    };
}

function catchFish(fish) {
    fish.caught = true;
    attachedFish = null;
    
    // 점수 계산 (요청하신 대로 타입별 차등)
    let points = 50;
    if (fish.type === 2) points = 200;
    else if (fish.type === 3 || fish.type === 4) points = 100;
    else if (fish.type === 5) points = 50;
    
    event4FishCaughtScore += points;
    
    const isAlreadyCleared = clearedLevels.includes(currentLevel);
    if (!isAlreadyCleared || canReceiveEventPoints()) {
        totalCredits += points;
    }
    savePlayerData();
    
    // 상단 플로팅 스코어 업데이트
    if (event4FishScore) {
        event4FishScore.innerText = event4FishCaughtScore;
        event4FishScore.style.transform = "scale(1.3)";
        setTimeout(() => { event4FishScore.style.transform = "scale(1)"; }, 200);
    }
    
    // 효과음 및 애니메이션
    soundMgr.play('coin');
    fish.el.classList.add('item-collected');
    
    // 플로팅 텍스트
    const plusText = document.createElement('div');
    plusText.className = 'popcorn-plus-text';
    plusText.innerText = `+${points}`;
    plusText.style.left = `${fish.x}%`;
    plusText.style.bottom = fish.el.style.bottom;
    gameContainer.appendChild(plusText);
    setTimeout(() => plusText.remove(), 1000);
    
    setTimeout(() => {
        const idx = activeFish.indexOf(fish);
        if (idx > -1) activeFish.splice(idx, 1);
        fish.el.remove();
    }, 500);
}

function clearFish() {
    activeFish.forEach(fish => {
        if (fish.el && fish.el.parentNode) {
            fish.el.remove();
        }
    });
    activeFish = [];
}

function updateNextLevelButtonVisibility() {
    const isEventLevel = LEVEL_CONFIGS[currentLevel]?.displayName?.startsWith("EVENT");
    if (gameState === 'PLAY' && !isEventLevel) {
        if (nextLevelBtn) nextLevelBtn.classList.add('hidden');
        if (prevLevelBtn) prevLevelBtn.classList.add('hidden');
        return;
    }

    if (nextLevelBtn) {
        const nextLv = currentLevel + 1;
        const isCurrentCleared = clearedLevels.includes(currentLevel);
        const isNextExists = !!LEVEL_CONFIGS[nextLv];
        const isNextCleared = clearedLevels.includes(nextLv);

        // 표시 조건: 다음 레벨이 존재하고 (현재 레벨 클리어 OR 다음 레벨이 이미 클리어된 상태 OR 방금 클리어 OR 현재 또는 다음이 이벤트 레벨)
        const isNextEventLevel = LEVEL_CONFIGS[nextLv]?.displayName?.startsWith("EVENT");
        if (isNextExists && (isCurrentCleared || isNextCleared || gameState === 'CLEAR' || isEventLevel || isNextEventLevel)) {
            nextLevelBtn.classList.remove('hidden');
        } else {
            nextLevelBtn.classList.add('hidden');
        }
    }

    if (prevLevelBtn) {
        const prevLv = currentLevel - 1;
        // 이전 레벨이 존재하면 뒤로 가기 버튼 노출 (클리어 여부와 상관없이 뒤로 가기는 상시 허용)
        if (LEVEL_CONFIGS[prevLv] !== undefined) {
            prevLevelBtn.classList.remove('hidden');
        } else {
            prevLevelBtn.classList.add('hidden');
        }
    }
}


function updateLivesUI() {
    checkLifeRegen(); // UI 업데이트 전 리젠 확인
    if (livesCountEl) {
        livesCountEl.innerText = `x${Math.max(0, lives - 1)}`;
    }
}

function checkLifeRegen() {
    if (lives >= 7) {
        lastLifeUpdate = Date.now();
        return;
    }

    const now = Date.now();
    const regenInterval = 5 * 60 * 1000; // 5분
    const elapsed = now - lastLifeUpdate;

    if (elapsed >= regenInterval) {
        const oldLives = lives;
        const recoverAmount = Math.floor(elapsed / regenInterval);
        lives = Math.min(7, lives + recoverAmount);
        lastLifeUpdate += recoverAmount * regenInterval;
        savePlayerData();
        updateLivesUI();
        triggerLifeSparkle();
        console.log(`Life regenerated: +${recoverAmount} lives`);

        if (oldLives === 0 && lives > 0) {
            // 생명이 0에서 1 이상으로 회복되었을 때 열기구 표시
            balloon.style.opacity = "1";
            balloon.classList.remove('explosion');
            balloon.style.transform = "translateX(-50%) scale(1)";
            balloonY = -getBasketOffset();
            balloonX = 50;
            balloon.style.bottom = `calc(8.05% + ${balloonY * 0.9195}%)`;
            balloon.style.left = `${balloonX}%`;
        }
    }
}

// 1분마다 생명 회복 체크
setInterval(checkLifeRegen, 60000);

// Set initial state
resetGame();
init();
updateLivesUI();
savePlayerData(); // Initial ground credits UI update


// --- Settings Management ---
function updateSettingsUI() {
    if (windToggleSettingsBtn) {
        windToggleSettingsBtn.classList.toggle('active', showWindLabels);
        windToggleSettingsBtn.innerText = showWindLabels ? 'ON' : 'OFF';
    }
    if (musicToggleSettingsBtn) {
        musicToggleSettingsBtn.classList.toggle('active', isMusicEnabled);
        musicToggleSettingsBtn.innerText = isMusicEnabled ? 'ON' : 'OFF';
    }
}

// showEventBonusText function removed as requested

function showFloatingText(text, color = "#ffd32a") {
    const bonusEl = document.createElement('div');
    bonusEl.className = 'bonus-float-text';
    bonusEl.innerText = text;
    if (color) bonusEl.style.color = color;

    // Position near the top center
    bonusEl.style.left = `50%`;
    bonusEl.style.bottom = `60%`;
    bonusEl.style.transform = `translateX(-50%)`;

    gameContainer.appendChild(bonusEl);

    // Fade out and remove
    setTimeout(() => {
        bonusEl.remove();
    }, 2000);
}

function showAd() {
    if (adOverlay) {
        adOverlay.classList.remove('hidden');
        const timerEl = adOverlay.querySelector('.ad-timer');
        let timeLeft = 20;

        if (timerEl) timerEl.innerText = timeLeft;

        const countdown = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(countdown);
                if (timerEl) timerEl.classList.add('hidden');
                if (getLifeAdBtn) getLifeAdBtn.classList.remove('hidden');
            }
        }, 1000);
    }
}

if (getLifeAdBtn) {
    getLifeAdBtn.addEventListener('click', () => {
        if (adOverlay) adOverlay.classList.add('hidden');
        if (getLifeAdBtn) getLifeAdBtn.classList.add('hidden');
        // Reset ad UI for next time
        const timerEl = adOverlay.querySelector('.ad-timer');
        if (timerEl) {
            timerEl.classList.remove('hidden');
            timerEl.innerText = "20";
        }

        // Reward: 2 lives (max 7)
        lives = Math.min(7, lives + 2);
        savePlayerData();
        updateLivesUI();
        triggerLifeSparkle();

        // Play life soundEffect
        if (soundMgr) {
            soundMgr.resume();
            soundMgr.play('life');
        }

        // If the balloon was hidden due to no lives, show it
        if (lives > 0 && balloon.style.opacity === "0") {
            balloon.style.opacity = "1";
            balloon.classList.remove('explosion');
            balloon.style.transform = "translateX(-50%) scale(1)";
            balloonY = -getBasketOffset();
            balloonX = 50;
            balloon.style.bottom = `calc(8.05% + ${balloonY * 0.9195}%)`;
            balloon.style.left = `${balloonX}%`;
        }
    });
}
function triggerLifeSparkle() {
    if (lifeBalloonIcon) {
        lifeBalloonIcon.classList.remove('sparkle-effect');
        void lifeBalloonIcon.offsetWidth; // Force reflow
        lifeBalloonIcon.classList.add('sparkle-effect');

        setTimeout(() => {
            lifeBalloonIcon.classList.remove('sparkle-effect');
        }, 1200);
    }
}

if (adsBtn) {
    adsBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!settingsScreen.classList.contains('hidden')) return;
        if (!isSoundPreloaded) await startSoundSystem();
        soundMgr.resume();
        if (lives >= 7) {
            alert("생명이 이미 가득 찼습니다! (최대 7개)");
            return;
        }
        showAd();
    });
}

function getDummyLeaderboard() {
    return [];
}

let currentRankMode = 'level'; // 'level' or 'overall'

async function updateRankUI() {
    if(rankListEl) rankListEl.innerHTML = '<div style="text-align:center; padding:10px; color:#2ecc71;">Loading ranking...</div>';
    let board = [];
    try {
        const querySnapshot = await db.collection("leaderboard").get();
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure necessary fields exist to avoid crashes
            if (data && data.nickname) {
                if (!data.levelScores) data.levelScores = {};
                if (typeof data.overallScore !== 'number') data.overallScore = 0;
                board.push(data);
            }
        });
        // Cache the successful fetch
        localStorage.setItem('balloon_leaderboard_profiles', JSON.stringify(board));
    } catch (error) {
        console.error("서버에서 랭킹을 불러오는데 실패했습니다.", error);
        let localBoard = JSON.parse(localStorage.getItem('balloon_leaderboard_profiles'));
        if (localBoard && Array.isArray(localBoard)) board = localBoard;
    }

    const dummyNames = ["CloudKing", "SkyRider", "AeroMaster", "WindWalker", "BalloonPro", "StormChaser"];
    board = board.filter(user => !dummyNames.includes(user.nickname));

    const rankScoreLabelEl = document.getElementById('rank-score-label');
    const tabLevelBtn = document.getElementById('tab-level');
    const tabOverallBtn = document.getElementById('tab-overall');

    let myDisplayScore = 0;
    
    if (currentRankMode === 'level') {
        const config = LEVEL_CONFIGS[currentLevel];
        const dispName = config ? config.displayName : currentLevel;
        if (dispName.toString().includes('EVENT') || dispName === "튜토리얼" || currentLevel === 0) {
            if(rankScoreLabelEl) rankScoreLabelEl.innerText = `[LV-${dispName}] 랭킹 제외 레벨`;
            if(myRankScoreEl) myRankScoreEl.innerText = '-';
            if(myRankPosEl) myRankPosEl.innerText = '-';
            if(rankListEl) rankListEl.innerHTML = '<div style="text-align:center; padding:20px; color:#ccc;">튜토리얼 및 이벤트 레벨은 랭킹이 제공되지 않습니다.</div>';
            if (tabLevelBtn) { tabLevelBtn.style.background = '#2ecc71'; tabLevelBtn.style.color = '#000'; }
            if (tabOverallBtn) { tabOverallBtn.style.background = 'transparent'; tabOverallBtn.style.color = '#fff'; }
            return;
        }

        if(rankScoreLabelEl) rankScoreLabelEl.innerText = `[LV-${dispName}] My Score:`;
        myDisplayScore = myLevelBestScores[currentLevel] || 0;
        
        // Sort descending by level score
        board.sort((a,b) => (b.levelScores[currentLevel] || 0) - (a.levelScores[currentLevel] || 0));
        
        if (tabLevelBtn) { tabLevelBtn.style.background = '#2ecc71'; tabLevelBtn.style.color = '#000'; }
        if (tabOverallBtn) { tabOverallBtn.style.background = 'transparent'; tabOverallBtn.style.color = '#fff'; }
    } else {
        if(rankScoreLabelEl) rankScoreLabelEl.innerText = 'Overall My Score:';
        myDisplayScore = calculateMyOverallScore();
        
        // Sort descending by overall score
        board.sort((a,b) => (b.overallScore || 0) - (a.overallScore || 0));
        
        if (tabLevelBtn) { tabLevelBtn.style.background = 'transparent'; tabLevelBtn.style.color = '#fff'; }
        if (tabOverallBtn) { tabOverallBtn.style.background = '#2ecc71'; tabOverallBtn.style.color = '#000'; }
    }

    if(myRankScoreEl) myRankScoreEl.innerText = myDisplayScore;

    // Calculate my rank
    let myRank = 1;
    for (let entry of board) {
        if (currentRankMode === 'level') {
            if (myDisplayScore < (entry.levelScores[currentLevel] || 0)) myRank++;
        } else {
            if (myDisplayScore < (entry.overallScore || 0)) myRank++;
        }
    }
    
    if(myRankPosEl) {
        if (myDisplayScore === 0) {
             myRankPosEl.innerText = `-`;
        } else if(myRank <= 3) {
            myRankPosEl.innerHTML = `<span style="color:#f1c40f;">${myRank}위</span>`;
        } else {
            myRankPosEl.innerText = `${myRank}위`;
        }
    }

    // Render top 5
    if(rankListEl) {
        rankListEl.innerHTML = '';
        if (board.length === 0) {
            rankListEl.innerHTML = '<div style="text-align:center; padding:20px; color:#ccc;">등록된 랭킹이 없습니다.</div>';
            return;
        }
        const top5 = board.slice(0, 5);
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        for (let i = 0; i < top5.length; i++) {
            const scoreToDisplay = currentRankMode === 'level' ? (top5[i].levelScores[currentLevel] || 0) : (top5[i].overallScore || 0);
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            item.style.padding = '5px 0';
            item.innerHTML = `<span>${medals[i]} &nbsp; ${top5[i].nickname}</span> <span style="color: #ffd32a; font-weight: normal;">${scoreToDisplay}</span>`;
            rankListEl.appendChild(item);
        }
    }
}

// Add Rank Events
const tabLevelBtn = document.getElementById('tab-level');
const tabOverallBtn = document.getElementById('tab-overall');

if (tabLevelBtn && tabOverallBtn) {
    tabLevelBtn.addEventListener('click', () => {
        currentRankMode = 'level';
        updateRankUI();
    });
    tabOverallBtn.addEventListener('click', () => {
        currentRankMode = 'overall';
        updateRankUI();
    });
}




// Add Rank Events
if (rankBtn) {
    rankBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!isSoundPreloaded && typeof startSoundSystem === 'function') await startSoundSystem();
        
        if (gameState === 'PLAY') {
            gameState = 'PAUSED';
            pauseStartTime = Date.now();
            if (mainActionBtn) {
                mainActionBtn.innerText = 'PAUSE';
                mainActionBtn.classList.add('item-paused');
            }
        }
        if (clearScreen) clearScreen.classList.add('hidden');
        if (levelHintEl) levelHintEl.classList.add('hidden');
        if (storeScreen) storeScreen.classList.add('hidden');
        if (settingsScreen) settingsScreen.classList.add('hidden');

        if (rankScreen) {
            rankScreen.classList.remove('hidden');
            updateRankUI();
        }
    });
}

if (closeRankBtn) {
    closeRankBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (rankScreen) rankScreen.classList.add('hidden');
        if (gameState === 'PAUSED') {
            const isStoreHidden = !document.getElementById('store-screen') || document.getElementById('store-screen').classList.contains('hidden');
            const isSettingsHidden = !document.getElementById('settings-screen') || document.getElementById('settings-screen').classList.contains('hidden');
            if (isStoreHidden && isSettingsHidden) {
                resumeGame();
            }
        }
    });
}

if (submitRankBtn) {
    submitRankBtn.addEventListener('click', async () => {
        const nickname = rankNicknameInput ? rankNicknameInput.value.trim() : "";
        if (!nickname) {
            alert("닉네임을 입력하세요!");
            return;
        }

        try {
            await db.collection("leaderboard").doc(nickname).set({
                nickname: nickname,
                levelScores: Object.assign({}, myLevelBestScores),
                overallScore: calculateMyOverallScore(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            alert("기록이 성공적으로 서버에 갱신되었습니다!");
            if(rankNicknameInput) rankNicknameInput.value = "";
            
            updateRankUI(); 
        } catch (error) {
            console.error("랭킹 서버 저장 중 오류 발생: ", error);
            alert("서버 연결에 실패했습니다.");
        }
    });
}

