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
const eventClearScreen = document.getElementById('event-clear-screen');
const eventResultScoreEl = document.getElementById('event-result-score');
const eventCounterEl = document.getElementById('event-credit-counter');
const eventCreditsValEl = document.getElementById('event-credits-val');
const eventCloseBtn = document.getElementById('event-close-btn');
const eventAccumulatedTotalEl = document.getElementById('event-accumulated-total-credits');
const windToggleBtn = document.getElementById('wind-toggle-btn');
const windLabels = document.querySelectorAll('.wind-label');

let showWindLabels = false;

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
let lastLifeUpdate = parseInt(localStorage.getItem('balloon_last_life_update')) || Date.now();
let clearedLevels = JSON.parse(localStorage.getItem('balloon_cleared_levels')) || [];

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

function savePlayerData() {
    localStorage.setItem('balloon_credits', totalCredits);
    localStorage.setItem('balloon_upgrades', JSON.stringify(upgrades));
    localStorage.setItem('balloon_store_data', JSON.stringify(storeData));
    localStorage.setItem('balloon_cleared_levels', JSON.stringify(clearedLevels));
    localStorage.setItem('balloon_lives', lives);
    localStorage.setItem('balloon_last_life_update', lastLifeUpdate);

    // Update ground credit display
    const groundCredits = document.getElementById('ground-credits-display');
    if (groundCredits) groundCredits.innerText = `${totalCredits}C`;
}

const burnerSound = new Audio('열기구소리.MP3');
burnerSound.loop = true;

const bgmFiles = [
    '열기구음악1.mp3', '열기구음악2.mp3', '열기구음악3.mp3', '열기구음악4.mp3',
    '열기구음악5.MP3', '열기구음악6.MP3', '열기구음악7.mp3', '열기구음악8.mp3'
];
let bgmAudio = new Audio();
bgmAudio.loop = false; // 곡이 끝나고 'ended' 이벤트가 발생하도록 false로 설정

// 음악이 끝나면 자동으로 다음 랜덤 곡 재생
bgmAudio.addEventListener('ended', () => {
    playRandomBGM(true);
});

const successSound = new Audio('미션성공.MP3');
const explosionSound = new Audio('폭발.MP3');
const coinSound = new Audio('코인소리.mp3');

function playCoinSound() {
    const sound = coinSound.cloneNode();
    sound.volume = 0.5;
    sound.play().catch(e => console.log("Coin sound play error:", e));
}

