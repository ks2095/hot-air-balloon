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

// ================= Visitor Stats System ================= //
let cachedTotalVisitors = parseInt(localStorage.getItem('balloon_cached_total_visitors')) || 0;

function updateVisitorDisplay() {
    const visitorLabelEl = document.getElementById('visitor-label');
    const visitorCountEl = document.getElementById('visitor-count-display');
    const isKor = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'kor') === 'kor';
    if (visitorLabelEl) {
        visitorLabelEl.innerText = isKor ? '전체 방문자:' : 'Total Visitors:';
    }
    if (visitorCountEl) {
        if (cachedTotalVisitors > 0) {
            const formatted = cachedTotalVisitors.toLocaleString();
            visitorCountEl.innerText = isKor ? `${formatted}명` : formatted;
        } else {
            visitorCountEl.innerText = '-';
        }
    }
}

async function recordVisitorAndSync() {
    try {
        if (typeof db === 'undefined' || !db) return;
        const statsDocRef = db.collection("leaderboard").doc("__stats_visitors__");
        const hasVisitedSession = sessionStorage.getItem('balloon_visited_session');
        if (!hasVisitedSession) {
            sessionStorage.setItem('balloon_visited_session', 'true');
            await statsDocRef.set({
                totalVisitors: firebase.firestore.FieldValue.increment(1),
                lastVisited: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }
        const docSnap = await statsDocRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            if (data && typeof data.totalVisitors === 'number') {
                cachedTotalVisitors = data.totalVisitors;
                localStorage.setItem('balloon_cached_total_visitors', cachedTotalVisitors);
                updateVisitorDisplay();
            }
        }
    } catch (e) {
        console.warn("방문자 수 동기화 실패:", e);
    }
}
// 페이지 로드 시 방문자 수 기록 및 동기화
setTimeout(() => {
    updateVisitorDisplay();
    recordVisitorAndSync();
}, 200);
// ======================================================== //

// 모바일 브라우저(아이폰, 갤럭시) 상/하단 바 고려한 동적 뷰포트 높이 계산 (--app-height)
function setAppHeight() {
    const vh = window.innerHeight;
    document.documentElement.style.setProperty('--app-height', `${vh}px`);
}
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(setAppHeight, 150);
});
if (screen && screen.orientation) {
    screen.orientation.addEventListener('change', () => {
        setTimeout(setAppHeight, 150);
    });
}
document.addEventListener('fullscreenchange', () => {
    setAppHeight();
    if (typeof updateSettingsUI === 'function') updateSettingsUI();
});
document.addEventListener('webkitfullscreenchange', () => {
    setAppHeight();
    if (typeof updateSettingsUI === 'function') updateSettingsUI();
});
setAppHeight();

const gameContainer = document.getElementById('game-container');
const balloon = document.getElementById('balloon');
const restartBtn = document.getElementById('restart-btn');
const clearScreen = document.getElementById('clear-screen');
const mainActionBtn = document.getElementById('main-action-btn');
const event6Joystick = document.getElementById('event6-joystick');
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
const closeAdBtn = document.getElementById('close-ad-btn');
const eventClearScreen = document.getElementById('event-clear-screen');
const eventResultScoreEl = document.getElementById('event-result-score');
const eventCounterEl = document.getElementById('event-credit-counter');
const eventCreditsValEl = document.getElementById('event-credits-val');
const eventCloseBtn = document.getElementById('event-close-btn');
const eventAccumulatedTotalEl = document.getElementById('event-accumulated-total-credits');
const settingsBtn = document.getElementById('settings-btn');
const settingsScreen = document.getElementById('settings-screen');
const langToggleSettingsBtn = document.getElementById('lang-toggle-settings-btn');
const windToggleSettingsBtn = document.getElementById('wind-toggle-settings-btn');
const musicToggleSettingsBtn = document.getElementById('music-toggle-settings-btn');
const uiSwapSettingsBtn = document.getElementById('ui-swap-settings-btn');
const fullscreenToggleSettingsBtn = document.getElementById('fullscreen-toggle-settings-btn');
const groundEl = document.getElementById('ground');
const resetRecordSettingsBtn = document.getElementById('reset-record-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const noticeSettingsBtn = document.getElementById('notice-settings-btn');
const noticeScreen = document.getElementById('notice-screen');
const closeNoticeBtn = document.getElementById('close-notice-btn');
const noticeContentEl = document.getElementById('notice-content');
const noticeTitleEl = document.getElementById('notice-title');
const settingNoticeLabelEl = document.getElementById('setting-notice-label');
const noticeTabNewsBtn = document.getElementById('notice-tab-news');
const noticeTabGuideBtn = document.getElementById('notice-tab-guide');
let activeNoticeTab = 'news'; // 'news' or 'guide'
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
let showCloudGuides = false;

const rankNicknameInput = document.getElementById('rank-nickname');

// Ad & Event selection elements
const pianoContainer = document.getElementById('piano-container');
const musicStaff = document.getElementById('music-staff');
const musicScoreBoard = document.getElementById('music-score-board');
const musicCreditsValEl = document.getElementById('music-credits-val');
const adSelectionOverlay = document.getElementById('ad-selection-overlay');
const adSelectLifeBtn = document.getElementById('ad-select-life-btn');
const adSelectEventBtn = document.getElementById('ad-select-event-btn');
const closeAdSelectionBtn = document.getElementById('close-ad-selection-btn');
const adRewardTitle = document.getElementById('ad-reward-title');
const startEventAdBtn = document.getElementById('start-event-ad-btn');
const adEventRewardsEl = document.getElementById('ad-event-rewards');
const eventSelectionOverlay = document.getElementById('event-selection-overlay');
const eventButtonsContainer = document.getElementById('event-buttons-container');
const closeEventSelectionBtn = document.getElementById('close-event-selection-btn');
const closeAdEventBtn = document.getElementById('close-ad-event-btn');

let isRewardedEventPlay = false; // 광고 시청 후 보상으로 하는 이벤트 플레이인지 여부
let previousLevelBeforeRewardedEvent = null; // 이벤트 보너스 광고 시청 전 원래 플레이하던 레벨 저장

let popcornGatheredScore = 0;
let event4FishCaughtScore = 0;
let popcornDepositTimer = null;

// EVENT 6 Melody tracking 
const EVENT6_MELODY_1 = ["do", "mi", "sol", "do", "mi", "sol", "la", "la", "la", "sol", "fa", "fa", "fa", "mi", "mi", "mi", "re", "re", "re", "do"];
const EVENT6_MELODY_2 = [
    "do", "do", "sol", "sol", "la", "la", "sol",
    "fa", "fa", "mi", "mi", "re", "re", "do",
    "sol", "sol", "fa", "fa", "mi", "mi", "re",
    "sol", "sol", "fa", "fa", "mi", "mi", "re",
    "do", "do", "sol", "sol", "la", "la", "sol",
    "fa", "fa", "mi", "mi", "re", "re", "do"
];
const EVENT6_MELODY_3 = [
    "do", "do", "do", "re", "mi",
    "mi", "re", "mi", "fa", "sol",
    "do2", "do2", "do2", "sol", "sol",
    "mi", "mi", "mi", "do", "do",
    "sol", "fa", "mi", "re", "do"
];
const EVENT6_MELODIES = [EVENT6_MELODY_1, EVENT6_MELODY_2, EVENT6_MELODY_3];
let currentEvent6Melody = EVENT6_MELODY_1;
let currentEvent6NoteIndex = 0;
let currentEvent6Note = "do";
let currentEvent6Score = 0;

// Natural notes available for the staff
const SCALE_NOTES = ["do", "re", "mi", "fa", "sol", "la", "si", "do2"];

const NOTE_POSITIONS = {
    'do': { bottom: -22, ledger: true },
    're': { bottom: -14, ledger: false },
    'mi': { bottom: -7, ledger: false },
    'fa': { bottom: -1, ledger: false },
    'sol': { bottom: 6, ledger: false },
    'la': { bottom: 12, ledger: false },
    'si': { bottom: 18, ledger: false },
    'do2': { bottom: 24, ledger: false }
};

let steak1Img = new Image();
steak1Img.src = 'steak1.png';
let steak2Img = new Image();
steak2Img.src = 'steak2.png';
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
let isUiSwapped = (localStorage.getItem('balloon_ui_swapped') === 'true'); // Default false
let currentLanguage = localStorage.getItem('balloon_language');
if (!currentLanguage) {
    const userLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    currentLanguage = userLang.startsWith('ko') ? 'kor' : 'eng';
    localStorage.setItem('balloon_language', currentLanguage);
}
if (groundEl) groundEl.classList.toggle('swapped-ui', isUiSwapped);

let storeOperationMode = null; // 'buy', 'sell' or null

let currentLevel = parseInt(localStorage.getItem('balloon_current_level')) || 0;
let lastKnownLevel = currentLevel;

function isTutorialLevel(lvl = currentLevel) {
    const num = Number(lvl);
    if (num === 0) return true;
    try {
        return !!(LEVEL_CONFIGS && LEVEL_CONFIGS[num] && LEVEL_CONFIGS[num].displayName === "튜토리얼");
    } catch (e) {
        return false;
    }
}

// 실제 게임(튜토리얼 외 레벨)에서 획득한 크레딧 및 아이템 보존용
let realCredits = (localStorage.getItem('balloon_real_credits') !== null)
    ? (parseInt(localStorage.getItem('balloon_real_credits')) || 0)
    : (isTutorialLevel(currentLevel) ? 0 : (parseInt(localStorage.getItem('balloon_credits')) || 0));

let realUpgrades = null;
try {
    realUpgrades = JSON.parse(localStorage.getItem('balloon_real_upgrades'));
} catch (e) {
    realUpgrades = null;
}
if (!realUpgrades && !isTutorialLevel(currentLevel)) {
    try {
        realUpgrades = JSON.parse(localStorage.getItem('balloon_upgrades'));
    } catch (e) {
        realUpgrades = null;
    }
}
if (!realUpgrades) {
    realUpgrades = {
        clock: 0,
        fan_left: 0,
        fan_right: 0,
        gas_item: 0,
        weight: 0
    };
} else {
    realUpgrades = {
        clock: realUpgrades.clock || 0,
        fan_left: realUpgrades.fan_left || 0,
        fan_right: realUpgrades.fan_right || 0,
        gas_item: realUpgrades.gas_item || 0,
        weight: realUpgrades.weight || 0
    };
}

let totalCredits = isTutorialLevel(currentLevel) ? 500 : realCredits;
let upgrades = isTutorialLevel(currentLevel)
    ? { clock: 0, fan_left: 0, fan_right: 0, gas_item: 0, weight: 0 }
    : JSON.parse(JSON.stringify(realUpgrades));

let lives = parseInt(localStorage.getItem('balloon_lives')) || 7;
if (lives > 7) lives = 7; // Cap at 7
let lastLifeUpdate = parseInt(localStorage.getItem('balloon_last_life_update')) || Date.now();
let clearedLevels = JSON.parse(localStorage.getItem('balloon_cleared_levels')) || [];
let myLevelBestScores = JSON.parse(localStorage.getItem('balloon_level_best_scores')) || {};


let lastEventCreditTime = parseInt(localStorage.getItem('balloon_last_event_credit_time')) || 0;

function shouldAllowEventCredits() {
    // 광고 보상 플레이인 경우 무조건 허용
    if (isRewardedEventPlay) return true;

    const isAlreadyCleared = clearedLevels.includes(currentLevel);
    // 아직 클리어하지 않은 레벨은 항상 크레딧 지급
    if (!isAlreadyCleared) return true;
    
    // 이미 클리어한 레벨의 경우:
    // 생명이 1이 남고 크레딧이 100 미만인 절박한 상황에서만 30분 간격으로 점수 획득 가능
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (lives === 1 && totalCredits < 100) {
        return (now - lastEventCreditTime > thirtyMinutes);
    }
    
    return false;
}

function recordEventCreditGain() {
    lastEventCreditTime = Date.now();
    savePlayerData();
}

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
        fan_left: { name: "선풍기좌측", desc: "+3m/s for 5s left wind power", price: 100, icon: "fan_left.png" },
        fan_right: { name: "선풍기우측", desc: "+3m/s for 5s right wind power", price: 100, icon: "fan_right.png" },
        gas_item: { name: "가스통", desc: "+100 extra gas", price: 100, icon: "gas_tank.png" },
        clock: { name: "자명종시계", desc: "+10s time extention", price: 100, icon: "alarm_clock.png" },
        weight: { name: "무게추", desc: "x5 gravity control", price: 100, icon: "weight.png" }
    }
};

let storeData = defaultStoreData;
if (savedStoreData) {
    try {
        let parsed = JSON.parse(savedStoreData);
        // If the data is from the old version (doesn't have 'clock'), use default
        if (!parsed.items || !parsed.items.clock) {
            storeData = defaultStoreData;
        } else {
            storeData = parsed;
            // Force update icons, descriptions and prices to match latest assets
            Object.keys(defaultStoreData.items).forEach(key => {
                if (storeData.items[key]) {
                    storeData.items[key].desc = defaultStoreData.items[key].desc;
                    storeData.items[key].price = defaultStoreData.items[key].price;
                    storeData.items[key].icon = defaultStoreData.items[key].icon;
                } else {
                    storeData.items[key] = { ...defaultStoreData.items[key] };
                }
            });
        }
    } catch (e) {
        storeData = defaultStoreData;
    }
}

// Always ensure all default items and their current asset icons exist
Object.keys(defaultStoreData.items).forEach(key => {
    if (!storeData.items || !storeData.items[key]) {
        if (!storeData.items) storeData.items = {};
        storeData.items[key] = { ...defaultStoreData.items[key] };
    } else {
        storeData.items[key].icon = defaultStoreData.items[key].icon;
    }
});
savePlayerData();


