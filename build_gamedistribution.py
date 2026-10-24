import os
import re
import shutil
import zipfile

PROJECT_DIR = os.path.abspath('.')
BUILD_DIR = os.path.join(PROJECT_DIR, 'gamedistribution_build')
ZIP_FILE = os.path.join(PROJECT_DIR, 'gamedistribution_build.zip')

print("=== Starting GameDistribution Build Process ===")

# 1. Clean and recreate build directory
if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)
os.makedirs(BUILD_DIR)

# 2. Files and extensions to copy
asset_extensions = ('.png', '.mp3', '.mp4', '.json', '.txt')
exclude_files = {'ads.txt', 'fix.py', 'fix_final.py', 'fix_visual.py', 'fix_visual_v2.py', 'build_gamedistribution.py'}

for f in os.listdir(PROJECT_DIR):
    if f in exclude_files or f.startswith('.') or os.path.isdir(f):
        continue
    if f.endswith(asset_extensions) or f in ['sw.js', 'tutorial_guide.js']:
        src = os.path.join(PROJECT_DIR, f)
        dst = os.path.join(BUILD_DIR, f)
        shutil.copy2(src, dst)
        print(f"Copied asset: {f}")

# 3. Copy style.css
shutil.copy2(os.path.join(PROJECT_DIR, 'style.css'), os.path.join(BUILD_DIR, 'style.css'))
print("Copied style.css")

# 4. Prepare index.html for GameDistribution
with open(os.path.join(PROJECT_DIR, 'index.html'), 'r', encoding='utf-8') as f:
    html_content = f.read()

# Remove Google AdSense / H5 Ads scripts
# Pattern to remove AdSense tags
adsense_meta_pattern = re.compile(r'<meta name="google-adsense-account"[^>]*>\s*', re.I)
adsense_scripts_pattern = re.compile(
    r'<!-- Google AdSense.*?window\.adsbygoogle =.*?const adConfig =.*?</script>\s*',
    re.DOTALL | re.I
)

html_content = adsense_meta_pattern.sub('', html_content)
html_content = adsense_scripts_pattern.sub('', html_content)

# GD SDK snippet
gd_sdk_snippet = """    <!-- GameDistribution HTML5 SDK -->
    <script>
        window["GD_OPTIONS"] = {
            "gameId": "YOUR_GAME_ID_HERE", // Replace with your GameDistribution Game ID from developer dashboard
            "onEvent": function(event) {
                if (typeof handleGdEvent === 'function') {
                    handleGdEvent(event);
                }
            }
        };
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://html5.api.gamedistribution.com/main.min.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "gamedistribution-jssdk");
    </script>
"""

# Insert GD SDK right before </head>
html_content = html_content.replace('</head>', gd_sdk_snippet + '</head>')

# Update serviceWorker crazygames check to avoid issues
html_content = html_content.replace(
    "!window.location.hostname.includes('crazygames')",
    "!window.location.hostname.includes('gamedistribution') && !window.location.hostname.includes('crazygames')"
)

