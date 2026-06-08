import os

file_path = "c:\\Users\\mutor\\Desktop\\안티그래비티\\뉴열기구게임\\game.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "cloud.style.left = '50%';" in line:
         # Insert the missing bottom style right after left style
         new_lines.append("        cloud.style.bottom = `${cloudBottomY - (100 / 60) - (zoneHeight / 5)}%`; // 이미지 위치만 1/5구역만큼 추가 하향\n")

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Visual cloud position inserted and adjusted.")