function savePlayerData() {
    if (!isTutorialLevel(currentLevel)) {
        realCredits = totalCredits;
        realUpgrades = JSON.parse(JSON.stringify(upgrades));
        localStorage.setItem('balloon_real_credits', realCredits);
        localStorage.setItem('balloon_real_upgrades', JSON.stringify(realUpgrades));
        localStorage.setItem('balloon_credits', totalCredits);
        localStorage.setItem('balloon_upgrades', JSON.stringify(upgrades));
    }
    localStorage.setItem('balloon_store_data', JSON.stringify(storeData));
    localStorage.setItem('balloon_cleared_levels', JSON.stringify(clearedLevels));
    localStorage.setItem('balloon_lives', lives);
    localStorage.setItem('balloon_last_life_update', lastLifeUpdate);
    localStorage.setItem('balloon_music_enabled', isMusicEnabled);
    localStorage.setItem('balloon_ui_swapped', isUiSwapped);
    localStorage.setItem('balloon_language', currentLanguage);
    localStorage.setItem('balloon_current_level', currentLevel);
    localStorage.setItem('balloon_last_event_credit_time', lastEventCreditTime);

    // Update ground credit display & store credit display
    const groundCredits = document.getElementById('ground-credits-display');
    if (groundCredits) groundCredits.innerText = `${totalCredits}C`;
    if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;
    const totalEl = document.getElementById('accumulated-total-credits');
    if (totalEl) totalEl.innerText = totalCredits;
    const eventTotalEl = document.getElementById('event-accumulated-total-credits');
    if (eventTotalEl) eventTotalEl.innerText = totalCredits;
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
    'bgm1.mp3', 'bgm2.mp3', 'bgm3.mp3', 'bgm4.mp3',
    'bgm5.mp3', 'bgm6.mp3', 'bgm7.mp3', 'bgm8.mp3',
    'bgm9.mp3', 'bgm10.mp3'
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
        { name: 'burner', url: 'balloon_sound.mp3' },
        { name: 'burner_alt', url: 'balloon_sound.mp3' },
        { name: 'success', url: 'mission_success.mp3' },
        { name: 'explosion', url: 'explosion.mp3' },
        { name: 'coin', url: 'coin.mp3' },
        { name: 'life', url: 'life_sound.mp3' },
        { name: 'popcorn', url: 'popcorn_sound.mp3' },
        { name: 'hit', url: 'hit.mp3' },
        { name: 'bird_hit', url: 'bird_hit.mp3' },
        { name: 'thunder', url: 'thunder.mp3' },
        { name: 'eagle_fall', url: 'eagle_fall.mp3' }
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
let activeBirds = []; // Level 21 birds
let activeEagles = []; // Level 23 eagles
let activeRaindrops = []; // Level 26 rain
let level26CloudX = 50; // Level 26 cloud dynamic X
let rainSeed = 12345;
let rainPowerReductionEndTime = 0;
function seededRainRandom() {
    rainSeed = (rainSeed * 9301 + 49297) % 233280;
    return rainSeed / 233280;
}
let attachedFish = null;
let draggingOffset = { x: 0, y: 0 };
let lightningStrikeState = 'IDLE'; // IDLE, FLASHING, STRIKING
let lightningTimer = 0;
let lastLightningStartTime = 0;
let activeLightningBolts = []; // Active falling bolts for Level 28

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
        winds: [-1.5, 1.5, -1.5, 1.5, -1.5, 1.5, -1.5],
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
        winds: [-4, 4, -4, 4, -4, 4, -4],
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
        winds: [-2, 2, -5, -4.75, 4.75, -4.75, 8],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    24: {
        displayName: "EVENT 4",
        winds: [-2.5, 2.5, -2.5, 2.5, -2.5, 2.5, -2.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.5
    },
    25: {
        displayName: "21",
        winds: [1.5, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    26: {
        displayName: "22",
        winds: [-1.5, 1.5, 2.25, -2.25, 1.5, -1.25, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    27: {
        displayName: "23",
        winds: [1.75, -2, 1.75, -1.75, 2.0, -1.75, 1.5],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    28: {
        displayName: "24",
        winds: [2, -5, 5, -5, 5, -5, 2],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    29: {
        displayName: "25",
        winds: [2, -4.75, 2, -4.75, 3, -2, 2],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    30: {
        displayName: "EVENT 5",
        winds: [-2, 2, -2, 2, -2, 0, 1],
        maxGas: 400,
        maxTime: 60,
        platformY: 6.5,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    31: {
        displayName: "26",
        winds: [2.0, -2.0, 2.0, -2.0, 2.0, -2.0, 2.0],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    32: {
        displayName: "27",
        winds: [2.0, -2.0, 2.0, -2.0, 2.0, -2.0, 2.0],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    33: {
        displayName: "28",
        winds: [2.0, -2.0, 2.0, -2.0, 2.0, -2.0, 2.0],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    34: {
        displayName: "29",
        winds: [2.0, -2.0, 2.0, -2.0, 2.0, -2.0, 2.0],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    35: {
        displayName: "30",
        winds: [2, -4.75, 2, -4.75, 3, -2, 2],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0,
        skyColor: "linear-gradient(to bottom, #0c0c24, #19194d, #2d2d86)"
    },
    36: {
        displayName: "EVENT 6",
        winds: [0, 0, 0, 0, 0, 0, 0],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    37: {
        displayName: "31",
        winds: [0, 0, 0, 0, 0, 0, 0],
        maxGas: 200,
        maxTime: 20,
        platformY: 5.0
    },
    38: {
        displayName: "32",
        winds: [0, 0, 0, 0, 0, 0, 0],
        maxGas: 200,
        maxTime: 20,
        platformY: 5.0
    }
};

function isSpaceEventLevel(displayName) {
    if (!displayName) return false;
    if (displayName === "EVENT 6") return true;
    const num = parseInt(displayName, 10);
    return !isNaN(num) && num >= 31;
}

if (!LEVEL_CONFIGS[currentLevel]) {
    currentLevel = 0;
    localStorage.setItem('balloon_current_level', currentLevel);
}

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
let isJoystickDragging = false;
let joystickVecX = 0;
let joystickVecY = 0;

const spaceFlameUp = document.querySelector('.space-flame-up');
const spaceFlameDown = document.querySelector('.space-flame-down');
const spaceFlameLeft = document.querySelector('.space-flame-left');
const spaceFlameRight = document.querySelector('.space-flame-right');

function updateSpaceFlames(vecX, vecY) {
    if (spaceFlameDown) spaceFlameDown.classList.toggle('active', vecY > 0.25);
    if (spaceFlameUp) spaceFlameUp.classList.toggle('active', vecY < -0.25);
    if (spaceFlameRight) spaceFlameRight.classList.toggle('active', vecX < -0.25);
    if (spaceFlameLeft) spaceFlameLeft.classList.toggle('active', vecX > 0.25);
}

function updateJoystickFromPoint(clientX, clientY) {
    if (!event6Joystick) return;
    const rect = event6Joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 14;
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    event6Joystick.style.setProperty('--joy-x', `${knobX.toFixed(1)}px`);
    event6Joystick.style.setProperty('--joy-y', `${knobY.toFixed(1)}px`);

    if (dist > 2) {
        const strength = Math.max(0.5, clampedDist / maxRadius);
        joystickVecX = Math.cos(angle) * strength;
        joystickVecY = -Math.sin(angle) * strength;
        isBurning = true;
        updateSpaceFlames(joystickVecX, joystickVecY);
        if (!soundMgr.activeSources['burner']) {
            soundMgr.play('burner', true, 1.0);
        }
    } else {
        joystickVecX = 0;
        joystickVecY = 0;
        isBurning = false;
        updateSpaceFlames(0, 0);
        soundMgr.stop('burner');
        soundMgr.stop('burner_alt');
    }
}

function resetJoystick() {
    isJoystickDragging = false;
    joystickVecX = 0;
    joystickVecY = 0;
    updateSpaceFlames(0, 0);
    if (event6Joystick) {
        event6Joystick.classList.remove('active');
        event6Joystick.style.setProperty('--joy-x', '0px');
        event6Joystick.style.setProperty('--joy-y', '0px');
    }
}

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
let isStunned = false; // 붉은새 충돌 시 상태
let stunEndTime = 0; // 스턴 종료 시간

// 보너스 점수 레벨 그룹 (표시 이름 기준)
const BONUS_G1_LEVELS = ["6", "7", "14", "15", "23", "26"];
const BONUS_G2_LEVELS = ["8", "9", "10", "16", "17", "18", "19", "20", "24", "25", "27", "28", "29", "30"];
const BONUS_G3_LEVELS = [];
const BONUS_G4_LEVELS = [];

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
    createParticles();
    createStars();

    if (itemLabelBtn) {
        itemLabelBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!isSoundPreloaded) await startSoundSystem();
            if (!settingsScreen.classList.contains('hidden')) return;
            if (gameState === 'PLAY') return;

            const container = document.querySelector('.store-container');
            const isVisible = !storeScreen.classList.contains('hidden');
            const isInventory = container ? container.classList.contains('inventory-mode') : false;

            if (isVisible && isInventory) {
                resumeGame();
            } else {
                if (gameState === 'PLAY') {
                    gameState = 'PAUSED';
                    pauseStartTime = Date.now();
                    mainActionBtn.innerText = 'PAUSE';
                    mainActionBtn.classList.add('item-paused');
                }
                if (clearScreen) clearScreen.classList.add('hidden');
                if (levelHintEl) levelHintEl.classList.add('hidden');
                storeScreen.classList.remove('hidden');
                updateStoreUI(true);
            }
        });
    }

    if (storeLabelBtn) {
        storeLabelBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!isSoundPreloaded) await startSoundSystem();
            if (!settingsScreen.classList.contains('hidden')) return;
            if (gameState === 'PLAY') return;

            const container = document.querySelector('.store-container');
            const isVisible = !storeScreen.classList.contains('hidden');
            const isInventory = container ? container.classList.contains('inventory-mode') : false;

            if (isVisible && !isInventory) {
                resumeGame();
            } else {
                if (gameState === 'PLAY') {
                    gameState = 'PAUSED';
                    pauseStartTime = Date.now();
                    mainActionBtn.innerText = 'PAUSE';
                    mainActionBtn.classList.add('item-paused');
                }
                if (clearScreen) clearScreen.classList.add('hidden');
                if (levelHintEl) levelHintEl.classList.add('hidden');
                storeScreen.classList.remove('hidden');
                storeOperationMode = null;
                updateStoreUI(false);
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
            goToNextLevel();
        });
    }

    if (prevLevelBtn) {
        prevLevelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToPrevLevel();
        });
    }

    if (openStoreBtn) {
        openStoreBtn.addEventListener('click', () => {
            storeScreen.classList.remove('hidden');
            clearScreen.classList.add('hidden');
            storeOperationMode = null;
            updateStoreUI(false);
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
            if (previousLevelBeforeRewardedEvent !== null) {
                currentLevel = previousLevelBeforeRewardedEvent;
                localStorage.setItem('balloon_current_level', currentLevel);
                previousLevelBeforeRewardedEvent = null;
                isRewardedEventPlay = false;
            }
            resetGame();
            updateNextLevelButtonVisibility();
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
            if (previousLevelBeforeRewardedEvent !== null) {
                currentLevel = previousLevelBeforeRewardedEvent;
                localStorage.setItem('balloon_current_level', currentLevel);
                previousLevelBeforeRewardedEvent = null;
                isRewardedEventPlay = false;
            }
            resetGame();
            updateNextLevelButtonVisibility();
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

    let lastSettingsCloseTime = 0;
    if (closeSettingsBtn) {
        const handleCloseSettings = (e) => {
            if (e) {
                e.stopPropagation();
                if (e.cancelable && (e.type === 'touchend' || e.type === 'touchstart')) {
                    e.preventDefault();
                }
            }
            const now = Date.now();
            if (now - lastSettingsCloseTime < 350) return;
            lastSettingsCloseTime = now;
            settingsScreen.classList.add('hidden');
            if (gameState === 'PAUSED' && !storeScreen.classList.contains('hidden') === false) {
                resumeGame();
            }
        };
        closeSettingsBtn.addEventListener('click', handleCloseSettings);
        closeSettingsBtn.addEventListener('touchend', handleCloseSettings, { passive: false });
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

    if (uiSwapSettingsBtn) {
        uiSwapSettingsBtn.addEventListener('click', () => {
            isUiSwapped = !isUiSwapped;
            if (groundEl) groundEl.classList.toggle('swapped-ui', isUiSwapped);
            savePlayerData();
            updateSettingsUI();
        });
    }

    if (fullscreenToggleSettingsBtn) {
        fullscreenToggleSettingsBtn.addEventListener('click', () => {
            const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
            if (!isFullscreen) {
                const el = document.documentElement;
                if (el.requestFullscreen) {
                    el.requestFullscreen().catch(err => {
                        console.log("Fullscreen request error", err);
                    });
                } else if (el.webkitRequestFullscreen) {
                    el.webkitRequestFullscreen();
                } else {
                    alert("아이폰(iOS) 브라우저 정책상 버튼 전체화면이 제한되어 있습니다.\n\n[팁] 사파리나 크롬 하단 '공유' → '홈 화면에 추가'를 하시면 주소창과 메뉴바가 완전히 사라진 100% 전체화면 앱으로 플레이할 수 있습니다!");
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
            setTimeout(() => {
                setAppHeight();
                updateSettingsUI();
            }, 100);
        });
    }

    if (resetRecordSettingsBtn) {
        resetRecordSettingsBtn.addEventListener('click', () => {
            if (confirm("모든 기록(크레딧, 아이템, 진행 상황, 랭킹)을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
                localStorage.removeItem('balloon_credits');
                localStorage.removeItem('balloon_upgrades');
                localStorage.removeItem('balloon_store_data');
                localStorage.removeItem('balloon_cleared_levels');
                localStorage.removeItem('balloon_lives');
                localStorage.removeItem('balloon_last_life_update');
                localStorage.removeItem('balloon_music_enabled');
                localStorage.removeItem('balloon_ui_swapped');
                localStorage.removeItem('balloon_level_best_scores');
                localStorage.removeItem('balloon_leaderboard_profiles');
                localStorage.removeItem('balloon_real_credits');
                localStorage.removeItem('balloon_real_upgrades');
                localStorage.removeItem('balloon_current_level');
                // 주의: 전체 방문자 수(balloon_cached_total_visitors 및 Firestore 카운트)는 초기화되지 않고 유지됩니다.

                totalCredits = 0;
                realCredits = 0;
                upgrades = { clock: 0, fan_left: 0, fan_right: 0, gas_item: 0, weight: 0 };
                realUpgrades = { clock: 0, fan_left: 0, fan_right: 0, gas_item: 0, weight: 0 };
                lives = 7;
                clearedLevels = [];
                currentLevel = 0;
                lastLifeUpdate = Date.now();
                isMusicEnabled = true;
                isUiSwapped = false;
                if (groundEl) groundEl.classList.remove('swapped-ui');
                storeData = defaultStoreData;
                myLevelBestScores = {};

                savePlayerData();
                updateLivesUI();
                if (typeof updateCreditsUI === 'function') updateCreditsUI();
                else if (groundCredits) groundCredits.innerText = "0C";

                updateSettingsUI();
                resetGame();

                alert("기록이 성공적으로 초기화되었습니다.");
                location.reload();
            }
        });
    }

    if (langToggleSettingsBtn) {
        langToggleSettingsBtn.addEventListener('click', () => {
            currentLanguage = (currentLanguage === 'kor') ? 'eng' : 'kor';
            localStorage.setItem('balloon_language', currentLanguage);
            updateLanguageUI();
            updateSettingsUI();
        });
    }

    if (noticeSettingsBtn) {
        noticeSettingsBtn.addEventListener('click', () => {
            if (noticeScreen) {
                noticeScreen.classList.remove('hidden');
                updateNoticeUI();
            }
        });
    }
    if (closeNoticeBtn) {
        closeNoticeBtn.addEventListener('click', () => {
            if (noticeScreen) noticeScreen.classList.add('hidden');
        });
    }
    if (noticeTabNewsBtn) {
        noticeTabNewsBtn.addEventListener('click', () => {
            activeNoticeTab = 'news';
            updateNoticeUI();
        });
    }
    if (noticeTabGuideBtn) {
        noticeTabGuideBtn.addEventListener('click', () => {
            activeNoticeTab = 'guide';
            updateNoticeUI();
        });
    }


    if (saveDecoBtn) {
        saveDecoBtn.addEventListener('click', () => {
            storeData.title = editStoreTitle.value;
            storeData.themeColor = editStoreColor.value;

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

    // Controls
    mainActionBtn.addEventListener('mousedown', async (e) => {
        if (!isSoundPreloaded) await startSoundSystem();
        soundMgr.init();
        await soundMgr.resume();

        if (Date.now() - lastSettingsCloseTime < 400) return;
        if (settingsScreen && !settingsScreen.classList.contains('hidden')) return;
        if (storeScreen && !storeScreen.classList.contains('hidden')) return;
        if (rankScreen && !rankScreen.classList.contains('hidden')) return;
        if (mainActionBtn.classList.contains('overheated')) return;
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

        if (Date.now() - lastSettingsCloseTime < 400) return;
        if (settingsScreen && !settingsScreen.classList.contains('hidden')) return;
        if (storeScreen && !storeScreen.classList.contains('hidden')) return;
        if (rankScreen && !rankScreen.classList.contains('hidden')) return;
        if (mainActionBtn.classList.contains('overheated')) return;
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

    if (event6Joystick) {
        const handleJoystickStart = (clientX, clientY) => {
            if (Date.now() - lastSettingsCloseTime < 400) return;
            if (settingsScreen && !settingsScreen.classList.contains('hidden')) return;
            if (!storeScreen.classList.contains('hidden')) return;
            if (mainActionBtn && mainActionBtn.classList.contains('overheated')) return;

            if (!isSoundPreloaded) startSoundSystem();
            soundMgr.init();
            soundMgr.resume();

            if (gameState === 'START' || gameState === 'CLEAR' || gameState === 'GAMEOVER' || (mainActionBtn && mainActionBtn.classList.contains('restart-mode'))) {
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
            }

            if (gameState === 'PLAY') {
                isJoystickDragging = true;
                event6Joystick.classList.add('active');
                updateJoystickFromPoint(clientX, clientY);
            }
        };

        event6Joystick.addEventListener('mousedown', (e) => {
            handleJoystickStart(e.clientX, e.clientY);
        });

        event6Joystick.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault();
            if (e.touches && e.touches.length > 0) {
                handleJoystickStart(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });

        window.addEventListener('mousemove', (e) => {
            if (isJoystickDragging && gameState === 'PLAY') {
                updateJoystickFromPoint(e.clientX, e.clientY);
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (isJoystickDragging && gameState === 'PLAY' && e.touches && e.touches.length > 0) {
                updateJoystickFromPoint(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
    }

    window.addEventListener('mouseup', () => {
        resetJoystick();
        isBurning = false;
        soundMgr.stop('burner');
        soundMgr.stop('burner_alt');
    });
    window.addEventListener('touchend', () => {
        resetJoystick();
        isBurning = false;
        soundMgr.stop('burner');
        soundMgr.stop('burner_alt');
    });
    window.addEventListener('touchcancel', () => {
        resetJoystick();
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



    // ==========================================
    // PC 키보드 컨트롤 (스페이스바 및 방향키 지원)
    // ==========================================
    const activeKeyMap = {
        Space: false,
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false
    };

    function isSpaceModeActive() {
        const currentCfg = LEVEL_CONFIGS[currentLevel];
        return currentCfg && isSpaceEventLevel(currentCfg.displayName);
    }

    async function triggerGameActionStart() {
        if (!isSoundPreloaded) await startSoundSystem();
        soundMgr.init();
        await soundMgr.resume();

        if (Date.now() - lastSettingsCloseTime < 400) return;
        if (settingsScreen && !settingsScreen.classList.contains('hidden')) return;
        if (storeScreen && !storeScreen.classList.contains('hidden')) return;
        if (rankScreen && !rankScreen.classList.contains('hidden')) return;
        if (mainActionBtn && mainActionBtn.classList.contains('overheated')) return;

        if (gameState === 'START' || gameState === 'CLEAR' || gameState === 'GAMEOVER' || (mainActionBtn && mainActionBtn.classList.contains('restart-mode'))) {
            if (lives <= 0) {
                const now = Date.now();
                const nextRegenTime = lastLifeUpdate + (5 * 60 * 1000);
                const waitMs = nextRegenTime - now;
                const waitMin = Math.ceil(waitMs / 60000);
                alert(getNoLifeAlertMessage(waitMin));
                return;
            }
            resetGame();
            startGame();
        }
    }

    function updateKeyboardControls() {
        if (gameState !== 'PLAY') return;
        if (isJoystickDragging) return; // 터치/마우스 조이스틱 드래그 중 우선

        const inSpaceMode = isSpaceModeActive();

        if (inSpaceMode) {
            // [이벤트 6, 레벨 31 이상] 방향키(또는 WASD) / 스페이스바로 가스 분출
            let vx = 0;
            let vy = 0;

            if (activeKeyMap.ArrowUp || activeKeyMap.KeyW) vy += 1;
            if (activeKeyMap.ArrowDown || activeKeyMap.KeyS) vy -= 1;
            if (activeKeyMap.ArrowLeft || activeKeyMap.KeyA) vx -= 1;
            if (activeKeyMap.ArrowRight || activeKeyMap.KeyD) vx += 1;

            // 스페이스바 단독 입력 시 기본 상방향(+Y) 가스 분출
            if (activeKeyMap.Space && vy === 0 && vx === 0) {
                vy = 1;
            }

            const len = Math.hypot(vx, vy);
            if (len > 0) {
                joystickVecX = vx / len;
                joystickVecY = vy / len;
                isBurning = true;
                updateSpaceFlames(joystickVecX, joystickVecY);
                if (event6Joystick) {
                    event6Joystick.classList.add('active');
                    event6Joystick.style.setProperty('--joy-x', `${(joystickVecX * 14).toFixed(1)}px`);
                    event6Joystick.style.setProperty('--joy-y', `${(-joystickVecY * 14).toFixed(1)}px`);
                }
                if (!soundMgr.activeSources['burner']) {
                    soundMgr.play('burner', true, 1.0);
                }
            } else {
                resetJoystick(); if (typeof resetDpad === 'function') resetDpad();
                isBurning = false;
                soundMgr.stop('burner');
                soundMgr.stop('burner_alt');
            }
        } else {
            // [일반 레벨] 스페이스바(또는 ArrowUp / KeyW)로 버너 점화
            if (activeKeyMap.Space || activeKeyMap.ArrowUp || activeKeyMap.KeyW) {
                isBurning = true;
                if (mainActionBtn) mainActionBtn.classList.add('keyboard-active');
                if (!soundMgr.activeSources['burner']) {
                    soundMgr.play('burner', true, 1.0);
                }
            } else {
                isBurning = false;
                if (mainActionBtn) mainActionBtn.classList.remove('keyboard-active');
                soundMgr.stop('burner');
                soundMgr.stop('burner_alt');
            }
        }
    }

    window.addEventListener('keydown', (e) => {
        // 텍스트 입력 중일 때는 게임 키 바인딩 무시
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
            return;
        }

        // 단축키: Ctrl + L (다음 레벨), Ctrl + K (이전 레벨)
        if (e.ctrlKey || e.metaKey) {
            const key = e.key ? e.key.toLowerCase() : '';
            if (e.code === 'KeyL' || key === 'l') {
                e.preventDefault();
                goToNextLevel();
                return;
            }
            if (e.code === 'KeyK' || key === 'k') {
                e.preventDefault();
                grantCheatLivesAndCredits();
                return;
            }
        }

        const code = e.code;
        const isGameControlKey = code === 'Space' ||
                                 code === 'ArrowUp' || code === 'ArrowDown' ||
                                 code === 'ArrowLeft' || code === 'ArrowRight' ||
                                 code === 'KeyW' || code === 'KeyS' ||
                                 code === 'KeyA' || code === 'KeyD';

        if (isGameControlKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault(); // 스크롤 등 브라우저 기본 동작 방지
        }

        if (code in activeKeyMap) {
            if (!activeKeyMap[code]) {
                activeKeyMap[code] = true;

                // 시작 / 재시작 상태에서 Space, Enter, ArrowUp 누르면 게임 시작
                if (gameState === 'START' || gameState === 'CLEAR' || gameState === 'GAMEOVER' || (mainActionBtn && mainActionBtn.classList.contains('restart-mode'))) {
                    if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW' || code === 'Enter') {
                        triggerGameActionStart();
                        return;
                    }
                }

                updateKeyboardControls();
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
            return;
        }

        const code = e.code;
        if (code in activeKeyMap) {
            activeKeyMap[code] = false;
            updateKeyboardControls();
        }
    });

    window.addEventListener('blur', () => {
        for (const k in activeKeyMap) {
            activeKeyMap[k] = false;
        }
        if (gameState === 'PLAY') {
            resetJoystick(); if (typeof resetDpad === 'function') resetDpad();
            isBurning = false;
            if (mainActionBtn) mainActionBtn.classList.remove('keyboard-active');
            soundMgr.stop('burner');
            soundMgr.stop('burner_alt');
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
    isRewardedEventPlay = false; // 기본적으로 광고 보상 플레이가 아님
    const config = LEVEL_CONFIGS[currentLevel];
    const isSpecialStart = config.displayName === "EVENT 2" || config.displayName === "EVENT 4";

    if (isSpecialStart) {
        balloonX = 50;
        // EVENT 2: Start on top of the landing pad
        const skyHeight = gameContainer.clientHeight * 0.9195;
        const platformY = config.platformY;
        const pixelOffset = 12 - 50; // -38 (User requested 50px lower from original 12)
        const targetYBottom = (100 / 7) * platformY + (pixelOffset / skyHeight) * 100;
        const platformHeightPercentage = (9 / skyHeight) * 100;
        const targetYTop = targetYBottom + platformHeightPercentage;
        balloonY = targetYTop - getBasketOffset() + 0.1; // Add 0.1 to avoid immediate touch
    } else if (isSpaceEventLevel(config.displayName)) {
        // 조이스틱 조작 시작 시 처음 위치한 현재 좌표(balloonX, balloonY) 그대로 출발
    } else {
        balloonX = 50;
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
    hasLiftedOffLevel31 = false;
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
    level26CloudX = 50; // 구름 위치 초기화
    initLevel31Planets(); // 레벨31 행성 출발 위치 고정 초기화
    
    // 26, 27, 28, 29, 30레벨용 빗방울 시드 및 현장 비우기 (매 시작마다 동일 패턴 보장)
    if (currentLevel === 31 || currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
        // 레벨 27, 28, 29, 30은 동일한 패턴(32번 시드) 사용
        const effectiveSeed = (currentLevel === 33 || currentLevel === 34 || currentLevel === 35) ? 32 : currentLevel;
        rainSeed = effectiveSeed + 777;
        activeRaindrops.forEach(drop => { if (drop.el && drop.el.parentNode) drop.el.remove(); });
        activeRaindrops.length = 0;
        
        // 28, 29, 30레벨 전용 번개 시퀀스 초기화 (시작 버튼 누른 시점부터 5초 타이머 시작)
        if (currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
            lightningStrikeState = 'IDLE';
            lightningTimer = 0;
            lastLightningStartTime = Date.now(); 
            activeLightningBolts = [];
        }
    }
    
    playRandomBGM();
}

function resumeGame() {
    // 아이템창 닫힐 때 미션 힌트 다시 표시
    if (levelHintEl) {
        const config = LEVEL_CONFIGS[currentLevel];
        const displayName = config.displayName;
        if (currentLevel === 0 || displayName === "튜토리얼" || BONUS_G1_LEVELS.includes(displayName) || BONUS_G2_LEVELS.includes(displayName) || BONUS_G3_LEVELS.includes(displayName) || BONUS_G4_LEVELS.includes(displayName)) {
            if (gameState !== 'PLAY' || !(currentLevel === 0 || displayName === "튜토리얼")) {
                levelHintEl.classList.remove('hidden');
            }
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

    const startX = (initialEvent.touches ? initialEvent.touches[0].clientX : initialEvent.clientX);
    const startY = (initialEvent.touches ? initialEvent.touches[0].clientY : initialEvent.clientY);
    let hasMoved = false;

    // 배치 미리보기 요소 생성
    if (placementPreviewEl) placementPreviewEl.remove();
    const itemData = storeData.items[key] || defaultStoreData.items[key];
    const previewIcon = (defaultStoreData.items[key] && defaultStoreData.items[key].icon) || (itemData && itemData.icon) || '';
    placementPreviewEl = document.createElement('div');
    placementPreviewEl.className = 'dropped-item placement-preview dragging';
    placementPreviewEl.innerHTML = `<img src="${previewIcon}" alt="${itemData.name}">`;
    placementPreviewEl.style.opacity = "0.7";
    placementPreviewEl.style.pointerEvents = "none";
    placementPreviewEl.style.zIndex = "3000";
    gameContainer.appendChild(placementPreviewEl);

    const updatePreview = (e) => {
        const ev = e.touches ? e.touches[0] : e;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) hasMoved = true;

        const rect = gameContainer.getBoundingClientRect();
        const x = ((ev.clientX - rect.left) / rect.width) * 100;
        const y = 100 - ((ev.clientY - rect.top) / rect.height) * 100;

        placementPreviewEl.style.left = `${x}%`;
        placementPreviewEl.style.bottom = `calc(8.05% + ${(y - 8.05) / 0.9195 * 0.9195}%)`;
    };

    const confirmDrop = (ev) => {
        const rect = gameContainer.getBoundingClientRect();
        if (ev.clientX >= rect.left && ev.clientX <= rect.right &&
            ev.clientY >= rect.top && ev.clientY <= rect.bottom) {

            const dropX = ((ev.clientX - rect.left) / rect.width) * 100;
            const dropY = 100 - ((ev.clientY - rect.top) / rect.height) * 100;
            const gameY = (dropY - 8.05) / 0.9195;

            placeItemOnScreen(key, dropX, gameY);
            upgrades[key]--;
            savePlayerData();
            updateStoreUI(true);
            if (showWindLabels) updateWindLabels();
        }

        if (placementPreviewEl) {
            placementPreviewEl.remove();
            placementPreviewEl = null;
        }
        if (gameState === 'PAUSED') resumeGame();
        
        // 뒷정리
        window.removeEventListener('mousemove', updatePreview);
        window.removeEventListener('touchmove', updatePreview);
        window.removeEventListener('mouseup', handleInitialDrop);
        window.removeEventListener('touchend', handleInitialDrop);
        window.removeEventListener('click', stickyDropHandler);
        // touchstart click 처리 중복 방지
    };

    const stickyDropHandler = (e) => {
        if (e.target && e.target.closest('.store-mini-item')) return; // 아이템 슬롯 재클릭 방지
        const ev = e.touches ? e.touches[0] : e;
        confirmDrop(ev);
        e.stopPropagation();
    };

    const handleInitialDrop = (e) => {
        if (hasMoved) {
            const ev = (e.changedTouches ? e.changedTouches[0] : e);
            confirmDrop(ev);
        } else {
            // 움직임 없는 터치/클릭: '선택 모드'로 전환하여 다음 클릭 시 배치
            window.removeEventListener('mouseup', handleInitialDrop);
            window.removeEventListener('touchend', handleInitialDrop);
            
            // 다음 클릭/탭 시 배치되도록 리스너 추가
            setTimeout(() => {
                window.addEventListener('click', stickyDropHandler, { once: true });
                window.addEventListener('touchstart', (te) => {
                    stickyDropHandler(te);
                }, { once: true });
            }, 50);
        }
    };

    updatePreview(initialEvent);
    if (initialEvent.cancelable) initialEvent.preventDefault();

    window.addEventListener('mousemove', updatePreview);
    window.addEventListener('touchmove', updatePreview, { passive: false });
    window.addEventListener('mouseup', handleInitialDrop);
    window.addEventListener('touchend', handleInitialDrop);
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
    const itemData = storeData.items[key] || defaultStoreData.items[key];
    const itemIconSrc = (defaultStoreData.items[key] && defaultStoreData.items[key].icon) || (itemData && itemData.icon) || '';
    const itemEl = document.createElement('div');
    itemEl.className = `dropped-item item-${key}`;
    itemEl.innerHTML = `<img src="${itemIconSrc}" alt="${itemData.name}">`;

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
                const allItemLevels = [...BONUS_G1_LEVELS, ...BONUS_G2_LEVELS, ...BONUS_G3_LEVELS, ...BONUS_G4_LEVELS];
                const isTutorial = (currentLevel === 0 || displayName === "튜토리얼");

                let isItemDisabled = (count === 0);

                // 아이템 미션이 없는 레벨이라면 비활성화 (튜토리얼 레벨은 사용 가능)
                if (!isTutorial && !allItemLevels.includes(displayName)) {
                    isItemDisabled = true;
                } else if (isTutorial) {
                    // 튜토리얼에서는 최대 4개까지 자유롭게 테스트 배치 가능
                    if (droppedItems.length >= 4) {
                        isItemDisabled = true;
                    }
                } else if (BONUS_G1_LEVELS.includes(displayName)) {
                    if (droppedItems.length >= 1) {
                        isItemDisabled = true;
                    }
                } else if (BONUS_G2_LEVELS.includes(displayName)) {
                    if (droppedItems.length >= 2) {
                        isItemDisabled = true;
                    }
                } else if (BONUS_G3_LEVELS.includes(displayName)) {
                    if (droppedItems.length >= 3) {
                        isItemDisabled = true;
                    }
                } else if (BONUS_G4_LEVELS.includes(displayName)) {
                    if (droppedItems.length >= 4) {
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

            const storeItemIcon = (defaultStoreData.items[key] && defaultStoreData.items[key].icon) || (data && data.icon) || '';
            itemDiv.innerHTML = `
                <div class="item-label-mini">${topLabel}</div>
                <img src="${storeItemIcon}" alt="${data.name}" class="item-icon-mini" onerror="if(this.src.indexOf('${defaultStoreData.items[key]?.icon||''}')===-1)this.src='${defaultStoreData.items[key]?.icon||''}';">
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
                                    const isKor = (currentLanguage === 'kor');
                                    alert(isKor ? "이미 최대 생명(7개)을 보유하고 있습니다." : "You already have maximum lives (7).");
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
                                const isKor = (currentLanguage === 'kor');
                                alert(isKor ? "최소 1개의 생명은 남겨두어야 합니다." : "You must keep at least 1 life.");
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
                    const isTutorial = (currentLevel === 0 || displayName === "튜토리얼");

                    if (isTutorial) {
                        if (droppedItems.length >= 4) return;
                    } else if (BONUS_G1_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 1) return;
                    } else if (BONUS_G2_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 2) return;
                    } else if (BONUS_G3_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 3) return;
                    } else if (BONUS_G4_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 4) return;
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
                    const isTutorial = (currentLevel === 0 || displayName === "튜토리얼");

                    if (isTutorial) {
                        if (droppedItems.length >= 4) return;
                    } else if (BONUS_G1_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 1) return;
                    } else if (BONUS_G2_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 2) return;
                    } else if (BONUS_G3_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 3) return;
                    } else if (BONUS_G4_LEVELS.includes(displayName)) {
                        if (droppedItems.length >= 4) return;
                    } else {

                        // 아이템 미션이 없는 레벨
                        return;
                    }

                    if (upgrades[key] > 0) {
                        if (e.cancelable) e.preventDefault();
                        startDragPlacement(key, e);
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
            checkBirdCollisions();
            checkEagleCollisions();
            checkPianoCollisions();
        }
        updateFish();
        updateBirds();
        updateEagles();
        updateCloudPosition();
        updateRain();
        updateMeteors();
        updateLevel31Planets();
        accumulator -= targetDelta;
    }

    // --- 렌더링 및 UI 업데이트 (실제 모니터 주사율에 맞춰 1회 실행) ---
    balloon.style.bottom = `calc(8.05% + ${balloonY * 0.9195}%)`;
    balloon.style.left = `${balloonX}%`;

    if (isBurning) {
        // 26~30레벨 빗물 페널티 시에는 불꽃이 나오지 않도록 처리
        if ((currentLevel >= 31 && currentLevel <= 35) && Date.now() < rainPowerReductionEndTime) {
            balloon.classList.remove('burning');
        } else {
            balloon.classList.add('burning');
        }
    } else {
        balloon.classList.remove('burning');
    }

    // UI 및 시간 제한 체크
    if (gameState === 'PLAY') {
        const now = Date.now();
        const diffSeconds = (now - missionStartTime) / 1000;
        const timeLeft = Math.max(0, currentMaxTime - diffSeconds);

        const currentGas = Math.floor(gas);
        const currentTime = timeLeft.toFixed(1);

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

        // 실패 및 클리어 조건 체크
        if (timeLeft <= 0 || gas <= 0) {
            if (timeLeft <= 0 && currentLevel === 30) {
                if (gameState === 'PLAY') triggerEvent6WinSequence();
            } else {
                gameOver(timeLeft <= 0 ? 'TIME OUT' : 'NO GAS');
            }
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
    const config = LEVEL_CONFIGS[currentLevel];
    if (!config) return;

    if (LEVEL_CONFIGS[currentLevel]) {
        targetLineX = 50;
        targetLineEl.style.left = `${targetLineX}%`;

        // 레벨별 플랫폼 높이 반영 (비주얼)
        const platformY = config.platformY;
        const targetYBottom = (100 / 7) * platformY;
        let pixelOffset = 12;
        if (config.displayName === "9") pixelOffset = 7;
        if (config.displayName === "10") pixelOffset = -3;
        if (config.displayName === "19" || config.displayName === "20") pixelOffset = 2; // Lowered by 10px from 12
        targetLineEl.style.bottom = `calc(8.05% + ${targetYBottom * 0.9195}% + ${pixelOffset}px)`;

        targetLineEl.classList.toggle('wormhole', config.displayName === "31" || config.displayName === "32");

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
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;

    // Vertical logic (Burner + Gravity)
    let burnDuration = 0;
    if (isBurning) {
        if (continuousBurnStartTime === 0) continuousBurnStartTime = Date.now();
        burnDuration = Date.now() - continuousBurnStartTime;

        if (burnDuration > 2000 && !isSpaceEventLevel(currentDisplayName)) {
            gameOver();
            return;
        }

        let appliedForce = currentBurnerForce;
        if (isSpaceEventLevel(currentDisplayName)) {
            // 우주 분사 가속: 가스 분사할 때마다 속도가 누적 가산 (기존의 1/5 수준: +0.0016/frame)
            const effectiveBurnDuration = Math.min(burnDuration, 2000);
            const burnTimeFactor = 1.0 + (effectiveBurnDuration / 400) * 0.5;
            appliedForce = 0.00264 * burnTimeFactor;
        } else if (burnDuration > 500) {
            appliedForce *= 1.155; // 0.5초 이상 누를 시 상승 힘 5.5% 추가 증가 (총 15.5%)
        }

        // 26, 27, 28레벨 빗물 페널티: 2초간 버너 작동 중지 및 상승 제한
        if ((currentLevel === 31 || currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) && Date.now() < rainPowerReductionEndTime) {
            appliedForce = 0;
            if (velY > 0) velY = 0; // 상승 속도 즉시 차단
        }

        if (isSpaceEventLevel(currentDisplayName)) {
            const skyHeight = gameContainer.clientHeight * 0.9195;
            const aspectRatio = (gameContainer.clientWidth > 0) ? (skyHeight / gameContainer.clientWidth) : 1.75;
            velY += appliedForce * joystickVecY;
            velX += appliedForce * joystickVecX * 0.2 * aspectRatio;
        } else {
            velY += appliedForce;
        }

        // 가스 소모 (버너 사용 시 매 프레임 소모)
        if (isSpaceEventLevel(currentDisplayName)) {
            const activeThrusters = (Math.abs(joystickVecX) > 0.25 ? 1 : 0) + (Math.abs(joystickVecY) > 0.25 ? 1 : 0);
            gas -= 0.12 * Math.max(1, activeThrusters);
        } else {
            gas -= 0.45;
        }
    } else {
        continuousBurnStartTime = 0;
    }

    let gravityForce = GRAVITY * activeGravityMultiplier;
    if (isSpaceEventLevel(currentDisplayName)) {
        gravityForce = 0;
    }
    velY -= gravityForce;

    let currentFriction = isSpaceEventLevel(currentDisplayName) ? 1.0 : FRICTION; // 완전 무중력 관성 보존 (마찰 0%, 누적 속도 100% 영구 유지)
    velY *= currentFriction;

    // Limit upward speed (EVENT 6는 상한선 없이 가스 분사할 때마다 무한 누적 가속)
    if (!isSpaceEventLevel(currentDisplayName)) {
        let effectiveMaxUpwardVel = MAX_UPWARD_VELOCITY;
        if (isBurning && burnDuration > 500) {
            effectiveMaxUpwardVel *= 1.155; // 0.5초 이상 누를 시 최대 상승 속도 5.5% 추가 증가 (총 15.5%)
        }
        if (velY > effectiveMaxUpwardVel) velY = effectiveMaxUpwardVel;
    }

    // Horizontal logic (Wind triggered by the center marker dot) & Cloud logic
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const markerOffsetPercentage = (79 / skyHeight) * 100;
    let markerY = balloonY + markerOffsetPercentage;

    let movementScale = 0.2;
    if (isStunned) {
        if (Date.now() < stunEndTime) {
            movementScale *= 0.25; // 기존 50%에서 추가로 50% 더 감소 (총 75% 감소)
            balloon.classList.add('shake-balloon');
        } else {
            isStunned = false;
            balloon.classList.remove('shake-balloon');
        }
    }

    let velMultiplier = 1.0;
    const balloonRadiusW = (16.25 / gameContainer.clientWidth) * 100;
    const balloonRadiusH = (16.25 / skyHeight) * 100;
    if (isInsideLevel26Cloud(balloonX, markerY, balloonRadiusW, balloonRadiusH)) velMultiplier = 0.5;

    // 우주 모드(레벨 31 등) 우주선 최고 속도 제한: 계속 추진해도 무한정 빨라지지 않도록 제한
    if (isSpaceEventLevel(currentDisplayName)) {
        const effectiveVelY = velY * movementScale; // 실제 Y축 프레임당 이동량 (movementScale = 0.2)
        const effectiveVelX = velX;                 // 실제 X축 프레임당 이동량
        const currentSpeed = Math.hypot(effectiveVelX, effectiveVelY);
        const MAX_SPACE_SPEED = 0.21;               // 프레임당 최대 유효 속도 0.21% (기존의 절반, 초당 약 12.5%)
        if (currentSpeed > MAX_SPACE_SPEED) {
            const factor = MAX_SPACE_SPEED / currentSpeed;
            velX *= factor;
            velY *= factor;
        }
    }

    balloonY += velY * movementScale * velMultiplier; // Scaling factor for smoothness

    const zoneHeight = 100 / 7;
    const zoneIndex = Math.min(6, Math.max(0, Math.floor(markerY / zoneHeight)));

    let windForce = ZONE_WINDS[zoneIndex];
    if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3" && !isSpaceEventLevel(currentDisplayName)) windForce *= level11WindMultiplier;
    windForce += tempWindBoosts[zoneIndex];

    velX += windForce * 0.00165; 
    velX *= currentFriction;

    let finalVelX = velX;
    if (isStunned) finalVelX *= 0.5; // 가로 속도도 50% 감소

    balloonX += finalVelX * velMultiplier;


    // Platform Dimensions
    const platformHeightPercentage = (9 / skyHeight) * 100;
    const config = LEVEL_CONFIGS[currentLevel];
    const platformY = config.platformY;
    let pixelOffset = 12;
    if (config.displayName === "9") pixelOffset = 7;
    if (config.displayName === "10") pixelOffset = -3;
    if (config.displayName === "19" || config.displayName === "20") pixelOffset = 2; // Lowered by 10px from 12
    if (config.displayName === "EVENT 2" || config.displayName === "EVENT 3" || config.displayName === "EVENT 4" || config.displayName === "EVENT 6") pixelOffset = 12 - 50; // 50px down
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
            const isLevel31 = config.displayName === "31" || config.displayName === "32";
            const isTouchingTop = isLevel31
                ? (basketY <= platTop + 1.2 && basketY >= platBottom)
                : (basketY <= platTop + 0.3 && basketY >= platTop - 0.7);

            if (isTouchingTop) {
                // 게임 시작 직후 바로 클리어 방지 (최소 2초 비행 필요)
                const isFreshStart = (Date.now() - missionStartTime) < 2000;
                if ((velY < 0 || isLevel31) && !isFreshStart) { // Moving Top -> Bottom (or touching wormhole top in LV-31)
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

    const val = coin.value || 10;
    sessionEventCredits += val;
    if (eventCreditsValEl) eventCreditsValEl.innerText = sessionEventCredits;

    const isAlreadyCleared = clearedLevels.includes(currentLevel);
    if (shouldAllowEventCredits()) {
        totalCredits += val;
        recordEventCreditGain();
        if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;
        console.log("Credits added:", totalCredits);
    } else {
        console.log("Already cleared level - coin points not added to total");
    }

    playCoinSound();

    // 열기구 위에 획득 점수 (+10 또는 +200) 표시
    const plusText = document.createElement('div');
    plusText.className = 'popcorn-plus-text';
    plusText.innerText = `+${val}`;
    plusText.style.left = `${balloonX}%`;
    plusText.style.bottom = `${8.05 + (balloonY * 0.9195) + 12}%`; // 열기구 본체보다 약간 위
    plusText.style.zIndex = '500';
    gameContainer.appendChild(plusText);
    setTimeout(() => plusText.remove(), 800);
    
    if (val >= 200) {
        showFloatingText(`+${val}C RAINBOW BONUS!`, "#ffd32a");
        gameContainer.classList.add('bonus-glimmer');
        setTimeout(() => gameContainer.classList.remove('bonus-glimmer'), 500);
    }

    setTimeout(() => {
        coin.el.remove();
    }, 500);
}

function getMarkerOffset() {
    const skyHeight = gameContainer.clientHeight * 0.9195;
    return (79 / skyHeight) * 100; // 79px from balloon bottom
}

function getBasketOffset() {
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const basketPixels = (140 * 0.58) - 30; // 51.2px from balloon bottom
    return (basketPixels / skyHeight) * 100;
}

let hasLiftedOffLevel31 = false;

function checkBoundaries() {
    const basketOffsetPercentage = getBasketOffset();
    const config = LEVEL_CONFIGS[currentLevel];
    const isEventLevel = config && config.displayName.startsWith("EVENT");

    if (config && config.displayName === "EVENT 6") {
        if (balloonY < -basketOffsetPercentage) {
            balloonY = -basketOffsetPercentage;
            if (velY < 0) velY = 0; // 최하단에서 반사 없이 정지
        }
        if (balloonY > 100) {
            balloonY = 100;
            if (velY > 0) velY = -velY * 0.4; // 우주 무중력 상단 탄성 반사
        }
    } else if (config && (config.displayName === "31" || config.displayName === "32")) {
        if (balloonY < -basketOffsetPercentage) {
            balloonY = -basketOffsetPercentage;
            if (velY < 0) velY = 0; // 최하단에서는 폭발하지 않고 정지
        }
        const skyHeight = (gameContainer.clientHeight || 640) * 0.9195;
        const maxLevel31Y = 100 - ((95 / skyHeight) * 100);
        if (balloonY > maxLevel31Y) {
            balloonY = maxLevel31Y;
            velY = 0;
            gameOver('CRASH');
            return;
        }
    } else {
        if (balloonY < -basketOffsetPercentage) {
            balloonY = -basketOffsetPercentage;
            velY = 0;
        }
        if (balloonY > 105) {
            balloonY = 105;
            gameOver();
        }
    }

    if (balloonX < 5) {
        balloonX = 5;
        if (config && config.displayName === "EVENT 6") {
            if (velX < 0) velX = -velX * 0.4; // 우주 무중력 좌측 탄성 반사
        } else if (!isEventLevel) {
            gameOver('CRASH');
        }
    }
    if (balloonX > 95) {
        balloonX = 95;
        if (config && config.displayName === "EVENT 6") {
            if (velX > 0) velX = -velX * 0.4; // 우주 무중력 우측 탄성 반사
        } else if (!isEventLevel) {
            gameOver('CRASH');
        }
    }

    // EVENT 4: 낚싯대 자동 반전 (벽에 닿을 때)
    if (config && config.displayName === "EVENT 4" && fishingGearEl) {
        if (balloonX < 15) {
            fishingGearEl.classList.remove('flipped');
        } else if (balloonX > 85) {
            fishingGearEl.classList.add('flipped');
        }
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

    resetJoystick(); if (typeof resetDpad === 'function') resetDpad();
    isBurning = false;
    soundMgr.stop('burner');

    const config = LEVEL_CONFIGS[currentLevel];
    const isEventLevel = config && config.displayName.startsWith("EVENT");

    if (isEventLevel) {
        // 이벤트 레벨에서는 터져도 클리어로 간주 (상태를 즉시 CLEAR로 변경하여 이동 중지)
        gameState = 'CLEAR';
        balloon.classList.add('explosion');
        gameContainer.classList.add('shake');
        soundMgr.play('explosion');
        
        setTimeout(() => {
            winGame();
        }, 500);
        return;
    }

    gameState = 'GAMEOVER';
    attachedFish = null;
    isStunned = false;
    balloon.classList.remove('shake-balloon');
    activeBirds.forEach(bird => bird.el.classList.remove('shake-bird'));
    activeEagles.forEach(eagle => eagle.el.classList.remove('shake-bird'));
    updateNextLevelButtonVisibility(); // 즉시 화살표 표시

    // 11~20레벨 실패 시 바람 방향을 처음 시작 방향(multiplier=1)으로 복구
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3" && currentDisplayName !== "EVENT 6") {
        level11WindMultiplier = 1;
        if (showWindLabels) updateWindLabels();
        if (windCountdownEl) windCountdownEl.classList.add('hidden');
    }

    const isEvent2 = config && config.displayName === "EVENT 2";

    if (isEvent2) {
        // 미션 실패해도 EVENT 2에서 얻은 요리 점수는 합산
        const displayCookedPct = Math.floor(cookedPercentage * 2);
        const earnedScore = displayCookedPct * 10;
        const isAlreadyCleared = clearedLevels.includes(currentLevel);
        if (earnedScore > 0) {
            if (shouldAllowEventCredits()) {
                totalCredits += earnedScore;
                recordEventCreditGain();
                console.log(`EVENT 2 Failed: Added ${earnedScore}C from cooking.`);
            }
        }
    }

    const isTutorialLevel = currentLevel === 0 || (config && config.displayName === "튜토리얼");

    if (!isEventLevel && !isTutorialLevel) {
        lives--;
        if (lives < 7 && lives >= 0) {
            // 생명이 깎인 시점부터 충전 타이머 시작 (이미 충전 중이 아니라면)
            if (lives === 6) lastLifeUpdate = Date.now();
        }
    } else {
        console.log("Life reduction skipped: Event or Tutorial Level.");
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

        const isKor = (currentLanguage === 'kor');
        const alertMsg = isKor ?
            `모든 생명을 잃었습니다! 1개가 충전될 때까지 약 ${waitMin}분 기다려야 합니다.` :
            `You lost all lives! Please wait ~${waitMin} min for 1 life to recharge.`;
        alert(alertMsg);

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
        // 화면 밖으로 나가지 않도록 Clamp 처리
        let clampedX = Math.min(72, Math.max(28, balloonX));
        failReasonBubble.style.left = `${clampedX}%`;

        // 상단 화면 밖으로 나가지 않도록 처리 (말풍선 높이 165px 고려)
        if (balloonY > 60) {
            failReasonBubble.style.bottom = `min(calc(100% - 175px), calc(8.05% + ${balloonY * 0.9195}% - 50px))`;
        } else {
            failReasonBubble.style.bottom = `calc(8.05% + ${balloonY * 0.9195}% + 140px)`; // 기존처럼 풍선 위로
        }

        failReasonBubble.classList.remove('hidden');
        setTimeout(() => {
            failReasonBubble.classList.add('hidden');
        }, 2000); // 2.0초 동안 보이게 수정
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
            if (currentLevel === 0 || currentDisplayName === "튜토리얼" || BONUS_G1_LEVELS.includes(currentDisplayName) || BONUS_G2_LEVELS.includes(currentDisplayName) || BONUS_G3_LEVELS.includes(currentDisplayName) || BONUS_G4_LEVELS.includes(currentDisplayName)) {
                levelHintEl.classList.remove('hidden');
            }
        }
    }, 2000); // 2-second wait

    
    // 랭킹에 실패 시 획득한 부분 점수 기록 (주로 이벤트 레벨)
    let failScore = 0;
    if (isEvent2) {
        failScore = Math.floor(cookedPercentage * 2) * 10;
    } else if (config && (config.displayName === "EVENT 1" || config.displayName === "EVENT 3" || isSpaceEventLevel(config.displayName))) {
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
    resetJoystick(); if (typeof resetDpad === 'function') resetDpad();
    isBurning = false;
    soundMgr.stop('burner');
    attachedFish = null;
    isStunned = false;
    balloon.classList.remove('shake-balloon');
    
    // 11~20레벨 클리어 시 바람 방향을 처음 시작 방향(multiplier=1)으로 복구
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3" && !isSpaceEventLevel(currentDisplayName)) {
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
    const displayTimeLeft = Number(timeLeft.toFixed(1));
    const timeScore = Math.round(displayTimeLeft * 10);

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

    // 모든 일반 레벨에서 착륙 성공 시 최소 20점 보장
    if (!isSteakEvent && landingBonus < 20) {
        landingBonus = 20;
    }

    const score = Math.floor(gas) + timeScore + landingBonus;

    let itemBonus = 0;
    const currentItemCount = getTotalItemsCount();
    const actualItemsDecreased = Math.max(0, initialItemCount - currentItemCount);

    // 아이템을 사용하는 레벨에만 아이템 보너스 부여, 아이템 미사용 레벨은 0점
    if (BONUS_G1_LEVELS.includes(currentDisplayName)) {
        // Group 1: 0개 줄면 200점, 1개 이상 줄면 0점
        if (actualItemsDecreased === 0) {
            itemBonus = 200;
        } else {
            itemBonus = 0;
        }
    } else if (BONUS_G2_LEVELS.includes(currentDisplayName)) {
        // Group 2 (19레벨 등): 0개 줄면 400점, 1개 줄면 200점, 2개 이상 줄면 0점
        if (actualItemsDecreased === 0) {
            itemBonus = 400;
        } else if (actualItemsDecreased === 1) {
            itemBonus = 200;
        } else {
            itemBonus = 0;
        }
    } else if (BONUS_G3_LEVELS.includes(currentDisplayName)) {
        if (actualItemsDecreased === 0) itemBonus = 600;
        else if (actualItemsDecreased === 1) itemBonus = 400;
        else if (actualItemsDecreased === 2) itemBonus = 200;
        else itemBonus = 0;
    } else if (BONUS_G4_LEVELS.includes(currentDisplayName)) {
        if (actualItemsDecreased === 0) itemBonus = 800;
        else if (actualItemsDecreased === 1) itemBonus = 600;
        else if (actualItemsDecreased === 2) itemBonus = 400;
        else if (actualItemsDecreased === 3) itemBonus = 200;
        else itemBonus = 0;
    } else {
        // 아이템을 사용하지 않는 레벨은 아이템 보너스 미합산
        itemBonus = 0;
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
            const label = (currentLanguage === 'kor') ? '굽기' : 'COOKED';
            resultFormulaEl.innerHTML = `${label}: ${displayCookedPct}% * 10`;
        }
    } else {
        if (resultScoreEl) resultScoreEl.innerText = isSteakEvent ? (displayCookedPct * 10) : (score + itemBonus);
        if (resultFormulaEl) {
            let formula = `(${Math.floor(gas)} + (${displayTimeLeft.toFixed(1)} * 10) + <span style="color: #ffd32a;">${landingBonus}</span>)`;
            if (itemBonus > 0) {
                formula += ` + <span style="color: #2ecc71;">${itemBonus}(ITEM BONUS)</span>`;
            }
            resultFormulaEl.innerHTML = formula;
        }
    }

    let scoreForRank = isSteakEvent ? (displayCookedPct * 10) : (score + itemBonus);

    if (isEventLevel) {
        if (shouldAllowEventCredits()) {
            if (isSteakEvent) {
                finalScore = (displayCookedPct * 10);
            } else {
                // EVENT 1, 3, 4는 플레이 중 이미 크레딧을 실시간 획득하므로
                // 클리어(가스/시간) 보너스를 0으로 설정하여 중복 지급을 방지합니다.
                finalScore = 0;
            }
            if (finalScore > 0) recordEventCreditGain();
        } else {
            finalScore = 0;
        }
        // Removed showEventBonusText call
    } else {
        // 일반 레벨: 최고기록 경신 시에만 (새로운 점수 - 기존 최고기록) 만큼의 크레딧을 추가로 지급
        const oldBest = myLevelBestScores[currentLevel] || 0;
        const isKor = (currentLanguage === 'kor');
        if (scoreForRank > oldBest) {
            finalScore = scoreForRank - oldBest;
            if (resultFormulaEl) {
                const isTop1 = (typeof isTopRankScore === 'function') ? isTopRankScore(currentLevel, scoreForRank) : false;
                let recordText = "";
                if (isTop1) {
                    recordText = (isAlreadyCleared && oldBest > 0)
                        ? (isKor ? `(신기록 달성! +${finalScore}C 추가 획득)` : `(New Record! +${finalScore}C earned)`)
                        : (isKor ? `(신기록 달성! +${finalScore}C 획득)` : `(New Record! +${finalScore}C earned)`);
                } else {
                    recordText = (isAlreadyCleared && oldBest > 0)
                        ? (isKor ? `(+${finalScore}C 추가 획득)` : `(+${finalScore}C earned)`)
                        : (isKor ? `(+${finalScore}C 획득)` : `(+${finalScore}C earned)`);
                }
                resultFormulaEl.innerHTML += `<br><span style="color: #ffd32a; font-size: 0.8em;">${recordText}</span>`;
            }
        } else {
            finalScore = 0;
            if (isAlreadyCleared && resultFormulaEl) {
                const notBeatenText = isKor ? `(최고기록 미달성 - 기존: ${oldBest})` : `(Best record not beaten - Best: ${oldBest})`;
                resultFormulaEl.innerHTML += `<br><span style="color: #666; font-size: 0.7em;">${notBeatenText}</span>`;
            }
        }
    }


    // 랭킹용 점수 계산 (클리어 보너스나 누적 점수 포함하여 그 레벨만의 점수 기록)
    if (isEventLevel) {
        // Changed: Removed +200 clear bonus for rank
        const evtName = LEVEL_CONFIGS[currentLevel].displayName;
        if(evtName === "EVENT 1" || evtName === "EVENT 3" || isSpaceEventLevel(evtName)) scoreForRank += sessionEventCredits;
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

    if (currentDisplayName.startsWith("EVENT")) {
        if (clearScreen) clearScreen.classList.add('hidden');
        if (eventClearScreen) {
            // 이벤트 전용 데이터는 업데이트하되 창은 띄우지 않음
            if (eventResultScoreEl) {
                let eventScore = 0;
                if (currentDisplayName === "EVENT 1" || currentDisplayName === "EVENT 3" || currentDisplayName === "EVENT 6") eventScore = sessionEventCredits;
                else if (currentDisplayName === "EVENT 4") eventScore = event4FishCaughtScore;
                eventResultScoreEl.innerText = eventScore;
            }
            if (eventAccumulatedTotalEl) eventAccumulatedTotalEl.innerText = totalCredits;
            eventClearScreen.classList.add('hidden'); 
        }

        // 광고 보너스 등으로 이벤트 게임 진입 후 종료 시: 직전에 플레이하던 레벨로 자동 복귀!
        if (previousLevelBeforeRewardedEvent !== null || isRewardedEventPlay) {
            const targetReturnLevel = (previousLevelBeforeRewardedEvent !== null) ? previousLevelBeforeRewardedEvent : 1;
            const returnDisplayName = LEVEL_CONFIGS[targetReturnLevel]?.displayName || targetReturnLevel;

            let earnedMsg = "";
            const isKor = (currentLanguage === 'kor');
            if (currentDisplayName === "EVENT 1" || currentDisplayName === "EVENT 3" || currentDisplayName === "EVENT 6") {
                earnedMsg = sessionEventCredits > 0 ? (isKor ? ` (+${sessionEventCredits}C 획득)` : ` (+${sessionEventCredits}C earned)`) : "";
            } else if (currentDisplayName === "EVENT 4") {
                earnedMsg = event4FishCaughtScore > 0 ? (isKor ? ` (+${event4FishCaughtScore}C 획득)` : ` (+${event4FishCaughtScore}C earned)`) : "";
            }

            setTimeout(() => {
                const returnAlertMsg = isKor ?
                    `이벤트 게임 종료!${earnedMsg}\n이전에 플레이하던 [LV-${returnDisplayName}] 레벨로 돌아갑니다.` :
                    `Event game finished!${earnedMsg}\nReturning to previous [LV-${returnDisplayName}].`;
                alert(returnAlertMsg);
                currentLevel = targetReturnLevel;
                previousLevelBeforeRewardedEvent = null;
                isRewardedEventPlay = false;
                resetGame();
                updateNextLevelButtonVisibility();
            }, 600);
        }
    } else {
        if (eventClearScreen) eventClearScreen.classList.add('hidden');
        clearScreen.classList.remove('hidden'); // 일반 레벨만 점수판 노출
    }

    updateNextLevelButtonVisibility();

    // 벌룬 이미지가 터진 상태면 복구 (리셋용)
    balloon.classList.remove('explosion');
    balloon.style.opacity = "1";
    balloon.style.transform = "translateX(-50%) scale(1)";

    soundMgr.play('success');

}

function triggerEvent6WinSequence() {
    if (gameState !== 'PLAY') return;
    gameState = 'CLEAR'; // 상태 중지
    resetJoystick(); if (typeof resetDpad === 'function') resetDpad();
    isBurning = false;
    soundMgr.stop('burner');
    
    // 폭발 효과음 재생
    if (soundMgr.play) soundMgr.play('explosion');
    
    // 풍선 터지는 애니메이션 클래스 추가
    balloon.classList.add('explosion');
    
    // 0.8초 후 실제 윈 게임 처리
    setTimeout(() => {
        winGame();
    }, 800);
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

            // 1구역 우측끝(i=9) 또는 7구역 우측끝(i=9)인 경우 무지개 코인 적용
            const isSpecialCoin = (zoneId === 1 && i === 9) || (zoneId === 7 && i === 9);
            if (isSpecialCoin) {
                c.classList.add('rainbow-coin');
            }

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
                collected: false,
                value: isSpecialCoin ? 200 : 10
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
        if (currentLevel >= 13 && currentLevel <= 23 && currentDisplayName !== "EVENT 3" && currentDisplayName !== "EVENT 6") wind *= level11WindMultiplier;
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

function handleLevelTransition() {
    const isNowTutorial = isTutorialLevel(currentLevel);
    const wasTutorial = (lastKnownLevel !== null) && isTutorialLevel(lastKnownLevel);

    if (lastKnownLevel !== null && lastKnownLevel !== currentLevel) {
        if (wasTutorial && !isNowTutorial) {
            // 튜토리얼 레벨에서 레벨 1 또는 다른 레벨로 넘어갈 때:
            // 튜토리얼 체험용 크레딧/아이템은 버리고, 원래 다른 레벨에서 획득했던 실제 크레딧과 아이템을 복구!
            totalCredits = realCredits;
            upgrades = JSON.parse(JSON.stringify(realUpgrades));
            clearDroppedItems();
            savePlayerData();
            if (typeof updateStoreUI === 'function') updateStoreUI(false);
            console.log(`[Level Transition] Left Tutorial -> Restored real credits (${realCredits}) and real items (Level ${lastKnownLevel} -> ${currentLevel})`);
        } else if (!wasTutorial && isNowTutorial) {
            // 다른 레벨에서 튜토리얼 레벨로 이동할 때:
            // 현재까지 다른 레벨에서 획득한 실제 크레딧과 아이템을 영구 보존
            realCredits = totalCredits;
            realUpgrades = JSON.parse(JSON.stringify(upgrades));
            localStorage.setItem('balloon_real_credits', realCredits);
            localStorage.setItem('balloon_real_upgrades', JSON.stringify(realUpgrades));
            localStorage.setItem('balloon_credits', totalCredits);
            localStorage.setItem('balloon_upgrades', JSON.stringify(upgrades));

            // 튜토리얼 전용 500 크레딧 부여 및 체험용 아이템 0으로 세팅
            totalCredits = 500;
            upgrades = {
                clock: 0,
                fan_left: 0,
                fan_right: 0,
                gas_item: 0,
                weight: 0
            };
            clearDroppedItems();
            savePlayerData();
            if (typeof updateStoreUI === 'function') updateStoreUI(false);
            console.log(`[Level Transition] Entered Tutorial -> Saved real credits (${realCredits}), granted 500 tutorial credits (Level ${lastKnownLevel} -> ${currentLevel})`);
        }
    } else if (isNowTutorial) {
        // 튜토리얼 레벨에 머무르는 도중:
        // 만약 크레딧이 0이고 보유/배치된 아이템도 전혀 없다면 500 크레딧 재충전 (체험 유지용)
        const totalItemsCount = (upgrades.clock || 0) + (upgrades.fan_left || 0) + (upgrades.fan_right || 0) + (upgrades.gas_item || 0) + (upgrades.weight || 0) + (typeof droppedItems !== 'undefined' ? droppedItems.length : 0);
        if (totalCredits === 0 && totalItemsCount === 0) {
            totalCredits = 500;
            savePlayerData();
            if (typeof updateStoreUI === 'function') updateStoreUI(false);
        }
    }

    lastKnownLevel = currentLevel;
}

function resetGame() {
    handleLevelTransition();
    gameState = 'START';
    isStunned = false; 
    balloon.classList.remove('shake-balloon');
    activeBirds.forEach(bird => bird.el.classList.remove('shake-bird'));
    activeEagles.forEach(eagle => eagle.el.classList.remove('shake-bird'));
    const config = LEVEL_CONFIGS[currentLevel];
    
    const balloonImg = document.getElementById('balloon-img');
    const groundEl = document.getElementById('ground');
    if (balloonImg) {
        if (isSpaceEventLevel(config.displayName)) {
            balloonImg.src = 'space_balloon.png';
            balloonImg.classList.add('space-balloon');
            balloon.classList.add('space-mode');
            balloon.classList.toggle('level31-mode', config.displayName === "31" || config.displayName === "32");
            if (groundEl) {
                groundEl.classList.add('space-ground');
                groundEl.classList.toggle('no-globe', config.displayName === "31" || config.displayName === "32");
            }
            if (mainActionBtn) mainActionBtn.classList.add('hidden');
            if (event6Joystick) event6Joystick.classList.remove('hidden');
            resetJoystick();
        } else {
            balloonImg.src = 'balloon.png';
            balloonImg.classList.remove('space-balloon');
            balloon.classList.remove('space-mode', 'level31-mode');
            if (groundEl) {
                groundEl.classList.remove('space-ground', 'no-globe');
            }
            if (mainActionBtn) mainActionBtn.classList.remove('hidden');
            if (event6Joystick) event6Joystick.classList.add('hidden');
            resetJoystick();
        }
    }

    // Apply level-specific sky color if defined
    if (config.skyColor) {
        gameContainer.style.background = config.skyColor;
    } else {
        gameContainer.style.background = ''; // Use CSS default
    }

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
    } else if (config.displayName === "EVENT 6") {
        balloonY = -getBasketOffset() + (100 / 14);
    } else {
        balloonY = -getBasketOffset();
    }

    velX = 0;
    velY = 0;
    isBurning = false;
    hasEnteredZone7 = false;
    hasLiftedOffLevel31 = false;
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
    if (timeTextEl) timeTextEl.innerText = Number(currentMaxTime).toFixed(1);
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

    // EVENT 5 전용: 피아노 건반 표시
    if (config.displayName === "EVENT 5") {
        if (pianoContainer) pianoContainer.classList.remove('hidden');
    } else {
        if (pianoContainer) pianoContainer.classList.add('hidden');
    }

    // EVENT 5 전용: 오선지 및 점수판 초기화
    if (config.displayName === "EVENT 5") {
        if (musicStaff) {
            musicStaff.classList.remove('hidden');
            musicStaff.style.left = '50%'; // 가운데 고정
            
            // 멜로디 1, 2, 3 중 하나 랜덤 선택
            currentEvent6Melody = EVENT6_MELODIES[Math.floor(Math.random() * EVENT6_MELODIES.length)];
            currentEvent6NoteIndex = 0;
            currentEvent6Note = currentEvent6Melody[currentEvent6NoteIndex];
            
            updateMelodyVisuals();
        }
        if (musicScoreBoard) {
            musicScoreBoard.classList.remove('hidden');
            if (musicCreditsValEl) musicCreditsValEl.innerText = '0';
        }
        currentEvent6Score = 0;
    } else {
        if (musicStaff) musicStaff.classList.add('hidden');
        if (musicScoreBoard) musicScoreBoard.classList.add('hidden');
    }

    console.log(`Resetting to Level ${currentLevel}`);
    rainSeed = currentLevel + 777; // 레벨별로 다른 시드 부여, 재시작 시 동일 패턴 보장
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
    } else if (config.displayName === "EVENT 5") {
        sessionEventCredits = 0;
        if (musicCreditsValEl) musicCreditsValEl.innerText = "0";
        if (eventCreditsValEl) eventCreditsValEl.innerText = "0";
    } else if (config.displayName === "EVENT 2") {
        clearCoins();
        if (eventCounterEl) eventCounterEl.classList.add('hidden');
        if (event2FloatingScore) {
            event2FloatingScore.classList.remove('hidden');
            const label = (currentLanguage === 'kor') ? '굽기' : 'COOKED';
            if (event2CookedPctEl) event2CookedPctEl.innerText = `${label}: 0%`;
            if (event2CookedScoreEl) event2CookedScoreEl.innerText = "0";
        }
    } else if (isSpaceEventLevel(config.displayName)) {
        clearCoins();
        clearMeteors();
        initLevel31Planets();
        sessionEventCredits = 0;
        if (eventCreditsValEl) eventCreditsValEl.innerText = "0";
        if (eventCounterEl) {
            if (config.displayName === "EVENT 6") {
                eventCounterEl.classList.remove('hidden');
                const coinIcon = eventCounterEl.querySelector('img');
                if (coinIcon) coinIcon.style.display = 'inline-block';
            } else {
                eventCounterEl.classList.add('hidden');
            }
        }
        if (event2FloatingScore) event2FloatingScore.classList.add('hidden');
        if (event3FloatingScore) event3FloatingScore.classList.add('hidden');
        if (event4FloatingScore) event4FloatingScore.classList.add('hidden');
    } else {
        clearCoins();
        clearMeteors();
        clearLevel31Planets();
        if (eventCounterEl) eventCounterEl.classList.add('hidden');
        if (event2FloatingScore) event2FloatingScore.classList.add('hidden');
        if (event3FloatingScore) event3FloatingScore.classList.add('hidden');
        if (event4FloatingScore) event4FloatingScore.classList.add('hidden');
    }

    // EVENT 4: 바다 표현 및 낚싯대 추가
    if (config.displayName === "EVENT 4") {
        if (seaOverlayEl) seaOverlayEl.classList.remove('hidden');
        if (fishingGearEl) {
            fishingGearEl.classList.remove('hidden');
            fishingGearEl.classList.remove('flipped');
        }
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

    // Level 21, 22, 25, 27, 30: Bird Obstacles
    if (currentLevel === 25 || currentLevel === 26 || currentLevel === 29 || currentLevel === 32) {
        createBirds();
    } else {
        clearBirds();
    }

    // Level 23, 24, 25, 29, 30: Eagle Obstacles
    if (currentLevel === 27 || currentLevel === 28 || currentLevel === 29 || currentLevel === 34 || currentLevel === 35) {

        createEagles();
    } else {
        clearEagles();
    }

    // Level 26, 27, 28, 29, 30: Cloud decoration
    if (currentLevel === 31 || currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {


        addLevel26Cloud();
    } else {
        removeLevel26Cloud();
    }

    attachedFish = null;

    // Clear accumulated popcorn
    document.querySelectorAll('.settled-popcorn').forEach(p => p.remove());
    settledPopcornItems = [];

    if (levelHintEl) {
        levelHintEl.classList.remove('level-8-hint');
        const displayName = config.displayName;
        const isTutorial = (currentLevel === 0 || displayName === "튜토리얼");
        if (isTutorial) {
            levelHintEl.innerHTML = (currentLanguage === 'kor') ?
                `<div class="tutorial-main-title">HOT AIR BALLOON<br>ADVENTURE</div><div class="tutorial-sub-guide">START 와 BURNER를 터치하여<br>상단 녹색 패드에 착륙 하세요!</div>` :
                `<div class="tutorial-main-title">HOT AIR BALLOON<br>ADVENTURE</div><div class="tutorial-sub-guide">Touch START and BURNER<br>to land on the green pad!</div>`;
            levelHintEl.classList.remove('hidden');
        } else if (BONUS_G1_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = (currentLanguage === 'kor') ? `아이템 1개 이하 사용` : `Use 1 item or less`;
            levelHintEl.classList.remove('hidden');
        } else if (BONUS_G2_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = (currentLanguage === 'kor') ? `아이템 2개 이하 사용` : `Use 2 items or less`;
            levelHintEl.classList.remove('hidden');
        } else if (BONUS_G3_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = (currentLanguage === 'kor') ? `아이템 3개 이하 사용` : `Use 3 items or less`;
            levelHintEl.classList.remove('hidden');
        } else if (BONUS_G4_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = (currentLanguage === 'kor') ? `아이템 4개 이하 사용` : `Use 4 items or less`;
            levelHintEl.classList.remove('hidden');
        } else {
            levelHintEl.classList.add('hidden');
        }

        if (!levelHintEl.classList.contains('hidden')) {
            if (isTutorial) {
                levelHintEl.style.top = '43%';
                levelHintEl.style.bottom = 'auto';
                levelHintEl.style.transform = 'translate(-50%, -50%)';
                levelHintEl.style.left = '50%';
                levelHintEl.style.width = '90%';
                levelHintEl.style.fontSize = '1.05rem';
                levelHintEl.style.lineHeight = '1.5';
                levelHintEl.style.wordBreak = 'keep-all';
                levelHintEl.style.textAlign = 'center';
                levelHintEl.style.position = 'absolute';
            } else {
                // Position level-hint at the bottom center of Zone 2
                levelHintEl.style.top = 'auto';
                levelHintEl.style.bottom = `calc(8.05% + (91.95% / 7) + 10px)`; // Bottom of Zone 2
                levelHintEl.style.transform = 'translateX(-50%)';
                levelHintEl.style.left = '50%';
                levelHintEl.style.width = '100.0%';
                levelHintEl.style.fontSize = '';
                levelHintEl.style.lineHeight = '';
                levelHintEl.style.wordBreak = '';
                levelHintEl.style.textAlign = 'center';
                levelHintEl.style.position = 'absolute';
            }
        }
    }
}


function addLevel26Cloud() {
    removeLevel26Cloud();
    
    const zoneHeight = 100 / 7;
    let z = 1; // 기본은 2구역
    let sizeScale = 1.0;
    let posShiftPct = 0; // 추가적인 위치 이동량 (백분율)

    if (currentLevel === 31) {
        z = 6; // 레벨 26: 7구역
        sizeScale = 0.6; // 크기 60%
        posShiftPct = -(zoneHeight * 0.2) - (zoneHeight / 6); // 점선 가이드를 1/6구역만큼 추가 하향
    } else if (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
        z = 5; // 레벨 27, 28, 29, 30은 6구역
    } else return;

    // 1. 필요한 수치 계산 (물리 판정, 점선 가이드, 구름 이미지 모두에 사용)
    const skyWidth = gameContainer.clientWidth;
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const cloudWidth = 384 * sizeScale;
    const halfWidthPct = (cloudWidth / skyWidth) * 100 / 2;
    const quarterZonePct = (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) ? (zoneHeight / 4) : 0;



    const cloudOffset = 35;
    const pixelOffsetPct = (cloudOffset / skyHeight) * 100;

    
    // isInsideLevel26Cloud의 로직을 그대로 재현
    const baseCloudBottom = z * zoneHeight - 2 + pixelOffsetPct + quarterZonePct + posShiftPct;
    const baseCloudTop = (z + 1) * zoneHeight + 2 + quarterZonePct + posShiftPct;

    const baseHeight = baseCloudTop - baseCloudBottom;
    const height = baseHeight * sizeScale;
    const centerY = baseCloudBottom + baseHeight / 2;
    const expandedHalfHeight = (height * 1.1) / 2;
    
    const cloudBottomY = centerY - expandedHalfHeight;
    const cloudCenterTopY = centerY + expandedHalfHeight;

    const skyBg = document.getElementById('sky-background');

    // 2. 하단 구름 이미지 생성 (시각적 장식)
    // 점선 크기와 동일하게 백분율(%)로 크기 및 위치 조정
    if (skyBg) {
        const cloud = document.createElement('img');
        cloud.src = 'cloud1.png';
        cloud.className = 'level26-cloud';
        if (currentLevel === 33 || currentLevel === 34 || currentLevel === 35) cloud.classList.add('storm-cloud');
        cloud.style.position = 'absolute';
        cloud.style.left = '50%';
        cloud.style.bottom = `${cloudBottomY - (100 / 60) - (zoneHeight / 5) + (zoneHeight / 6)}%`; // 구름 이미지는 그대로 유지
        cloud.style.width = `${(halfWidthPct * 2) * 1.1}%`; 
        cloud.style.height = `${(cloudCenterTopY - cloudBottomY) * 1.1}%`; 
        cloud.style.transform = 'translateX(-50%) scaleY(3.0)';
        cloud.style.zIndex = '15';
        cloud.style.opacity = '0.4';
        cloud.style.pointerEvents = 'none';
        cloud.style.maxWidth = 'none';  // 스마트폰 등 소형 화면에서 이미지 크기 제한 방지
        cloud.style.maxHeight = 'none';
        cloud.style.objectFit = 'fill'; // 정확한 백분율 크기에 맞춰 늘어남
        skyBg.appendChild(cloud);
    }

    // 3. 점선 가이드 생성 (실제 물리 판정 영역 시각화)
    if (skyBg) {
        const svgNamespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNamespace, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");
        svg.classList.add("level26-cloud-guide-svg");
        svg.style.position = "absolute";
        svg.style.left = "0";
        svg.style.top = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "14";
        svg.style.display = showCloudGuides ? 'block' : 'none';


        const polygon = document.createElementNS(svgNamespace, "polygon");
        
        const slantFactorRight = Math.tan(20 * Math.PI / 180);
        const slantFactorLeft = Math.tan(15 * Math.PI / 180);
        const dxPixels = (halfWidthPct / 100) * skyWidth;
        const dyGameUnitsRight = (dxPixels * slantFactorRight / skyHeight) * 100;
        const dyGameUnitsLeft = (dxPixels * slantFactorLeft / skyHeight) * 100;

        const currentTopRightTop = baseCloudTop - dyGameUnitsRight; // 상단은 산 모양으로 반전
        const currentTopLeftTop = baseCloudTop - dyGameUnitsLeft;
        const currentTopRightBot = baseCloudTop + dyGameUnitsRight; // 하단은 계곡 모양 그대로 유지
        const currentTopLeftBot = baseCloudTop + dyGameUnitsLeft;
        const currentTopCenter = baseCloudTop;

        const lx = 50 - halfWidthPct;
        const rx = 50 + halfWidthPct;
        const mx = 50;

        const lyTop = ((currentTopLeftTop + baseCloudBottom) / 2) + ((currentTopLeftTop - baseCloudBottom) * sizeScale * 1.1) / 2;
        const ryTop = ((currentTopRightTop + baseCloudBottom) / 2) + ((currentTopRightTop - baseCloudBottom) * sizeScale * 1.1) / 2;
        const myTop = ((currentTopCenter + baseCloudBottom) / 2) + ((currentTopCenter - baseCloudBottom) * sizeScale * 1.1) / 2;

        const lyBot = ((currentTopLeftBot + baseCloudBottom) / 2) - ((currentTopLeftBot - baseCloudBottom) * sizeScale * 1.1) / 2;
        const ryBot = ((currentTopRightBot + baseCloudBottom) / 2) - ((currentTopRightBot - baseCloudBottom) * sizeScale * 1.1) / 2;
        const myBot = ((currentTopCenter + baseCloudBottom) / 2) - ((currentTopCenter - baseCloudBottom) * sizeScale * 1.1) / 2;

        const points = [
            `${lx},${100 - lyBot}`,
            `${mx},${100 - myBot}`,
            `${rx},${100 - ryBot}`,
            `${rx},${100 - ryTop}`,
            `${mx},${100 - myTop}`,
            `${lx},${100 - lyTop}`
        ].join(" ");

        polygon.setAttribute("points", points);
        if (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
            polygon.setAttribute("fill", "rgba(255, 211, 42, 0.3)"); // 레벨 27, 28 전용 반투명 노란색 채우기
        } else {
            polygon.setAttribute("fill", "none");
        }
        polygon.setAttribute("stroke", "white");
        polygon.setAttribute("stroke-width", "0.4");
        polygon.setAttribute("stroke-dasharray", "1, 1");
        
        svg.appendChild(polygon);
        skyBg.appendChild(svg);
    }

    // 4. 레벨 28 전용 번개 상태 초기화
    if (currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
        lightningStrikeState = 'IDLE';
        lightningTimer = 0;
        lastLightningStartTime = Date.now();
        activeLightningBolts = [];
    }
}




function removeLevel26Cloud() {
    document.querySelectorAll('.level26-cloud, .level26-cloud-guide, .level26-cloud-guide-svg, .lightning-bolt').forEach(c => c.remove());
    clearRaindrops();
    level26CloudX = 50;
}

function spawnRaindrop() {
    if (gameState !== 'PLAY' && gameState !== 'START') return;
    const skyWidth = gameContainer.clientWidth;
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const zoneHeight = 100 / 7;
    
    let z = 1;
    let sizeScale = 1.0;
    let posShiftPct = 0;
    if (currentLevel === 31) {
        z = 6; sizeScale = 0.6; posShiftPct = -(zoneHeight * 0.2) - (zoneHeight / 6);
    } else if (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) z = 5;
    else return;

    const cloudWidth = 384 * sizeScale;
    const halfWidthPct = (cloudWidth / skyWidth) * 100 / 2;
    const pixelOffsetPct = (35 / skyHeight) * 100;
    const quarterZonePct = (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) ? (zoneHeight / 4) : 0;
    
    // Cloud bottom position logic (matching addLevel26Cloud)
    const baseCloudBottom = z * zoneHeight - 2 + pixelOffsetPct + quarterZonePct + posShiftPct;
    const baseHeight = ((z + 1) * zoneHeight + 2 + quarterZonePct + posShiftPct) - baseCloudBottom;
    const height = baseHeight * sizeScale;
    const centerY = baseCloudBottom + baseHeight / 2;
    const startY = centerY - (height * 0.9) / 2; // Spawn from near the bottom edge

    const currentRandom = (currentLevel === 31 || currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) ? seededRainRandom : Math.random;
    const startX = level26CloudX - halfWidthPct + currentRandom() * (halfWidthPct * 2);

    const rainEl = document.createElement('div');
    rainEl.className = 'raindrop';
    gameContainer.appendChild(rainEl);

    activeRaindrops.push({
        el: rainEl,
        x: startX,
        y: startY,
        velY: (0.3 + currentRandom() * 0.2) * ((currentLevel === 31 || currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) ? 0.33 : 1), // 26, 27, 28, 29, 30레벨은 속도 1/3로 감속
        velX: (currentRandom() - 0.5) * 0.05
    });
}

function updateRain() {
    if (gameState !== 'PLAY' && gameState !== 'START') return;

    // 레벨별 빗방울 개수 차등 적용 (26레벨은 100%, 27레벨은 50%)
    if (currentLevel === 31) {
        if (seededRainRandom() > 0.9725) spawnRaindrop(); // 갯수 10% 증가 (0.025 -> 0.0275 확률)
    } else if (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
        let threshold = 0.93875; // 기본 확률 (0.06125)
        if (currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
            const elapsed = (Date.now() - missionStartTime) / 1000;
            if (elapsed > 20) {
                // 20초 경과 시 빗방울 발생 확률 절반으로 감소 (0.06125 -> 0.030625)
                threshold = 1 - (1 - 0.93875) / 2; // 약 0.969375
            }
        }
        if (seededRainRandom() > threshold) spawnRaindrop();
    }

    const skyHeight = gameContainer.clientHeight * 0.9195;
    const balloonWidthPct = (45 / (gameContainer.clientWidth || 1)) * 100;
    const halfW = balloonWidthPct / 2;
    const balloonHeightPct = (110 / skyHeight) * 100;

    for (let i = activeRaindrops.length - 1; i >= 0; i--) {
        const drop = activeRaindrops[i];
        drop.y -= drop.velY;
        drop.x += drop.velX;

        // 비 충돌 판정: 26레벨은 파란색 원(열기구 몸체)에 맞았을 때만 작동
        let isHit = false;
        const skyWidth = gameContainer.clientWidth;
        const skyHeight = gameContainer.clientHeight * 0.9195;

        if (currentLevel === 31 || currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
            const bodyXPx = (balloonX / 100) * skyWidth;
            const bodyYPx = ((balloonY + getMarkerOffset()) / 100) * skyHeight;
            const bodyRadius = 32.5 / 2;
            
            const dropXPx = (drop.x / 100) * skyWidth;
            const dropYPx = (drop.y / 100) * skyHeight;
            
            const dx = dropXPx - bodyXPx;
            const dy = dropYPx - bodyYPx;
            if (dx * dx + dy * dy < bodyRadius * bodyRadius) {
                isHit = true;
            }
        } else {
            const balloonWidthPct = (45 / (skyWidth || 1)) * 100;
            const halfW = balloonWidthPct / 2;
            const balloonHeightPct = (110 / skyHeight) * 100;
            if (Math.abs(drop.x - balloonX) < halfW && drop.y > balloonY && drop.y < balloonY + balloonHeightPct) {
                isHit = true;
            }
        }

        if (gameState === 'PLAY' && isHit) {
            if (currentLevel === 31 || currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) {
                showFloatingText("BURNER FAIL", "#ff4d4d");
                // 빗물 페널티: 1초간 버너 작동 중지
                rainPowerReductionEndTime = Date.now() + 1000;
            } else {
                gas = Math.max(0, gas - 3);
                showFloatingText("-3 GAS", "#ff4d4d");
            }
            
            if (drop.el && drop.el.parentNode) drop.el.remove();
            activeRaindrops.splice(i, 1);
            continue;
        }

        if (drop.y < -10) {
            if (drop.el && drop.el.parentNode) drop.el.remove();
            activeRaindrops.splice(i, 1);
        } else {
            drop.el.style.left = `${drop.x}%`;
            drop.el.style.bottom = `calc(8.05% + ${drop.y * 0.9195}%)`;
        }
    }
}

let activeMeteors = [];

function clearMeteors() {
    activeMeteors.forEach(m => {
        if (m.el && m.el.parentNode) m.el.remove();
    });
    activeMeteors = [];
}

function spawnMeteor() {
    const mEl = document.createElement('div');
    mEl.className = 'meteor';
    const size = 24 + Math.random() * 14;
    mEl.style.width = `${size}px`;
    mEl.style.height = `${size}px`;
    mEl.innerHTML = `
        <svg viewBox="0 0 60 60" width="100%" height="100%">
            <defs>
                <radialGradient id="rockGrad" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stop-color="#a89f91"/>
                    <stop offset="55%" stop-color="#6e655f"/>
                    <stop offset="100%" stop-color="#3b3532"/>
                </radialGradient>
            </defs>
            <polygon points="30,3 48,9 57,26 52,46 35,57 14,53 4,37 8,16" fill="url(#rockGrad)" stroke="#26211f" stroke-width="2"/>
            <circle cx="22" cy="22" r="6" fill="#4a423e" opacity="0.7"/>
            <circle cx="39" cy="34" r="8" fill="#4a423e" opacity="0.65"/>
            <circle cx="24" cy="41" r="4.5" fill="#332d2a" opacity="0.7"/>
            <circle cx="38" cy="18" r="3.5" fill="#544b46" opacity="0.6"/>
        </svg>
    `;

    // 사방(상단, 좌측, 우측)에서 지구(하단)를 향해 낙하
    const side = Math.random();
    let startX, startY, targetX;
    if (side < 0.5) {
        startX = 5 + Math.random() * 90;
        startY = 104;
        targetX = 15 + Math.random() * 70;
    } else if (side < 0.75) {
        startX = -6;
        startY = 45 + Math.random() * 55;
        targetX = 25 + Math.random() * 65;
    } else {
        startX = 106;
        startY = 45 + Math.random() * 55;
        targetX = 10 + Math.random() * 65;
    }

    const speed = (0.22 + Math.random() * 0.22) / 3;
    const dx = targetX - startX;
    const dy = -5 - startY;
    const len = Math.hypot(dx, dy) || 1;
    const velX = (dx / len) * speed;
    const velY = (dy / len) * speed;

    const rotDir = Math.random() < 0.5 ? 1 : -1;
    const rotSpeed = (0.4 + Math.random() * 0.9) * rotDir; // 천천히 자전

    mEl.style.left = `${startX}%`;
    mEl.style.bottom = `calc(8.05% + ${startY * 0.9195}%)`;
    gameContainer.appendChild(mEl);

    activeMeteors.push({
        el: mEl,
        x: startX,
        y: startY,
        velX,
        velY,
        angle: Math.random() * 360,
        rotSpeed,
        size,
        blown: false
    });
}

function updateMeteors() {
    if (gameState !== 'PLAY' && gameState !== 'START') return;
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentDisplayName !== "EVENT 6") return;

    if (activeMeteors.length < 6 && Math.random() < 0.014) {
        spawnMeteor();
    }

    const activeFlameEls = [];
    if (gameState === 'PLAY' && isBurning) {
        if (spaceFlameUp && spaceFlameUp.classList.contains('active')) activeFlameEls.push({ el: spaceFlameUp, dir: 'up' });
        if (spaceFlameDown && spaceFlameDown.classList.contains('active')) activeFlameEls.push({ el: spaceFlameDown, dir: 'down' });
        if (spaceFlameLeft && spaceFlameLeft.classList.contains('active')) activeFlameEls.push({ el: spaceFlameLeft, dir: 'left' });
        if (spaceFlameRight && spaceFlameRight.classList.contains('active')) activeFlameEls.push({ el: spaceFlameRight, dir: 'right' });
    }

    const flameRects = activeFlameEls.map(f => ({
        dir: f.dir,
        rect: f.el.getBoundingClientRect()
    }));

    for (let i = activeMeteors.length - 1; i >= 0; i--) {
        const m = activeMeteors[i];
        m.x += m.velX;
        m.y += m.velY;
        m.angle = (m.angle + m.rotSpeed) % 360;

        if (!m.blown && flameRects.length > 0 && m.el) {
            const mRect = m.el.getBoundingClientRect();
            for (const f of flameRects) {
                const hit = !(
                    mRect.right < f.rect.left ||
                    mRect.left > f.rect.right ||
                    mRect.bottom < f.rect.top ||
                    mRect.top > f.rect.bottom
                );
                if (hit) {
                    m.blown = true;
                    m.el.classList.add('blown');
                    m.rotSpeed *= 6;
                    if (f.dir === 'up') {
                        m.velY = 2.4;
                        m.velX += (Math.random() - 0.5) * 0.8;
                    } else if (f.dir === 'down') {
                        m.velY = -2.4;
                        m.velX += (Math.random() - 0.5) * 0.8;
                    } else if (f.dir === 'left') {
                        m.velX = -2.4;
                        m.velY += (Math.random() - 0.5) * 0.8;
                    } else if (f.dir === 'right') {
                        m.velX = 2.4;
                        m.velY += (Math.random() - 0.5) * 0.8;
                    }

                    const val = 100;
                    sessionEventCredits += val;
                    if (eventCreditsValEl) eventCreditsValEl.innerText = sessionEventCredits;
                    if (shouldAllowEventCredits()) {
                        totalCredits += val;
                        recordEventCreditGain();
                        if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;
                        const groundCredits = document.getElementById('ground-credits-display');
                        if (groundCredits) groundCredits.innerText = `${totalCredits}C`;
                        savePlayerData();
                    }
                    playCoinSound();

                    const plusText = document.createElement('div');
                    plusText.className = 'popcorn-plus-text';
                    plusText.innerText = `+${val}`;
                    plusText.style.left = `${m.x}%`;
                    plusText.style.bottom = `${8.05 + (m.y * 0.9195)}%`;
                    plusText.style.zIndex = '500';
                    gameContainer.appendChild(plusText);
                    setTimeout(() => plusText.remove(), 800);
                    break;
                }
            }
        }

        if (m.y < -8 || m.y > 115 || m.x < -15 || m.x > 115) {
            if (m.el && m.el.parentNode) m.el.remove();
            activeMeteors.splice(i, 1);
        } else {
            m.el.style.left = `${m.x}%`;
            m.el.style.bottom = `calc(8.05% + ${m.y * 0.9195}%)`;
            m.el.style.transform = `translate(-50%, 50%) rotate(${m.angle.toFixed(1)}deg)`;
        }
    }
}

let activeLevel31Planets = [];
let activeLevel31Orbits = [];
let level31GravitySvg = null;
let level31GravityArrows = [];
function clearLevel31Planets() {
    activeLevel31Planets.forEach(p => {
        if (p.el && p.el.parentNode) p.el.remove();
    });
    activeLevel31Planets = [];
    activeLevel31Orbits.forEach(el => {
        if (el && el.parentNode) el.remove();
    });
    activeLevel31Orbits = [];
    if (level31GravitySvg && level31GravitySvg.parentNode) {
        level31GravitySvg.remove();
    }
    level31GravitySvg = null;
    level31GravityArrows = [];
}

function initLevel31Planets() {
    clearLevel31Planets();
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentDisplayName !== "31") return;

    // 레벨 31: 1,2구역 / 3,4구역 / 4,5구역(고리없는 행성) 3종 행성 공전
    const orbitConfigs = [
        // 1. 행성 1: 1, 2 구역 공전 (Y: 약 10% ~ 24.3%)
        {
            cx: 50,
            cy: 120 / 7,
            rx: 50,
            ry: 50 / 7,
            angle: Math.PI,
            speed: 0.0055,
            size: 58,
            height: 58 * 0.7,
            orbitColor: 'rgba(255, 190, 100, 0.28)',
            svg: `
                <svg viewBox="0 0 80 56" width="100%" height="100%">
                    <defs>
                        <radialGradient id="planetGrad1" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stop-color="#ffeaa7"/>
                            <stop offset="45%" stop-color="#f39c12"/>
                            <stop offset="85%" stop-color="#ba4a00"/>
                            <stop offset="100%" stop-color="#6e2c00"/>
                        </radialGradient>
                    </defs>
                    <ellipse cx="40" cy="28" rx="36" ry="10" fill="none" stroke="rgba(253, 203, 110, 0.55)" stroke-width="3.5" transform="rotate(-14 40 28)"/>
                    <circle cx="40" cy="28" r="17" fill="url(#planetGrad1)"/>
                    <path d="M 24 24 Q 40 28 56 24" fill="none" stroke="rgba(186, 74, 0, 0.45)" stroke-width="2.5"/>
                    <path d="M 25 32 Q 40 36 55 31" fill="none" stroke="rgba(255, 234, 167, 0.4)" stroke-width="2"/>
                    <path d="M 4 28 A 36 10 0 0 0 76 28" fill="none" stroke="rgba(255, 234, 167, 0.85)" stroke-width="3.5" transform="rotate(-14 40 28)"/>
                </svg>
            `
        },
        // 2. 행성 2: 3, 4 구역 공전 (Y: 약 32.8% ~ 52.8%)
        {
            cx: 50,
            cy: 300 / 7,
            rx: 50,
            ry: 70 / 7,
            angle: Math.PI / 2,
            speed: -0.005,
            size: 56,
            height: 56 * 0.7,
            orbitColor: 'rgba(116, 185, 255, 0.28)',
            svg: `
                <svg viewBox="0 0 80 56" width="100%" height="100%">
                    <defs>
                        <radialGradient id="planetGrad2" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stop-color="#a8e6cf"/>
                            <stop offset="45%" stop-color="#00cec9"/>
                            <stop offset="85%" stop-color="#0984e3"/>
                            <stop offset="100%" stop-color="#1b1464"/>
                        </radialGradient>
                    </defs>
                    <ellipse cx="40" cy="28" rx="34" ry="9" fill="none" stroke="rgba(129, 236, 236, 0.5)" stroke-width="3" transform="rotate(12 40 28)"/>
                    <circle cx="40" cy="28" r="16.5" fill="url(#planetGrad2)"/>
                    <path d="M 24 25 Q 40 21 56 25" fill="none" stroke="rgba(255, 255, 255, 0.35)" stroke-width="2"/>
                    <path d="M 25 32 Q 40 29 55 32" fill="none" stroke="rgba(9, 132, 227, 0.5)" stroke-width="2.5"/>
                    <path d="M 6 28 A 34 9 0 0 0 74 28" fill="none" stroke="rgba(168, 230, 207, 0.85)" stroke-width="3" transform="rotate(12 40 28)"/>
                </svg>
            `
        },
        // 3. 행성 3 (신규, 고리 없는 행성): 4, 5 구역 공전 (Y: 약 54.3% ~ 71.4%)
        {
            cx: 50,
            cy: 440 / 7,
            rx: 50,
            ry: 60 / 7,
            angle: 0,
            speed: 0.0045,
            size: 44,
            height: 44, // 고리가 없는 정원형 행성
            orbitColor: 'rgba(255, 118, 117, 0.28)',
            svg: `
                <svg viewBox="0 0 60 60" width="100%" height="100%">
                    <defs>
                        <radialGradient id="planetGrad3" cx="32%" cy="28%" r="68%">
                            <stop offset="0%" stop-color="#ff7675"/>
                            <stop offset="38%" stop-color="#d63031"/>
                            <stop offset="75%" stop-color="#8c1414"/>
                            <stop offset="100%" stop-color="#2d0505"/>
                        </radialGradient>
                        <radialGradient id="planetAtmosphere3" cx="50%" cy="50%" r="50%">
                            <stop offset="70%" stop-color="rgba(255, 118, 117, 0)"/>
                            <stop offset="100%" stop-color="rgba(255, 118, 117, 0.5)"/>
                        </radialGradient>
                    </defs>
                    <!-- 고리 없는 순수 구체 행성 본체 -->
                    <circle cx="30" cy="30" r="22" fill="url(#planetGrad3)"/>
                    <!-- 표면 크레이터 및 대기 디테일 -->
                    <circle cx="23" cy="22" r="3.8" fill="#600d0d" opacity="0.6"/>
                    <circle cx="37" cy="34" r="3.0" fill="#600d0d" opacity="0.55"/>
                    <circle cx="33" cy="20" r="2.2" fill="#ff7675" opacity="0.5"/>
                    <circle cx="21" cy="36" r="2.5" fill="#4a0808" opacity="0.65"/>
                    <circle cx="31" cy="40" r="1.8" fill="#4a0808" opacity="0.5"/>
                    <path d="M 14 28 Q 28 35 44 26" fill="none" stroke="rgba(255, 175, 175, 0.35)" stroke-width="2.2"/>
                    <path d="M 16 35 Q 32 40 42 34" fill="none" stroke="rgba(100, 10, 10, 0.45)" stroke-width="1.8"/>
                    <!-- 대기 발광 레이어 -->
                    <circle cx="30" cy="30" r="22" fill="url(#planetAtmosphere3)"/>
                </svg>
            `
        }
    ];

    orbitConfigs.forEach(cfg => {
        const pEl = document.createElement('div');
        pEl.className = 'orbiting-planet';
        const pHeight = cfg.height || (cfg.size * 0.7);
        pEl.style.width = `${cfg.size}px`;
        pEl.style.height = `${pHeight}px`;
        pEl.innerHTML = cfg.svg;
        gameContainer.appendChild(pEl);

        const pObj = {
            el: pEl,
            cx: cfg.cx,
            cy: cfg.cy,
            rx: cfg.rx,
            ry: cfg.ry,
            angle: cfg.angle,
            speed: cfg.speed,
            orbitType: 'horizontal',
            x: cfg.cx + cfg.rx * Math.cos(cfg.angle),
            y: cfg.cy + cfg.ry * Math.sin(cfg.angle)
        };
        activeLevel31Planets.push(pObj);
    });

    const svgNS = "http://www.w3.org/2000/svg";
    level31GravitySvg = document.createElementNS(svgNS, "svg");
    level31GravitySvg.id = "level31-gravity-svg";
    level31GravitySvg.setAttribute("width", "100%");
    level31GravitySvg.setAttribute("height", "100%");
    level31GravitySvg.style.position = "absolute";
    level31GravitySvg.style.top = "0";
    level31GravitySvg.style.left = "0";
    level31GravitySvg.style.width = "100%";
    level31GravitySvg.style.height = "100%";
    level31GravitySvg.style.pointerEvents = "none";
    level31GravitySvg.style.zIndex = "15";

    level31GravitySvg.innerHTML = `
        <defs>
            <linearGradient id="gravityArrowGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffeaa7"/>
                <stop offset="60%" stop-color="#f39c12"/>
                <stop offset="100%" stop-color="#e17055"/>
            </linearGradient>
            <linearGradient id="gravityArrowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e0f7fa"/>
                <stop offset="50%" stop-color="#00cec9"/>
                <stop offset="100%" stop-color="#0984e3"/>
            </linearGradient>
            <linearGradient id="gravityArrowGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff9ff3"/>
                <stop offset="50%" stop-color="#f368e0"/>
                <stop offset="100%" stop-color="#ee5253"/>
            </linearGradient>
            <filter id="gravityArrowGlow0" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#f39c12" flood-opacity="0.9"/>
            </filter>
            <filter id="gravityArrowGlow1" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00cec9" flood-opacity="0.9"/>
            </filter>
            <filter id="gravityArrowGlow2" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#f368e0" flood-opacity="0.9"/>
            </filter>
        </defs>
    `;

    const strokeColors = [
        "rgba(255, 234, 167, 0.95)",
        "rgba(224, 255, 255, 0.95)",
        "rgba(255, 185, 205, 0.95)"
    ];

    level31GravityArrows = [];
    for (let i = 0; i < orbitConfigs.length; i++) {
        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("fill", `url(#gravityArrowGrad${i})`);
        pathEl.setAttribute("stroke", strokeColors[i] || "rgba(255, 255, 255, 0.95)");
        pathEl.setAttribute("stroke-width", "1");
        pathEl.setAttribute("stroke-linejoin", "round");
        pathEl.setAttribute("filter", `url(#gravityArrowGlow${i})`);
        pathEl.style.opacity = "0";
        pathEl.style.pointerEvents = "none";
        level31GravitySvg.appendChild(pathEl);
        level31GravityArrows.push(pathEl);
    }

    gameContainer.appendChild(level31GravitySvg);
    updateLevel31Planets();
}

function updateLevel31Planets() {
    if (gameState !== 'PLAY' && gameState !== 'START') {
        if (level31GravityArrows && level31GravityArrows.length) {
            level31GravityArrows.forEach(arrow => { if (arrow) arrow.style.opacity = "0"; });
        }
        return;
    }
    const currentDisplayName = LEVEL_CONFIGS[currentLevel]?.displayName;
    if (currentDisplayName !== "31") {
        clearLevel31Planets();
        return;
    }

    const skyWidth = gameContainer.clientWidth || 360;
    const containerHeight = gameContainer.clientHeight || 640;
    const skyHeight = containerHeight * 0.9195;
    const groundOffsetPx = containerHeight * 0.0805;
    const aspectRatio = skyHeight / skyWidth;

    const shipXPx = (balloonX / 100) * skyWidth;
    const shipYPx = (balloonY / 100) * skyHeight + 70;

    // SVG 스크린 기준 풍선 중심 좌표 (top: 0 기준)
    const shipScreenX = shipXPx;
    const shipScreenY = containerHeight - (groundOffsetPx + shipYPx);

    for (let i = 0; i < activeLevel31Planets.length; i++) {
        const p = activeLevel31Planets[i];
        if (gameState === 'PLAY' || gameState === 'START') {
            p.angle += p.speed;
        }

        // 가로 타원 궤도 운동 (레벨 31)
        p.x = p.cx + p.rx * Math.cos(p.angle);
        p.y = p.cy + p.ry * Math.sin(p.angle);
        const depthScale = 1.255 - 0.865 * Math.sin(p.angle);

        p.el.style.left = `${p.x}%`;
        p.el.style.bottom = `calc(8.05% + ${p.y * 0.9195}%)`;
        p.el.style.transform = `translate(-50%, 50%) scale(${depthScale.toFixed(3)})`;

        const planetXPx = (p.x / 100) * skyWidth;
        const planetYPx = (p.y / 100) * skyHeight;
        const dxPx = planetXPx - shipXPx;
        const dyPx = planetYPx - shipYPx;
        const distPx = Math.hypot(dxPx, dyPx);
        const gravityRadiusPx = p.gravityRadius ? (p.gravityRadius + 20 * depthScale) : (110 + 35 * depthScale);

        const arrowEl = level31GravityArrows ? level31GravityArrows[i] : null;

        if (gameState === 'PLAY' && distPx < gravityRadiusPx && distPx > 1) {
            const proximity = 1 - (distPx / gravityRadiusPx);
            const basePull = p.pullStrength || 0.017;
            const pullForce = basePull * Math.pow(proximity, 1.25) * (0.55 + 0.45 * depthScale);
            const dirX = dxPx / distPx;
            const dirY = dyPx / distPx;

            velY += dirY * pullForce;
            velX += dirX * pullForce * 0.2 * aspectRatio;

            if (distPx < 28) {
                velX *= 0.95;
                velY *= 0.95;
            }
            p.el.classList.add('gravity-pull');

            // --- 행성별 실시간 끌어당김 화살표 표시 ---
            if (arrowEl) {
                const planetScreenX = planetXPx;
                const planetScreenY = containerHeight - (groundOffsetPx + planetYPx);

                const screenVx = planetScreenX - shipScreenX;
                const screenVy = planetScreenY - shipScreenY;
                const screenDist = Math.hypot(screenVx, screenVy) || 1;

                const ux = screenVx / screenDist;
                const uy = screenVy / screenDist;
                const nx = -uy;
                const ny = ux;

                const startDist = 18;
                const startX = shipScreenX + ux * startDist;
                const startY = shipScreenY + uy * startDist;

                const shaftHalfWidth = 1.8 + proximity * 5.2;
                const headHalfWidth = shaftHalfWidth * 2.8;

                const maxAllowedLen = Math.max(20, screenDist - startDist - 16);
                const targetLen = 32 + proximity * 48;
                const arrowLen = Math.min(targetLen, maxAllowedLen);
                const headLen = Math.min(arrowLen * 0.45, 12 + proximity * 10);

                const tipX = startX + ux * arrowLen;
                const tipY = startY + uy * arrowLen;

                const baseHeadX = tipX - ux * headLen;
                const baseHeadY = tipY - uy * headLen;

                const p1x = (startX + nx * shaftHalfWidth).toFixed(1);
                const p1y = (startY + ny * shaftHalfWidth).toFixed(1);
                const p2x = (baseHeadX + nx * shaftHalfWidth).toFixed(1);
                const p2y = (baseHeadY + ny * shaftHalfWidth).toFixed(1);
                const p3x = (baseHeadX + nx * headHalfWidth).toFixed(1);
                const p3y = (baseHeadY + ny * headHalfWidth).toFixed(1);
                const p4x = tipX.toFixed(1);
                const p4y = tipY.toFixed(1);
                const p5x = (baseHeadX - nx * headHalfWidth).toFixed(1);
                const p5y = (baseHeadY - ny * headHalfWidth).toFixed(1);
                const p6x = (baseHeadX - nx * shaftHalfWidth).toFixed(1);
                const p6y = (baseHeadY - ny * shaftHalfWidth).toFixed(1);
                const p7x = (startX - nx * shaftHalfWidth).toFixed(1);
                const p7y = (startY - ny * shaftHalfWidth).toFixed(1);

                const d = `M ${p1x} ${p1y} L ${p2x} ${p2y} L ${p3x} ${p3y} L ${p4x} ${p4y} L ${p5x} ${p5y} L ${p6x} ${p6y} L ${p7x} ${p7y} Z`;
                arrowEl.setAttribute("d", d);
                arrowEl.style.opacity = Math.min(1, 0.4 + proximity * 0.6).toFixed(2);
            }
        } else {
            p.el.classList.remove('gravity-pull');
            if (arrowEl) {
                arrowEl.style.opacity = "0";
            }
        }
    }
}

function updateCloudPosition() {
    if (gameState !== 'PLAY' && gameState !== 'START') return;
    if (currentLevel < 31 || currentLevel > 35) return;

    let z = 1;
    if (currentLevel === 31) z = 6;
    else if (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) z = 5;

    const wind = ZONE_WINDS[z] + tempWindBoosts[z];
    
    // 구름 이동 속도: 26레벨은 플레이/대기 관계없이 속도 2, 나머지는 풍향 가속도 적용 (0.035)
    const currentSpeed = (currentLevel === 31) ? 2 : wind; 
    level26CloudX += currentSpeed * 0.035; 

    // 화면 끝 도달 시 반대편으로 워핑 (좌우 30% 여유)
    if (level26CloudX > 130) level26CloudX = -30;
    if (level26CloudX < -30) level26CloudX = 130;

    // 시각적 요소 업데이트
    const clouds = document.querySelectorAll('.level26-cloud');
    clouds.forEach(c => c.style.left = `${level26CloudX}%`);
    
    const svgGuides = document.querySelectorAll('.level26-cloud-guide-svg');
    svgGuides.forEach(s => s.style.left = `${level26CloudX - 50}%`);

    // --- 레벨 28, 29, 30 전용 번개 시퀀스 처리 ---
    if ((currentLevel === 33 || currentLevel === 34 || currentLevel === 35) && gameState === 'PLAY') {
        const timeDelta = 16.66; // Loop fixed delta
        const now = Date.now();
        const skyBg = document.getElementById('sky-background');

        // 현재 구역의 바람 계산 (열기구 위치 기준)
        const markerY = balloonY + getMarkerOffset();
        const zoneHeight = 100 / 7;
        const balloonZoneIndex = Math.min(6, Math.max(0, Math.floor(markerY / zoneHeight)));
        const currentWind = (ZONE_WINDS[balloonZoneIndex] || 0) + (tempWindBoosts[balloonZoneIndex] || 0);

        if (lightningStrikeState === 'IDLE') {
            // 레벨 28은 7초(4s IDLE + 3s FLASHING), 나머지는 5초 주기로 번개 시퀀스 시작
            const idleLimit = (currentLevel === 33 || currentLevel === 34 || currentLevel === 35) ? 4000 : 2000;
            if (now - lastLightningStartTime > idleLimit) {
                lightningStrikeState = 'FLASHING';
                lightningTimer = 3000; // 3초간 번쩍임
                clouds.forEach(c => c.classList.add('flashing'));
            }
        } else if (lightningStrikeState === 'FLASHING') {
            // 구름은 바람대로 그대로 흘러감
            level26CloudX += currentSpeed * 0.035; 
            clouds.forEach(c => c.style.left = `${level26CloudX}%`);
            svgGuides.forEach(s => s.style.left = `${level26CloudX - 50}%`);

            lightningTimer -= timeDelta;
            if (lightningTimer <= 0) {
                lightningStrikeState = 'STRIKING';
                soundMgr.play('thunder', false, 1.2); // 번개 하강 시작 직전 천둥소리 재생
                clouds.forEach(c => c.classList.remove('flashing'));
                
                // 번개 생성
                if (skyBg) {
                    const boltEl = document.createElement('div');
                    boltEl.className = 'lightning-bolt active';
                    boltEl.style.position = 'absolute';
                    boltEl.style.width = '17.28px'; // 34.56 * 0.5
                    boltEl.style.height = '72px';  // 144 * 0.5
                    boltEl.style.backgroundColor = '#ffff00'; // Fallback yellow
                    boltEl.style.filter = 'drop-shadow(0 0 20px #ffff00)'; // Fallback glow
                    boltEl.style.zIndex = '500'; // 구름(14) 및 다른 요소보다 높게 설정
                    gameContainer.appendChild(boltEl);
                    
                    const quarterZonePct = (zoneHeight / 4);
                    const cloudOffset = 35;
                    const skyH = gameContainer.clientHeight * 0.9195;
                    const pixelOffsetPct = (cloudOffset / skyH) * 100;
                    const boltStartY = 5 * zoneHeight - 2 + pixelOffsetPct + quarterZonePct;

                    const strikeX = balloonX + (currentWind * 5.0); 

                    activeLightningBolts.push({
                        el: boltEl,
                        x: strikeX,
                        y: boltStartY,
                        velY: 0.3375 
                    });

                    // 번개 생성 직후 다음 주기를 위해 즉시 IDLE 상태로 복귀
                    lightningStrikeState = 'IDLE';
                    lastLightningStartTime = Date.now();
                }
            }
        }

        // --- 번개 하강 및 충돌 처리 (상태와 독립적으로 항상 수행) ---
        for (let i = activeLightningBolts.length - 1; i >= 0; i--) {
            const bolt = activeLightningBolts[i];
            bolt.y -= bolt.velY;
            bolt.el.style.left = `${bolt.x}%`;
            bolt.el.style.bottom = `calc(8.05% + ${bolt.y * 0.9195}%)`;
            bolt.el.style.transform = 'translate(-50%, 0)';

            // --- 정밀한 원-직사각형(Circle-AABB) 충돌 판정 ---
            const skyH = gameContainer.clientHeight * 0.9195;
            const gameW = gameContainer.clientWidth;
            
            // 1. 파란색 원(열기구 본체) 정보 - 픽셀 환산 (반지름 16.25px)
            const markerR = 32.5 / 2;
            const markerX_px = (balloonX / 100) * gameW;
            const markerY_px = ((balloonY + getMarkerOffset()) / 100) * skyH;
            
            // 2. 번개 흰색 본체 정보 - 픽셀 환산 (길이를 위로 추가 10% 연장)
            const boltW_px = 14;  
            const boltH_px = 60;  // 54px * 1.1(10% 추가 증강) = 약 60px로 연장
            const boltYOffset_px = 8; // 하단 오프셋은 8px 유지
            const boltX_px = (bolt.x / 100) * gameW;
            const boltY_px = (bolt.y / 100) * skyH + boltYOffset_px;
            
            const rectL = boltX_px - (boltW_px / 2);
            const rectR = boltX_px + (boltW_px / 2);
            const rectB = boltY_px;
            const rectT = boltY_px + boltH_px;
            
            // --- 열기구 충돌 체크 ---
            const closestX = Math.max(rectL, Math.min(markerX_px, rectR));
            const closestY = Math.max(rectB, Math.min(markerY_px, rectT));
            const dx = markerX_px - closestX;
            const dy = markerY_px - closestY;
            if ((dx * dx) + (dy * dy) < (markerR * markerR)) {
                gameOver('CRASH');
                bolt.el.remove();
                activeLightningBolts.splice(i, 1);
                continue;
            }

            // --- 독수리 충돌 체크 (정밀 3점 판정) ---
            let isBoltRemoved = false;
            for (let j = activeEagles.length - 1; j >= 0; j--) {
                const eagle = activeEagles[j];
                if (eagle.isHit) continue;
                
                const eagleBaseX = (eagle.x / 100) * gameW;
                const eagleBaseY = (eagle.y / 100) * skyH;
                const dir = (eagle.velX > 0) ? -1 : 1;
                
                const centers = [
                    { dx: 0, dy: 22, r: 10.5 },   // 몸통
                    { dx: -18, dy: 25, r: 7.5 },  // 머리 측
                    { dx: 18, dy: 30, r: 7.5 }    // 뒤쪽
                ];
                
                let eagleHit = false;
                for (let pt of centers) {
                    const cx = eagleBaseX + (pt.dx * dir);
                    const cy = eagleBaseY + pt.dy;
                    const r = pt.r;
                    
                    const cX = Math.max(rectL, Math.min(cx, rectR));
                    const cY = Math.max(rectB, Math.min(cy, rectT));
                    const dX = cx - cX;
                    const dY = cy - cY;
                    if (dX*dX + dY*dY < r*r) {
                        eagleHit = true;
                        break;
                    }
                }
                
                if (eagleHit) {
                    eagle.isHit = true;
                    eagle.velY = -0.8; 
                    if (eagle.el) eagle.el.classList.add('hit-effect');
                    isBoltRemoved = true;
                    soundMgr.play('eagle_fall', false, 0.8);
                    break;
                }
            }

            // --- 붉은새 충돌 체크 (레벨 30 전용) ---
            if (!isBoltRemoved && currentLevel === 35) {
                for (let j = activeBirds.length - 1; j >= 0; j--) {
                    const bird = activeBirds[j];
                    if (bird.isHit) continue;
                    
                    const birdX_px = (bird.x / 100) * gameW;
                    const birdY_px = (bird.y / 100) * skyH + 7.65; // Center Y
                    const birdR = 5.1;
                    
                    const cX = Math.max(rectL, Math.min(birdX_px, rectR));
                    const cY = Math.max(rectB, Math.min(birdY_px, rectT));
                    const dX = birdX_px - cX;
                    const dY = birdY_px - cY;
                    
                    if (dX*dX + dY*dY < birdR*birdR) {
                        bird.isHit = true;
                        bird.velY = -0.8; // 하강 속도
                        if (bird.el) bird.el.classList.add('hit-effect');
                        isBoltRemoved = true;
                        soundMgr.play('eagle_fall', false, 0.8);
                        break;
                    }
                }
            }

            if (isBoltRemoved) {
                bolt.el.remove();
                activeLightningBolts.splice(i, 1);
                continue;
            }

            // 화면 아래로 사라지면 제거
            if (bolt.y < -20) {
                bolt.el.remove();
                activeLightningBolts.splice(i, 1);
            }
        }
    }
}

function clearRaindrops() {
    activeRaindrops.forEach(drop => {
        if (drop.el && drop.el.parentNode) drop.el.remove();
    });
    activeRaindrops = [];
}

function isInsideLevel26Cloud(x, y, halfW = 0, halfH = 0) {
    const zoneHeight = 100 / 7;
    let z = 1;
    let sizeScale = 1.0;
    let posShiftPct = 0;
    if (currentLevel === 31) {
        z = 6;
        sizeScale = 0.6;
        posShiftPct = -(zoneHeight * 0.2) - (zoneHeight / 6); // 점선 가이드를 1/6구역만큼 추가 하향
    } else if (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) z = 5;
    else return false;
    const skyWidth = gameContainer.clientWidth;
    const cloudWidth = 384 * sizeScale;
    const cloudWidthPct = (cloudWidth / skyWidth) * 100;
    const halfWidthCloud = cloudWidthPct / 2;
    
    // X축 범위 오버랩 체크 (객체의 [x-halfW, x+halfW]와 구름의 [level26CloudX-halfWidthCloud, level26CloudX+halfWidthCloud])
    if (x + halfW < level26CloudX - halfWidthCloud || x - halfW > level26CloudX + halfWidthCloud) return false;

    const quarterZonePct = (currentLevel === 32 || currentLevel === 33 || currentLevel === 34 || currentLevel === 35) ? (zoneHeight / 4) : 0;
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const cloudOffset = 35;
    const pixelOffsetInGameUnits = (cloudOffset / skyHeight) * 100;
    
    // Y축 판정을 위한 상하단 경계 계산 (기울기가 크지 않으므로 객체의 중심 x 기준으로 계산)
    const slantFactorRight = Math.tan(20 * Math.PI / 180);
    const slantFactorLeft = Math.tan(15 * Math.PI / 180);

    const zoneBottom = z * zoneHeight + quarterZonePct;
    const baseZoneTop = (z + 1) * zoneHeight + 2 + quarterZonePct; 

    let currentTopForTop = baseZoneTop;
    let currentTopForBot = baseZoneTop;
    if (x > 50) {
        const dxPixels = (x - 50) / 100 * skyWidth;
        const dyPixels = dxPixels * slantFactorRight;
        const dyGameUnits = (dyPixels / skyHeight) * 100;
        currentTopForTop -= dyGameUnits; // 상단은 산 모양으로 반전
        currentTopForBot += dyGameUnits; // 하단은 계곡 모양 그대로 유지
    } else if (x < 50) {
        const dxPixels = (50 - x) / 100 * skyWidth;
        const dyPixels = dxPixels * slantFactorLeft;
        const dyGameUnits = (dyPixels / skyHeight) * 100;
        currentTopForTop -= dyGameUnits;
        currentTopForBot += dyGameUnits;
    }

    const baseCloudBottom = zoneBottom - 2 + pixelOffsetInGameUnits + posShiftPct;
    
    // 상단 경계 계산
    const baseHeightTop = (currentTopForTop + posShiftPct) - baseCloudBottom;
    const centerYTop = baseCloudBottom + baseHeightTop / 2;
    const cloudTop = centerYTop + (baseHeightTop * sizeScale) / 2;

    // 하단 경계 계산 (기존 로직 유지)
    const baseHeightBot = (currentTopForBot + posShiftPct) - baseCloudBottom;
    const centerYBot = baseCloudBottom + baseHeightBot / 2;
    const cloudBottom = centerYBot - (baseHeightBot * sizeScale) / 2;
    
    // Y축 범위 오버랩 체크
    if (y + halfH >= cloudBottom && y - halfH <= cloudTop) {
        return true;
    }

    return false;
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
        const label = (currentLanguage === 'kor') ? '굽기' : 'COOKED';
        if (event2CookedPctEl) event2CookedPctEl.innerText = `${label}: ${displayPct}%`;
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
    p.src = 'popcorn.png';
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
    if (shouldAllowEventCredits()) {
        totalCredits += popcornGatheredScore;
        recordEventCreditGain();
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
            fishEl.src = `fish${type}.png`;
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
            const maxSurface = (100 / 7) * 2.8; // 3구역 80% 지점 (약 40%)
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
                
                const maxSurface = (100 / 7) * 2.8;
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
                const maxSurface = (100 / 7) * 2.8;
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
            
            // 수면 높이 제한 적용 (물고기 머리가 3구역 80% 지점을 넘지 않게)
            const maxSurface = (100 / 7) * 2.8;
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
        if (attachedFish.type === 1) {
            // 물고기1은 5초 동안만 끌고 다님
            if (Date.now() - attachedFish.attachTime > 5000) {
                attachedFish.lastReleaseTime = Date.now();
                attachedFish = null;
                return;
            }
            return; 
        }

        if (isBurning && continuousBurnStartTime !== 0) {
            let catchThreshold = 800; // 기본 (물고기 2: 0.8초)
            if (attachedFish.type === 3) catchThreshold = 600;      // 물고기 3: 0.6초
            else if (attachedFish.type === 4) catchThreshold = 400; // 물고기 4: 0.4초
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
                    // 최근에 풀려난 물고기면 3초간 재부착 방지
                    if (fish.type === 1 && fish.lastReleaseTime && (Date.now() - fish.lastReleaseTime < 3000)) {
                        continue;
                    }

                    attachedFish = fish;
                    soundMgr.play('hit');
                    if (fish.type === 1) {
                        draggingOffset = getBaitOffset();
                        fish.attachTime = Date.now();
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
    if (shouldAllowEventCredits()) {
        totalCredits += points;
        recordEventCreditGain();
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

function createBirds() {
    clearBirds();
    
    // 레벨 26(31), 27(32)은 붉은새가 나오지 않도록 제외
    if (currentLevel === 31 || currentLevel === 32) return;
    
    // 기본 생성 구역: 2, 3, 4, 5구역(인덱스 1~4)
    let zonesToSpawn = [1, 2, 3, 4];
    
    // 레벨 22, 27 (인덱스 26, 32)은 3구역(index 2)과 5구역(index 4)에 한 마리씩 더 추가
    if (currentLevel === 26 || currentLevel === 32) {
        zonesToSpawn.push(2); // 3구역 한 마리 더
        zonesToSpawn.push(4); // 5구역 한 마리 더
    }

    zonesToSpawn.forEach((zoneIdx, loopIdx) => {
        const birdContainer = document.createElement('div');
        birdContainer.className = 'bird-css';
        birdContainer.innerHTML = `
                <div class="bird-beak"></div>
                <div class="bird-head">
                    <div class="bird-eye"></div>
                </div>
                <div class="bird-body"></div>
                <div class="bird-wing"></div>
                <div class="bird-tail"></div>
            `;
        gameContainer.appendChild(birdContainer);

        let birdVelX = (Math.random() * 0.28 + 0.21) * (Math.random() > 0.5 ? 1 : -1);
        let birdX = Math.random() * 100;
        let birdY = zoneIdx * (110 / 7) + (Math.random() * 10);

        // 레벨 21, 25, 30, 2구역(zoneIdx 1) 붉은새 커스텀 (우측 벽면 중앙 출발, 속도 0.4)
        if ((currentLevel === 25 || currentLevel === 29 || currentLevel === 35) && zoneIdx === 1) {
            birdVelX = -0.4; 
            birdX = 100; 
            birdY = (zoneIdx + 0.5) * (100 / 7);
        }
        // 레벨 21, 25, 30, 3~4구역(zoneIdx 2, 3) 붉은새 커스텀 (좌측 하단 출발, 속도 0.4)
        if ((currentLevel === 25 || currentLevel === 29 || currentLevel === 35) && (zoneIdx === 2 || zoneIdx === 3)) {
            birdVelX = 0.4; 
            birdX = 0; 
            birdY = zoneIdx * (100 / 7);
        }
        // 레벨 21, 25, 30, 5구역(zoneIdx 4) 붉은새 커스텀 (우측 하단 출발, 속도 0.5)
        if ((currentLevel === 25 || currentLevel === 29 || currentLevel === 35) && zoneIdx === 4) {
            birdVelX = -0.5; 
            birdX = 100; 
            birdY = zoneIdx * (100 / 7);
        }

        // 레벨 22, 27, 2구역(zoneIdx 1) 붉은새 커스텀 (좌측 벽면 중앙 출발, 속도 0.4)
        if ((currentLevel === 26 || currentLevel === 32) && zoneIdx === 1) {
            birdVelX = 0.4; 
            birdX = 0; 
            birdY = (zoneIdx + 0.5) * (100 / 7);
        }
        // 레벨 22, 27, 3구역(zoneIdx 2) 붉은새 1 (LoopIdx 1) - 우측 하단 1/4 출발, 속도 0.4
        if ((currentLevel === 26 || currentLevel === 32) && loopIdx === 1) {
            birdVelX = -0.4; 
            birdX = 100; 
            birdY = (zoneIdx + 0.25) * (100 / 7);
        }
        // 레벨 22, 27, 3구역(zoneIdx 2) 붉은새 2 (LoopIdx 4) - 좌측 상단 3/4 출발, 속도 0.4
        if ((currentLevel === 26 || currentLevel === 32) && loopIdx === 4) {
            birdVelX = 0.4; 
            birdX = 0; 
            birdY = (zoneIdx + 0.75) * (100 / 7);
        }

        // 레벨 22, 27, 4구역(zoneIdx 3) 붉은새 커스텀 (우측 중간 출발, 속도 0.4)
        if ((currentLevel === 26 || currentLevel === 32) && zoneIdx === 3) {
            birdVelX = -0.4; 
            birdX = 100; 
            birdY = (zoneIdx + 0.5) * (100 / 7);
        }
        // 레벨 22, 27, 5구역(zoneIdx 4) 붉은새 1 (LoopIdx 3) - 좌측 중간 출발, 속도 0.3
        if ((currentLevel === 26 || currentLevel === 32) && loopIdx === 3) {
            birdVelX = 0.3; 
            birdX = 0; 
            if (currentLevel === 32) {
                birdY = (zoneIdx + 0.3) * (100 / 7); // 레벨 27: 조금 낮춤
            } else {
                birdY = (zoneIdx + 0.5) * (100 / 7); // 레벨 22: 기존 유지
            }
        }
        // 레벨 22, 27, 5구역(zoneIdx 4) 붉은새 2 (LoopIdx 5) - 우측 하단 출발, 속도 0.28
        if ((currentLevel === 26 || currentLevel === 32) && loopIdx === 5) {
            birdVelX = -0.28; 
            birdX = 100; 
            birdY = zoneIdx * (100 / 7);
        }

        // 레벨 23, 24, 2구역(zoneIdx 1) 붉은새는 우측벽면 중앙에서 아래로 40px 지점에서 출발 (속도 0.5 고정)
        if ((currentLevel === 27 || currentLevel === 28) && zoneIdx === 1) {
            birdVelX = -0.5; // 고정 속도 0.5 (좌측 방향)
            birdX = 100; // 우측 벽면
            const skyHeight = gameContainer.clientHeight * 0.9195;
            const pixelOffsetPct = skyHeight > 0 ? (40 / skyHeight) * 100 : 5.6; 
            birdY = (zoneIdx + 0.5) * (100 / 7) - pixelOffsetPct; // 2구역 중앙에서 40px 하강
        }
        // 레벨 23, 3구역(zoneIdx 2) 붉은새는 우측벽면 중앙에서 출발 (속도 0.3 고정, 좌측 이동)
        if (currentLevel === 27 && zoneIdx === 2) {
            birdVelX = -0.3; 
            birdX = 100; 
            birdY = (zoneIdx + 0.5) * (100 / 7);
        }
        // 레벨 24, 3구역(zoneIdx 2) 붉은새는 좌측벽면 중앙에서 출발 (속도 0.3 고정, 우측 이동)
        if (currentLevel === 28 && zoneIdx === 2) {
            birdVelX = 0.3; 
            birdX = 0; 
            birdY = (zoneIdx + 0.5) * (100 / 7);
        }
        // 레벨 23, 24, 4구역(zoneIdx 3) 붉은새는 좌측벽면 중앙에서 출발 (속도 0.3 고정)
        if ((currentLevel === 27 || currentLevel === 28) && zoneIdx === 3) {
            birdVelX = 0.3; // 고정 속도 0.3 (우측 방향)
            birdX = 0; // 좌측 벽면
            birdY = (zoneIdx + 0.5) * (100 / 7); // 4구역 중앙 (약 50.0%)
        }

        const bird = {
            el: birdContainer,
            x: birdX,
            y: birdY,
            velX: birdVelX,
            width: 21.3,
            height: 15.3
        };
        activeBirds.push(bird);
    });
}

function updateBirds() {
    for (let i = activeBirds.length - 1; i >= 0; i--) {
        const bird = activeBirds[i];
        const skyHeight = gameContainer.clientHeight * 0.9195;
        const skyWidth = gameContainer.clientWidth;

        if (bird.isHit) {
            // 번개 맞고 추락하는 상태
            bird.y += bird.velY; // velY는 음수 (-0.8)
            
            if (!bird.currentRotation) bird.currentRotation = 0;
            if (bird.currentRotation < 540) bird.currentRotation += 15;
            else bird.currentRotation = 540;
            
            if (bird.el) bird.el.style.zIndex = '9';
            const flip = bird.velX > 0 ? 'scaleX(-1)' : 'scaleX(1)';
            bird.el.style.left = `${bird.x}%`;
            bird.el.style.bottom = `calc(8.05% + ${bird.y * 0.9195}%)`;
            bird.el.style.transform = `translateX(-50%) ${flip} rotate(${bird.currentRotation}deg)`;
            
            if (bird.y < 2) {
                if (bird.el && bird.el.parentNode) bird.el.remove();
                activeBirds.splice(i, 1);
            }
            continue;
        }

        let velMultiplier = 1.0;
        const birdHalfW = (21.3 / 2 / skyWidth) * 100;
        const birdHalfH = (15.3 / 2 / skyHeight) * 100;
        if (isInsideLevel26Cloud(bird.x, bird.y, birdHalfW, birdHalfH)) velMultiplier = 0.5;
        
        bird.x += bird.velX * velMultiplier;
        
        // Wrap around
        if (bird.x > 110) bird.x = -10;
        if (bird.x < -10) bird.x = 110;

        bird.el.style.left = `${bird.x}%`;
        bird.el.style.bottom = `calc(8.05% + ${bird.y * 0.9195}%)`;
        
        // Face movement direction
        const flip = bird.velX > 0 ? 'scaleX(-1)' : 'scaleX(1)';
        bird.el.style.transform = `translateX(-50%) ${flip}`;
    }
}

function clearBirds() {
    activeBirds.forEach(bird => {
        if (bird.el && bird.el.parentNode) {
            bird.el.remove();
        }
    });
    activeBirds = [];
}

const activePianoKeys = new Set();
function checkPianoCollisions() {
    const config = LEVEL_CONFIGS[currentLevel];
    if (!config || config.displayName !== "EVENT 5") return;

    const skyHeight = gameContainer.clientHeight * 0.9195;
    const skyWidth = gameContainer.clientWidth;

    // Hitbox Circle (representing the blue center marker)
    const markerBodyXPx = (balloonX / 100) * skyWidth;
    // Y in screen coordinates (0 is top of container)
    // balloonY=0 is bottom of sky area (8.05% from bottom of container)
    const markerBottomOffset = 8.05; // %
    const markerEffectiveY = markerBottomOffset + ((balloonY + getMarkerOffset()) * 0.9195);
    const markerYPx_fromBottom = (markerEffectiveY / 100) * gameContainer.clientHeight;
    const markerYPx = gameContainer.clientHeight - markerYPx_fromBottom;

    const radius = 32.5 / 2;
    // Red Dot position (the topmost point of the blue circle marker)
    // In screen coordinates (0 is top), the topmost point is Y - radius
    const dotXPx = markerBodyXPx;
    const dotYPx = markerYPx - radius;

    const keys = document.querySelectorAll('.key');
    const gameRect = gameContainer.getBoundingClientRect();

    const currentKeysInCollision = new Set();
    keys.forEach(key => {
        const rect = key.getBoundingClientRect();
        const keyTop = rect.top - gameRect.top;
        const keyBottom = rect.bottom - gameRect.top;
        const keyLeft = rect.left - gameRect.left;
        const keyRight = rect.right - gameRect.left;

        // Point-in-Rect Collision (using the Red Dot point) - Only works when burning
        if (isBurning && dotXPx >= keyLeft && dotXPx <= keyRight &&
            dotYPx >= keyTop && dotYPx <= keyBottom) {
            
            currentKeysInCollision.add(key);
            if (!activePianoKeys.has(key)) {
                key.classList.add('pressed');
                playPianoNote(key.dataset.note);

                // EVENT 6 미션: 악보의 음을 치면 다음 음으로 (랜덤)
                if (key.dataset.note === currentEvent6Note && musicStaff && !musicStaff.classList.contains('vanishing')) {
                    triggerStaffMatchEffect();
                }
            }
        }
    });

    // Remove highlight when collision ends
    activePianoKeys.forEach(key => {
        if (!currentKeysInCollision.has(key)) {
            key.classList.remove('pressed');
        }
    });

    // Update active set
    activePianoKeys.clear();
    currentKeysInCollision.forEach(k => activePianoKeys.add(k));
}

function triggerStaffMatchEffect() {
    if (!musicStaff) return;
    
    // 점수 획득 (한 음당 100점)
    sessionEventCredits += 100;
    
    // 첫 클리어이거나 광고 보상 플레이일 때 토탈 크레딧 합산
    if (shouldAllowEventCredits()) {
        totalCredits += 100;
        recordEventCreditGain();
        if (totalCreditsEl) totalCreditsEl.innerText = totalCredits;
        const groundCredits = document.getElementById('ground-credits-display');
        if (groundCredits) groundCredits.innerText = `${totalCredits}C`;
        savePlayerData();
    }

    if (eventCounterEl) eventCreditsValEl.innerText = sessionEventCredits;
    if (musicCreditsValEl) musicCreditsValEl.innerText = sessionEventCredits;
    
    // 이펙트 시작: 위로 솟구치며 투명해짐
    musicStaff.classList.add('vanishing');
    
    setTimeout(() => {
        musicStaff.classList.add('hidden');
        musicStaff.classList.remove('vanishing');
        
        // 다음 음표 선택 (멜로디 시퀀스 진행)
        currentEvent6NoteIndex++;
        if (currentEvent6NoteIndex >= currentEvent6Melody.length) {
            currentEvent6NoteIndex = 0; // 끝까지 가면 다시 처음부터
        }
        currentEvent6Note = currentEvent6Melody[currentEvent6NoteIndex];
        
        updateMelodyVisuals();

        // 0.15초 뒤에 다시 나타남 (가운데 고정)
        setTimeout(() => {
            musicStaff.classList.remove('hidden');
        }, 150);
    }, 250);
}

function updateMelodyVisuals() {
    const note = currentEvent6Note;
    const pos = NOTE_POSITIONS[note];
    if (!pos) return;

    const noteContainer = musicStaff.querySelector('.note-container');
    const ledgerLine = musicStaff.querySelector('.ledger-line');

    if (noteContainer) {
        noteContainer.style.bottom = `${pos.bottom}px`;
    }
    if (ledgerLine) {
        ledgerLine.style.display = pos.ledger ? 'block' : 'none';
    }
}

let pianoAudioCtx = null;
function playPianoNote(note) {
    if (!pianoAudioCtx) {
        pianoAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Frequencies for C4 octave
    const pianoFreqs = {
        'do': 261.6, 'do-sharp': 277.2,
        're': 293.7, 're-sharp': 311.1,
        'mi': 329.6,
        'fa': 349.2, 'fa-sharp': 370.0,
        'sol': 392.0, 'sol-sharp': 415.3,
        'la': 440.0, 'la-sharp': 466.2,
        'si': 493.9, 'do2': 523.3
    };
    
    const freq = pianoFreqs[note];
    if (!freq) return;

    if (pianoAudioCtx.state === 'suspended') {
        pianoAudioCtx.resume();
    }

    const osc = pianoAudioCtx.createOscillator();
    const gain = pianoAudioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, pianoAudioCtx.currentTime);
    
    // Piano-like envelope (quick attack, decaying sustain) - Lengthened to 2s
    gain.gain.setValueAtTime(0, pianoAudioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, pianoAudioCtx.currentTime + 0.05); 
    gain.gain.exponentialRampToValueAtTime(0.001, pianoAudioCtx.currentTime + 2.0); 
    
    osc.connect(gain);
    gain.connect(pianoAudioCtx.destination);
    
    osc.start();
    osc.stop(pianoAudioCtx.currentTime + 2.0);
}


function checkBirdCollisions() {
    if (gameState !== 'PLAY') return;
    if (isStunned && Date.now() < stunEndTime) return; // 이미 부딪힌 상태면 무시
    
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const skyWidth = gameContainer.clientWidth;

    // 1. Balloon Body Center (Blue Circle)
    const bodyXPx = (balloonX / 100) * skyWidth;
    const bodyYPx = ((balloonY + getMarkerOffset()) / 100) * skyHeight;
    const bodyRadius = 32.5 / 2;

    // 2. Basket Center (Red Dot)
    const basketXPx = (balloonX / 100) * skyWidth;
    const basketYPx = ((balloonY + getBasketOffset()) / 100) * skyHeight;
    const basketRadius = 7.8 / 2;

    activeBirds.forEach(bird => {
        if (bird.isHit) return; // 추락 중인 새와는 충돌 무시
        const birdXPx = (bird.x / 100) * skyWidth;
        // Bird collision point is roughly at its center (height is 15.3px)
        const birdYPx = (bird.y / 100) * skyHeight + 7.65;
        
        // Bird Hitbox (approximate circle for the body/head area)
        const birdRadius = 5.1;  // 더 정밀한 판정 (6 * 0.85)
        // Body-Bird Collision (Circumference check)
        const dxBody = bodyXPx - birdXPx;
        const dyBody = bodyYPx - birdYPx;
        const distBodySq = dxBody * dxBody + dyBody * dyBody;
        const combinedBodyRadiusSq = Math.pow(bodyRadius + birdRadius, 2);

        // Basket-Bird Collision (Circumference check)
        const dxBasket = basketXPx - birdXPx;
        const dyBasket = basketYPx - birdYPx;
        const distBasketSq = dxBasket * dxBasket + dyBasket * dyBasket;
        const combinedBasketRadiusSq = Math.pow(basketRadius + birdRadius, 2);

        if (distBodySq < combinedBodyRadiusSq || distBasketSq < combinedBasketRadiusSq) {
            // 21, 22, 25, 27레벨 등에서는 즉시 폭발
            const config = LEVEL_CONFIGS[currentLevel];
            if (config && (config.displayName === "21" || config.displayName === "22" || config.displayName === "25" || config.displayName === "27" || config.displayName === "28" || config.displayName === "30")) {
                gameOver('CRASH');
                return;
            }

            // 붉은새 충돌 효과 적용
            isStunned = true;
            stunEndTime = Date.now() + 1500; // 2000 -> 1500
            soundMgr.play('bird_hit'); // 'hit' 대신 'bird_hit' 재생
            
            // 충격으로 반대 방향 튕겨나기 (약 10.92% 이동 - 기존 대비 30% 감소)
            const bounceDirection = (balloonX > (bird.x)) ? 10.92 : -10.92;
            balloonX += bounceDirection;
            velX = 0; // 가로 관성 제거하여 튕겨나간 위치 유지
            velY *= 0.5; // 수직 속도 반감 (충격 흡수)
            checkBoundaries(); // 튕겨나간 후 경계 체크 즉시 실행
            
            // 새도 같이 흔든다
            bird.el.classList.add('shake-bird');
            
            setTimeout(() => {
                bird.el.classList.remove('shake-bird');
            }, 1500); // 2000 -> 1500
        }
    });
}

// --- 레벨 23 독수리 기믹 ---
function createEagles() {
    clearEagles();
    const now = performance.now();
    const config = LEVEL_CONFIGS[currentLevel];
    const isLevel23 = config && config.displayName === "23";
    const isLevel24 = config && config.displayName === "24";
    const isLevel25 = config && config.displayName === "25";
    const isLevel29 = config && config.displayName === "29";
    const isLevel30 = config && config.displayName === "30";
    const isSpecialPatternLevel = isLevel23 || isLevel24 || isLevel25 || isLevel29 || isLevel30;


    // 23, 24, 25, 29, 30레벨은 4마리 배치, 그 외 레벨은 1마리
    const eagleCount = (isLevel23 || isLevel24 || isLevel25 || isLevel29 || isLevel30) ? 4 : 1;

    for (let i = 0; i < eagleCount; i++) {
        const eagleWrap = document.createElement('div');
        eagleWrap.className = 'eagle-obstacle';
        eagleWrap.style.position = 'absolute';
        eagleWrap.style.width = '72px'; 
        eagleWrap.style.height = '48px'; 
        eagleWrap.style.display = 'flex';
        eagleWrap.style.alignItems = 'center';
        eagleWrap.style.justifyContent = 'center';
        eagleWrap.style.zIndex = '12';
        
        const eagleImg = document.createElement('img');
        eagleImg.src = 'eagle.png';
        eagleImg.style.width = '100%';
        eagleImg.style.height = 'auto';
        eagleWrap.appendChild(eagleImg);

        // 25레벨에 한해 정교한 3중 충돌 범위 시각화 (빨간 점선)
        if (config.displayName === "25") {
            const hitboxes = [
                { w: 20, bottom: 22, left: '50%' }, // 몸통 (중앙)
                { w: 15, bottom: 25, left: '25%' }, // 머리 측 (조금 더 내림)
                { w: 15, bottom: 30, left: '75%' }  // 뒤쪽 (날개/꼬리)
            ];
            hitboxes.forEach(hb => {
                const visual = document.createElement('div');
                visual.className = 'eagle-hitbox-visual';
                visual.style.width = hb.w + 'px';
                visual.style.height = hb.w + 'px';
                visual.style.bottom = hb.bottom + 'px';
                visual.style.left = hb.left;
                visual.style.transform = 'translate(-50%, 50%)';
                eagleWrap.appendChild(visual);
            });
        }

        gameContainer.appendChild(eagleWrap);
        const eagleEl = eagleWrap;

        let startX, startY, velX, velY;

        if (isSpecialPatternLevel) {
            const zoneHeight = 100 / 7;
            let targetX, targetY;

            if (i === 0) {
                // 독수리 1: 3-4구역 경계 우측 -> 1구역 하단 중앙
                startX = 98;
                startY = 3 * zoneHeight;
                targetX = 50;
                targetY = 0;
            } else if (i === 1) {
                // 독수리 2: 4-5구역 경계 좌측 -> 7구역 상단 중앙
                startX = 2;
                startY = 4 * zoneHeight;
                targetX = 50;
                targetY = 100;
            } else if (i === 2) {
                // 독수리 3: 3-4구역 경계 좌측 -> 1구역 하단 중앙
                startX = 2;
                startY = 3 * zoneHeight;
                targetX = 50;
                targetY = 0;
            } else {
                // 독수리 4: 4-5구역 경계 우측 -> 7구역 상단 중앙
                startX = 98;
                startY = 4 * zoneHeight;
                targetX = 50;
                targetY = 100;
            }
            
            const baseSpeed = (config.displayName === "23") ? 0.3 : 0.25; // 23레벨 독수리 속도 20% 상향 (0.25 -> 0.3)
            const dx = targetX - startX;
            const dy = targetY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            velX = (dx / dist) * baseSpeed;
            velY = (dy / dist) * baseSpeed;
        } else {
            // 다른 레벨을 위한 기본 로직
            startX = (i === 0) ? 20 : 80;
            startY = 10 + (Math.random() * 50); 
            velX = (Math.random() * 0.15 + 0.15) * (i === 0 ? 1 : -1);
            velY = (Math.random() * 0.1 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
        }
        
        const eagle = {
            el: eagleEl,
            x: startX,
            y: startY,
            velX: velX,
            velY: velY,
            lastDirChangeTime: now,
            width: 72,
            height: 48,
            isSpecialPattern: isSpecialPatternLevel
        };
        
        // 초기 위치 및 반전 즉시 반영
        eagleEl.style.left = `${eagle.x}%`;
        eagleEl.style.bottom = `calc(8.05% + ${eagle.y * 0.9195}%)`;
        const initialFlip = eagle.velX > 0 ? 'scaleX(-1)' : 'scaleX(1)';
        eagleEl.style.transform = `translateX(-50%) ${initialFlip}`;
        
        activeEagles.push(eagle);
    }
}

function updateEagles() {
    // 스타트를 누를 때만 움직이도록 설정 (23, 24, 25, 29, 30레벨은 대기화면에서도 움직이게 수정)
    const config = LEVEL_CONFIGS[currentLevel];
    const isSpecialEagleLevel = config && ["23", "24", "25", "29", "30"].includes(config.displayName);
    if (gameState !== 'PLAY' && !(gameState === 'START' && isSpecialEagleLevel)) return;
    
    const now = performance.now();
    for (let i = activeEagles.length - 1; i >= 0; i--) {
        const eagle = activeEagles[i];
        
        if (eagle.isHit) {
            // 번개 맞고 추락하는 상태
            eagle.y += eagle.velY; // velY는 음수 (-0.8)
            
            // 한바퀴 반(540도) 회전 연출
            if (!eagle.currentRotation) eagle.currentRotation = 0;
            if (eagle.currentRotation < 540) {
                eagle.currentRotation += 15; // 빠르게 회전
            } else {
                eagle.currentRotation = 540; // 540도(등 뒤 상해) 유지
            }
            
            // 열기구(z-index 10)보다 뒤에 보이도록 설정
            if (eagle.el) eagle.el.style.zIndex = '9';

            const flip = eagle.velX > 0 ? 'scaleX(-1)' : 'scaleX(1)';
            eagle.el.style.left = `${eagle.x}%`;
            eagle.el.style.bottom = `calc(8.05% + ${eagle.y * 0.9195}%)`;
            eagle.el.style.transform = `translateX(-50%) ${flip} rotate(${eagle.currentRotation}deg)`;
            
            // 바닥(1구역 하단)까지 추락하면 제거 (y < 2)
            if (eagle.y < 2) {
                if (eagle.el && eagle.el.parentNode) eagle.el.remove();
                activeEagles.splice(i, 1);
            }
            continue;
        }

        if (!eagle.isSpecialPattern) {
            // 기존 일반 독수리: 3초마다 방향 무작위 전환
            if (now - eagle.lastDirChangeTime > 3000) {
                eagle.velX *= -1;
                eagle.velY *= -1;
                eagle.lastDirChangeTime = now;
            }
        }

        let velMultiplier = 1.0;
        if (isInsideLevel26Cloud(eagle.x, eagle.y)) velMultiplier = 0.5;

        eagle.x += eagle.velX * velMultiplier;
        eagle.y += eagle.velY * velMultiplier;
        
        // 반사 로직 (같은 반사각으로 이동)
        if (eagle.x > 100) { eagle.x = 100; eagle.velX *= -1; }
        if (eagle.x < 0) { eagle.x = 0; eagle.velX *= -1; }
        const maxY = 95;
        const minY = 0;
        if (eagle.y > maxY) { eagle.y = maxY; eagle.velY *= -1; }
        if (eagle.y < minY) { eagle.y = minY; eagle.velY *= -1; }

        eagle.el.style.left = `${eagle.x}%`;
        eagle.el.style.bottom = `calc(8.05% + ${eagle.y * 0.9195}%)`;
        
        const flip = eagle.velX > 0 ? 'scaleX(-1)' : 'scaleX(1)';
        let rotation = (eagle.velX > 0) ? ((eagle.velY < 0) ? -20 : 10) : ((eagle.velY < 0) ? -20 : 20);
        eagle.el.style.transform = `translateX(-50%) ${flip} rotate(${rotation}deg)`;
    }
}

function clearEagles() {
    activeEagles.forEach(eagle => {
        if (eagle.el && eagle.el.parentNode) {
            eagle.el.remove();
        }
    });
    activeEagles = [];
}

function checkEagleCollisions() {
    if (gameState !== 'PLAY') return;
    if (isStunned && Date.now() < stunEndTime) return;
    
    const skyHeight = gameContainer.clientHeight * 0.9195;
    const skyWidth = gameContainer.clientWidth;

    const bodyXPx = (balloonX / 100) * skyWidth;
    const bodyYPx = ((balloonY + getMarkerOffset()) / 100) * skyHeight;
    const bodyRadius = 32.5 / 2;

    const basketXPx = (balloonX / 100) * skyWidth;
    const basketYPx = ((balloonY + getBasketOffset()) / 100) * skyHeight;
    const basketRadius = 7.8 / 2;

    activeEagles.forEach(eagle => {
        if (eagle.isHit) return; // 번개 맞은 독수리는 충돌 무시
        // 독수리 형상에 맞춘 3지점(몸통, 양쪽 날개) 정밀 충돌 판정
        const centers = [
            { dx: 0, dy: 22, r: 10.5 },   // 몸통
            { dx: -18, dy: 25, r: 7.5 },  // 머리 측 (25로 하향)
            { dx: 18, dy: 30, r: 7.5 }   // 뒤쪽
        ];
        
        const eagleBaseXPx = (eagle.x / 100) * skyWidth;
        const eagleBaseYPx = (eagle.y / 100) * skyHeight;

        for (let pt of centers) {
            // 독수리가 바라보는 방향(flip)에 맞춰 히트박스 좌우 정렬
            const dir = eagle.velX > 0 ? -1 : 1; 
            const eagleXPx = eagleBaseXPx + (pt.dx * dir);
            const eagleYPx = eagleBaseYPx + pt.dy;
            const eagleRadius = pt.r;
            
            const dxBody = bodyXPx - eagleXPx;
            const dyBody = bodyYPx - eagleYPx;
            const distBodySq = dxBody * dxBody + dyBody * dyBody;
            const combinedBodyRadiusSq = Math.pow(bodyRadius + eagleRadius, 2);

            const dxBasket = basketXPx - eagleXPx;
            const dyBasket = basketYPx - eagleYPx;
            const distBasketSq = dxBasket * dxBasket + dyBasket * dyBasket;
            const combinedBasketRadiusSq = Math.pow(basketRadius + eagleRadius, 2);

            if (distBodySq < combinedBodyRadiusSq || distBasketSq < combinedBasketRadiusSq) {
                gameOver('CRASH');
                return;
            }
        }
    });
}

function goToNextLevel() {
    const nextLv = currentLevel + 1;
    if (LEVEL_CONFIGS[nextLv]) {
        currentLevel = nextLv;
        localStorage.setItem('balloon_current_level', currentLevel);
        if (typeof storeScreen !== 'undefined' && storeScreen && !storeScreen.classList.contains('hidden')) {
            storeScreen.classList.add('hidden');
        }
        resetGame();
        if (rankScreen && !rankScreen.classList.contains('hidden')) {
            updateRankUI();
        }
    }
}

function goToPrevLevel() {
    const prevLv = currentLevel - 1;
    if (LEVEL_CONFIGS[prevLv]) {
        currentLevel = prevLv;
        localStorage.setItem('balloon_current_level', currentLevel);
        if (typeof storeScreen !== 'undefined' && storeScreen && !storeScreen.classList.contains('hidden')) {
            storeScreen.classList.add('hidden');
        }
        resetGame();
        if (rankScreen && !rankScreen.classList.contains('hidden')) {
            updateRankUI();
        }
    }
}

function grantCheatLivesAndCredits() {
    lives = 7;
    lastLifeUpdate = Date.now();
    totalCredits += 10000;
    realCredits += 10000;
    savePlayerData();
    updateLivesUI();
    if (typeof updateStoreUI === 'function') {
        updateStoreUI(false);
    }
    if (typeof restoreBalloonVisibility === 'function') {
        restoreBalloonVisibility();
    }
    if (typeof triggerLifeSparkle === 'function') {
        triggerLifeSparkle();
    }
    if (typeof soundMgr !== 'undefined' && soundMgr.play) {
        soundMgr.play('life');
        setTimeout(() => { if (soundMgr.play) soundMgr.play('coin'); }, 150);
    }
    if (typeof showFloatingText === 'function') {
        showFloatingText('+10,000C & 7 LIVES!', '#2ecc71');
    }
    console.log('[Cheat] Full Lives (7) & +10000 Credits granted!');
}

function updateNextLevelButtonVisibility() {
    const isEventLevel = LEVEL_CONFIGS[currentLevel]?.displayName?.startsWith("EVENT") || isSpaceEventLevel(LEVEL_CONFIGS[currentLevel]?.displayName);
    const isTutorial = isTutorialLevel(currentLevel);
    const isRankOpen = rankScreen && !rankScreen.classList.contains('hidden');

    // 리더보드(순위/기록) 창이 열려 있을 때는 다른 레벨로 가는 좌우 화살표 숨김
    if (isRankOpen) {
        if (nextLevelBtn) {
            nextLevelBtn.classList.add('hidden');
            nextLevelBtn.classList.remove('tutorial-blink');
        }
        if (prevLevelBtn) prevLevelBtn.classList.add('hidden');
        return;
    }

    if (gameState === 'PLAY' && !isEventLevel) {
        if (nextLevelBtn) {
            nextLevelBtn.classList.add('hidden');
            nextLevelBtn.classList.remove('tutorial-blink');
        }
        if (prevLevelBtn) prevLevelBtn.classList.add('hidden');
        return;
    }

    if (nextLevelBtn) {
        const nextLv = currentLevel + 1;
        const isCurrentCleared = clearedLevels.includes(currentLevel);
        const isNextExists = !!LEVEL_CONFIGS[nextLv];
        const isNextCleared = clearedLevels.includes(nextLv);

        // 표시 조건: 다음 레벨이 존재하고 (현재가 튜토리얼 레벨 OR 현재 레벨 클리어 OR 다음 레벨이 이미 클리어된 상태 OR 방금 클리어 OR 현재 또는 다음이 이벤트 레벨)
        const isNextEventLevel = LEVEL_CONFIGS[nextLv]?.displayName?.startsWith("EVENT");
        if (isNextExists && (isTutorial || isCurrentCleared || isNextCleared || gameState === 'CLEAR' || isEventLevel || isNextEventLevel)) {
            nextLevelBtn.classList.remove('hidden');
            if (isTutorial) {
                nextLevelBtn.classList.add('tutorial-blink');
            } else {
                nextLevelBtn.classList.remove('tutorial-blink');
            }
        } else {
            nextLevelBtn.classList.add('hidden');
            nextLevelBtn.classList.remove('tutorial-blink');
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


function restoreBalloonVisibility() {
    if (!balloon) return;
    balloon.classList.remove('explosion', 'shake-balloon');
    balloon.style.opacity = "1";
    balloon.style.transform = "translateX(-50%) scale(1)";

    // 시작 위치로 열기구 좌표 이동
    balloonX = 50;
    const config = (typeof LEVEL_CONFIGS !== 'undefined') ? LEVEL_CONFIGS[currentLevel] : null;
    if (config && (config.displayName === "EVENT 2" || config.displayName === "EVENT 4")) {
        const skyHeight = gameContainer ? (gameContainer.clientHeight * 0.9195) : 500;
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

    if (mainActionBtn) {
        mainActionBtn.classList.remove('overheated', 'burner-mode');
        mainActionBtn.classList.add('restart-mode');
        const currentDisplayName = config ? config.displayName : '';
        mainActionBtn.innerText = currentLevel === 0 ? 'START' : (currentDisplayName.startsWith("EVENT") ? 'START EVENT LEVEL' : `START LEVEL ${currentDisplayName}`);
    }
}

function updateLivesUI() {
    checkLifeRegen(); // UI 업데이트 전 리젠 확인
    if (livesCountEl) {
        livesCountEl.innerText = `x${Math.max(0, lives - 1)}`;
    }
    if (lives > 0 && gameState !== 'PLAY') {
        if (balloon && (balloon.style.opacity === "0" || balloon.classList.contains('explosion') || balloon.style.transform.includes('scale(0)'))) {
            restoreBalloonVisibility();
        }
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

// --- Notice Management ---
// 1. NEWS 데이터 (나중에 업데이트할 소식이 있을 때 아래 배열에 { title: "...", desc: "..." } 형태로 추가)
const NOTICE_NEWS_DATA = {
    kor: [],
    eng: []
};

// 2. 게임설명서 데이터 (기존 6개 설명서)
const NOTICE_GUIDE_DATA = {
    kor: [
        {
            title: "📱 디바이스 (Device)",
            desc: "이 열기구 게임은 스마트폰 전용 웹게임입니다."
        },
        {
            title: "🔄 레벨 이동 버튼 안내",
            desc: "레벨 이동버튼이 동작 안될때는 스마트폰 화면 회전기능을 활성화하거나 비활성화 해보세요."
        },
        {
            title: "🔥 기본 비행 및 버너 조작",
            desc: "START 버튼을 터치하여 비행을 시작하고, 길게 누르고 있으면 버너가 가동되어 상승합니다. 손을 떼면 서서히 하강합니다. (⚠️ 2초 이상 누르면 열기구가 과열되어 터집니다!)"
        },
        {
            title: "💨 바람과 착륙 패드",
            desc: "고도 구간마다 바람의 세기와 방향이 다릅니다. 바람을 타고 이동하여 상단의 녹색 패드에 부드럽게 착륙하세요."
        },
        {
            title: "🛠️ 아이템 활용 팁",
            desc: "상점(STORE)에서 구매한 선풍기, 시계, 가스통 등의 아이템을 인벤토리(ITEM)에서 하늘에 배치하여 바람과 시간을 조절해 보세요."
        },
        {
            title: "🏆 순위 등록 시스템",
            desc: "일반 레벨 착륙 점수 및 최고기록을 달성하여 글로벌 랭킹 순위표에 닉네임을 등록하고 실력을 뽐내보세요!"
        }
    ],
    eng: [
        {
            title: "📱 Device",
            desc: "This hot air balloon game is a smartphone-dedicated web game."
        },
        {
            title: "🔄 Level Button Tip",
            desc: "If the level buttons are not responding, try enabling or disabling your smartphone's auto-rotate feature."
        },
        {
            title: "🔥 Flight & Burner Controls",
            desc: "Tap START to launch. Hold the button to fire the burner and ascend. Release the button to slowly descend. (⚠️ Holding the burner for more than 2 seconds will overheat and explode the balloon!)"
        },
        {
            title: "💨 Wind Zones & Landing Pad",
            desc: "Each altitude zone has different wind directions and speeds. Navigate through the winds to land safely on the green pad."
        },
        {
            title: "🛠️ Using Sky Items",
            desc: "Purchase items (Fans, Clocks, Gas tanks) in the STORE and deploy them from ITEM inventory onto the sky to conquer levels."
        },
        {
            title: "🏆 Global Leaderboard",
            desc: "Achieve top landing scores across all regular levels and submit your nickname to rank on the leaderboard!"
        }
    ]
};

function updateNoticeUI() {
    const isKor = (currentLanguage === 'kor');
    if (settingNoticeLabelEl) settingNoticeLabelEl.innerText = isKor ? '공지사항' : 'Notice';
    if (noticeSettingsBtn) noticeSettingsBtn.innerText = isKor ? '보기 📢' : 'OPEN 📢';
    if (noticeTitleEl) noticeTitleEl.innerText = isKor ? '📢 공지사항' : '📢 NOTICE';
    if (closeNoticeBtn) closeNoticeBtn.innerText = isKor ? '닫기' : 'CLOSE';

    // 탭 버튼 텍스트 및 활성화 상태 갱신
    if (noticeTabNewsBtn) {
        noticeTabNewsBtn.innerText = "NEWS";
        noticeTabNewsBtn.classList.toggle('active', activeNoticeTab === 'news');
    }
    if (noticeTabGuideBtn) {
        noticeTabGuideBtn.innerText = isKor ? "게임설명서" : "GUIDE";
        noticeTabGuideBtn.classList.toggle('active', activeNoticeTab === 'guide');
    }

    // 선택된 탭(NEWS / 게임설명서)에 따른 내용 렌더링
    if (noticeContentEl) {
        const currentData = (activeNoticeTab === 'news') ? NOTICE_NEWS_DATA : NOTICE_GUIDE_DATA;
        const list = isKor ? currentData.kor : currentData.eng;
        if (!list || list.length === 0) {
            noticeContentEl.innerHTML = `
                <div style="text-align: center; padding: 40px 10px; color: #888; font-size: 0.82rem;">
                    ${isKor ? "등록된 새로운 소식이 없습니다." : "No news available yet."}
                </div>
            `;
        } else {
            noticeContentEl.innerHTML = list.map(item => `
                <div class="notice-item">
                    <div class="notice-item-title">${item.title}</div>
                    <div class="notice-item-desc">${item.desc}</div>
                </div>
            `).join('');
        }
    }
}

// --- Settings Management ---
function updateSettingsUI() {
    updateNoticeUI();
    const isKor = (currentLanguage === 'kor');

    const settingsTitleEl = document.getElementById('settings-title');
    if (settingsTitleEl) settingsTitleEl.innerText = isKor ? '설정' : 'Settings';

    const settingNoticeLabelEl = document.getElementById('setting-notice-label');
    if (settingNoticeLabelEl) settingNoticeLabelEl.innerText = isKor ? '공지사항' : 'Notice';
    if (noticeSettingsBtn) noticeSettingsBtn.innerText = isKor ? '보기 📢' : 'OPEN 📢';

    const settingLangLabelEl = document.getElementById('setting-lang-label');
    if (settingLangLabelEl) settingLangLabelEl.innerText = isKor ? '언어 설정' : 'Language';

    const settingWindLabelEl = document.getElementById('setting-wind-label');
    if (settingWindLabelEl) settingWindLabelEl.innerText = isKor ? '바람세기' : 'Wind info';

    const settingMusicLabelEl = document.getElementById('setting-music-label');
    if (settingMusicLabelEl) settingMusicLabelEl.innerText = isKor ? '배경 음악' : 'Music';

    const settingUiSwapLabelEl = document.getElementById('setting-uiswap-label');
    if (settingUiSwapLabelEl) settingUiSwapLabelEl.innerText = isKor ? '버튼위치' : 'UI Layout';

    const settingFullscreenLabelEl = document.getElementById('setting-fullscreen-label');
    if (settingFullscreenLabelEl) settingFullscreenLabelEl.innerText = isKor ? '전체 화면' : 'Full Screen';

    const settingResetLabelEl = document.getElementById('setting-reset-label');
    if (settingResetLabelEl) settingResetLabelEl.innerText = isKor ? '기록 초기화' : 'Reset Record';

    const closeSettingsBtnEl = document.getElementById('close-settings-btn');
    if (closeSettingsBtnEl) closeSettingsBtnEl.innerText = isKor ? '닫기' : 'Close';

    const resetRecordSettingsBtnEl = document.getElementById('reset-record-settings-btn');
    if (resetRecordSettingsBtnEl) resetRecordSettingsBtnEl.innerText = isKor ? '초기화' : 'RESET';

    if (langToggleSettingsBtn) {
        langToggleSettingsBtn.classList.toggle('active', currentLanguage === 'kor');
        langToggleSettingsBtn.innerText = currentLanguage === 'kor' ? '한국어' : 'ENG';
    }
    if (windToggleSettingsBtn) {
        windToggleSettingsBtn.classList.toggle('active', showWindLabels);
        windToggleSettingsBtn.innerText = showWindLabels ? (isKor ? '켜짐' : 'ON') : (isKor ? '꺼짐' : 'OFF');
    }
    if (musicToggleSettingsBtn) {
        musicToggleSettingsBtn.classList.toggle('active', isMusicEnabled);
        musicToggleSettingsBtn.innerText = isMusicEnabled ? (isKor ? '켜짐' : 'ON') : (isKor ? '꺼짐' : 'OFF');
    }
    if (uiSwapSettingsBtn) {
        uiSwapSettingsBtn.classList.toggle('active', isUiSwapped);
        uiSwapSettingsBtn.innerText = isUiSwapped ? (isKor ? '오른손' : 'Right') : (isKor ? '왼손' : 'Left');
    }
    if (fullscreenToggleSettingsBtn) {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        fullscreenToggleSettingsBtn.classList.toggle('active', isFullscreen);
        fullscreenToggleSettingsBtn.innerText = isFullscreen ? (isKor ? '켜짐' : 'ON') : (isKor ? '실행 ⛶' : 'GO ⛶');
    }

    if (settingsBtn) {
        settingsBtn.title = isKor ? '설정' : 'Settings';
    }
}

function updateLanguageUI() {
    const isKorLang = (currentLanguage === 'kor');
    const isPC = (getDeviceType() === 'PC');
    document.querySelectorAll('.score-rank-btn').forEach(btn => {
        if (isPC) {
            btn.innerText = isKorLang ? '순위등록 (모바일 전용)' : 'Rank Register (Mobile)';
            btn.style.opacity = '0.6';
        } else {
            btn.innerText = isKorLang ? '순위등록' : 'Rank Register';
            btn.style.opacity = '1';
        }
    });
    updateNoticeUI();
    const isKor = (currentLanguage === 'kor');

    updateSettingsUI();

    // Rank -> 기록 라벨 언어 동기화
    ['rank-btn', 'clear-rank-btn', 'event-clear-rank-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = isKor ? '기록' : 'Record';
    });
    updateVisitorDisplay();
    if (adsBtn) {
        adsBtn.innerText = isKor ? '광고' : 'Ads';
        adsBtn.title = isKor ? '광고 시청 및 보상' : 'Watch Ads';
    }
    const tabMaxLevelEl = document.getElementById('tab-max-level');
    if (tabMaxLevelEl) tabMaxLevelEl.innerText = isKor ? '최고레벨' : 'Max Level';
    const tabLevelEl = document.getElementById('tab-level');
    if (tabLevelEl) tabLevelEl.innerText = isKor ? '레벨순위' : 'Level Rank';
    const tabOverallEl = document.getElementById('tab-overall');
    if (tabOverallEl) tabOverallEl.innerText = isKor ? '전체순위' : 'Overall Rank';
    const myRankPosLabelEl = document.getElementById('my-rank-pos-label');
    if (myRankPosLabelEl) myRankPosLabelEl.innerText = isKor ? '내 순위:' : 'My Rank:';
    const copyUidTextEl = document.getElementById('copy-uid-text');
    if (copyUidTextEl) copyUidTextEl.innerText = isKor ? 'UID 복사' : 'Copy UID';
    const closeRankBtnEl = document.getElementById('close-rank-btn');
    if (closeRankBtnEl) closeRankBtnEl.innerText = isKor ? '닫기' : 'CLOSE';

    // 1. 이벤트 2 (스테이크)
    const cookedPctEl = document.getElementById('event2-cooked-pct');
    if (cookedPctEl) {
        const currentText = cookedPctEl.innerText;
        const numMatch = currentText.match(/\d+%/);
        const pctStr = numMatch ? numMatch[0] : '0%';
        cookedPctEl.innerText = isKor ? `굽기: ${pctStr}` : `COOKED: ${pctStr}`;
    }

    // 2. 이벤트 3 (팝콘)
    const popcornLabelEl = document.getElementById('event3-popcorn-label');
    if (popcornLabelEl) {
        popcornLabelEl.innerText = isKor ? '팝콘먹기' : 'POPCORN GATHERED';
    }

    // 3. 이벤트 4 (낚시)
    const fishLabelEl = document.getElementById('event4-fish-label');
    if (fishLabelEl) {
        fishLabelEl.innerText = isKor ? '낚은 물고기' : 'FISH CAUGHT';
    }

    // 4. 광고 선택 창 (ad-selection-overlay)
    const adSelectTitle = document.querySelector('#ad-selection-overlay .selection-title');
    if (adSelectTitle) adSelectTitle.innerText = isKor ? '광고 보상 선택' : 'SELECT AD REWARD';

    const adSelectLifeBtnTitle = document.querySelector('#ad-select-life-btn .btn-title');
    if (adSelectLifeBtnTitle) adSelectLifeBtnTitle.innerText = isKor ? '생명 충전' : 'Refill Life';

    const adSelectLifeBtnDesc = document.querySelector('#ad-select-life-btn .btn-desc');
    if (adSelectLifeBtnDesc) adSelectLifeBtnDesc.innerHTML = isKor ? '20초 광고 시청 후<br>생명 2개 획득' : 'Watch 20s Ad to<br>gain 2 Lives';

    const adSelectEventBtnTitle = document.querySelector('#ad-select-event-btn .btn-title');
    if (adSelectEventBtnTitle) adSelectEventBtnTitle.innerText = isKor ? '이벤트 게임' : 'Event Game';

    const adSelectEventBtnDesc = document.querySelector('#ad-select-event-btn .btn-desc');
    if (adSelectEventBtnDesc) adSelectEventBtnDesc.innerHTML = isKor ? '30초 광고 시청 후<br>생명 1개 & 이벤트 게임' : 'Watch 30s Ad to gain<br>1 Life & Event Game';

    const closeAdSelectBtn = document.getElementById('close-ad-selection-btn');
    if (closeAdSelectBtn) closeAdSelectBtn.innerText = isKor ? '닫기' : 'CLOSE';

    // 5. 광고 시청 및 보상 선택 화면 (ad-overlay)
    const adTitle = document.getElementById('ad-reward-title');
    if (adTitle) {
        if (adTitle.dataset.adType === 'life') {
            adTitle.innerText = isKor ? '생명 충전 광고' : 'Life Refill Ad';
        } else if (adTitle.dataset.adType === 'event') {
            adTitle.innerText = isKor ? '이벤트 보너스 광고' : 'Event Bonus Ad';
        } else {
            adTitle.innerText = isKor ? '광고시간' : 'AD TIME';
        }
    }

    const adMsg = document.querySelector('#ad-overlay .ad-message');
    if (adMsg) adMsg.innerText = isKor ? '열기구게임 많이 사랑해주세요!!!🎈🎈🎈' : 'Enjoy Hot Air Balloon Adventure!🎈🎈🎈';

    const getLifeAdBtnEl = document.getElementById('get-life-ad-btn');
    if (getLifeAdBtnEl) getLifeAdBtnEl.innerText = isKor ? '생명받기' : 'GET LIFE';
    if (closeAdBtn) closeAdBtn.innerText = isKor ? '닫기' : 'Close';

    const rewardHint = document.querySelector('#ad-event-rewards .reward-hint');
    if (rewardHint) rewardHint.innerText = isKor ? '원하는 이벤트 번호를 선택하세요!' : 'Select an event to play!';

    const closeAdEventBtn = document.getElementById('close-ad-event-btn');
    if (closeAdEventBtn) closeAdEventBtn.innerText = isKor ? '닫기' : 'CLOSE';

    // 광고 보상 이벤트 버튼 라벨
    const eventLabels = {
        '1': { kor: '코인', eng: 'COIN' },
        '2': { kor: '스테이크', eng: 'STEAK' },
        '3': { kor: '팝콘', eng: 'POPCORN' },
        '4': { kor: '낚시', eng: 'FISHING' },
        '5': { kor: '피아노', eng: 'PIANO' },
        '6': { kor: '운석', eng: 'METEOR' }
    };
    document.querySelectorAll('.event-reward-btn').forEach(btn => {
        const num = btn.getAttribute('data-event');
        const labelEl = btn.querySelector('.evt-label');
        if (labelEl && eventLabels[num]) {
            labelEl.innerText = isKor ? eventLabels[num].kor : eventLabels[num].eng;
        }
    });

    // 6. 이벤트 선택 창 (event-selection-overlay)
    const eventSelectTitle = document.querySelector('#event-selection-overlay .selection-title');
    if (eventSelectTitle) eventSelectTitle.innerText = isKor ? '이벤트 게임 선택' : 'SELECT EVENT GAME';

    const closeEventSelectBtn = document.getElementById('close-event-selection-btn');
    if (closeEventSelectBtn) closeEventSelectBtn.innerText = isKor ? '닫기' : 'CLOSE';

    // 7. 피아노 건반 음계 라벨
    const noteMap = {
        'do': { kor: '도', eng: 'C' },
        're': { kor: '레', eng: 'D' },
        'mi': { kor: '미', eng: 'E' },
        'fa': { kor: '파', eng: 'F' },
        'sol': { kor: '솔', eng: 'G' },
        'la': { kor: '라', eng: 'A' },
        'si': { kor: '시', eng: 'B' },
        'do2': { kor: '도', eng: 'C' }
    };
    document.querySelectorAll('.piano-keys .key.white').forEach(k => {
        const note = k.getAttribute('data-note');
        if (note && noteMap[note]) {
            const blackKey = k.querySelector('.key.black');
            k.childNodes[0].nodeValue = (isKor ? noteMap[note].kor : noteMap[note].eng) + ' ';
        }
    });

    // 8. 게임 오버 / 미션 실패 화면 (fail-screen)
    const failScreenTitle = document.querySelector('#fail-screen h1');
    if (failScreenTitle) failScreenTitle.innerText = isKor ? '미션 실패!' : 'MISSION FAILED!';

    const failScreenDesc = document.querySelector('#fail-screen p');
    if (failScreenDesc) failScreenDesc.innerText = isKor ? '벽에 충돌하여 열기구가 터졌습니다.' : 'The balloon popped after crashing into a wall.';

    // 9. 미션 힌트 (level-hint)
    if (levelHintEl && !levelHintEl.classList.contains('hidden')) {
        const config = LEVEL_CONFIGS[currentLevel];
        const displayName = config ? config.displayName : '';
        const isTutorial = (currentLevel === 0 || displayName === "튜토리얼");
        if (isTutorial) {
            levelHintEl.innerHTML = isKor ?
                `<div class="tutorial-main-title">HOT AIR BALLOON<br>ADVENTURE</div><div class="tutorial-sub-guide">START 와 BURNER를 터치하여<br>상단 녹색 패드에 착륙 하세요!</div>` :
                `<div class="tutorial-main-title">HOT AIR BALLOON<br>ADVENTURE</div><div class="tutorial-sub-guide">Touch START and BURNER<br>to land on the green pad!</div>`;
        } else if (BONUS_G1_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = isKor ? `아이템 1개 이하 사용` : `Use 1 item or less`;
        } else if (BONUS_G2_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = isKor ? `아이템 2개 이하 사용` : `Use 2 items or less`;
        } else if (BONUS_G3_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = isKor ? `아이템 3개 이하 사용` : `Use 3 items or less`;
        } else if (BONUS_G4_LEVELS.includes(displayName)) {
            levelHintEl.innerHTML = isKor ? `아이템 4개 이하 사용` : `Use 4 items or less`;
        }
    }

    // 10. 상점 화면 아이템명 번역
    if (typeof storeData !== 'undefined' && storeData.items) {
        if (isKor) {
            if (storeData.items.life) storeData.items.life.name = "생명";
            if (storeData.items.fan_left) storeData.items.fan_left.name = "선풍기좌측";
            if (storeData.items.fan_right) storeData.items.fan_right.name = "선풍기우측";
            if (storeData.items.gas_item) storeData.items.gas_item.name = "가스통";
            if (storeData.items.clock) storeData.items.clock.name = "자명종시계";
            if (storeData.items.weight) storeData.items.weight.name = "무게추";
        } else {
            if (storeData.items.life) storeData.items.life.name = "Life";
            if (storeData.items.fan_left) storeData.items.fan_left.name = "Fan Left";
            if (storeData.items.fan_right) storeData.items.fan_right.name = "Fan Right";
            if (storeData.items.gas_item) storeData.items.gas_item.name = "Gas Tank";
            if (storeData.items.clock) storeData.items.clock.name = "Alarm Clock";
            if (storeData.items.weight) storeData.items.weight.name = "Weight";
        }
        if (typeof updateStoreUI === 'function') {
            const isStoreOpen = storeScreen && !storeScreen.classList.contains('hidden');
            if (isStoreOpen) {
                const isInventory = document.querySelector('.store-container')?.classList.contains('inventory-mode');
                updateStoreUI(isInventory);
            }
        }
    }

    // 11. 튜토리얼 가이드 툴팁 시스템에도 언어 동기화 알림
    if (window.updateTutorialGuideLanguage) {
        window.updateTutorialGuideLanguage(currentLanguage);
    }
}

// Set initial state (executed safely after all functions and constants are declared)
resetGame();
init();
updateLanguageUI();
updateSettingsUI();
updateLivesUI();
savePlayerData(); // Initial ground credits UI update
syncLeaderboardData();

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

// Audio Control for Ads
let isAdAudioPaused = false;

function pauseAdAudio() {
    if (bgmAudio && !bgmAudio.paused) {
        isAdAudioPaused = true;
        bgmAudio.pause();
    }
    if (soundMgr && soundMgr.context && soundMgr.context.state === 'running') {
        try { soundMgr.context.suspend(); } catch (e) { }
    }
}

function resumeAdAudio() {
    if (soundMgr && soundMgr.context && soundMgr.context.state === 'suspended') {
        try { soundMgr.context.resume(); } catch (e) { }
    }
    if (isAdAudioPaused && isMusicEnabled && bgmAudio) {
        bgmAudio.play().catch(() => {});
        isAdAudioPaused = false;
    }
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
        
        // 광고 선택 메뉴 표시
        if (adSelectionOverlay) {
            adSelectionOverlay.classList.remove('hidden');
            if (lives >= 7) {
                adSelectLifeBtn.style.opacity = "0.5";
            } else {
                adSelectLifeBtn.style.opacity = "1";
            }
        }
    });
}

if (adSelectLifeBtn) {
    adSelectLifeBtn.addEventListener('click', () => {
        if (lives >= 7) {
            const isKor = (currentLanguage === 'kor');
            alert(isKor ? "생명이 이미 가득 찼습니다! (최대 7개)" : "Lives are already full! (Max 7)");
            return;
        }
        adSelectionOverlay.classList.add('hidden');
        showAd('life', 20);
    });
}

if (adSelectEventBtn) {
    adSelectEventBtn.addEventListener('click', () => {
        const clearedEvents = Object.keys(LEVEL_CONFIGS).filter(lv => {
            const config = LEVEL_CONFIGS[lv];
            return config.displayName.includes('EVENT') && clearedLevels.includes(parseInt(lv));
        });

        if (clearedEvents.length === 0) {
            const isKor = (currentLanguage === 'kor');
            alert(isKor ?
                "아직 클리어한 이벤트 게임이 없습니다! 먼저 일반 게임을 진행하여 이벤트를 클리어하세요." :
                "No cleared event games yet! Clear event games during normal gameplay first.");
            return;
        }

        adSelectionOverlay.classList.add('hidden');
        showAd('event', 30);
    });
}

if (closeAdSelectionBtn) {
    closeAdSelectionBtn.addEventListener('click', () => {
        adSelectionOverlay.classList.add('hidden');
    });
}

// 광고 모달 터치/클릭 외부 침범 차단 (닫기 버튼 외 다른 버튼 안 눌러지게 방지)
if (adOverlay) {
    ['click', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'pointerdown', 'pointerup'].forEach(evt => {
        adOverlay.addEventListener(evt, (e) => {
            // 내부 버튼(닫기, 생명받기 등) 클릭 시에는 정상 작동하도록 이벤트 허용하되, 외부 전파는 완벽 차단
            e.stopPropagation();
        }, { passive: false });
    });
}

// ==========================================
// Ads System (Timer Simulation & AdSense Ready)
// ==========================================
const USE_GOOGLE_H5_ADS = false;
let adCountdownInterval = null;
let isCurrentAdCompleted = false;

function showAd(type, duration) {
    const isKor = (currentLanguage === 'kor');

    // 애드센스 정식 승인 후 H5 연동 시
    if (USE_GOOGLE_H5_ADS && typeof adBreak === 'function') {
        try {
            adBreak({
                type: 'reward',
                name: (type === 'life' ? 'refill_lives' : 'bonus_event'),
                beforeAd: () => {
                    pauseAdAudio();
                },
                afterAd: () => {
                    resumeAdAudio();
                },
                beforeReward: (showAdFn) => { showAdFn(); },
                adViewed: () => {
                    if (type === 'life') {
                        lives = Math.min(7, lives + 2);
                        lastLifeUpdate = Date.now();
                        savePlayerData();
                        updateLivesUI();
                        triggerLifeSparkle();
                        restoreBalloonVisibility();
                        alert(isKor ? "생명이 충전되었습니다! 💖" : "Lives recharged! 💖");
                    } else {
                        lives = Math.min(7, lives + 1);
                        savePlayerData();
                        updateLivesUI();
                        triggerLifeSparkle();
                        restoreBalloonVisibility();
                        if (adOverlay) adOverlay.classList.remove('hidden');
                        if (getLifeAdBtn) getLifeAdBtn.classList.add('hidden');
                        if (adEventRewardsEl) adEventRewardsEl.classList.remove('hidden');
                    }
                },
                adBreakDone: (info) => {
                    if (info && info.breakStatus !== 'viewed' && info.breakStatus !== 'dismissed') {
                        runLocalTimerAd(type, duration);
                    }
                }
            });
            return;
        } catch (e) {
            console.warn("H5 Ads error, running local timer:", e);
        }
    }

    // 기본: 자체 타이머 광고 모달 실행
    runLocalTimerAd(type, duration);
}

function runLocalTimerAd(type, duration) {
    if (!adOverlay) return;
    
    // 플레이 중 광고 진입 시 일시정지 처리
    if (gameState === 'PLAY') {
        gameState = 'PAUSED';
        pauseStartTime = Date.now();
        if (mainActionBtn) {
            mainActionBtn.innerText = 'PAUSE';
            mainActionBtn.classList.add('item-paused');
        }
    }

    // 광고 시청 시 배경음악 및 사운드 즉시 정지
    pauseAdAudio();
    
    isCurrentAdCompleted = false;
    adOverlay.classList.remove('hidden');
    
    if (adRewardTitle) {
        adRewardTitle.dataset.adType = type;
        const isKor = (currentLanguage === 'kor');
        if (type === 'life') {
            adRewardTitle.innerText = isKor ? "생명 충전 광고" : "Life Refill Ad";
        } else {
            adRewardTitle.innerText = isKor ? "이벤트 보너스 광고" : "Event Bonus Ad";
        }
    }

    const timerEl = adOverlay.querySelector('.ad-timer');
    let timeLeft = duration;

    if (timerEl) {
        timerEl.classList.remove('hidden');
        timerEl.innerText = timeLeft;
    }
    
    // 보상 버튼 초기화
    if (getLifeAdBtn) getLifeAdBtn.classList.add('hidden');
    if (adEventRewardsEl) adEventRewardsEl.classList.add('hidden');

    if (adCountdownInterval) {
        clearInterval(adCountdownInterval);
        adCountdownInterval = null;
    }

    adCountdownInterval = setInterval(() => {
        timeLeft--;
        if (timerEl) timerEl.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(adCountdownInterval);
            adCountdownInterval = null;
            isCurrentAdCompleted = true; // 광고 완주 플래그
            if (timerEl) timerEl.classList.add('hidden');
            
            if (type === 'life') {
                if (getLifeAdBtn) getLifeAdBtn.classList.remove('hidden');
            } else {
                // 이벤트 광고 보상: 생명 1개 충전 및 이벤트 목록 오픈
                lives = Math.min(7, lives + 1);
                savePlayerData();
                updateLivesUI();
                triggerLifeSparkle();
                restoreBalloonVisibility();

                if (adEventRewardsEl) {
                    adEventRewardsEl.classList.remove('hidden');
                    const eventBtns = adEventRewardsEl.querySelectorAll('.event-reward-btn');
                    eventBtns.forEach(btn => {
                        const eventNum = btn.dataset.event;
                        const eventLevelIdx = Object.keys(LEVEL_CONFIGS).find(lv => 
                            LEVEL_CONFIGS[lv].displayName === `EVENT ${eventNum}`
                        );
                        
                        if (eventLevelIdx && clearedLevels.includes(parseInt(eventLevelIdx))) {
                            btn.classList.remove('locked');
                        } else {
                            btn.classList.add('locked');
                        }
                    });
                }
            }
        }
    }, 1000);
}

// 닫기 버튼 이벤트 (중간에 닫으면 생명 미충전 및 음악 재개)
if (closeAdBtn) {
    closeAdBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 1. 광고를 끝까지 보지 않고 중간에 닫은 경우
        if (!isCurrentAdCompleted) {
            if (adCountdownInterval) {
                clearInterval(adCountdownInterval);
                adCountdownInterval = null;
            }
            if (adOverlay) adOverlay.classList.add('hidden');
            if (getLifeAdBtn) getLifeAdBtn.classList.add('hidden');
            if (adEventRewardsEl) adEventRewardsEl.classList.add('hidden');

            const timerEl = adOverlay ? adOverlay.querySelector('.ad-timer') : null;
            if (timerEl) {
                timerEl.classList.remove('hidden');
                timerEl.innerText = "20";
            }

            // 음악 다시 재생
            resumeAdAudio();

            // 생명 미충전 안내 알림
            const isKor = (currentLanguage === 'kor');
            alert(isKor ? "광고 시청이 중단되어 생명이 충전되지 않았습니다." : "Ad playback was cancelled. No lives were recharged.");
            return;
        }

        // 2. 이미 광고 시청이 완료된 후 닫은 경우
        if (adOverlay) adOverlay.classList.add('hidden');
        if (getLifeAdBtn) getLifeAdBtn.classList.add('hidden');
        if (adEventRewardsEl) adEventRewardsEl.classList.add('hidden');

        const timerEl = adOverlay ? adOverlay.querySelector('.ad-timer') : null;
        if (timerEl) {
            timerEl.classList.remove('hidden');
            timerEl.innerText = "20";
        }
        resumeAdAudio();
    });
}

// 생명받기 버튼 클릭 시 생명 2개 충전 및 음악 재개
if (getLifeAdBtn) {
    getLifeAdBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (adOverlay) adOverlay.classList.add('hidden');
        if (getLifeAdBtn) getLifeAdBtn.classList.add('hidden');

        const timerEl = adOverlay ? adOverlay.querySelector('.ad-timer') : null;
        if (timerEl) {
            timerEl.classList.remove('hidden');
            timerEl.innerText = "20";
        }

        // 보상 지급: 생명 2개 충전 (최대 7개)
        lives = Math.min(7, lives + 2);
        savePlayerData();
        updateLivesUI();
        triggerLifeSparkle();
        restoreBalloonVisibility();

        if (soundMgr) {
            soundMgr.resume();
            soundMgr.play('life');
        }

        // 음악 다시 재생
        resumeAdAudio();
    });
}

if (adEventRewardsEl) {
    const eventBtns = adEventRewardsEl.querySelectorAll('.event-reward-btn');
    eventBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventNum = btn.dataset.event;
            const eventLevelIdx = Object.keys(LEVEL_CONFIGS).find(lv => 
                LEVEL_CONFIGS[lv].displayName === `EVENT ${eventNum}`
            );

            if (eventLevelIdx) {
                if (adOverlay) adOverlay.classList.add('hidden');
                if (adEventRewardsEl) adEventRewardsEl.classList.add('hidden');
                resumeAdAudio();
                startRewardedEvent(parseInt(eventLevelIdx));
            }
        });
    });
}

if (closeAdEventBtn) {
    closeAdEventBtn.addEventListener('click', () => {
        if (adOverlay) adOverlay.classList.add('hidden');
        if (adEventRewardsEl) adEventRewardsEl.classList.add('hidden');
        const timerEl = adOverlay ? adOverlay.querySelector('.ad-timer') : null;
        if (timerEl) {
            timerEl.classList.remove('hidden');
            timerEl.innerText = "20";
        }
        resumeAdAudio();
        restoreBalloonVisibility();
    });
}

function showEventSelection() {
    if (!eventSelectionOverlay || !eventButtonsContainer) return;

    eventButtonsContainer.innerHTML = '';
    
    // 클리어한 이벤트 필터링
    const clearedEvents = Object.keys(LEVEL_CONFIGS).filter(lv => {
        const config = LEVEL_CONFIGS[lv];
        return config.displayName.includes('EVENT') && clearedLevels.includes(parseInt(lv));
    });

    clearedEvents.forEach(lv => {
        const config = LEVEL_CONFIGS[lv];
        const btn = document.createElement('button');
        btn.className = 'selection-btn';
        const isKor = (currentLanguage === 'kor');
        btn.innerHTML = `
            <span class="btn-title">${config.displayName}</span>
            <span class="btn-desc">${isKor ? '이 게임을 플레이하여 크레딧 획득' : 'Play this game to earn credits'}</span>
        `;
        btn.addEventListener('click', () => {
            eventSelectionOverlay.classList.add('hidden');
            startRewardedEvent(parseInt(lv));
        });
        eventButtonsContainer.appendChild(btn);
    });

    eventSelectionOverlay.classList.remove('hidden');
}

if (closeEventSelectionBtn) {
    closeEventSelectionBtn.addEventListener('click', () => {
        eventSelectionOverlay.classList.add('hidden');
    });
}

function startRewardedEvent(levelIndex) {
    // 이벤트 게임 진입 직전 플레이하던 일반 레벨을 기억
    const currentCfg = LEVEL_CONFIGS[currentLevel];
    if (currentCfg && !currentCfg.displayName.startsWith("EVENT") && !isSpaceEventLevel(currentCfg.displayName)) {
        previousLevelBeforeRewardedEvent = currentLevel;
    }

    currentLevel = levelIndex;
    resetGame();
    startGame();
    isRewardedEventPlay = true; // startGame() 이후에 TRUE로 설정하여 덮어쓰지지 않도록 함
    
    const isKor = (currentLanguage === 'kor');
    const msg = isKor ?
        `${LEVEL_CONFIGS[levelIndex].displayName} 시작! 이번 판은 크레딧을 획득할 수 있습니다.` :
        `${LEVEL_CONFIGS[levelIndex].displayName} Start! You can earn credits in this round.`;
    alert(msg);
}

// winGame이나 gameOver에서 isRewardedEventPlay가 초기화될 필요는 없음
// startGame()에서 다음 판을 시작할 때마다 초기화되기 때문

function getDeviceType() {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isMobile || isTablet) {
        return 'Mobile';
    }
    if (window.innerWidth <= 600 && (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) {
        return 'Mobile';
    }
    return 'PC';
}

function getDeviceDetail() {
    const ua = navigator.userAgent || '';
    if (/iPhone/i.test(ua)) return 'Mobile (iPhone)';
    if (/Android/i.test(ua)) return 'Mobile (Android)';
    if (/iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'Tablet (iPad)';
    if (/Windows/i.test(ua)) return 'PC (Windows)';
    if (/Macintosh|Mac OS X/i.test(ua)) return 'PC (Mac)';
    if (/Linux/i.test(ua)) return 'PC (Linux)';
    return getDeviceType();
}

function getDeviceUid() {
    let uid = localStorage.getItem('balloon_device_uid');
    if (!uid) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            uid = crypto.randomUUID();
        } else {
            uid = 'uid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        localStorage.setItem('balloon_device_uid', uid);
    }
    return uid;
}

function isTopRankScore(level, newScore) {
    if (newScore <= 0) return false;
    try {
        const localBoard = JSON.parse(localStorage.getItem('balloon_leaderboard_profiles'));
        if (!localBoard || !Array.isArray(localBoard) || localBoard.length === 0) {
            return false;
        }
        const myUid = (typeof getDeviceUid === 'function') ? getDeviceUid() : null;
        const dummyNames = ["CloudKing", "SkyRider", "AeroMaster", "WindWalker", "BalloonPro", "StormChaser"];
        
        let highestOtherScore = 0;
        let hasOtherScores = false;

        for (const user of localBoard) {
            if (!user || dummyNames.includes(user.nickname) || user.device === 'PC') continue;
            // 내 기기에서 등록했던 이전 점수는 다른 유저의 점수가 아니므로 제외
            if (myUid && user.uid === myUid) continue;

            const lvlScore = (user.levelScores && typeof user.levelScores[level] === 'number') ? user.levelScores[level] : 0;
            if (lvlScore > 0) {
                hasOtherScores = true;
                if (lvlScore > highestOtherScore) {
                    highestOtherScore = lvlScore;
                }
            }
        }

        // 다른 유저 점수가 존재하면 그 중 최고 점수보다 높아야 1등 신기록
        if (hasOtherScores) {
            return newScore > highestOtherScore;
        }
        // 다른 유저 등록 기록이 없으면 1등 신기록
        return true;
    } catch (e) {
        console.error("Error in isTopRankScore:", e);
        return false;
    }
}

async function syncLeaderboardData() {
    try {
        if (typeof db === 'undefined' || !db) return;
        const querySnapshot = await db.collection("leaderboard").get();
        let board = [];
        querySnapshot.forEach((doc) => {
            if (doc.id === '__stats_visitors__') {
                const data = doc.data();
                if (data && typeof data.totalVisitors === 'number') {
                    cachedTotalVisitors = data.totalVisitors;
                    localStorage.setItem('balloon_cached_total_visitors', cachedTotalVisitors);
                    if (typeof updateVisitorDisplay === 'function') updateVisitorDisplay();
                }
                return;
            }
            const data = doc.data();
            if (data && data.nickname) {
                if (!data.levelScores) data.levelScores = {};
                if (typeof data.overallScore !== 'number') data.overallScore = 0;
                board.push(data);
            }
        });
        localStorage.setItem('balloon_leaderboard_profiles', JSON.stringify(board));
    } catch (e) {
        // 백그라운드 동기화 실패 시 무시
    }
}

function getDummyLeaderboard() {
    return [];
}

let currentRankMode = 'level'; // 'max_level', 'level' or 'overall'

function getMyMaxLevelInfo() {
    let maxIdx = 0;
    if (Array.isArray(clearedLevels)) {
        for (let lv of clearedLevels) {
            const num = parseInt(lv);
            if (!isNaN(num) && LEVEL_CONFIGS[num] && num > maxIdx) {
                maxIdx = num;
            }
        }
    }
    if (myLevelBestScores && typeof myLevelBestScores === 'object') {
        for (let lv in myLevelBestScores) {
            const num = parseInt(lv);
            if (!isNaN(num) && LEVEL_CONFIGS[num] && (myLevelBestScores[num] > 0) && num > maxIdx) {
                maxIdx = num;
            }
        }
    }
    if (Array.isArray(clearedLevels) && clearedLevels.includes(maxIdx) && LEVEL_CONFIGS[maxIdx + 1]) {
        maxIdx = maxIdx + 1;
    }
    if (typeof currentLevel === 'number' && LEVEL_CONFIGS[currentLevel] && currentLevel > maxIdx) {
        if (Array.isArray(clearedLevels) && (clearedLevels.includes(currentLevel - 1) || clearedLevels.includes(currentLevel))) {
            maxIdx = currentLevel;
        }
    }
    const cfg = LEVEL_CONFIGS[maxIdx] || LEVEL_CONFIGS[0];
    const dispName = cfg ? cfg.displayName : maxIdx;
    return {
        levelIndex: maxIdx,
        displayName: dispName,
        label: `LV-${dispName}`
    };
}

function getEntryMaxLevel(entry) {
    if (entry && typeof entry.maxLevel === 'number' && LEVEL_CONFIGS[entry.maxLevel]) {
        const cfg = LEVEL_CONFIGS[entry.maxLevel];
        const disp = entry.maxLevelDisplayName || (cfg ? cfg.displayName : entry.maxLevel);
        return {
            levelIndex: entry.maxLevel,
            displayName: disp,
            label: `LV-${disp}`
        };
    }
    let maxIdx = 0;
    if (entry && entry.levelScores && typeof entry.levelScores === 'object') {
        for (let lv in entry.levelScores) {
            const num = parseInt(lv);
            if (!isNaN(num) && LEVEL_CONFIGS[num] && (entry.levelScores[num] > 0) && num > maxIdx) {
                maxIdx = num;
            }
        }
    }
    const cfg = LEVEL_CONFIGS[maxIdx] || LEVEL_CONFIGS[0];
    const disp = cfg ? cfg.displayName : maxIdx;
    return {
        levelIndex: maxIdx,
        displayName: disp,
        label: `LV-${disp}`
    };
}

async function updateRankUI() {
    if(rankListEl) rankListEl.innerHTML = '<div style="text-align:center; padding:10px; color:#2ecc71;">Loading ranking...</div>';
    let board = [];
    try {
        const querySnapshot = await db.collection("leaderboard").get();
        querySnapshot.forEach((doc) => {
            if (doc.id === '__stats_visitors__') {
                const data = doc.data();
                if (data && typeof data.totalVisitors === 'number') {
                    cachedTotalVisitors = data.totalVisitors;
                    localStorage.setItem('balloon_cached_total_visitors', cachedTotalVisitors);
                    updateVisitorDisplay();
                }
                return;
            }
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
    board = board.filter(user => !dummyNames.includes(user.nickname) && user.device !== 'PC');

    const rankScoreLabelEl = document.getElementById('rank-score-label');
    const tabMaxLevelBtn = document.getElementById('tab-max-level');
    const tabLevelBtn = document.getElementById('tab-level');
    const tabOverallBtn = document.getElementById('tab-overall');
    const isKor = (currentLanguage === 'kor');

    let myDisplayScore = 0;
    const myDevType = getDeviceType();
    const myDevLabel = (myDevType === 'PC') ? 'PC' : (isKor ? '폰' : 'Phone');
    const myDevIcon = (myDevType === 'PC') ? '💻' : '📱';
    
    if (currentRankMode === 'max_level') {
        if (tabMaxLevelBtn) { tabMaxLevelBtn.style.background = '#2ecc71'; tabMaxLevelBtn.style.color = '#000'; }
        if (tabLevelBtn) { tabLevelBtn.style.background = 'transparent'; tabLevelBtn.style.color = '#fff'; }
        if (tabOverallBtn) { tabOverallBtn.style.background = 'transparent'; tabOverallBtn.style.color = '#fff'; }

        if (rankScoreLabelEl) rankScoreLabelEl.innerText = isKor ? '내 최고 도달 레벨:' : 'My Max Level:';

        const myMax = getMyMaxLevelInfo();
        const myOverall = calculateMyOverallScore();

        if (myRankScoreEl) {
            myRankScoreEl.innerHTML = `<span style="color:#2ecc71; font-weight:bold;">${myMax.label}</span> <span style="font-size:0.75rem; color:#ffd32a; margin-left:3px;">(${myOverall.toLocaleString()} C)</span> <span style="font-size:0.75rem; color:#aaa; margin-left:3px;">(${myDevLabel} ${myDevIcon})</span>`;
        }

        // Sort: 1차 최고 레벨 순, 2차 전체 누적 점수 순
        board.sort((a, b) => {
            const maxA = getEntryMaxLevel(a).levelIndex;
            const maxB = getEntryMaxLevel(b).levelIndex;
            if (maxB !== maxA) return maxB - maxA;
            return (b.overallScore || 0) - (a.overallScore || 0);
        });

        // 내 순위 계산
        let myRank = 1;
        const myLevelIdx = myMax.levelIndex;
        for (let entry of board) {
            const entryLevelIdx = getEntryMaxLevel(entry).levelIndex;
            if (entryLevelIdx > myLevelIdx) {
                myRank++;
            } else if (entryLevelIdx === myLevelIdx && (entry.overallScore || 0) > myOverall) {
                myRank++;
            }
        }

        if (myRankPosEl) {
            if (myDevType === 'PC') {
                myRankPosEl.innerHTML = `<span style="color:#aaa; font-size:0.75rem;">${isKor ? '순위 등록 불가 (PC)' : 'Unranked (PC)'}</span>`;
            } else if (myRank <= 3) {
                myRankPosEl.innerHTML = `<span style="color:#f1c40f;">${myRank}${isKor ? '위' : ''}</span>`;
            } else {
                myRankPosEl.innerText = `${myRank}${isKor ? '위' : ''}`;
            }
        }
    } else if (currentRankMode === 'level') {
        if (tabMaxLevelBtn) { tabMaxLevelBtn.style.background = 'transparent'; tabMaxLevelBtn.style.color = '#fff'; }
        if (tabLevelBtn) { tabLevelBtn.style.background = '#2ecc71'; tabLevelBtn.style.color = '#000'; }
        if (tabOverallBtn) { tabOverallBtn.style.background = 'transparent'; tabOverallBtn.style.color = '#fff'; }

        const config = LEVEL_CONFIGS[currentLevel];
        const dispName = config ? config.displayName : currentLevel;
        if (dispName.toString().includes('EVENT') || dispName === "튜토리얼" || currentLevel === 0) {
            if(rankScoreLabelEl) rankScoreLabelEl.innerText = isKor ? `[LV-${dispName}] 순위 제외 레벨` : `[LV-${dispName}] Unranked Level`;
            if(myRankScoreEl) myRankScoreEl.innerText = '-';
            if(myRankPosEl) myRankPosEl.innerText = '-';
            if(rankListEl) rankListEl.innerHTML = isKor ?
                '<div style="text-align:center; padding:20px; color:#ccc;">튜토리얼 및 이벤트 레벨은 순위가 제공되지 않습니다.</div>' :
                '<div style="text-align:center; padding:20px; color:#ccc;">Leaderboard is not available for Tutorial and Event levels.</div>';
            return;
        }

        if(rankScoreLabelEl) rankScoreLabelEl.innerText = isKor ? `[LV-${dispName}] 내 점수:` : `[LV-${dispName}] My Score:`;
        myDisplayScore = myLevelBestScores[currentLevel] || 0;
        
        // Sort descending by level score
        board.sort((a,b) => (b.levelScores[currentLevel] || 0) - (a.levelScores[currentLevel] || 0));

        if(myRankScoreEl) {
            myRankScoreEl.innerHTML = `${myDisplayScore} <span style="font-size:0.75rem; color:#aaa; margin-left:3px;">(${myDevLabel} ${myDevIcon})</span>`;
        }

        let myRank = 1;
        for (let entry of board) {
            if (myDisplayScore < (entry.levelScores[currentLevel] || 0)) myRank++;
        }
        if(myRankPosEl) {
            if (myDevType === 'PC') {
                myRankPosEl.innerHTML = `<span style="color:#aaa; font-size:0.75rem;">${isKor ? '순위 등록 불가 (PC)' : 'Unranked (PC)'}</span>`;
            } else if (myDisplayScore === 0) {
                myRankPosEl.innerText = `-`;
            } else if(myRank <= 3) {
                myRankPosEl.innerHTML = `<span style="color:#f1c40f;">${myRank}${isKor ? '위' : ''}</span>`;
            } else {
                myRankPosEl.innerText = `${myRank}${isKor ? '위' : ''}`;
            }
        }
    } else {
        if (tabMaxLevelBtn) { tabMaxLevelBtn.style.background = 'transparent'; tabMaxLevelBtn.style.color = '#fff'; }
        if (tabLevelBtn) { tabLevelBtn.style.background = 'transparent'; tabLevelBtn.style.color = '#fff'; }
        if (tabOverallBtn) { tabOverallBtn.style.background = '#2ecc71'; tabOverallBtn.style.color = '#000'; }

        if(rankScoreLabelEl) rankScoreLabelEl.innerText = isKor ? '전체 내 점수:' : 'Overall My Score:';
        myDisplayScore = calculateMyOverallScore();
        
        // Sort descending by overall score
        board.sort((a,b) => (b.overallScore || 0) - (a.overallScore || 0));

        if(myRankScoreEl) {
            myRankScoreEl.innerHTML = `${myDisplayScore} <span style="font-size:0.75rem; color:#aaa; margin-left:3px;">(${myDevLabel} ${myDevIcon})</span>`;
        }

        let myRank = 1;
        for (let entry of board) {
            if (myDisplayScore < (entry.overallScore || 0)) myRank++;
        }
        if(myRankPosEl) {
            if (myDevType === 'PC') {
                myRankPosEl.innerHTML = `<span style="color:#aaa; font-size:0.75rem;">${isKor ? '순위 등록 불가 (PC)' : 'Unranked (PC)'}</span>`;
            } else if (myDisplayScore === 0) {
                myRankPosEl.innerText = `-`;
            } else if(myRank <= 3) {
                myRankPosEl.innerHTML = `<span style="color:#f1c40f;">${myRank}${isKor ? '위' : ''}</span>`;
            } else {
                myRankPosEl.innerText = `${myRank}${isKor ? '위' : ''}`;
            }
        }
    }



    if (rankNicknameInput && submitRankBtn) {
        if (myDevType === 'PC') {
            rankNicknameInput.placeholder = isKor ? "PC 등록 불가 (모바일 전용)" : "PC unavailable (Mobile only)";
            rankNicknameInput.disabled = true;
            submitRankBtn.disabled = true;
            submitRankBtn.style.opacity = '0.5';
            submitRankBtn.style.cursor = 'not-allowed';
            submitRankBtn.innerText = isKor ? "등록 불가" : "Blocked";
            submitRankBtn.title = isKor ? "PC에서는 순위 등록이 불가합니다." : "Leaderboard registration is not available on PC.";
        } else {
            rankNicknameInput.placeholder = isKor ? "닉네임" : "Nickname";
            rankNicknameInput.disabled = false;
            submitRankBtn.disabled = false;
            submitRankBtn.style.opacity = '1';
            submitRankBtn.style.cursor = 'pointer';
            submitRankBtn.innerText = isKor ? "등록" : "Submit";
            submitRankBtn.title = "";
        }
    }

    // Render top 5
    if(rankListEl) {
        rankListEl.innerHTML = '';
        if (board.length === 0) {
            rankListEl.innerHTML = isKor ?
                '<div style="text-align:center; padding:20px; color:#ccc;">등록된 순위가 없습니다.</div>' :
                '<div style="text-align:center; padding:20px; color:#ccc;">No scores submitted yet.</div>';
            return;
        }
        const top5 = board.slice(0, 5);
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        for (let i = 0; i < top5.length; i++) {
            const userDev = (top5[i].device === 'PC') ? 'PC' : 'Mobile';
            const userDevIcon = (userDev === 'PC') ? '💻' : '📱';
            const userDevText = (userDev === 'PC') ? 'PC' : (isKor ? '폰' : 'Phone');
            const userDevTitle = top5[i].deviceDetail || userDev;
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            item.style.padding = '5px 0';

            if (currentRankMode === 'max_level') {
                const entryMax = getEntryMaxLevel(top5[i]);
                const entryOverall = (top5[i].overallScore || 0).toLocaleString();
                item.innerHTML = `<span>${medals[i]} &nbsp; <span title="${userDevTitle}">${userDevIcon}</span> ${top5[i].nickname}</span> <span style="color: #2ecc71; font-weight: bold;">${entryMax.label} <span style="font-size:0.7rem; color:#ffd32a; font-weight:normal; margin-left:3px;" title="${userDevTitle}">(${entryOverall}C)</span></span>`;
            } else {
                const scoreToDisplay = currentRankMode === 'level' ? (top5[i].levelScores[currentLevel] || 0) : (top5[i].overallScore || 0);
                item.innerHTML = `<span>${medals[i]} &nbsp; <span title="${userDevTitle}">${userDevIcon}</span> ${top5[i].nickname}</span> <span style="color: #ffd32a; font-weight: normal;">${scoreToDisplay} <span style="font-size:0.7rem; color:#aaa; margin-left:3px;" title="${userDevTitle}">(${userDevText})</span></span>`;
            }
            rankListEl.appendChild(item);
        }
    }
}

// Add Rank Events
const tabMaxLevelBtn = document.getElementById('tab-max-level');
const tabLevelBtn = document.getElementById('tab-level');
const tabOverallBtn = document.getElementById('tab-overall');

if (tabMaxLevelBtn) {
    tabMaxLevelBtn.addEventListener('click', () => {
        currentRankMode = 'max_level';
        updateRankUI();
    });
}
if (tabLevelBtn) {
    tabLevelBtn.addEventListener('click', () => {
        currentRankMode = 'level';
        updateRankUI();
    });
}
if (tabOverallBtn) {
    tabOverallBtn.addEventListener('click', () => {
        currentRankMode = 'overall';
        updateRankUI();
    });
}




// Add Rank Events
async function openRankModal(e) {
    if (e) e.stopPropagation();
    if (!isSoundPreloaded && typeof startSoundSystem === 'function') await startSoundSystem();
    
    if (gameState === 'PLAY') {
        gameState = 'PAUSED';
        pauseStartTime = Date.now();
        if (mainActionBtn) {
            mainActionBtn.innerText = 'PAUSE';
            mainActionBtn.classList.add('item-paused');
        }
    }
    // 클리어 상태가 아닐 때만 clearScreen을 숨김 (클리어 상태에서는 점수 결과창 위에 랭킹창이 뜨고, 닫으면 점수창이 유지됨)
    if (gameState !== 'CLEAR') {
        if (clearScreen) clearScreen.classList.add('hidden');
    }
    if (levelHintEl) levelHintEl.classList.add('hidden');
    if (storeScreen) storeScreen.classList.add('hidden');
    if (settingsScreen) settingsScreen.classList.add('hidden');

    if (rankScreen) {
        rankScreen.classList.remove('hidden');
        updateVisitorDisplay();
        recordVisitorAndSync();
        const savedNick = localStorage.getItem('balloon_registered_nickname');
        if (rankNicknameInput && !rankNicknameInput.value && savedNick) {
            rankNicknameInput.value = savedNick;
        }
        updateRankUI();
        updateNextLevelButtonVisibility();
    }
}

if (rankBtn) {
    rankBtn.addEventListener('click', openRankModal);
}
const scoreRankRegisterBtn = document.getElementById('score-rank-register-btn');
if (scoreRankRegisterBtn) {
    scoreRankRegisterBtn.addEventListener('click', (e) => {
        if (getDeviceType() === 'PC') {
            const isKor = (currentLanguage === 'kor');
            alert(isKor ? "PC 환경에서 플레이한 게임은 레벨 순위 및 전체 순위에 등록할 수 없습니다.\n(모바일 기기에서만 순위 등록이 가능합니다.)" : "Games played on PC cannot be registered to Level Rank and Overall Rank.\n(Leaderboard registration is only available on mobile devices.)");
            return;
        }
        openRankModal(e);
        setTimeout(() => {
            if (rankNicknameInput) rankNicknameInput.focus();
        }, 120);
    });
}
const eventScoreRankRegisterBtn = document.getElementById('event-score-rank-register-btn');
if (eventScoreRankRegisterBtn) {
    eventScoreRankRegisterBtn.addEventListener('click', (e) => {
        if (getDeviceType() === 'PC') {
            const isKor = (currentLanguage === 'kor');
            alert(isKor ? "PC 환경에서 플레이한 게임은 레벨 순위 및 전체 순위에 등록할 수 없습니다.\n(모바일 기기에서만 순위 등록이 가능합니다.)" : "Games played on PC cannot be registered to Level Rank and Overall Rank.\n(Leaderboard registration is only available on mobile devices.)");
            return;
        }
        openRankModal(e);
        setTimeout(() => {
            if (rankNicknameInput) rankNicknameInput.focus();
        }, 120);
    });
}

const clearRankBtn = document.getElementById('clear-rank-btn');
if (clearRankBtn) {
    clearRankBtn.addEventListener('click', openRankModal);
}
const eventClearRankBtn = document.getElementById('event-clear-rank-btn');
if (eventClearRankBtn) {
    eventClearRankBtn.addEventListener('click', openRankModal);
}

const copyUidBtn = document.getElementById('copy-uid-btn');
const copyUidText = document.getElementById('copy-uid-text');
if (copyUidBtn) {
    copyUidBtn.addEventListener('click', async (e) => {
        if (e) e.stopPropagation();
        const uid = (typeof getDeviceUid === 'function') ? getDeviceUid() : (localStorage.getItem('balloon_device_uid') || '');
        if (!uid) return;
        const isKor = (currentLanguage === 'kor');

        let copied = false;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(uid);
                copied = true;
            } catch (err) {
                console.warn('navigator.clipboard failed:', err);
            }
        }
        if (!copied) {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = uid;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                copied = document.execCommand('copy');
                document.body.removeChild(textarea);
            } catch (err) {
                console.warn('execCommand copy failed:', err);
            }
        }

        if (copyUidText) {
            copyUidText.innerText = isKor ? "복사 완료!" : "Copied!";
            setTimeout(() => {
                copyUidText.innerText = isKor ? "UID 복사" : "Copy UID";
            }, 2000);
        }
        alert(isKor ? `UID가 클립보드에 복사되었습니다!\n\n[내 UID]\n${uid}` : `UID copied to clipboard!\n\n[My UID]\n${uid}`);
    });
}

if (closeRankBtn) {
    closeRankBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (rankScreen) rankScreen.classList.add('hidden');
        updateNextLevelButtonVisibility();
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
        const isKor = (currentLanguage === 'kor');
        if (getDeviceType() === 'PC') {
            alert(isKor ? "PC 환경에서 플레이한 게임은 레벨 순위 및 전체 순위에 등록할 수 없습니다.\n(모바일 기기에서만 순위 등록이 가능합니다.)" : "Games played on PC cannot be registered to Level Rank and Overall Rank.\n(Leaderboard registration is only available on mobile devices.)");
            return;
        }
        const nickname = rankNicknameInput ? rankNicknameInput.value.trim() : "";
        if (!nickname) {
            alert(isKor ? "닉네임을 입력하세요!" : "Please enter a nickname!");
            return;
        }

        const deviceUid = getDeviceUid();
        const myRegisteredNickname = localStorage.getItem('balloon_registered_nickname');

        // 규칙 1: 이 기기에서 이미 등록된 다른 닉네임이 있는 경우
        if (myRegisteredNickname && myRegisteredNickname !== nickname) {
            const conflictMsg = isKor ?
                `한 기기에서는 하나의 닉네임만 사용할 수 있습니다.\n기존 닉네임 [${myRegisteredNickname}]을 사용해주세요.` :
                `Only one nickname is allowed per device.\nPlease use your registered nickname [${myRegisteredNickname}].`;
            alert(conflictMsg);
            if (rankNicknameInput) rankNicknameInput.value = myRegisteredNickname;
            return;
        }

        try {
            // 규칙 2: 다른 기기가 같은 닉네임을 쓰고 있는지 Firebase 확인
            const docRef = db.collection("leaderboard").doc(nickname);
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                const data = docSnap.data();
                if (data && data.uid && data.uid !== deviceUid) {
                    const dupMsg = isKor ?
                        "중복된 이름입니다. 이미 다른 기기에서 사용 중인 닉네임입니다." :
                        "This nickname is already in use by another device. Please choose another nickname.";
                    alert(dupMsg);
                    return;
                }
            }

            const devType = getDeviceType(); // 'Mobile' or 'PC'
            const devDetail = getDeviceDetail(); // e.g. 'Mobile (iPhone)', 'Mobile (Android)', 'PC (Windows)'

            const maxInfo = getMyMaxLevelInfo();

            await docRef.set({
                nickname: nickname,
                uid: deviceUid,
                levelScores: Object.assign({}, myLevelBestScores),
                overallScore: calculateMyOverallScore(),
                maxLevel: maxInfo.levelIndex,
                maxLevelDisplayName: maxInfo.displayName,
                device: devType,
                deviceDetail: devDetail,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            localStorage.setItem('balloon_registered_nickname', nickname);

            alert(isKor ? "기록이 성공적으로 순위 서버에 갱신되었습니다!" : "Record successfully submitted to leaderboard!");
            
            updateRankUI(); 
        } catch (error) {
            console.error("랭킹 서버 저장 중 오류 발생: ", error);
            alert(isKor ? "순위 서버 연결에 실패했습니다." : "Failed to connect to leaderboard server.");
        }
    });
}