with open(os.path.join(BUILD_DIR, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(html_content)
print("Created GameDistribution index.html")

# 5. Prepare game.js for GameDistribution
with open(os.path.join(PROJECT_DIR, 'game.js'), 'r', encoding='utf-8') as f:
    js_content = f.read()

# GD SDK System code to prepend
gd_system_code = """// ==========================================
// GameDistribution HTML5 SDK Integration System
// ==========================================
let isGdAudioPaused = false;
let currentGdRewardedType = null;
let currentGdRewardSuccessCb = null;
let currentGdRewardFailCb = null;
let lastGdInterstitialTime = 0;
const GD_INTERSTITIAL_COOLDOWN = 60000; // 60 seconds minimum cooldown between interstitial ads

function handleGdEvent(event) {
    if (!event || !event.name) return;
    console.log("[GameDistribution] Event:", event.name);

    switch (event.name) {
        case "SDK_GAME_PAUSE":
            // Mandatory: Mute all audio during ads
            if (bgmAudio && !bgmAudio.paused) {
                isGdAudioPaused = true;
                bgmAudio.pause();
            }
            if (soundMgr && soundMgr.context && soundMgr.context.state === 'running') {
                try { soundMgr.context.suspend(); } catch (e) { }
            }
            if (gameState === 'PLAY') {
                gameState = 'PAUSED';
                pauseStartTime = Date.now();
                if (mainActionBtn) {
                    mainActionBtn.innerText = 'PAUSE';
                    mainActionBtn.classList.add('item-paused');
                }
            }
            break;

        case "SDK_GAME_START":
            // Resume audio after ad completes
            if (soundMgr && soundMgr.context && soundMgr.context.state === 'suspended') {
                try { soundMgr.context.resume(); } catch (e) { }
            }
            if (isGdAudioPaused && isMusicEnabled && bgmAudio) {
                bgmAudio.play().catch(() => {});
                isGdAudioPaused = false;
            }
            preloadGdRewarded();
            break;

        case "SDK_REWARDED_WATCH_COMPLETE":
            console.log("[GameDistribution] Rewarded ad complete! Granting reward for:", currentGdRewardedType);
            if (typeof currentGdRewardSuccessCb === 'function') {
                currentGdRewardSuccessCb();
                currentGdRewardSuccessCb = null;
            }
            break;

        case "SDK_READY":
            console.log("[GameDistribution] SDK Ready!");
            preloadGdRewarded();
            break;

        case "SDK_ERROR":
            console.warn("[GameDistribution] SDK Error:", event);
            if (typeof currentGdRewardFailCb === 'function') {
                currentGdRewardFailCb(event);
                currentGdRewardFailCb = null;
            }
            break;
    }
}

function preloadGdRewarded() {
    if (typeof gdsdk !== 'undefined' && typeof gdsdk.preloadAd === 'function') {
        gdsdk.preloadAd('rewarded').catch(() => {});
    }
}

function requestGdRewardedAd(type, onSuccess, onFail) {
    if (typeof gdsdk !== 'undefined' && typeof gdsdk.showAd === 'function') {
        currentGdRewardedType = type;
        currentGdRewardSuccessCb = onSuccess;
        currentGdRewardFailCb = onFail;

        gdsdk.showAd('rewarded')
            .then(response => {
                console.log("[GameDistribution] Rewarded ad call succeeded", response);
            })
            .catch(error => {
                console.warn("[GameDistribution] Rewarded ad failed or cancelled:", error);
                if (typeof onFail === 'function') onFail(error);
                currentGdRewardSuccessCb = null;
                currentGdRewardFailCb = null;
            });
        return true;
    }
    return false;
}

function requestGdInterstitial(onFinished) {
    const now = Date.now();
    if (now - lastGdInterstitialTime < GD_INTERSTITIAL_COOLDOWN) {
        if (onFinished) onFinished();
        return false;
    }

    if (typeof gdsdk !== 'undefined' && typeof gdsdk.showAd === 'function') {
        lastGdInterstitialTime = now;
        gdsdk.showAd()
            .then(() => {
                if (onFinished) onFinished();
            })
            .catch(err => {
                console.warn("[GameDistribution] Interstitial ad failed/skipped:", err);
                if (onFinished) onFinished();
            });
        return true;
    }

    if (onFinished) onFinished();
    return false;
}

"""

# Prepend GD system code
js_content = gd_system_code + "\n" + js_content

# Update showAd function to prioritize GD Rewarded Ads
old_show_ad_pattern = re.compile(
    r'function showAd\(type, duration\)\s*\{.*?(?=function runLocalTimerAd)',
    re.DOTALL
)

new_show_ad_function = """function showAd(type, duration) {
    const isKor = (currentLanguage === 'kor');

    // 1. GameDistribution Rewarded Ad Integration
    if (typeof gdsdk !== 'undefined' && typeof gdsdk.showAd === 'function') {
        const triggered = requestGdRewardedAd(
            type,
            () => {
                // Reward success
                if (type === 'life') {
                    lives = 7;
                    lastLifeUpdate = Date.now();
                    savePlayerData();
                    updateLivesUI();
                    triggerLifeSparkle();
                    if (typeof restoreBalloonVisibility === 'function') restoreBalloonVisibility();
                    const lifeModal = document.getElementById('ad-selection-overlay');
                    if (lifeModal) lifeModal.classList.add('hidden');
                    alert(isKor ? "생명이 7개로 완전 충전되었습니다! 💖" : "Lives fully refilled to 7! 💖");
                } else {
                    lives = Math.min(7, lives + 1);
                    savePlayerData();
                    updateLivesUI();
                    triggerLifeSparkle();
                    if (typeof restoreBalloonVisibility === 'function') restoreBalloonVisibility();
                    if (adOverlay) adOverlay.classList.remove('hidden');
                    if (getLifeAdBtn) getLifeAdBtn.classList.add('hidden');
                    if (adEventRewardsEl) adEventRewardsEl.classList.remove('hidden');
                }
            },
            (error) => {
                console.warn("[GameDistribution] Rewarded ad fallback to local timer:", error);
                runLocalTimerAd(type, duration);
            }
        );
        if (triggered) return;
    }

    // 2. Fallback: Local Timer Ad (if running standalone or outside GD portal)
    runLocalTimerAd(type, duration);
}
"""

js_content = old_show_ad_pattern.sub(new_show_ad_function, js_content)

# Add Interstitial Ad trigger on level transitions (when close-clear-btn is clicked)
close_clear_pattern = re.compile(r'closeClearBtn\.addEventListener\(\'click\',\s*\(\)\s*=>\s*\{', re.I)
if close_clear_pattern.search(js_content):
    js_content = close_clear_pattern.sub(
        "closeClearBtn.addEventListener('click', () => {\n    if (typeof requestGdInterstitial === 'function') requestGdInterstitial();",
        js_content
    )

with open(os.path.join(BUILD_DIR, 'game.js'), 'w', encoding='utf-8') as f:
    f.write(js_content)
print("Created GameDistribution game.js")

# 6. Create ZIP file for GameDistribution Developer Portal
print(f"Creating ZIP archive: {ZIP_FILE}")
with zipfile.ZipFile(ZIP_FILE, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(BUILD_DIR):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, BUILD_DIR)
            zf.write(file_path, arcname)

zip_size_kb = os.path.getsize(ZIP_FILE) / 1024
print(f"Successfully generated {ZIP_FILE} ({zip_size_kb:.1f} KB)")
print("=== GameDistribution Build Complete ===")
