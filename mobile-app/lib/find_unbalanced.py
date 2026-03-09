
path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

total = 0
for i, line in enumerate(lines):
    count = line.count('`')
    if count > 0:
        total += count
        state = "odd (UNCLOSED)" if total % 2 == 1 else "even (balanced)"
        print(f"Line {i+1}: {count} backticks, running total: {total} ({state})")
        print(f"  Content: {line.strip()[:100]}")

print(f"\nFinal total: {total}")
print("BALANCED" if total % 2 == 0 else "UNBALANCED - MISSING CLOSING BACKTICK")
