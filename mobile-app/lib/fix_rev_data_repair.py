
path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if "id: 'm-06'" in line:
        # We found the broken m-06 block (or the start of it).
        # We need to skip everything until m-07 starts.
        # But we must be careful. m-06 starts with '{' on previous line.
        # If we are at 'id:', we already appended '{' (unless we popped it).
        
        # Let's check if previous line was '{'.
        if i > 0 and lines[i-1].strip() == '{':
            # We want to replace the whole object including braces.
            # So pop the '{' we just added.
            if new_lines and new_lines[-1].strip() == '{':
                new_lines.pop()
        
        # Now append correct m-06 object
        # Note: I am appending the comma },
        new_lines.append("            {\n")
        new_lines.append("                id: 'm-06',\n")
        new_lines.append("                title: 'Matrices & Determinants',\n")
        new_lines.append("                content: `# Matrices & Determinants\n\n")
        new_lines.append("## 1. Types of Matrices\n")
        new_lines.append("- **Symmetric**: $A^T = A$\n")
        new_lines.append("- **Skew-Symmetric**: $A^T = -A$\n")
        new_lines.append("- **Orthogonal**: $A A^T = I$\n")
        new_lines.append("- **Idempotent**: $A^2 = A$\n")
        new_lines.append("- **Involutory**: $A^2 = I$\n")
        new_lines.append("- **Nilpotent**: $A^k = O$\n\n")
        new_lines.append("## 2. Properties of Determinants\n")
        new_lines.append("- $|A^T| = |A|$\n")
        new_lines.append("- $|AB| = |A||B|$\n")
        new_lines.append("- $|kA| = k^n|A|$ (for order n)\n")
        new_lines.append("- $|A^{-1}| = 1/|A|$\n")
        new_lines.append("- $|Adj A| = |A|^{n-1}$\n\n")
        new_lines.append("## 3. Properties of Adjoint\n")
        new_lines.append("- $A(Adj A) = (Adj A)A = |A|I$\n")
        new_lines.append("- $(Adj A)^{-1} = Adj(A^{-1}) = \\frac{A}{|A|}$\n")
        new_lines.append("- $Adj(AB) = (Adj B)(Adj A)$\n")
        new_lines.append("- $Adj(kA) = k^{n-1} Adj A$\n\n")
        new_lines.append("## 4. Inverse of Matrix\n")
        new_lines.append("$$A^{-1} = \\frac{Adj A}{|A|}$$\n")
        new_lines.append("Conditions:\n")
        new_lines.append("- Exists if $|A| \\neq 0$ (Non-singular)\n")
        new_lines.append("- $(A^{-1})^{-1} = A$\n")
        new_lines.append("- $(AB)^{-1} = B^{-1}A^{-1}$\n")
        new_lines.append("- $(A^T)^{-1} = (A^{-1})^T$\n\n")
        new_lines.append("## 5. System of Linear Equations\n")
        new_lines.append("$AX = B$\n")
        new_lines.append("- **Unique Solution**: $|A| \\neq 0$\n")
        new_lines.append("- **No Solution**: $|A| = 0$ and $(Adj A)B \\neq O$\n")
        new_lines.append("- **Infinite Solutions**: $|A| = 0$ and $(Adj A)B = O$\n\n")
        new_lines.append("## 6. Cramer's Rule\n")
        new_lines.append("For $a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$:\n")
        new_lines.append("$$x = \\frac{D_1}{D}, \\quad y = \\frac{D_2}{D}$$\n")
        new_lines.append("where $D = \\begin{vmatrix}a_1 & b_1 \\\\ a_2 & b_2\\end{vmatrix}, D_1 = \\begin{vmatrix}c_1 & b_1 \\\\ c_2 & b_2\\end{vmatrix}, D_2 = \\begin{vmatrix}a_1 & c_1 \\\\ a_2 & c_2\\end{vmatrix}$`\n")
        new_lines.append("            },\n")
        
        # Now skip ahead until we find m-07
        j = i + 1
        found_next = False
        while j < len(lines):
            # Check for m-07 ID
            if "id: 'm-07'" in lines[j]:
                # Found it. We should resume from the '{' before it.
                # Assuming lines[j-1] is '{'.
                if lines[j-1].strip() == '{':
                    i = j - 1
                else:
                    # Fallback
                    i = j
                    # If we resume at 'id:', we miss the '{'.
                    # We should probably insert it if we missed it.
                    # But if we assume file structure is consistent, lines[j-1] IS '{'.
                    pass
                found_next = True
                break
            j += 1
        
        if not found_next:
            # Maybe m-07 doesn't exist or we hit EOF?
            # m-07 SHOULD exist.
            print("Warning: Could not find m-07 start.")
            # Just panic or stop skipping?
            # Put i = j which is EOF
            i = j
        continue

    new_lines.append(line)
    i += 1

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
