// ==========================================
// 튜토리얼 레벨 버튼 설명 말풍선 가이드 시스템
// ==========================================
(function() {
    let activeTutorialTooltipEl = null;
    let currentTutorialTargetBtn = null;
    let tutorialTooltipTimer = null;

    const TUTORIAL_BUTTON_EXPLANATIONS = {
        'main-action-btn': {
            title: { kor: 'START / BURNER', eng: 'START / BURNER' },
            desc: {
                kor: '열기구를 출발시키고,<br>누르고 있으면 버너로 상승합니다.<br><span style="color:#ff6b6b; font-weight:bold;">(2초 이상 누르면 열기구 터짐!)</span>',
                eng: 'Starts balloon, and hold to<br>activate burner to ascend.<br><span style="color:#ff6b6b; font-weight:bold;">(Hold >2s will explode balloon!)</span>'
            },
            placement: 'top'
        },
        'store-label-btn': {
            title: { kor: 'STORE (상점)', eng: 'STORE' },
            desc: {
                kor: '코인(C)으로 유용한 아이템을<br>구매하거나 판매할 수 있습니다.',
                eng: 'Buy or sell useful items<br>with coins (C).'
            },
            placement: 'top'
        },
        'item-label-btn': {
            title: { kor: 'ITEM (인벤토리)', eng: 'ITEM' },
            desc: {
                kor: '보유 중인 아이템을 장착하거나<br>게임 화면에 배치할 수 있습니다.',
                eng: 'Equip or place items onto<br>the sky playfield.'
            },
            placement: 'top'
        },
        'rank-btn': {
            title: { kor: '순위 (RANK)', eng: 'RANK' },
            desc: {
                kor: '레벨별 클리어 점수와 전체<br>랭킹 순위를 확인하고 등록합니다.',
                eng: 'Check and submit level scores<br>and overall leaderboard rank.'
            },
            placement: 'bottom'
        },
        'ads-btn': {
            title: { kor: '광고', eng: 'Ads' },
            desc: {
                kor: '광고를 시청하고 생명 충전<br>또는 이벤트 게임을 즐길 수 있습니다.',
                eng: 'Watch ads to refill lives or<br>play special event games.'
            },
            placement: 'bottom'
        },
        'settings-btn': {
            title: { kor: 'Settings (환경설정)', eng: 'Settings' },
            desc: {
                kor: '바람 정보 표시, 음악(BGM), UI 위치,<br>전체화면, 언어 등을 설정합니다.',
                eng: 'Configure winds, music, UI swap,<br>fullscreen, and language.'
            },
            placement: 'bottom'
        },
        'next-level-btn': {
            title: { kor: '다음 레벨 (▶)', eng: 'Next Level (▶)' },
            desc: {
                kor: '다음 레벨 단계로 바로 이동합니다.',
                eng: 'Jump directly to the next level.'
            },
            placement: 'bottom'
        },
        'prev-level-btn': {
            title: { kor: '이전 레벨 (◀)', eng: 'Prev Level (◀)' },
            desc: {
                kor: '이전 레벨 단계로 되돌아갑니다.',
                eng: 'Return to previous level.'
            },
            placement: 'bottom'
        }
    };

    function removeTutorialTooltip() {
        if (activeTutorialTooltipEl) {
            activeTutorialTooltipEl.remove();
            activeTutorialTooltipEl = null;
        }
        currentTutorialTargetBtn = null;
        if (tutorialTooltipTimer) {
            clearTimeout(tutorialTooltipTimer);
            tutorialTooltipTimer = null;
        }
    }

    window.removeTutorialTooltip = removeTutorialTooltip;

    function isTutorialLevelNow() {
        try {
            if (typeof currentLevel !== 'undefined') {
                if (currentLevel === 0) return true;
                if (typeof LEVEL_CONFIGS !== 'undefined' && LEVEL_CONFIGS[currentLevel]) {
                    const disp = LEVEL_CONFIGS[currentLevel].displayName;
                    if (disp === '튜토리얼') return true;
                }
            }
        } catch (e) {
            console.warn(e);
        }
        return false;
    }

    function showTutorialTooltip(btnId, targetEl) {
        removeTutorialTooltip();
        const info = TUTORIAL_BUTTON_EXPLANATIONS[btnId];
        if (!info || !targetEl) return;

        const lang = (typeof currentLanguage !== 'undefined' && currentLanguage === 'eng') ? 'eng' : 'kor';
        const titleText = (typeof info.title === 'object') ? (info.title[lang] || info.title.kor) : info.title;
        const descText = (typeof info.desc === 'object') ? (info.desc[lang] || info.desc.kor) : info.desc;
        const subText = (lang === 'eng') ? 'Touch once more to activate' : '한 번 더 터치하면 실행됩니다';

        const container = document.getElementById('game-container') || document.body;
        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-bubble-tooltip';
        tooltip.id = 'tutorial-btn-tooltip';
        tooltip.innerHTML = '<span class="bubble-title">' + titleText + '</span>' +
                            '<span class="bubble-desc">' + descText + '</span>' +
                            '<span class="bubble-sub">' + subText + '</span>';

        container.appendChild(tooltip);
        activeTutorialTooltipEl = tooltip;
        currentTutorialTargetBtn = btnId;

        const containerRect = container.getBoundingClientRect();
        const btnRect = targetEl.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let placement = info.placement || 'top';
        let left = (btnRect.left + btnRect.width / 2) - containerRect.left;
        let top = 0;

        if (placement === 'top') {
            top = (btnRect.top - containerRect.top) - tooltipRect.height - 12;
            if (top < 10) {
                placement = 'bottom';
                top = (btnRect.bottom - containerRect.top) + 12;
            }
        } else {
            top = (btnRect.bottom - containerRect.top) + 12;
            if (top + tooltipRect.height > containerRect.height - 10) {
                placement = 'top';
                top = (btnRect.top - containerRect.top) - tooltipRect.height - 12;
            }
        }

        const halfWidth = tooltipRect.width / 2;
        if (left - halfWidth < 10) {
            left = halfWidth + 10;
        } else if (left + halfWidth > containerRect.width - 10) {
            left = containerRect.width - halfWidth - 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.classList.add(placement === 'top' ? 'arrow-bottom' : 'arrow-top');

        tutorialTooltipTimer = setTimeout(() => {
            removeTutorialTooltip();
        }, 5000);
    }

    function interceptEvent(e, btnId, targetEl) {
        if (!isTutorialLevelNow()) return;

        // START/BURNER 버튼인 경우: 게임이 진행 중(PLAY)일 때는 버너 조작을 방해하지 않음
        if (btnId === 'main-action-btn' && typeof gameState !== 'undefined' && gameState === 'PLAY') {
            return;
        }

        if (currentTutorialTargetBtn === btnId) {
            // 두 번째 클릭: 말풍선 닫고 실제 동작 실행 허용
            removeTutorialTooltip();
        } else {
            // 첫 번째 클릭: 동작 차단하고 설명 말풍선 띄움
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            showTutorialTooltip(btnId, targetEl);
        }
    }

    function init() {
        const btnIds = Object.keys(TUTORIAL_BUTTON_EXPLANATIONS);
        btnIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            el.addEventListener('click', (e) => interceptEvent(e, id, el), true);
            el.addEventListener('mousedown', (e) => interceptEvent(e, id, el), true);
            el.addEventListener('touchstart', (e) => interceptEvent(e, id, el), true);
        });

        // 빈 화면 클릭 시 튜토리얼 말풍선 닫기
        window.addEventListener('click', (e) => {
            if (!activeTutorialTooltipEl) return;
            const selector = Object.keys(TUTORIAL_BUTTON_EXPLANATIONS).map(id => '#' + id).join(', ');
            const clickedBtn = e.target.closest(selector);
            if (!clickedBtn && !e.target.closest('#tutorial-btn-tooltip')) {
                removeTutorialTooltip();
            }
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
