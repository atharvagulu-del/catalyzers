
import os

path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Original Line 351: {lines[350]}")
print(f"Original Line 416: {lines[415]}")

# New content for m-06 and m-07
# Note: Using raw string for LaTeX backslashes.
# We need to be careful not to introduce extra newlines or mess up indentation.

new_content = r"""            {
                id: 'm-06',
                title: 'Matrices & Determinants',
                content: `# Matrices & Determinants

## 1. Types of Matrices
- **Symmetric**: $A^T = A$
- **Skew-Symmetric**: $A^T = -A$
- **Orthogonal**: $A A^T = I$
- **Idempotent**: $A^2 = A$
- **Involutory**: $A^2 = I$
- **Nilpotent**: $A^k = O$

## 2. Properties of Determinants
- $|A^T| = |A|$
- $|AB| = |A||B|$
- $|kA| = k^n|A|$ (for order n)
- $|A^{-1}| = 1/|A|$
- $|Adj A| = |A|^{n-1}$

## 3. Properties of Adjoint
- $A(Adj A) = (Adj A)A = |A|I$
- $(Adj A)^{-1} = Adj(A^{-1}) = \frac{A}{|A|}$
- $Adj(AB) = (Adj B)(Adj A)$
- $Adj(kA) = k^{n-1} Adj A$

## 4. Inverse of Matrix
$$A^{-1} = \frac{Adj A}{|A|}$$
Conditions:
- Exists if $|A| \neq 0$ (Non-singular)
- $(A^{-1})^{-1} = A$
- $(AB)^{-1} = B^{-1}A^{-1}$
- $(A^T)^{-1} = (A^{-1})^T$

## 5. System of Linear Equations
$AX = B$
- **Unique Solution**: $|A| \neq 0$
- **No Solution**: $|A| = 0$ and $(Adj A)B \neq O$
- **Infinite Solutions**: $|A| = 0$ and $(Adj A)B = O$

## 6. Cramer's Rule
For $a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$:
$$x = \frac{D_1}{D}, \quad y = \frac{D_2}{D}$$
where $D = \begin{vmatrix}a_1 & b_1 \\ a_2 & b_2\end{vmatrix}, D_1 = \begin{vmatrix}c_1 & b_1 \\ c_2 & b_2\end{vmatrix}, D_2 = \begin{vmatrix}a_1 & c_1 \\ a_2 & c_2\end{vmatrix}$`
            },
            {
                id: 'm-07',
                title: 'Straight Lines',
                content: `# Straight Lines

## 1. Forms of Line
| Form | Equation |
|------|----------|
| Slope-Intercept | $y = mx + c$ |
| Point-Slope | $y-y_1 = m(x-x_1)$ |
| Two Point | $y-y_1 = \frac{y_2-y_1}{x_2-x_1}(x-x_1)$ |
| Intercept | $\frac{x}{a} + \frac{y}{b} = 1$ |
| General | $ax + by + c = 0$ |
| Normal | $x\cos\alpha + y\sin\alpha = p$ |

## 2. Angle Between Lines
$$\tan\theta = \left|\frac{m_1 - m_2}{1 + m_1m_2}\right|$$
- **Parallel**: $m_1 = m_2$
- **Perpendicular**: $m_1m_2 = -1$

## 3. Distance Formulas
- **Point to Line**: $d = \frac{|ax_1 + by_1 + c|}{\sqrt{a^2 + b^2}}$
- **Between Parallel Lines**: $d = \frac{|c_1 - c_2|}{\sqrt{a^2 + b^2}}$
- **Origin to Line**: $d = \frac{|c|}{\sqrt{a^2 + b^2}}$

## 4. Position of Point
For line $L: ax + by + c = 0$:
- Same side: $\frac{ax_1 + by_1 + c}{ax_2 + by_2 + c} > 0$
- Opposite side: Ratio < 0

## 5. Concurrent Lines
Condition: $\begin{vmatrix}a_1 & b_1 & c_1 \\ a_2 & b_2 & c_2 \\ a_3 & b_3 & c_3\end{vmatrix} = 0$

## 6. Family of Lines
$$L_1 + \lambda L_2 = 0$$

## 7. Pair of Straight Lines
$ax^2 + 2hxy + by^2 = 0$
- **Angle**: $\tan\theta = \frac{2\sqrt{h^2 - ab}}{a+b}$
- **Perpendicular**: $a + b = 0$
- **Coincident**: $h^2 = ab$`
            },
"""

# Convert string to lines, preserving indentation
# split('\n') gives lines without \n, so we add it back
new_lines_list = [line + '\n' for line in new_content.split('\n')]

# If the last line is empty (due to trailing newline in string), remove it
if new_content.endswith('\n') and new_lines_list[-1] == '\n':
    new_lines_list.pop()
elif not new_content.endswith('\n'):
    # If raw string didn't end with newline, we should check if we need one
    pass

# Replace lines 350 to 416 (exclusive of 416? No, 350:416 replaces 350..415)
# Wait, I want to replace line 351 (index 350) UP TO line 416 (index 415).
# Python slice [350:416] replaces indices 350, 351, ..., 415.
# This covers 66 lines.
lines[350:416] = new_lines_list

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Successfully updated revisionData.ts")
