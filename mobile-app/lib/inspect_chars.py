
path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
try:
    with open(path, 'rb') as f:
        lines = f.readlines()

    # Lines are 0-indexed in list -> Line 352 is index 351
    # We want 352, 353, 354, 355
    start_idx = 351 # Line 352
    end_idx = 356   # Up to but not including Line 357 (so 356)

    print(f"File Lines Total: {len(lines)}")
    
    for i in range(start_idx, end_idx):
        if i >= len(lines):
            break
        
        line_bytes = lines[i]
        line_num = i + 1
        
        print(f"\n--- Line {line_num} ---")
        print(f"Bytes repr: {line_bytes!r}")
        print("Characters:")
        for idx, b in enumerate(line_bytes):
            char_display = chr(b) if 32 <= b <= 126 else f"\\x{b:02x}"
            print(f"  {idx}: {b} ({char_display})")

except Exception as e:
    print(f"Error: {e}")
