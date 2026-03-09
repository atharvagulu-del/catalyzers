
path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'rb') as f:
    lines = f.readlines()

print(f"Line 354: {lines[353]}")
print(f"Repr 354: {repr(lines[353])}")
print(f"Line 355: {lines[354]}")
print(f"Repr 355: {repr(lines[354])}")
