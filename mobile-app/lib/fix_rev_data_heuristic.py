
path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

found_idx = -1
for i, line in enumerate(lines):
    if "# Matrices & Determinants" in line:
        found_idx = i
        break

if found_idx != -1:
    print(f"Found marker at line {found_idx+1}")
    
    # Trace back to find start of object '{'
    start_idx = -1
    for i in range(found_idx, max(0, found_idx - 10), -1):
        s = lines[i].strip()
        if s == '{':
            start_idx = i
            break
        if s == '},':
            # We hit previous object end
            start_idx = i + 1 # Start after it
            break
            
    if start_idx == -1:
        # Fallback
        start_idx = found_idx
        
    print(f"Determined start at line {start_idx+1}")
    
    # Trace forward to find end of object
    # We look for start of m-07
    end_idx = -1
    for i in range(found_idx, len(lines)):
        if "id: 'm-07'" in lines[i]:
            # The close brace is before this line maybe?
            # Or the open brace of m-07 is at i-1
            end_idx = i - 2 # Assuming i-1 is {, i-2 is },
            break
            
    if end_idx == -1:
        print("Could not find m-07 to delimit end.")
        end_idx = found_idx + 50 # Heuristic limit
        
    print(f"Replacing lines {start_idx+1} to {end_idx+1}")
    
    # Construct clean block
    block = []
    block.append("            {\n")
    block.append("                id: 'm-06',\n")
    block.append("                title: 'Matrices & Determinants',\n")
    block.append("                content: `# Matrices & Determinants\n\n")
    block.append("## 1. Types of Matrices\n")
    block.append("- **Symmetric**: $A^T = A$\n")
    block.append("- **Skew-Symmetric**: $A^T = -A$\n")
    block.append("- **Orthogonal**: $A A^T = I$\n")
    block.append("- **Idempotent**: $A^2 = A$\n")
    block.append("- **Involutory**: $A^2 = I$\n")
    block.append("- **Nilpotent**: $A^k = O$\n\n")
    block.append("## 2. Properties of Determinants\n")
    block.append("- $|A^T| = |A|$\n")
    block.append("- $|AB| = |A||B|$\n")
    block.append("- $|kA| = k^n|A|$ (for order n)\n")
    block.append("- $|A^{-1}| = 1/|A|$\n")
    block.append("- $|Adj A| = |A|^{n-1}$\n\n")
    block.append("## 3. Properties of Adjoint\n")
    block.append("- $A(Adj A) = (Adj A)A = |A|I$\n")
    block.append("- $(Adj A)^{-1} = Adj(A^{-1}) = \\frac{A}{|A|}$\n")
    block.append("- $Adj(AB) = (Adj B)(Adj A)$\n")
    block.append("- $Adj(kA) = k^{n-1} Adj A$\n\n")
    block.append("## 4. Inverse of Matrix\n")
    block.append("$$A^{-1} = \\frac{Adj A}{|A|}$$\n")
    block.append("Conditions:\n")
    block.append("- Exists if $|A| \\neq 0$ (Non-singular)\n")
    block.append("- $(A^{-1})^{-1} = A$\n")
    block.append("- $(AB)^{-1} = B^{-1}A^{-1}$\n")
    block.append("- $(A^T)^{-1} = (A^{-1})^T$\n\n")
    block.append("## 5. System of Linear Equations\n")
    block.append("$AX = B$\n")
    block.append("- **Unique Solution**: $|A| \\neq 0$\n")
    block.append("- **No Solution**: $|A| = 0$ and $(Adj A)B \\neq O$\n")
    block.append("- **Infinite Solutions**: $|A| = 0$ and $(Adj A)B = O$\n\n")
    block.append("## 6. Cramer's Rule\n")
    block.append("For $a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$:\n")
    block.append("$$x = \\frac{D_1}{D}, \\quad y = \\frac{D_2}{D}$$\n")
    block.append("where $D = \\begin{vmatrix}a_1 & b_1 \\\\ a_2 & b_2\\end{vmatrix}, D_1 = \\begin{vmatrix}c_1 & b_1 \\\\ c_2 & b_2\\end{vmatrix}, D_2 = \\begin{vmatrix}a_1 & c_1 \\\\ a_2 & c_2\\end{vmatrix}$`\n")
    block.append("            },\n")
    
    # Replace
    # lines[start_idx : end_idx+1] = block
    # Note: slice assignment relies on indices.
    # end_idx is inclusive in my logic, slice is exclusive.
    lines[start_idx : end_idx + 1] = block
    
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Heuristic repair applied.")

else:
    print("Could not find '# Matrices & Determinants' to anchor repair.")
