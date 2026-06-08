import os

# The missing functions and the fixed raindrops logic
fix_content = """
function updateRain() {
    if (gameState !== 'PLAY' && gameState !== 'START') return;

    // 레벨별 빗방울 개수 차등 적용 (26레벨은 100%, 27레벨은 50%)
    if (currentLevel === 31) {
        if (Math.random() > 0.95) spawnRaindrop(); // 개수 대폭 감소 (0.05 확률)
    } else if (currentLevel === 32) {
        if (Math.random() > 0.65) spawnRaindrop(); 
    }

    const skyHeight = gameContainer.clientHeight * 0.9195;
    const balloonWidthPct = (45 / (gameContainer.clientWidth || 1)) * 100;
    const halfW = balloonWidthPct / 2;
    const balloonHeightPct = (110 / skyHeight) * 100;

    for (let i = activeRaindrops.length - 1; i >= 0; i--) {
        const drop = activeRaindrops[i];
        drop.y -= drop.velY;
        drop.x += drop.velX;

        // 비 충돌 판정
        if (gameState === 'PLAY' && Math.abs(drop.x - balloonX) < halfW && drop.y > balloonY && drop.y < balloonY + balloonHeightPct) {
            gas = Math.max(0, gas - 3);
            showFloatingText("-3 GAS", "#ff4d4d");
            
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

function updateCloudPosition() {
    if (gameState !== 'PLAY' && gameState !== 'START') return;
    if (currentLevel < 31 || currentLevel > 33) return;

    let z = 1;
    if (currentLevel === 31) z = 2;
    else if (currentLevel === 32) z = 5;
    else if (currentLevel === 33) z = 2;

    const wind = ZONE_WINDS[z] + tempWindBoosts[z];
    
    // 구름 이동 속도: 26레벨은 대기화면(START)에서 멈춤, 플레이 중에는 2, 나머지는 풍향 가속도 적용 (0.035)
    const isLevel26Start = (currentLevel === 31 && gameState === 'START');
    const currentSpeed = (currentLevel === 31) ? (isLevel26Start ? 0 : 2) : wind; 
    level26CloudX += currentSpeed * 0.035; 

    // 화면 끝 도달 시 반대편으로 워핑 (좌우 30% 여유)
    if (level26CloudX > 130) level26CloudX = -30;
    if (level26CloudX < -30) level26CloudX = 130;

    // 시각적 요소 업데이트
    const clouds = document.querySelectorAll('.level26-cloud');
    clouds.forEach(c => c.style.left = `${level26CloudX}%`);
    
    const svgGuides = document.querySelectorAll('.level26-cloud-guide-svg');
    svgGuides.forEach(s => s.style.left = `${level26CloudX - 50}%`);
}

function clearRaindrops() {
"""

file_path = "c:\\Users\\mutor\\Desktop\\안티그래비티\\뉴열기구게임\\game.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
found = False
for i, line in enumerate(lines):
    # Find the end of spawnRaindrop
    if "activeRaindrops.push({" in line:
        found = True
        
    if found and line.strip() == "}":
        new_lines.append(line)
        new_lines.append(fix_content)
        found = False
        # The next line in current file is the headless loop. We want to skip it until we find a line where it used to be part of clearRaindrops or similar.
        # Current file has:
        # 3381: }
        # 3382:     }); (Wait, looking at my last view_file...)
        # 3382:     });
        # 3383:     activeRaindrops = [];
        # 3384: }
        # Let's skip until we see "activeRaindrops = [];"
        continue
    
    if line.strip() == "activeRaindrops = [];" or ( "if (drop.el && drop.el.parentNode) drop.el.remove();" in line):
        continue
    if line.strip() == "});" and "activeRaindrops.forEach" not in line: # Part of broken loop
        continue
    if line.strip() == "}": # Might be the end of headless function
         # Need to be careful here. 
         pass

    new_lines.append(line)

# Let's try a simpler approach. Use markers.
# We know where it starts to break.
# Lines 3381 is the end of spawnRaindrop.
# Lines 3386 is the end of headless area.

final_lines = lines[:3381] + [fix_content] + lines[3385:]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(final_lines)

print("File fixed.")
