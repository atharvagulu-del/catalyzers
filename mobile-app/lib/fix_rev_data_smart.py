
import os

path = r"e:\New folder (17)\mobile-app\lib\revisionData.ts"
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

updates = {
    'm-16': r"""            {
                id: 'm-16',
                title: 'Definite Integration',
                content: `# Definite Integration

## 1. Newton-Leibniz Formula
$$\int_a^b f(x)dx = F(b) - F(a)$$

## 2. Properties
- P0: $\int_a^b f(x)dx = \int_a^b f(t)dt$
- P1: $\int_a^b f(x)dx = -\int_b^a f(x)dx$
- P2: $\int_a^b f(x)dx = \int_a^c f(x)dx + \int_c^b f(x)dx$
- P3: $\int_a^b f(x)dx = \int_a^b f(a+b-x)dx$ (King's Rule)
- P4: $\int_0^a f(x)dx = \int_0^a f(a-x)dx$
- P5: $\int_{-a}^a f(x)dx = 2\int_0^a f(x)dx$ (if even), 0 (if odd)
- P6: $\int_0^{2a} f(x)dx = 2\int_0^a f(x)dx$ (if $f(2a-x)=f(x)$)

## 3. Leibniz Integral Rule
$$\frac{d}{dx} \int_{\phi(x)}^{\psi(x)} f(t)dt = f(\psi(x))\psi'(x) - f(\phi(x))\phi'(x)$$

## 4. Walli's Formula
$$ \int_0^{\pi/2} \sin^n x dx = \int_0^{\pi/2} \cos^n x dx $$
Value is $\frac{(n-1)(n-3)...}{n(n-2)...} \times K$ where K=$\pi/2$ (n even) or 1 (n odd).

## 5. Estimation of Integrals
If $m \le f(x) \le M$ on [a,b]:
$$m(b-a) \le \int_a^b f(x)dx \le M(b-a)$$`
            },""",
    'm-17': r"""            {
                id: 'm-17',
                title: 'Differential Equations',
                content: `# Differential Equations

## 1. Order & Degree
- **Order**: Highest derivative present
- **Degree**: Power of highest derivative (after removing radicals/fractions)

## 2. Variable Separable
If $f(x)dx = g(y)dy$, integrate both sides:
$$\int f(x)dx = \int g(y)dy + C$$

## 3. Homogeneous DE
Form: $\frac{dy}{dx} = F\left(\frac{y}{x}\right)$
Method: Put $y = vx \implies \frac{dy}{dx} = v + x\frac{dv}{dx}$
Result: $\int \frac{dv}{F(v)-v} = \int \frac{dx}{x}$

## 4. Linear DE
$$\frac{dy}{dx} + Py = Q$$
- IF = $e^{\int P dx}$
- Solution: $y(IF) = \int (Q \cdot IF) dx + C$

## 5. Bernoulli's Equation
$$\frac{dy}{dx} + Py = Qy^n$$
Divide by $y^n$, substitute $v = y^{1-n}$.

## 6. Exact DE
$Mdx + Ndy = 0$.
Exact if $\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$.
Solution: $\int_{y const} Mdx + \int (\text{terms of N w/o x}) dy = C$`
            },""",
    'm-19': r"""            {
                id: 'm-19',
                title: 'Inverse Trigonometry',
                content: `# Inverse Trigonometry

## 1. Principal Values
| Function | Domain | Range |
|---|---|---|
| $\sin^{-1}x$ | $[-1, 1]$ | $[-\pi/2, \pi/2]$ |
| $\cos^{-1}x$ | $[-1, 1]$ | $[0, \pi]$ |
| $\tan^{-1}x$ | $R$ | $(-\pi/2, \pi/2)$ |
| $\cot^{-1}x$ | $R$ | $(0, \pi)$ |
| $\sec^{-1}x$ | $R-(-1,1)$ | $[0, \pi] - \{\pi/2\}$ |
| $\csc^{-1}x$ | $R-(-1,1)$ | $[-\pi/2, \pi/2] - \{0\}$ |

## 2. Properties
- $\sin^{-1}x + \cos^{-1}x = \pi/2$
- $\tan^{-1}x + \cot^{-1}x = \pi/2$
- $\sec^{-1}x + \csc^{-1}x = \pi/2$
- $\sin^{-1}(-x) = -\sin^{-1}x$
- $\cos^{-1}(-x) = \pi - \cos^{-1}x$

## 3. Standard Formulas
- $\tan^{-1}x + \tan^{-1}y = \tan^{-1}\left(\frac{x+y}{1-xy}\right)$ (xy < 1)
- $\tan^{-1}x - \tan^{-1}y = \tan^{-1}\left(\frac{x-y}{1+xy}\right)$
- $2\tan^{-1}x = \sin^{-1}\frac{2x}{1+x^2} = \cos^{-1}\frac{1-x^2}{1+x^2}$`
            },""",
    'm-21': r"""            {
                id: 'm-21',
                title: 'Statistics',
                content: `# Statistics

## 1. Central Tendency
- **Mean** ($\bar{x}$): $\frac{\sum f_ix_i}{\sum f_i}$
- **Median**: Middle term. Grouped: $L + \frac{N/2 - C}{f} \times h$
- **Mode**: Frequency peak. Grouped: $L + \frac{f_1 - f_0}{2f_1 - f_0 - f_2} \times h$
- **Relation**: $Mode = 3Median - 2Mean$

## 2. Dispersion
- **Variance** ($\sigma^2$): $\frac{\sum f_i(x_i - \bar{x})^2}{N} = \frac{\sum f_ix_i^2}{N} - (\bar{x})^2$
- **Standard Deviation** ($\sigma$): $\sqrt{Variance}$
- **CV**: $\frac{\sigma}{\bar{x}} \times 100$

## 3. Transformations
- If $y_i = ax_i + b$:
  - $\bar{y} = a\bar{x} + b$
  - $\sigma_y = |a|\sigma_x$
  - $Var(y) = a^2 Var(x)$`
            },"""
}

output_lines = []
i = 0
found_count = 0

while i < len(lines):
    line = lines[i]
    
    # Identify if a block starts here
    match_id = None
    for mid in updates.keys():
        if f"id: '{mid}'" in line:
            match_id = mid
            break
    
    if match_id:
        print(f"Found {match_id} at line {i+1}")
        found_count += 1
        
        # Determine strict start of block (previous '{')
        start_idx = i
        if i > 0 and '{' in lines[i-1]:
            start_idx = i - 1
        
        # Determine strict end of block ('},')
        end_idx = i
        while end_idx < len(lines):
            stripped = lines[end_idx].strip()
            if stripped == '},' or stripped == '}':
                break
            end_idx += 1
        
        # Backtrack output_lines if we already added the '{' line
        if start_idx == i - 1:
            if output_lines and '{' in output_lines[-1]:
                output_lines.pop()
        
        # Append new replacement
        repl = updates[match_id]
        if not repl.endswith('\n'):
            repl += '\n'
        output_lines.append(repl)
        
        # Advance i
        i = end_idx + 1
        continue

    output_lines.append(line)
    i += 1

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print(f"Update complete. Replaced {found_count} blocks.")
