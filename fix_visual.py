import os

file_path = "c:\\Users\\mutor\\Desktop\\안티그래비티\\뉴열기구게임\\game.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "cloud.style.bottom =" in line and "cloudBottomY" in line and "(100 / 60)" in line:
         # Need to restore the line and add the subtraction
         new_lines.append("        cloud.style.bottom = `${cloudBottomY - (100 / 60) - (zoneHeight / 5)}%`; // 이미지 위치만 1/5구역만큼 추가 하향\n")
    else:
        new_lines.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Visual cloud position adjusted.")