function playRandomBGM(force = false) {
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

let currentLevel = 1;
const LEVEL_CONFIGS = {
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
        displayName: "EVENT LEVEL",
        winds: [-2, 2, -2, 2, -2, 2, -2],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    6: {
        displayName: "5",
        winds: [-2, 4.75, -1.75, 4.75, -1.75, 4.75, -1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    7: {
        displayName: "6",
        winds: [-1, -1, -1, 4.75, -1.75, 4.75, -1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    8: {
        displayName: "7",
        winds: [1.75, 1.75, 1.75, -1.75, -1.75, -1.75, 1.75],
        maxGas: 400,
        maxTime: 40,
        platformY: 6.0
    },
    9: {
        displayName: "8",
        winds: [-1, -1, -1, -1, -1, 6, -1],
        maxGas: 400,
        maxTime: 40,
        platformY: 2.0
    }
};

let currentMaxGas = LEVEL_CONFIGS[1].maxGas;
let currentMaxTime = LEVEL_CONFIGS[1].maxTime;

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

// Initialize
function init() {
    // restartBtn.addEventListener('click', () => {
    //     resetGame();
    //     startGame();
    // });
    createParticles();
    createStars();

    if (itemLabelBtn) {
        itemLabelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
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
                storeScreen.classList.remove('hidden');
                updateStoreUI(true); // 인벤토리 모드로 열기/전환
            }
        });
    }

    if (storeLabelBtn) {
        storeLabelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
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
    mainActionBtn.addEventListener('mousedown', (e) => {
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
            if (burnerSound.paused) {
                burnerSound.play().catch(e => console.log("Audio play failed:", e));
            }
        }
    });

    mainActionBtn.addEventListener('touchstart', (e) => {
        if (e.cancelable) e.preventDefault();
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
            if (burnerSound.paused) {
                burnerSound.play().catch(e => console.log("Audio play failed:", e));
            }
        }
    }, { passive: false });

    window.addEventListener('mouseup', () => {
        isBurning = false;
        burnerSound.pause();
        burnerSound.currentTime = 0;
    });
    window.addEventListener('touchend', () => {
        isBurning = false;
        burnerSound.pause();
        burnerSound.currentTime = 0;
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
            const maxLevel = Object.keys(LEVEL_CONFIGS).length;
            if (currentLevel < maxLevel) {
                currentLevel++;
                resetGame();
                console.log(`Switched to Level ${currentLevel}`);
            }
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (currentLevel > 1) {
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
        // 신규 유저 초기 화면처럼 모든 데이터 초기화 (Ctrl + Y)
        if (e.ctrlKey && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            if (confirm("모든 게임 기록과 포인트를 초기화하고 처음부터 다시 시작하시겠습니까?")) {
                localStorage.removeItem('balloon_credits');
                localStorage.removeItem('balloon_upgrades');
                localStorage.removeItem('balloon_store_data');
                localStorage.removeItem('balloon_cleared_levels');
                localStorage.removeItem('balloon_lives');
                localStorage.removeItem('balloon_last_life_update');
                console.log("User Data Reset: All data cleared (Ctrl+Y)");
                location.reload(); // 페이지를 새로고침하여 완전 초기 상태로 복구
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
    balloonY = -getBasketOffset();
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
    const config = LEVEL_CONFIGS[currentLevel];

    // 아이템 효과는 이제 인벤토리에서 직접 사용할 때만 발동되므로
    // 시작 시에는 기본 설정값만 사용합니다. (자동 적용 안 함)
    currentMaxGas = config.maxGas;
    currentMaxTime = config.maxTime;

    gas = currentMaxGas;
    elapsedTime = 0;
    missionStartTime = Date.now();
    playRandomBGM();
}

function resumeGame() {
    if (gameState === 'PAUSED') {
        const now = Date.now();
        const pauseElapsed = now - pauseStartTime;
        missionStartTime += pauseElapsed;

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
                let isItemDisabled = (count === 0);

                if (displayName === "5" || displayName === "6") {
                    const restrictionMap = { "5": "clock", "6": "fan_right" };
                    const restrictedItem = restrictionMap[displayName];
                    if (key !== restrictedItem || droppedItems.length > 0) {
                        isItemDisabled = true;
                    }
                } else if (displayName === "7") {
                    const allowedItems = ["fan_left", "fan_right"];
                    const isAlreadyOnScreen = droppedItems.some(item => item.key === key);
                    if (!allowedItems.includes(key) || isAlreadyOnScreen) {
                        isItemDisabled = true;
                    }
                } else if (displayName === "8") {
                    const allowedItems = ["fan_right", "weight"];
                    const isAlreadyOnScreen = droppedItems.some(item => item.key === key);
                    if (!allowedItems.includes(key) || isAlreadyOnScreen) {
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

                    if (displayName === "5" || displayName === "6") {
                        const restrictionMap = { "5": "clock", "6": "fan_right" };
                        const restrictedItem = restrictionMap[displayName];
                        if (key !== restrictedItem || droppedItems.length > 0) return;
                    } else if (displayName === "7") {
                        const allowedItems = ["fan_left", "fan_right"];
                        const isAlreadyOnScreen = droppedItems.some(item => item.key === key);
                        if (!allowedItems.includes(key) || isAlreadyOnScreen) return;
                    } else if (displayName === "8") {
                        const allowedItems = ["fan_right", "weight"];
                        const isAlreadyOnScreen = droppedItems.some(item => item.key === key);
                        if (!allowedItems.includes(key) || isAlreadyOnScreen) return;
                    }

                    if (upgrades[key] > 0) {
                        startDragPlacement(key, e);
                    }
                });
                itemDiv.addEventListener('touchstart', (e) => {
                    const displayName = LEVEL_CONFIGS[currentLevel].displayName;

                    if (displayName === "5" || displayName === "6") {
                        const restrictionMap = { "5": "clock", "6": "fan_right" };
                        const restrictedItem = restrictionMap[displayName];
                        if (key !== restrictedItem || droppedItems.length > 0) return;
                    } else if (displayName === "7") {
                        const allowedItems = ["fan_left", "fan_right"];
                        const isAlreadyOnScreen = droppedItems.some(item => item.key === key);
                        if (!allowedItems.includes(key) || isAlreadyOnScreen) return;
                    } else if (displayName === "8") {
                        const allowedItems = ["fan_right", "weight"];
                        const isAlreadyOnScreen = droppedItems.some(item => item.key === key);
                        if (!allowedItems.includes(key) || isAlreadyOnScreen) return;
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
        // 시간 10초 추가
        missionStartTime += 10000;

        // 잔여 시간 40초로 제한
        const maxTimeLimit = 40;
        const diffSeconds = (now - missionStartTime) / 1000;
        const timeLeft = currentMaxTime - diffSeconds;

        if (timeLeft > maxTimeLimit) {
            missionStartTime = now - (currentMaxTime - maxTimeLimit) * 1000;
        }
        console.log("Item used: Clock - 10s added (Limited to 40s max)");
    } else if (key === 'gas_item') {
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

function update() {
    if (gameState === 'PLAY') {
        handleMovement();
        checkBoundaries();
        updateTargetLine();
    }

    // Render (Balloon starts above the 8.05% ground, sky is 93% high)
    balloon.style.bottom = `calc(8.05% + ${balloonY * 0.9195}%)`;
    balloon.style.left = `${balloonX}%`;

    if (isBurning) {
        balloon.classList.add('burning');
    } else {
        balloon.classList.remove('burning');
    }

    // Update UI
    if (gameState === 'PLAY') {
        const now = Date.now();
        const diffSeconds = (now - missionStartTime) / 1000;
        const timeLeft = Math.max(0, currentMaxTime - diffSeconds);

        const currentGas = Math.floor(gas);
        const currentTime = Math.ceil(timeLeft);

        if (gasTextEl.innerText != currentGas) {
            gasTextEl.innerText = currentGas;
            gasFillEl.style.width = `${Math.max(0, (gas / currentMaxGas) * 100)}%`;
        }
        if (timeTextEl.innerText != currentTime) {
            timeTextEl.innerText = currentTime;
            timeFillEl.style.width = `${Math.max(0, (timeLeft / currentMaxTime) * 100)}%`;
        }

        // Update dev labels
        if (gasValEl) gasValEl.innerText = Math.floor(currentMaxGas - gas);
        if (timeValEl) timeValEl.innerText = Math.floor(diffSeconds); // Show elapsed time as requested/original

        // Check fail conditions
        if (timeLeft <= 0 || gas <= 0) {
            gameOver(timeLeft <= 0 ? 'TIME OUT' : 'NO GAS');
        }

        // 버너 버튼 색상 차오르는 효과 업데이트
        if (isBurning && continuousBurnStartTime !== 0) {
            const fillPercent = Math.min(100, (now - continuousBurnStartTime) / 2000 * 100);
            mainActionBtn.style.setProperty('--fill', `${fillPercent}%`);
        } else {
            mainActionBtn.style.setProperty('--fill', '0%');
        }
    } else if (gameState === 'PAUSED') {
        // 일시정지 중에는 아무 작업도 하지 않음 (resumeGame()에서 처리됨)
        mainActionBtn.style.setProperty('--fill', '0%');
    } else if (gameState === 'START' || gameState === 'CLEAR') {
        mainActionBtn.style.setProperty('--fill', '0%');
    }

    requestAnimationFrame(update);
}

function updateTargetLine() {
    // 모든 레벨에서 착륙 패드가 가로로 움직이지 않도록 고정 (1~9레벨 공통)
    if (currentLevel >= 1 && currentLevel <= 9) {
        const config = LEVEL_CONFIGS[currentLevel];
        if (config.displayName === "8") {
            const skyWidth = gameContainer.clientWidth;
            const offsetPercent = (100 / skyWidth) * 100;
            targetLineX = 50 + offsetPercent;
        } else {
            targetLineX = 50;
        }

        targetLineEl.style.left = `${targetLineX}%`;

        // 레벨별 플랫폼 높이 반영 (비주얼)
        const platformY = config.platformY;
        const targetYBottom = (100 / 7) * platformY;
        targetLineEl.style.bottom = `calc(8.05% + ${targetYBottom * 0.9195}% + 12px)`;

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

    const windForce = ZONE_WINDS[zoneIndex] + tempWindBoosts[zoneIndex];

    velX += windForce * 0.00165; // Reduced from 0.0033 (half of previous effect)
    velX *= FRICTION;

    balloonX += velX;

    // Platform Dimensions
    const platformHeightPercentage = (9 / skyHeight) * 100;
    const platformY = LEVEL_CONFIGS[currentLevel].platformY;
    const targetYBottom = (100 / 7) * platformY + (12 / skyHeight) * 100; // Visual bottom of the platform
    const targetYTop = targetYBottom + platformHeightPercentage; // Top of the grass

    const platHalfWidth = (100 / 12) / 2;
    const platLeft = targetLineX - platHalfWidth;
    const platRight = targetLineX + platHalfWidth;
    const platTop = targetYTop;
    const platBottom = targetYBottom;

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
            if (velY < 0) { // Moving Top -> Bottom
                winGame();
                return;
            } else if (velY > 0) { // Pushing against the top from below?
                gameOver('CRASH');
                return;
            }
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

    if (!clearedLevels.includes(currentLevel) || LEVEL_CONFIGS[currentLevel].displayName === "EVENT LEVEL") {
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
    burnerSound.pause();

    const isEventLevel = LEVEL_CONFIGS[currentLevel] && LEVEL_CONFIGS[currentLevel].displayName === "EVENT LEVEL";
    const isAlreadyCleared = clearedLevels.includes(currentLevel);

    if (!isEventLevel && !isAlreadyCleared) {
        lives--;
        if (lives < 7 && lives >= 0) {
            // 생명이 깎인 시점부터 충전 타이머 시작 (이미 충전 중이 아니라면)
            if (lives === 6) lastLifeUpdate = Date.now();
        }
    } else {
        console.log("Life reduction skipped: Event Level or Already Cleared Level.");
    }

    savePlayerData();
    updateLivesUI();
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
    explosionSound.play().catch(e => console.log("Explosion audio failed:", e));

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
            // 시작 위치로 살짝 이동 (resetGame의 로직 일부 반영)
            balloonY = -getBasketOffset();
            balloonX = 50;
            balloon.style.bottom = `calc(8.05% + ${balloonY * 0.9195}%)`;
            balloon.style.left = `${balloonX}%`;
        }

        if (LEVEL_CONFIGS[currentLevel].displayName === "EVENT LEVEL" || clearedLevels.includes(currentLevel)) {
            updateNextLevelButtonVisibility();
        }

        // 5, 6, 7 레벨 실패 시 미션 가이드 다시 표시
        if (levelHintEl) {
            const displayName = LEVEL_CONFIGS[currentLevel].displayName;
            if (displayName === "5" || displayName === "6" || displayName === "7" || displayName === "8") {
                levelHintEl.classList.remove('hidden');
            }
        }
    }, 2000); // 2-second wait
}

function winGame() {
    gameState = 'CLEAR';
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

    if (ratio <= 0.2) { landingBonus = 50; bonusText = "PERFECT"; }
    else if (ratio <= 0.4) { landingBonus = 40; bonusText = "GREAT"; }
    else if (ratio <= 0.6) { landingBonus = 30; bonusText = "GOOD"; }
    else if (ratio <= 0.8) { landingBonus = 20; bonusText = "NICE"; }
    else { landingBonus = 10; bonusText = "LANDED"; }

    const score = Math.floor(gas) + Math.floor(timeLeft * 10) + landingBonus;

    const isEventLevel = LEVEL_CONFIGS[currentLevel] && LEVEL_CONFIGS[currentLevel].displayName === "EVENT LEVEL";
    const isAlreadyCleared = clearedLevels.includes(currentLevel);
    let finalScore = score;

    // 점수창 UI 업데이트 (상세 정보 표시)
    if (resultScoreEl) resultScoreEl.innerText = score;
    if (resultFormulaEl) {
        resultFormulaEl.innerHTML = `(${Math.floor(gas)} + (${Math.floor(timeLeft)} * 10) + <span style="color: #ffd32a;">${landingBonus}</span>)`;
    }

    if (isEventLevel) {
        finalScore = (isAlreadyCleared ? 200 : score + 200); // 이벤트 레벨은 이미 깨도 보너스 줌
        showEventBonusText();
    } else if (isAlreadyCleared) {
        finalScore = 0; // 이미 클리어한 레벨은 점수 합산 안 함
        console.log("Already cleared level - Score shown but mission points not added");
    }

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

    const currentDisplayName = LEVEL_CONFIGS[currentLevel].displayName;
    if (clearTitleEl) clearTitleEl.innerText = currentDisplayName === "EVENT LEVEL" ? "EVENT LEVEL CLEAR!" : `LEVEL-${currentDisplayName} CLEAR`;

    if (currentDisplayName === "EVENT LEVEL") {
        console.log("Event Level Cleared: Score stored quietly.");
    } else {
        clearScreen.classList.remove('hidden'); // 클리어 여부 상관없이 점수판 노출
    }

    updateNextLevelButtonVisibility();

    successSound.play().catch(e => console.log("Success audio failed:", e));
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
    p.el.style.width = `${Math.abs(ZONE_WINDS[p.zoneIndex]) * 5 + 5}px`;
}

function animateParticles() {
    particles.forEach(p => {
        const wind = ZONE_WINDS[p.zoneIndex] + tempWindBoosts[p.zoneIndex];
        // 모든 파티클이 구역의 바람 세기와 아이템 부스트에 영향을 받도록 수정
        p.x += wind * 0.12;

        if (p.x > 110) p.x = -10;
        if (p.x < -10) p.x = 110;

        p.el.style.left = `${p.x}%`;

        // 바람 세기나 아이템 효과가 변할 때 길이를 실시간 반영
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
    balloonY = -getBasketOffset();
    velX = 0;
    velY = 0;
    isBurning = false;
    hasEnteredZone7 = false;
    // 아이템 효과는 이제 인벤토리에서 직접 사용할 때만 발동되므로
    // 시작 시에는 기본 설정값만 사용합니다.
    currentMaxGas = config.maxGas;
    currentMaxTime = config.maxTime;
    gas = currentMaxGas;

    if (gasFillEl) gasFillEl.style.width = "100%";
    if (timeFillEl) timeFillEl.style.width = "100%";
    if (gasTextEl) gasTextEl.innerText = currentMaxGas;
    if (timeTextEl) timeTextEl.innerText = currentMaxTime;
    if (gasValEl) gasValEl.innerText = "0";
    if (timeValEl) timeValEl.innerText = "0";

    // Update Level Indicator
    if (levelIndicator) {
        const displayName = config.displayName;
        levelIndicator.innerText = (displayName === "EVENT LEVEL") ? displayName : `LV-${displayName}`;
    }
    updateTargetLine();
    console.log(`Resetting to Level ${currentLevel}`);

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
    mainActionBtn.innerText = currentLevel === 1 ? 'START' : (currentDisplayName === "EVENT LEVEL" ? 'START EVENT LEVEL' : `START LEVEL ${currentDisplayName}`);
    clearScreen.classList.add('hidden');
    failScreen.classList.add('hidden');
    if (failReasonBubble) failReasonBubble.classList.add('hidden');
    updateNextLevelButtonVisibility();

    // EVENT LEVEL (LEVEL 6) 특수 기믹: 코인 생성 및 UI 처리
    if (LEVEL_CONFIGS[currentLevel].displayName === "EVENT LEVEL") {
        createCoins();
        sessionEventCredits = 0;
        if (eventCreditsValEl) eventCreditsValEl.innerText = "0";
        if (eventCounterEl) eventCounterEl.classList.remove('hidden');
    } else {
        clearCoins();
        if (eventCounterEl) eventCounterEl.classList.add('hidden');
    }

    if (levelHintEl) {
        const displayName = config.displayName;
        if (displayName === "5") {
            levelHintEl.innerHTML = `Use Only <img src="자명종시계.png" class="hint-icon" alt="Clock"> x1`;
            levelHintEl.classList.remove('hidden');
        } else if (displayName === "6") {
            levelHintEl.innerHTML = `Use Only <img src="선풍기우측.png" class="hint-icon" alt="Fan Right"> x1`;
            levelHintEl.classList.remove('hidden');
        } else if (displayName === "7") {
            levelHintEl.innerHTML = `Use Only <img src="선풍기좌측.png" class="hint-icon" alt="Fan Left"> x1<br><span style="visibility: hidden;">Use Only </span><img src="선풍기우측.png" class="hint-icon" alt="Fan Right"> x1`;
            levelHintEl.classList.remove('hidden');
        } else if (displayName === "8") {
            levelHintEl.innerHTML = `Use Only <img src="선풍기우측.png" class="hint-icon" alt="Fan Right"> x1<br><span style="visibility: hidden;">Use Only </span><img src="무게추.png" class="hint-icon" alt="Weight"> x1`;
            levelHintEl.classList.remove('hidden');
        } else {
            levelHintEl.classList.add('hidden');
        }
    }
}


function updateWindLabels() {
    const zoneHeight = 100 / 7;
    windLabels.forEach(label => {
        const zoneIdx = parseInt(label.dataset.zone);

        let currentWind = ZONE_WINDS[zoneIdx] + tempWindBoosts[zoneIdx];

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

function updateNextLevelButtonVisibility() {
    if (!nextLevelBtn) return;

    const nextLv = currentLevel + 1;
    const isCleared = clearedLevels.includes(currentLevel);
    const isEventLevel = LEVEL_CONFIGS[currentLevel] && LEVEL_CONFIGS[currentLevel].displayName === "EVENT LEVEL";

    // 이미 클리어한 레벨이거나, 이벤트 레벨이거나, 방금 클리어한 상태라면 다음 레벨 버튼 표시
    if (LEVEL_CONFIGS[nextLv] && (isCleared || isEventLevel || gameState === 'CLEAR')) {
        const nextDisplayName = LEVEL_CONFIGS[nextLv].displayName;
        nextLevelBtn.innerText = (nextDisplayName === "EVENT LEVEL") ? nextDisplayName : `LEVEL ${nextDisplayName}`;
        nextLevelBtn.classList.remove('hidden');
    } else {
        nextLevelBtn.classList.add('hidden');
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


// 바람세기 표시 토글
if (windToggleBtn) {
    windToggleBtn.addEventListener('click', () => {
        showWindLabels = !showWindLabels;
        windLabels.forEach(label => {
            label.classList.toggle('hidden', !showWindLabels);
        });
        if (showWindLabels) updateWindLabels();
    });
}

function showEventBonusText() {
    const bonusEl = document.createElement('div');
    bonusEl.className = 'bonus-float-text';
    bonusEl.innerText = '+200';

    // Position: Right of the platform
    const platformHalfWidth = (100 / 12) / 2;
    const posX = targetLineX + platformHalfWidth + 1; // 1% gap

    const platformY = LEVEL_CONFIGS[currentLevel].platformY;
    const posY = (100 / 7) * platformY;

    bonusEl.style.left = `${posX}%`;
    bonusEl.style.bottom = `calc(8.05% + ${posY * 0.9195}% + 15px)`;

    gameContainer.appendChild(bonusEl);

    // Fade out and remove
    setTimeout(() => {
        bonusEl.remove();
    }, 2000);
}
