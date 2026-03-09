export type Subject = 'Maths' | 'Physics' | 'Chemistry';

export interface RevisionChapter {
    id: string;
    title: string;
    content?: string;
}

export interface RevisionSubject {
    id: Subject;
    title: string;
    color: string;
    chapters: RevisionChapter[];
}

export const revisionData: RevisionSubject[] = [
    {
        id: 'Maths',
        title: 'Mathematics',
        color: 'text-blue-500',
        chapters: [
            {
                id: 'm-01',
                title: 'Quadratic Equations',
                content: `# Quadratic Equations

## 1. Standard Form
$$ax^2 + bx + c = 0, \\quad a \\neq 0$$

## 2. Quadratic Formula (Shreedharacharya)
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## 3. Discriminant (D = b² - 4ac)

| Condition | Nature of Roots |
|-----------|-----------------|
| D > 0 | Two distinct real roots |
| D = 0 | Two equal real roots (α = β = -b/2a) |
| D < 0 | Two complex conjugate roots |
| D ≥ 0 | Real roots exist |
| D is perfect square | Rational roots (if a,b,c ∈ Q) |

## 4. Vieta's Relations (Sum & Product)
For roots α, β:

| Relation | Formula |
|----------|---------|
| Sum | α + β = -b/a |
| Product | αβ = c/a |
| Difference | \\|α - β\\| = √D / \\|a\\| |

## 5. Symmetric Functions of Roots

| Expression | In terms of α+β, αβ |
|------------|---------------------|
| α² + β² | (α + β)² - 2αβ |
| α³ + β³ | (α + β)³ - 3αβ(α + β) |
| α² - β² | (α + β)(α - β) |
| α⁴ + β⁴ | (α² + β²)² - 2(αβ)² |
| 1/α + 1/β | (α + β) / αβ |
| α/β + β/α | (α² + β²) / αβ |

## 6. Formation of Quadratic Equation
$$x^2 - (\\text{sum of roots})x + (\\text{product of roots}) = 0$$

## 7. Common Roots
If $a_1x^2 + b_1x + c_1 = 0$ and $a_2x^2 + b_2x + c_2 = 0$ have:

**One common root α:**
$$\\alpha = \\frac{c_1a_2 - c_2a_1}{a_1b_2 - a_2b_1} = \\frac{b_1c_2 - b_2c_1}{c_1a_2 - c_2a_1}$$

**Both roots common:**
$$\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$$

## 8. Position of Roots (for a > 0)
Let f(x) = ax² + bx + c

| Condition | Requirements |
|-----------|--------------|
| Both roots > k | D ≥ 0, f(k) > 0, -b/2a > k |
| Both roots < k | D ≥ 0, f(k) > 0, -b/2a < k |
| k lies between roots | f(k) < 0 |
| Both roots in (p, q) | D ≥ 0, f(p) > 0, f(q) > 0, p < -b/2a < q |
| Exactly one root in (p, q) | f(p) · f(q) < 0 |

## 9. Maximum/Minimum Value
- If a > 0: **Minimum** = $\\frac{4ac - b^2}{4a}$ at x = -b/2a
- If a < 0: **Maximum** = $\\frac{4ac - b^2}{4a}$ at x = -b/2a

## 10. Sign of Quadratic Expression
For f(x) = ax² + bx + c with roots α, β (α < β):
- If a > 0: f(x) < 0 for x ∈ (α, β)
- If a < 0: f(x) > 0 for x ∈ (α, β)`
            },
            {
                id: 'm-02',
                title: 'Sequences & Series',
                content: `# Sequences & Series

## 1. Arithmetic Progression (AP)

| Property | Formula |
|----------|---------|
| nth term | $a_n = a + (n-1)d$ |
| Sum of n terms | $S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}(a + l)$ |
| Common difference | $d = a_{n+1} - a_n$ |
| Middle term (odd n) | $a_m = \\frac{a + l}{2}$ |
| nth term from end | $l - (n-1)d$ |

**Properties:**
- If a, b, c are in AP: $2b = a + c$
- Sum from both ends is constant: $a_1 + a_n = a_2 + a_{n-1}$
- $a_n = S_n - S_{n-1}$

## 2. Geometric Progression (GP)

| Property | Formula |
|----------|---------|
| nth term | $a_n = ar^{n-1}$ |
| Sum (r ≠ 1) | $S_n = \\frac{a(r^n - 1)}{r - 1} = \\frac{a(1 - r^n)}{1 - r}$ |
| Sum (r = 1) | $S_n = na$ |
| Infinite GP (\\|r\\| < 1) | $S_\\infty = \\frac{a}{1 - r}$ |
| Product of n terms | $P_n = a^n \\cdot r^{n(n-1)/2}$ |

**Properties:**
- If a, b, c are in GP: $b^2 = ac$
- $a_1 \\cdot a_n = a_2 \\cdot a_{n-1} = a_3 \\cdot a_{n-2}$

## 3. Harmonic Progression (HP)
- Reciprocals of HP terms form AP
- nth term: $\\frac{1}{a + (n-1)d}$
- No direct sum formula

## 4. Means

| Mean | Two Numbers (a, b) | n Numbers |
|------|-------------------|-----------|
| AM | $\\frac{a + b}{2}$ | $\\frac{\\sum a_i}{n}$ |
| GM | $\\sqrt{ab}$ | $(a_1 \\cdot a_2 \\cdots a_n)^{1/n}$ |
| HM | $\\frac{2ab}{a + b}$ | $\\frac{n}{\\sum (1/a_i)}$ |

**Important Relations:**
- $AM \\geq GM \\geq HM$ (equality when all terms equal)
- $GM^2 = AM \\times HM$
- For positive numbers: $AM - GM \\geq 0$

## 5. Insertion of Means
- n AMs between a and b: $d = \\frac{b-a}{n+1}$
- n GMs between a and b: $r = (b/a)^{1/(n+1)}$
- n HMs: Insert AMs in reciprocals

## 6. Arithmetico-Geometric Progression (AGP)
Form: $a, (a+d)r, (a+2d)r^2, ...$

$$S_n = \\frac{a - [a+(n-1)d]r^n}{1-r} + \\frac{dr(1-r^{n-1})}{(1-r)^2}$$

$$S_\\infty = \\frac{a}{1-r} + \\frac{dr}{(1-r)^2}$$ for |r| < 1

## 7. Special Sums

| Sum | Formula |
|-----|---------|
| $\\sum_{k=1}^{n} k$ | $\\frac{n(n+1)}{2}$ |
| $\\sum_{k=1}^{n} k^2$ | $\\frac{n(n+1)(2n+1)}{6}$ |
| $\\sum_{k=1}^{n} k^3$ | $\\left[\\frac{n(n+1)}{2}\\right]^2$ |
| $\\sum_{k=1}^{n} k^4$ | $\\frac{n(n+1)(2n+1)(3n^2+3n-1)}{30}$ |
| $1 + 3 + 5 + ... + (2n-1)$ | $n^2$ |
| $2 + 4 + 6 + ... + 2n$ | $n(n+1)$ |

## 8. Method of Differences
If $a_n = f(n) - f(n-1)$, then $S_n = f(n) - f(0)$`
            },
            {
                id: 'm-03',
                title: 'Binomial Theorem',
                content: `# Binomial Theorem

## 1. Binomial Expansion
$$(x+y)^n = \\sum_{r=0}^{n} \\binom{n}{r} x^{n-r} y^r$$

## 2. General Term
$$T_{r+1} = \\binom{n}{r} x^{n-r} y^r$$

## 3. Binomial Coefficient
$$\\binom{n}{r} = \\frac{n!}{r!(n-r)!} = {}^nC_r$$

## 4. Middle Term
| n | Middle Term(s) |
|---|----------------|
| Even | $T_{n/2 + 1}$ |
| Odd | $T_{(n+1)/2}$ and $T_{(n+3)/2}$ |

## 5. Properties of Coefficients

| Property | Formula |
|----------|---------|
| Symmetry | $\\binom{n}{r} = \\binom{n}{n-r}$ |
| Pascal's | $\\binom{n}{r} + \\binom{n}{r+1} = \\binom{n+1}{r+1}$ |
| Sum | $\\sum_{r=0}^n \\binom{n}{r} = 2^n$ |
| Alternating | $\\sum_{r=0}^n (-1)^r \\binom{n}{r} = 0$ |
| Even/Odd | $C_0+C_2+C_4+... = C_1+C_3+C_5+... = 2^{n-1}$ |

## 6. Special Sums

| Sum | Value |
|-----|-------|
| $\\sum r \\cdot C_r$ | $n \\cdot 2^{n-1}$ |
| $\\sum r^2 \\cdot C_r$ | $n(n+1) \\cdot 2^{n-2}$ |
| $\\sum C_r^2$ | $\\binom{2n}{n}$ |

## 7. Negative/Fractional Index (|x| < 1)
$$(1+x)^n = 1 + nx + \\frac{n(n-1)}{2!}x^2 + \\frac{n(n-1)(n-2)}{3!}x^3 + ...$$

| Expansion | Series |
|-----------|--------|
| $(1+x)^{-1}$ | $1 - x + x^2 - x^3 + ...$ |
| $(1-x)^{-1}$ | $1 + x + x^2 + x^3 + ...$ |
| $(1+x)^{-2}$ | $1 - 2x + 3x^2 - 4x^3 + ...$ |
| $(1-x)^{-2}$ | $1 + 2x + 3x^2 + 4x^3 + ...$ |
| $(1+x)^{1/2}$ | $1 + \\frac{x}{2} - \\frac{x^2}{8} + ...$ |

## 8. Greatest Term
For $(1+x)^n$ where $x > 0$:
$$m = \\frac{(n+1)|x|}{1+|x|}$$
- If m is integer: $T_m$ and $T_{m+1}$ are greatest
- Otherwise: $T_{[m]+1}$ is greatest`
            },
            {
                id: 'm-04',
                title: 'Complex Numbers',
                content: `# Complex Numbers

## 1. Basic Definitions
- $i = \\sqrt{-1}$, $i^2 = -1$, $i^3 = -i$, $i^4 = 1$
- Complex number: $z = a + ib$ (a = Real, b = Imaginary)

## 2. Powers of i

| Power | Value |
|-------|-------|
| $i^{4n}$ | 1 |
| $i^{4n+1}$ | i |
| $i^{4n+2}$ | -1 |
| $i^{4n+3}$ | -i |

## 3. Modulus & Argument
- Modulus: $|z| = \\sqrt{a^2 + b^2}$
- Argument: $\\theta = \\tan^{-1}(b/a)$ (Principal: $-\\pi < \\theta \\leq \\pi$)
- Polar Form: $z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}$

## 4. Properties of Modulus

| Property | Formula |
|----------|---------|
| Product | $|z_1 z_2| = |z_1| \\cdot |z_2|$ |
| Quotient | $|z_1/z_2| = |z_1|/|z_2|$ |
| Power | $|z^n| = |z|^n$ |
| Triangle Ineq | $|z_1 + z_2| \\leq |z_1| + |z_2|$ |
| Reverse Triangle | $||z_1| - |z_2|| \\leq |z_1 - z_2|$ |

## 5. Properties of Conjugate

| Property | Formula |
|----------|---------|
| $\\overline{z_1 \\pm z_2}$ | $\\bar{z_1} \\pm \\bar{z_2}$ |
| $\\overline{z_1 \\cdot z_2}$ | $\\bar{z_1} \\cdot \\bar{z_2}$ |
| $z \\cdot \\bar{z}$ | $|z|^2$ |
| $z + \\bar{z}$ | $2 Re(z)$ |
| $z - \\bar{z}$ | $2i \\cdot Im(z)$ |

## 6. Properties of Argument
- $\\arg(z_1 z_2) = \\arg(z_1) + \\arg(z_2)$
- $\\arg(z_1/z_2) = \\arg(z_1) - \\arg(z_2)$
- $\\arg(z^n) = n \\cdot \\arg(z)$
- $\\arg(\\bar{z}) = -\\arg(z)$

## 7. De Moivre's Theorem
$$(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta$$

## 8. nth Roots of Unity
Roots of $z^n = 1$: $e^{i \\cdot 2k\\pi/n}$ for k = 0, 1, ..., n-1

**Cube Roots:** $1, \\omega, \\omega^2$ where $\\omega = \\frac{-1 + i\\sqrt{3}}{2}$
- $1 + \\omega + \\omega^2 = 0$
- $\\omega^3 = 1$

## 9. Geometry of Complex Numbers
- Distance: $|z_1 - z_2|$
- Midpoint: $(z_1 + z_2)/2$
- Centroid: $(z_1 + z_2 + z_3)/3$
- Circle: $|z - z_0| = r$`
            },
            {
                id: 'm-05',
                title: 'P & C',
                content: `# Permutations & Combinations

## 1. Fundamental Principles
- **Multiplication**: m × n ways
- **Addition**: m + n ways

## 2. Permutations (Arrangements)   
$$^nP_r = \\\\frac{n!}{(n-r)!}$$

| Type | Formula |
|------|---------|
| All n distinct | $n!$ |
| Circular | $(n-1)!$ |
| Necklace/Garland | $\\\\frac{(n-1)!}{2}$ |
| With repetition | $n^r$ |
| With identical | $\\\\frac{n!}{p! \\\\cdot q! \\\\cdot r!...}$ |

## 3. Combinations (Selections)
$$^nC_r = \\\\binom{n}{r} = \\\\frac{n!}{r!(n-r)!}$$

## 4. Properties

| Property | Formula |
|----------|---------|
| Symmetry | $^nC_r = ^nC_{n-r}$ |
| Pascal's | $^nC_r + ^nC_{r-1} = ^{n+1}C_r$ |
| Total | $^nC_0 + ^nC_1 + ... + ^nC_n = 2^n$ |
| Vandermonde | $^{m+n}C_r = \\\\sum ^mC_k \\\\cdot ^nC_{r-k}$ |

## 5. Distribution Formulas

| Objects | Groups | Formula |
|---------|--------|---------|
| n identical | r distinct | $^{n+r-1}C_{r-1}$ |
| n distinct | r distinct | Multinomial |

## 6. Selection with Repetition
$^{n+r-1}C_{r-1}$ ways to select r from n types

## 7. Derangement
$$D_n = n! \\\\left(1 - \\\\frac{1}{1!} + \\\\frac{1}{2!} - \\\\frac{1}{3!} + ... + (-1)^n\\\\frac{1}{n!}\\\\right)$$

| n | Dn |
|---|-----|
| 1 | 0 |
| 2 | 1 |
| 3 | 2 |
| 4 | 9 |
| 5 | 44 |

## 8. Number of Divisors
If $N = p_1^{a_1} \\\\cdot p_2^{a_2} \\\\cdot ... \\\\cdot p_k^{a_k}$:
- Total divisors: $(a_1+1)(a_2+1)...(a_k+1)$
- Sum of divisors: Product formula`
            },
            {
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
- $(Adj A)^{-1} = Adj(A^{-1}) = \\\\frac{A}{|A|}$
- $Adj(AB) = (Adj B)(Adj A)$
- $Adj(kA) = k^{n-1} Adj A$

## 4. Inverse of Matrix
$$A^{-1} = \\\\frac{Adj A}{|A|}$$
Conditions:
- Exists if $|A| \\\\neq 0$ (Non-singular)
- $(A^{-1})^{-1} = A$
- $(AB)^{-1} = B^{-1}A^{-1}$
- $(A^T)^{-1} = (A^{-1})^T$

## 5. System of Linear Equations
$AX = B$
- **Unique Solution**: $|A| \\\\neq 0$
- **No Solution**: $|A| = 0$ and $(Adj A)B \\\\neq O$
- **Infinite Solutions**: $|A| = 0$ and $(Adj A)B = O$

## 6. Cramer's Rule
For $a_1x + b_1y = c_1$, $a_2x + b_2y = c_2$:
$$x = \\\\frac{D_1}{D}, \\\\quad y = \\\\frac{D_2}{D}$$`
            },
            {
                id: 'm-07',
                title: 'Straight Lines',
                content: `# Straight Lines

## 1. Forms of Line
    | Form | Equation |
| ------| ----------|
| Slope - Intercept | $y = mx + c$ |
| Point - Slope | $y - y_1 = m(x - x_1)$ |
| Two Point | $y - y_1 = \frac{ y_2 - y_1 } { x_2 - x_1 } (x - x_1)$ |
| Intercept | $\frac{ x } { a } + \frac{ y } { b } = 1$ |
| General | $ax + by + c = 0$ |
| Normal | $x\cos\alpha + y\sin\alpha = p$ |

## 2. Angle Between Lines
$$\tan\theta = \left |\frac{ m_1 - m_2 } { 1 + m_1m_2 } \right | $$
    - ** Parallel **: $m_1 = m_2$
        - ** Perpendicular **: $m_1m_2 = -1$

## 3. Distance Formulas
    - ** Point to Line **: $d = \frac{| ax_1 + by_1 + c |} { \sqrt{ a ^ 2 + b ^ 2 } } $
        - ** Between Parallel Lines **: $d = \frac{| c_1 - c_2 |} { \sqrt{ a ^ 2 + b ^ 2 } } $
            - ** Origin to Line **: $d = \frac{| c |} { \sqrt{ a ^ 2 + b ^ 2 } } $

## 4. Position of Point
For line $L: ax + by + c = 0$:
- Same side: $\frac{ ax_1 + by_1 + c } { ax_2 + by_2 + c } > 0$
    - Opposite side: Ratio < 0

## 5. Concurrent Lines
Condition: $\begin{ vmatrix } a_1 & b_1 & c_1 \\ a_2 & b_2 & c_2 \\ a_3 & b_3 & c_3\end{ vmatrix } = 0$

## 6. Family of Lines
$$L_1 + \lambda L_2 = 0$$

## 7. Pair of Straight Lines
$ax ^ 2 + 2hxy + by ^ 2 = 0$
    - ** Angle **: $\tan\theta = \frac{ 2\sqrt{ h ^ 2 - ab } } { a + b } $
        - ** Perpendicular **: $a + b = 0$
            - ** Coincident **: $h ^ 2 = ab$`
            },
            {
                id: 'm-08',
                title: 'Circles',
                content: `# Circles

## 1. Standard Form
$$(x - h) ^ 2 + (y - k) ^ 2 = r ^ 2$$
Center: $(h, k)$, Radius: $r$

## 2. General Form
$$x ^ 2 + y ^ 2 + 2gx + 2fy + c = 0$$
    - Center: $(-g, -f)$
        - Radius: $r = \\sqrt{ g ^ 2 + f ^ 2 - c } $
            - Circle exists if $g ^ 2 + f ^ 2 - c > 0$

## 3. Diameter Form
If $(x_1, y_1)$ and $(x_2, y_2)$ are diameter ends:
$$(x - x_1)(x - x_2) + (y - y_1)(y - y_2) = 0$$

## 4. Parametric Form
$x = h + r\\cos\\theta$, $y = k + r\\sin\\theta$

## 5. Tangent Equations

    | Form | Equation |
| ------| ----------|
| At point $(x_1, y_1)$ | $xx_1 + yy_1 + g(x + x_1) + f(y + y_1) + c = 0$ |
| Slope m from center | $y - k = m(x - h) \\pm r\\sqrt{ 1 + m ^ 2 } $ |
| To $x ^ 2 + y ^ 2=r ^ 2$ at $(x_1, y_1)$ | $xx_1 + yy_1 = r ^ 2$ |
| Slope form | $y = mx \\pm r\\sqrt{ 1 + m ^ 2 } $ |

## 6. Length of Tangent
From external point $(x_1, y_1)$:
$$L = \\sqrt{ x_1 ^ 2 + y_1 ^ 2 + 2gx_1 + 2fy_1 + c } = \\sqrt{ S_1 } $$

## 7. Chord of Contact
From $(x_1, y_1)$ to circle $S = 0$:
$$T = 0$$ i.e., $xx_1 + yy_1 + g(x + x_1) + f(y + y_1) + c = 0$

## 8. Position of Point

    | Condition | Position |
| -----------| ----------|
| $S_1 < 0$ | Inside |
| $S_1 = 0$ | On circle |
| $S_1 > 0$ | Outside |

## 9. Chord with Mid - point $(h, k)$
$$T = S_1$$ gives equation of chord

## 10. Radical Axis
For circles $S_1 = 0$ and $S_2 = 0$:
$$S_1 - S_2 = 0$$
    (Perpendicular to line joining centers)

## 11. Family of Circles
Through intersection of $S_1 = 0$ and $S_2 = 0$:
$$S_1 + \\lambda S_2 = 0$$`
            },
            {
                id: 'm-09',
                title: 'Conic Sections',
                content: `# Conic Sections

## PARABOLA

### Standard Forms

    | Equation | Vertex | Focus | Directrix | Axis | LR |
| ----------| --------| -------| -----------| ------| -----|
| $y ^ 2 = 4ax$ | (0, 0) | (a, 0) | x = -a | y = 0 | 4a |
| $y ^ 2 = -4ax$ | (0, 0) | (-a, 0) | x = a | y = 0 | 4a |
| $x ^ 2 = 4ay$ | (0, 0) | (0, a) | y = -a | x = 0 | 4a |
| $x ^ 2 = -4ay$ | (0, 0) | (0, -a) | y = a | x = 0 | 4a |

### Parametric Form($y ^ 2 = 4ax$)
$x = at ^ 2$, $y = 2at$

### Tangent Equations
    - Point form: $yy_1 = 2a(x + x_1)$
        - Slope form: $y = mx + a / m$
            - Parametric: $ty = x + at ^ 2$

### Normal: $y = -tx + 2at + at ^ 3$

---

## ELLIPSE($\\frac{ x^ 2}{ a^ 2} + \\frac{ y^ 2}{ b^ 2} = 1$, $a > b$)

    | Property | Formula |
| ----------| ---------|
| Center | (0, 0) |
| Vertices | $(\\pm a, 0)$ |
| Foci | $(\\pm ae, 0)$ |
| Eccentricity | $e = \\sqrt{ 1 - b ^ 2 / a ^ 2 } $ |
| Directrices | $x = \\pm a / e$ |
| Latus Rectum | $2b ^ 2 / a$ |
| $b ^ 2$ relation | $b ^ 2 = a ^ 2(1 - e ^ 2)$ |

### Parametric: $x = a\\cos\\theta$, $y = b\\sin\\theta$

### Tangent
    - Point form: $\\frac{ xx_1 } { a ^ 2 } + \\frac{ yy_1 } { b ^ 2 } = 1$
        - Slope form: $y = mx \\pm \\sqrt{ a ^ 2m ^ 2 + b ^ 2 } $

---

## HYPERBOLA($\\frac{ x^ 2}{ a^ 2} - \\frac{ y^ 2}{ b^ 2} = 1$)

    | Property | Formula |
| ----------| ---------|
| Center | (0, 0) |
| Vertices | $(\\pm a, 0)$ |
| Foci | $(\\pm ae, 0)$ |
| Eccentricity | $e = \\sqrt{ 1 + b ^ 2 / a ^ 2 } $(e > 1) |
| Asymptotes | $y = \\pm \\frac{ b } { a } x$ |
| Latus Rectum | $2b ^ 2 / a$ |
| $b ^ 2$ relation | $b ^ 2 = a ^ 2(e ^ 2 - 1)$ |

### Parametric: $x = a\\sec\\theta$, $y = b\\tan\\theta$

### Rectangular Hyperbola: $xy = c ^ 2$
    - $e = \\sqrt{ 2 } $
        - Parametric: $(ct, c / t)$`
            },
            {
                id: 'm-10',
                title: 'Vectors',
                content: `# Vectors

## 1. Basic Formulas
    - Magnitude: $ |\\vec{ a }| = \\sqrt{ a_x ^ 2 + a_y ^ 2 + a_z ^ 2 } $
        - Unit vector: $\\hat{ a } = \\frac{ \\vec{ a } } {|\\vec{ a }|} $
            - Position vector: $\\vec{ r } = x\\hat{ i } + y\\hat{ j } + z\\hat{ k } $

## 2. Dot Product(Scalar)
$$\\vec{ a } \\cdot \\vec{ b } = |\\vec{ a }||\\vec{ b }|\\cos\\theta = a_xb_x + a_yb_y + a_zb_z$$

    | Property | Formula |
| ----------| ---------|
| Commutative | $\\vec{ a } \\cdot \\vec{ b } = \\vec{ b } \\cdot \\vec{ a } $ |
| Self dot | $\\vec{ a } \\cdot \\vec{ a } = |\\vec{ a }|^ 2$ |
| Perpendicular | $\\vec{ a } \\cdot \\vec{ b } = 0$ |
| Projection of a on b | $\\frac{ \\vec{ a } \\cdot \\vec{ b } } {|\\vec{ b }|} $ |

## 3. Cross Product(Vector)
$$\\vec{ a } \\times \\vec{ b } = |\\vec{ a }||\\vec{ b }|\\sin\\theta \\hat{ n } $$

$$ = \\begin{ vmatrix } \\hat{ i } & \\hat{ j } & \\hat{ k } \\\\ a_x & a_y & a_z \\\\ b_x & b_y & b_z \\end{ vmatrix } $$

    | Property | Result |
| ----------| --------|
| Anti - commutative | $\\vec{ a } \\times \\vec{ b } = -\\vec{ b } \\times \\vec{ a } $ |
| Parallel vectors | $\\vec{ a } \\times \\vec{ b } = \\vec{ 0 } $ |
| Area of parallelogram | $ |\\vec{ a } \\times \\vec{ b }| $ |
| Area of triangle | $\\frac{ 1 } { 2 }|\\vec{ a } \\times \\vec{ b }| $ |

## 4. Scalar Triple Product
$$[\\vec{ a } \\vec{ b } \\vec{ c }] = \\vec{ a } \\cdot(\\vec{ b } \\times \\vec{ c })$$

    | Application | Formula |
| -------------| ---------|
| Volume of parallelepiped | $ | [\\vec{ a } \\vec{ b } \\vec{ c }] | $ |
| Volume of tetrahedron | $\\frac{ 1 } { 6 }| [\\vec{ a } \\vec{ b } \\vec{ c }] | $ |
| Coplanarity condition | $[\\vec{ a } \\vec{ b } \\vec{ c }] = 0$ |

## 5. Vector Triple Product
$$\\vec{ a } \\times(\\vec{ b } \\times \\vec{ c }) = (\\vec{ a } \\cdot \\vec{ c }) \\vec{ b } - (\\vec{ a } \\cdot \\vec{ b }) \\vec{ c } $$

## 6. Section Formula
Internal division: $\\frac{ m\\vec{ b } + n\\vec{ a } } { m + n } $
External division: $\\frac{ m\\vec{ b } - n\\vec{ a } } { m - n } $`
            },
            {
                id: 'm-11',
                title: '3D Geometry',
                content: `# 3D Geometry

## 1. Distance Formulas
    - Between points: $d = \\sqrt{ (x_2 - x_1) ^ 2 + (y_2 - y_1) ^ 2 + (z_2 - z_1) ^ 2 } $
        - From origin: $d = \\sqrt{ x ^ 2 + y ^ 2 + z ^ 2 } $

## 2. Direction Cosines(l, m, n)
$$l = \\cos\\alpha, \\quad m = \\cos\\beta, \\quad n = \\cos\\gamma$$
$$l ^ 2 + m ^ 2 + n ^ 2 = 1$$

Direction ratios(a, b, c):
$$l = \\frac{ a } { \\sqrt{ a ^ 2 + b ^ 2 + c ^ 2 } } $$

## 3. Line Equations

    | Form | Equation |
| ------| ----------|
| Symmetric | $\\frac{ x - x_1 } { a } = \\frac{ y - y_1 } { b } = \\frac{ z - z_1 } { c } $ |
| Vector | $\\vec{ r } = \\vec{ a } + \\lambda\\vec{ b } $ |
| Two points | $\\frac{ x - x_1 } { x_2 - x_1 } = \\frac{ y - y_1 } { y_2 - y_1 } = \\frac{ z - z_1 } { z_2 - z_1 } $ |

## 4. Plane Equations

    | Form | Equation |
| ------| ----------|
| General | $ax + by + cz + d = 0$ |
| Intercept | $\\frac{ x } { a } + \\frac{ y } { b } + \\frac{ z } { c } = 1$ |
| Normal | $lx + my + nz = p$ |
| Vector | $\\vec{ r } \\cdot \\vec{ n } = d$ |

## 5. Angle Between Lines
$$\\cos\\theta = \\frac{ a_1a_2 + b_1b_2 + c_1c_2 } { \\sqrt{ a_1 ^ 2 + b_1 ^ 2 + c_1 ^ 2 } \\sqrt{ a_2 ^ 2 + b_2 ^ 2 + c_2 ^ 2 } } $$

    ** Perpendicular:** $a_1a_2 + b_1b_2 + c_1c_2 = 0$
        ** Parallel:** $\\frac{ a_1 } { a_2 } = \\frac{ b_1 } { b_2 } = \\frac{ c_1 } { c_2 } $

## 6. Angle Between Planes
$$\\cos\\theta = \\frac{| a_1a_2 + b_1b_2 + c_1c_2 |} { \\sqrt{ a_1 ^ 2 + b_1 ^ 2 + c_1 ^ 2 } \\sqrt{ a_2 ^ 2 + b_2 ^ 2 + c_2 ^ 2 } } $$

## 7. Distance Formulas

    | From | To | Formula |
| ------| -----| ---------|
| Point $(x_1, y_1, z_1)$ | Plane $ax + by + cz + d=0$ | $\\frac{| ax_1 + by_1 + cz_1 + d |} { \\sqrt{ a ^ 2 + b ^ 2 + c ^ 2 } } $ |
| Parallel planes | | $\\frac{| d_1 - d_2 |} { \\sqrt{ a ^ 2 + b ^ 2 + c ^ 2 } } $ |

## 8. Skew Lines
Shortest distance between skew lines:
$$d = \\frac{| (\\vec{ a_2 } -\\vec{ a_1 }) \\cdot(\\vec{ b_1 } \\times \\vec{ b_2 }) |} {|\\vec{ b_1 } \\times \\vec{ b_2 }|} $$`
            },
            {
                id: 'm-12',
                title: 'Limits',
                content: `# Limits & Continuity

## 1. Standard Limits

    | Limit | Value |
| -------| -------|
| $\\lim_{ x \\to 0 } \\frac{ \\sin x } { x } $ | 1 |
| $\\lim_{ x \\to 0 } \\frac{ \\tan x } { x } $ | 1 |
| $\\lim_{ x \\to 0 } \\frac{ 1 - \\cos x } { x ^ 2 } $ | 1 / 2 |
| $\\lim_{ x \\to 0 } \\frac{ e ^ x - 1 } { x } $ | 1 |
| $\\lim_{ x \\to 0 } \\frac{ a ^ x - 1 } { x } $ | $\\ln a$ |
| $\\lim_{ x \\to 0 } \\frac{ \\ln(1 + x) } { x } $ | 1 |
| $\\lim_{ x \\to 0 } (1 + x) ^ { 1/x }$ | e |
| $\\lim_{ x \\to \\infty } (1 + 1 / x) ^ x$ | e |
| $\\lim_{ x \\to 0 } \\frac{ (1 + x) ^ n - 1 } { x } $ | n |

## 2. Algebraic Limits
$$\\lim_{ x \\to a } \\frac{ x ^ n - a ^ n } { x - a } = na ^ { n- 1}$$

## 3. L'Hôpital's Rule
For $\\frac{ 0 } { 0 }$ or $\\frac{ \\infty } { \\infty }$ forms:
$$\\lim_{ x \\to a } \\frac{ f(x) } { g(x) } = \\lim_{ x \\to a } \\frac{f'(x)}{g'(x) } $$

## 4. Sandwich Theorem
If $g(x) \\leq f(x) \\leq h(x)$ and $\\lim g(x) = \\lim h(x) = L$
Then $\\lim f(x) = L$

## 5. Continuity Conditions
$f(x)$ is continuous at $x = a$ if:
    1. $f(a)$ is defined
2. $\\lim_{ x \\to a } f(x)$ exists
3. $\\lim_{ x \\to a } f(x) = f(a)$

## 6. Types of Discontinuity
    - ** Removable **: Limit exists but ≠ f(a)
        - ** Jump **: Left limit ≠ Right limit
            - ** Infinite **: Limit is ±∞`
            },
            {
                id: 'm-13',
                title: 'Differentiation',
                content: `# Differentiation

## 1. Basic Derivatives

    | Function | Derivative |
| ----------| ------------|
| $x ^ n$ | $nx ^ { n- 1}$ |
| $e ^ x$ | $e ^ x$ |
| $a ^ x$ | $a ^ x \\ln a$ |
| $\\ln x$ | $1 / x$ |
| $\\log_a x$ | $1 / (x \\ln a) $ |

## 2. Trigonometric Derivatives

    | Function | Derivative |
| ----------| ------------|
| $\\sin x$ | $\\cos x$ |
| $\\cos x$ | $ -\\sin x$ |
| $\\tan x$ | $\\sec ^ 2 x$ |
| $\\cot x$ | $ -\\csc ^ 2 x$ |
| $\\sec x$ | $\\sec x \\tan x$ |
| $\\csc x$ | $ -\\csc x \\cot x$ |

## 3. Inverse Trigonometric

    | Function | Derivative |
| ----------| ------------|
| $\\sin ^ {- 1}x$ | $1 /\\sqrt{ 1 - x ^ 2 } $ |
| $\\cos ^ {- 1}x$ | $ - 1 /\\sqrt{ 1 - x ^ 2 } $ |
| $\\tan ^ {- 1}x$ | $1 / (1 + x ^ 2)$ |
| $\\cot ^ {- 1}x$ | $ - 1 / (1 + x ^ 2)$ |
| $\\sec ^ {- 1}x$ | $1 / (| x |\\sqrt{ x ^ 2 - 1 }) $ |

## 4. Rules of Differentiation

    | Rule | Formula |
| ------| ---------|
| Sum / Diff | $(u \\pm v)' = u' \\pm v'$ |
    | Product | $(uv)' = u'v + uv'$ |
        | Quotient | $(u / v)' = (u'v - uv')/v^2$ |
            | Chain | $\\frac{ dy } { dx } = \\frac{ dy } { du } \\cdot \\frac{ du } { dx } $ |

## 5. Leibniz Rule(nth derivative)
$$(uv) ^ {(n)} = \\sum_{ r = 0 }^ { n } \\binom{ n } { r } u ^ {(n - r)} v ^ {(r)}$$

## 6. Parametric Differentiation
If $x = f(t)$, $y = g(t)$:
$$\\frac{ dy } { dx } = \\frac{ dy / dt } { dx / dt } $$

## 7. Implicit Differentiation
Differentiate both sides w.r.t.x, treating y as function of x`
            },
            {
                id: 'm-14',
                title: 'Applications of Derivatives',
                content: `# Applications of Derivatives

## Tangent / Normal
    - Tangent slope = $dy / dx$
        - Normal slope = $ - 1 / (dy / dx)$

## Monotonicity
    - Increasing: $f'(x) > 0$
        - Decreasing: $f'(x) < 0$

## Maxima / Minima
First Derivative Test:
- Max: $f'$ changes + to -
    - Min: $f'$ changes - to +

Second Derivative Test:
- $f''(c) < 0$: Maximum
    - $f''(c) > 0$: Minimum`
            },
            {
                id: 'm-15',
                title: 'Integration',
                content: `# Indefinite Integration

## 1. Basic Integrals

    | Function | Integral |
| ----------| ----------|
| $x ^ n$ | $\\frac{ x ^ { n+ 1 }}{ n + 1 } + C$(n ≠ -1) |
| $1 / x$ | $\\ln | x | + C$ |
| $e ^ x$ | $e ^ x + C$ |
| $a ^ x$ | $\\frac{ a ^ x } { \\ln a } + C$ |

## 2. Trigonometric Integrals

    | Function | Integral |
| ----------| ----------|
| $\\sin x$ | $ -\\cos x + C$ |
| $\\cos x$ | $\\sin x + C$ |
| $\\tan x$ | $\\ln |\\sec x | + C$ |
| $\\cot x$ | $\\ln |\\sin x | + C$ |
| $\\sec x$ | $\\ln |\\sec x + \\tan x | + C$ |
| $\\csc x$ | $\\ln |\\csc x - \\cot x | + C$ |
| $\\sec ^ 2 x$ | $\\tan x + C$ |
| $\\csc ^ 2 x$ | $ -\\cot x + C$ |

## 3. Inverse Trigonometric

    | Function | Integral |
| ----------| ----------|
| $1 /\\sqrt{ 1 - x ^ 2 } $ | $\\sin ^ {- 1}x + C$ |
| $1 / (1 + x ^ 2)$ | $\\tan ^ {- 1}x + C$ |
| $1 / (x\\sqrt{ x ^ 2 - 1 }) $ | $\\sec ^ {- 1}x + C$ |

## 4. Special Integrals

    | Integral | Result |
| ----------| --------|
| $\\int \\frac{ dx } { x ^ 2 + a ^ 2 } $ | $\\frac{ 1 } { a } \\tan ^ {- 1}\\frac{ x } { a } $ |
| $\\int \\frac{ dx } { x ^ 2 - a ^ 2 } $ | $\\frac{ 1 } { 2a } \\ln |\\frac{ x - a } { x + a }| $ |
| $\\int \\frac{ dx } { a ^ 2 - x ^ 2 } $ | $\\frac{ 1 } { 2a } \\ln |\\frac{ a + x } { a - x }| $ |
| $\\int \\frac{ dx } { \\sqrt{ a ^ 2 - x ^ 2 } } $ | $\\sin ^ {- 1}\\frac{ x } { a } $ |
| $\\int \\frac{ dx } { \\sqrt{ x ^ 2 + a ^ 2 } } $ | $\\ln | x +\\sqrt{ x ^ 2 + a ^ 2 }| $ |
| $\\int \\frac{ dx } { \\sqrt{ x ^ 2 - a ^ 2 } } $ | $\\ln | x +\\sqrt{ x ^ 2 - a ^ 2 }| $ |

## 5. Integration by Parts(ILATE)
$$\\int u \\cdot v \\, dx = u \\int v \\, dx - \\int \\left(\\frac{ du }{ dx } \\int v \\, dx\\right) dx$$

    ** Priority:** Inverse Trig → Logarithmic → Algebraic → Trig → Exponential

## 6. Partial Fractions
For $\\frac{ P(x) } { Q(x) }$ where deg(P) < deg(Q):
- Linear factor $(x - a)$: $\\frac{ A } { x - a } $
    - Repeated linear $(x - a) ^ 2$: $\\frac{ A } { x - a } + \\frac{ B } { (x - a) ^ 2 } $
        - Quadratic $ax ^ 2 + bx + c$: $\\frac{ Ax + B } { ax ^ 2 + bx + c } $`
            },
            {
                id: 'm-16',
                title: 'Definite Integration',
                content: `# Definite Integration

## 1. Newton - Leibniz Formula
$$\int_a ^ b f(x)dx = F(b) - F(a)$$

## 2. Properties
    - P0: $\int_a ^ b f(x)dx = \int_a ^ b f(t)dt$
        - P1: $\int_a ^ b f(x)dx = -\int_b ^ a f(x)dx$
            - P2: $\int_a ^ b f(x)dx = \int_a ^ c f(x)dx + \int_c ^ b f(x)dx$
                - P3: $\int_a ^ b f(x)dx = \int_a ^ b f(a + b - x)dx$(King's Rule)
                    - P4: $\int_0 ^ a f(x)dx = \int_0 ^ a f(a - x)dx$
                - P5: $\int_{- a}^ a f(x)dx = 2\int_0 ^ a f(x)dx$(if even), 0(if odd)
    - P6: $\int_0 ^ { 2a } f(x)dx = 2\int_0 ^ a f(x)dx$(if $f(2a - x) = f(x)$)

## 3. Leibniz Integral Rule
$$\frac{ d } { dx } \int_{ \phi(x) }^ { \psi(x) } f(t)dt = f(\psi(x)) \psi'(x) - f(\phi(x))\phi'(x)$$

## 4. Walli's Formula
$$ \int_0 ^ { \pi/ 2} \sin ^ n x dx = \int_0 ^ { \pi/ 2} \cos ^ n x dx $$
Value is $\frac{ (n - 1)(n - 3)... } { n(n - 2)... } \times K$ where K = $\pi / 2$(n even) or 1(n odd).

## 5. Estimation of Integrals
If $m \le f(x) \le M$ on[a, b]:
$$m(b - a) \le \int_a ^ b f(x)dx \le M(b - a)$$`
            },
            {
                id: 'm-17',
                title: 'Differential Equations',
                content: `# Differential Equations

## 1. Order & Degree
    - ** Order **: Highest derivative present
        - ** Degree **: Power of highest derivative(after removing radicals / fractions)

## 2. Variable Separable
If $f(x)dx = g(y)dy$, integrate both sides:
$$\int f(x)dx = \int g(y)dy + C$$

## 3. Homogeneous DE
Form: $\frac{ dy } { dx } = F\left(\frac{ y }{ x }\right)$
Method: Put $y = vx \implies \frac{ dy } { dx } = v + x\frac{ dv } { dx } $
Result: $\int \frac{ dv } { F(v) - v } = \int \frac{ dx } { x } $

## 4. Linear DE
$$\frac{ dy } { dx } + Py = Q$$
    - IF = $e ^ { \int P dx }$
        - Solution: $y(IF) = \int(Q \cdot IF) dx + C$

## 5. Bernoulli's Equation
$$\frac{ dy } { dx } + Py = Qy ^ n$$
Divide by $y ^ n$, substitute $v = y ^ { 1-n }$.

## 6. Exact DE
$Mdx + Ndy = 0$.
Exact if $\frac{ \partial M } { \partial y } = \frac{ \partial N } { \partial x } $.
    Solution: $\int_{y const } Mdx + \int(\text{ terms of N w/ o x}) dy = C$`
            },
            {
                id: 'm-18',
                title: 'Trigonometry',
                content: `# Trigonometry

## 1. Fundamental Identities
    - $\\sin ^ 2\\theta + \\cos ^ 2\\theta = 1$
        - $1 + \\tan ^ 2\\theta = \\sec ^ 2\\theta$
            - $1 + \\cot ^ 2\\theta = \\csc ^ 2\\theta$

## 2. Reciprocal Relations
    | | |
| ---| ---|
| $\\sin\\theta = 1 /\\csc\\theta$ | $\\csc\\theta = 1 /\\sin\\theta$ |
| $\\cos\\theta = 1 /\\sec\\theta$ | $\\sec\\theta = 1 /\\cos\\theta$ |
| $\\tan\\theta = 1 /\\cot\\theta$ | $\\cot\\theta = 1 /\\tan\\theta$ |

## 3. Sum & Difference Formulas
    | Formula | |
| ---------| ---|
| $\\sin(A \\pm B)$ | $\\sin A \\cos B \\pm \\cos A \\sin B$ |
| $\\cos(A \\pm B)$ | $\\cos A \\cos B \\mp \\sin A \\sin B$ |
| $\\tan(A \\pm B)$ | $\\frac{ \\tan A \\pm \\tan B } { 1 \\mp \\tan A \\tan B } $ |

## 4. Double Angle Formulas
    | | |
| ---| ---|
| $\\sin 2A$ | $2\\sin A \\cos A = \\frac{ 2\\tan A } { 1 +\\tan ^ 2 A } $ |
| $\\cos 2A$ | $\\cos ^ 2 A - \\sin ^ 2 A = 2\\cos ^ 2 A - 1 = 1 - 2\\sin ^ 2 A$ |
| $\\tan 2A$ | $\\frac{ 2\\tan A } { 1 - \\tan ^ 2 A } $ |

## 5. Half Angle Formulas
    - $\\sin(A / 2) = \\pm\\sqrt{ \\frac{ 1 -\\cos A } { 2 } } $
        - $\\cos(A / 2) = \\pm\\sqrt{ \\frac{ 1 +\\cos A } { 2 } } $
            - $\\tan(A / 2) = \\frac{ 1 -\\cos A } { \\sin A } = \\frac{ \\sin A } { 1 +\\cos A } $

## 6. Triple Angle Formulas
    - $\\sin 3A = 3\\sin A - 4\\sin ^ 3 A$
        - $\\cos 3A = 4\\cos ^ 3 A - 3\\cos A$
            - $\\tan 3A = \\frac{ 3\\tan A - \\tan ^ 3 A } { 1 - 3\\tan ^ 2 A } $

## 7. Product to Sum(Prosthaphaeresis)
    - $2\\sin A \\cos B = \\sin(A + B) + \\sin(A - B)$
        - $2\\cos A \\sin B = \\sin(A + B) - \\sin(A - B)$
            - $2\\cos A \\cos B = \\cos(A + B) + \\cos(A - B)$
                - $2\\sin A \\sin B = \\cos(A - B) - \\cos(A + B)$

## 8. Sum to Product
    - $\\sin C + \\sin D = 2\\sin\\frac{ C + D } { 2 } \\cos\\frac{ C - D } { 2 } $
        - $\\sin C - \\sin D = 2\\cos\\frac{ C + D } { 2 } \\sin\\frac{ C - D } { 2 } $
            - $\\cos C + \\cos D = 2\\cos\\frac{ C + D } { 2 } \\cos\\frac{ C - D } { 2 } $
                - $\\cos C - \\cos D = -2\\sin\\frac{ C + D } { 2 } \\sin\\frac{ C - D } { 2 } $

## 9. General Solutions

    | Equation | General Solution |
| ----------| -----------------|
| $\\sin\\theta = 0$ | $\\theta = n\\pi$ |
| $\\cos\\theta = 0$ | $\\theta = (2n + 1) \\frac{ \\pi } { 2 } $ |
| $\\tan\\theta = 0$ | $\\theta = n\\pi$ |
| $\\sin\\theta = \\sin\\alpha$ | $\\theta = n\\pi + (-1) ^ n\\alpha$ |
| $\\cos\\theta = \\cos\\alpha$ | $\\theta = 2n\\pi \\pm \\alpha$ |
| $\\tan\\theta = \\tan\\alpha$ | $\\theta = n\\pi + \\alpha$ |

## 10. Standard Angles

    | θ | 0° | 30° | 45° | 60° | 90° |
| ---| ---| ---| ---| ---| ---|
| sin | 0 | 1 / 2 | 1 /√2 | √3 / 2 | 1 |
| cos | 1 | √3 / 2 | 1 /√2 | 1 / 2 | 0 |
| tan | 0 | 1 /√3 | 1 | √3 | ∞ | `
            },
            {
                id: 'm-19',
                title: 'Inverse Trigonometry',
                content: `# Inverse Trigonometry

## 1. Principal Values
    | Function | Domain | Range |
| ---| ---| ---|
| $\sin ^ {- 1}x$ | $[-1, 1]$ | $[-\pi / 2, \pi / 2]$ |
| $\cos ^ {- 1}x$ | $[-1, 1]$ | $[0, \pi]$ |
| $\tan ^ {- 1}x$ | $R$ | $(-\pi / 2, \pi / 2)$ |
| $\cot ^ {- 1}x$ | $R$ | $(0, \pi)$ |
| $\sec ^ {- 1}x$ | $R - (-1, 1)$ | $[0, \pi]- \{ \pi / 2\ } $ |
| $\csc ^ {- 1}x$ | $R - (-1, 1)$ | $[-\pi / 2, \pi / 2]- \{ 0\ } $ |

## 2. Properties
    - $\sin ^ {- 1}x + \cos ^ {- 1}x = \pi / 2$
        - $\tan ^ {- 1}x + \cot ^ {- 1}x = \pi / 2$
            - $\sec ^ {- 1}x + \csc ^ {- 1}x = \pi / 2$
                - $\sin ^ {- 1}(-x) = -\sin ^ {- 1}x$
                    - $\cos ^ {- 1}(-x) = \pi - \cos ^ {- 1}x$

## 3. Standard Formulas
    - $\tan ^ {- 1}x + \tan ^ {- 1}y = \tan ^ {- 1}\left(\frac{ x+ y}{ 1-xy }\right)$(xy < 1)
        - $\tan ^ {- 1}x - \tan ^ {- 1}y = \tan ^ {- 1}\left(\frac{ x- y}{ 1+xy }\right)$
            - $2\tan ^ {- 1}x = \sin ^ {- 1}\frac{ 2x } { 1 + x ^ 2 } = \cos ^ {- 1}\frac{ 1 - x ^ 2 } { 1 + x ^ 2 } $`
            },
            {
                id: 'm-20',
                title: 'Probability',
                content: `# Probability

## 1. Basic Formulas
    - $P(A) = \\frac{ n(A) } { n(S) } $
        - $0 \\leq P(A) \\leq 1$
            - $P(A') = 1 - P(A)$
                - $P(S) = 1$, $P(\\phi) = 0$

## 2. Addition Theorem
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

For mutually exclusive: $P(A \\cup B) = P(A) + P(B)$

## 3. Conditional Probability
$$P(A | B) = \\frac{ P(A \\cap B) }{ P(B) }$$

## 4. Multiplication Theorem
$$P(A \\cap B) = P(A) \\cdot P(B | A) = P(B) \\cdot P(A | B)$$

For independent events: $P(A \\cap B) = P(A) \\cdot P(B)$

## 5. Bayes' Theorem
$$P(A_i | B) = \\frac{ P(A_i) \\cdot P(B|A_i) }{ \\sum_{ j } P(A_j) \\cdot P(B | A_j)}$$

## 6. Total Probability
$$P(B) = \\sum_{ i } P(A_i) \\cdot P(B | A_i)$$

## 7. Binomial Distribution
$$P(X = r) = \\binom{ n }{ r } p ^ r q ^ { n- r}$$

            | Measure | Formula |
| ---------| ---------|
| Mean | $\\mu = np$ |
| Variance | $\\sigma ^ 2 = npq$ |
| SD | $\\sigma = \\sqrt{ npq }$ |

## 8. Poisson Distribution
$$P(X = r) = \\frac{ e^ {-\\lambda} \\lambda ^ r}{ r! }$$

Mean = Variance = $\\lambda$

## 9. Expected Value
$$E(X) = \\sum x_i \\cdot P(x_i)$$

            | Property | Formula |
| ----------| ---------|
| $E(aX + b)$ | $aE(X) + b$ |
| $E(X + Y)$ | $E(X) + E(Y)$ |
| $Var(X)$ | $E(X ^ 2) - [E(X)] ^ 2$ | `
            },
            {
                id: 'm-21',
                title: 'Statistics',
                content: `# Statistics

## 1. Central Tendency
- **Mean** ($\\\\bar{x}$): $\\\\frac{\\\\sum f_i x_i}{\\\\sum f_i}$
- **Median**: Middle term. Grouped: $L + \\\\frac{N/2 - C}{f} \\\\times h$
- **Mode**: Frequency peak. Grouped: $L + \\\\frac{f_1 - f_0}{2f_1 - f_0 - f_2} \\\\times h$
- **Relation**: $Mode = 3 \\\\times Median - 2 \\\\times Mean$

## 2. Dispersion
- **Variance** ($\\\\sigma^2$): $\\\\frac{\\\\sum f_i(x_i - \\\\bar{x})^2}{N} = \\\\frac{\\\\sum f_i x_i^2}{N} - (\\\\bar{x})^2$
- **Standard Deviation** ($\\\\sigma$): $\\\\sqrt{Variance}$
- **Coefficient of Variation**: $\\\\frac{\\\\sigma}{\\\\bar{x}} \\\\times 100$

## 3. Transformations
If $y_i = ax_i + b$:
- $\\\\bar{y} = a\\\\bar{x} + b$
- $\\\\sigma_y = |a| \\\\sigma_x$
- $Var(y) = a^2 Var(x)$`
            },
        ]
    },
    {
        id: 'Physics',
        title: 'Physics',
        color: 'text-purple-500',
        chapters: [
            { id: 'p-01', title: 'Mechanics', content: '# Mechanics\n\n*Coming soon...*' },
            { id: 'p-02', title: 'Electromagnetism', content: '# Electromagnetism\n\n*Coming soon...*' },
        ]
    },
    {
        id: 'Chemistry',
        title: 'Chemistry',
        color: 'text-pink-500',
        chapters: [
            { id: 'c-01', title: 'Physical Chemistry', content: '# Physical Chemistry\n\n*Coming soon...*' },
            { id: 'c-02', title: 'Organic Chemistry', content: '# Organic Chemistry\n\n*Coming soon...*' },
        ]
    }
];