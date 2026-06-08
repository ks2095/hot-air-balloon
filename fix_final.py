import os

file_path = "c:\\Users\\mutor\\Desktop\\안티그래비티\\뉴열기구게임\\game.js"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# We need to find the correct insertion points and fix the headless blocks.

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # 1. Check for the end of updateCloudPosition (around line 3449 in view_file)
    # The view_file said 3449 is the end of updateCloudPosition.
    # But line numbers in view_file are 1-based.
    
    if i == 3449: # index 3449 is line 3450
        # Instead of just the blank line, let's insert clearRaindrops and the header for isInsideLevel26Cloud
        new_lines.append("\n")
        new_lines.append("function clearRaindrops() {\n")
        new_lines.append("    activeRaindrops.forEach(drop => {\n")
        new_lines.append("        if (drop.el && drop.el.parentNode) drop.el.remove();\n")
        new_lines.append("    });\n")
        new_lines.append("    activeRaindrops = [];\n")
        new_lines.append("}\n\n")
        new_lines.append("function isInsideLevel26Cloud(x, y, halfW = 0, halfH = 0) {\n")
        i += 1
        continue

    new_lines.append(line)
    i += 1

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("File fixed with clearRaindrops and isInsideLevel26Cloud header.")
