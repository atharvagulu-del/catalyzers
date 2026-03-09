
path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

# Find all backtick positions
in_template = False
template_start = None
problems = []

for i, line in enumerate(lines):
    line_num = i + 1
    for j, char in enumerate(line):
        # Check for backtick not preceded by backslash
        if char == '`':
            # Check if escaped
            escaped = False
            if j > 0 and line[j-1] == '\\':
                # Check if the backslash itself is escaped
                if j > 1 and line[j-2] == '\\':
                    escaped = False  # Double backslash means the backtick is NOT escaped
                else:
                    escaped = True
            
            if not escaped:
                if not in_template:
                    in_template = True
                    template_start = (line_num, j+1)
                else:
                    in_template = False
                    template_start = None
            else:
                # Escaped backtick inside template - this is OK
                # But escaped backtick as closing is a problem
                if in_template:
                    pass  # Normal escaped char inside string
                else:
                    problems.append(f"Line {line_num}: Escaped backtick outside template literal")

if in_template:
    problems.append(f"Unclosed template literal starting at line {template_start[0]}, col {template_start[1]}")

print("=== Analysis Results ===")
if problems:
    for p in problems:
        print(p)
else:
    print("No obvious template literal issues found")

# Also count backticks per line to spot potential issues
print("\n=== Lines with backticks ===")
for i, line in enumerate(lines):
    count = line.count('`')
    if count > 0:
        print(f"Line {i+1}: {count} backtick(s) - {line.strip()[:80]}...")
