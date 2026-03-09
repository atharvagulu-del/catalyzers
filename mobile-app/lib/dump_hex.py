
path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'rb') as f:
    lines = f.readlines()

start = 349  # 0-indexed, so line 350
end = 360

for i in range(start, end):
    if i < len(lines):
        print(f"Line {i+1}: {lines[i]}")
        print(f"Hex {i+1}: {lines[i].hex(' ')}")
