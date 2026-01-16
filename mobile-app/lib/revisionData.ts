export type Subject = 'Maths' | 'Physics' | 'Chemistry';

export interface RevisionChapter {
    id: string;
    title: string;
    pageStart?: number; // Keeping for backward compatibility if needed
    pageEnd?: number;
    content?: string;   // New field for Native Formula Content (Markdown/LaTeX)
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
                title: 'Circle Formula',
                pageStart: 1,
                pageEnd: 1,
                content: `
# Circle Formulas

## 1. Standard Equation
The equation of a circle with center $(h, k)$ and radius $r$ is:
$$(x - h)^2 + (y - k)^2 = r^2$$

## 2. General Equation
The general equation is:
$$x^2 + y^2 + 2gx + 2fy + c = 0$$
*   **Center**: $(-g, -f)$
*   **Radius**: $\\sqrt{g^2 + f^2 - c}$

## 3. Diameter Form
If $(x_1, y_1)$ and $(x_2, y_2)$ are diameter endpoints:
$$(x - x_1)(x - x_2) + (y - y_1)(y - y_2) = 0$$

## 4. Tangent Equation
Equation of tangent at $(x_1, y_1)$ to $x^2 + y^2 = a^2$:
$$xx_1 + yy_1 = a^2$$
`
            },
            {
                id: 'm-02',
                title: 'Quadratic Equation',
                pageStart: 2,
                pageEnd: 4,
                content: `
# Quadratic Equations

## 1. Standard Form
$$ax^2 + bx + c = 0, \\quad a \\neq 0$$

## 2. Roots of Equation
The roots $\\alpha, \\beta$ are given by:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## 3. Nature of Roots ($D = b^2 - 4ac$)
*   $D > 0$: Real and distinct roots
*   $D = 0$: Real and equal roots ($\\alpha = \\beta = -b/2a$)
*   $D < 0$: Complex conjugate roots

## 4. Sum and Product
*   Sum of roots: $\\alpha + \\beta = -\\frac{b}{a}$
*   Product of roots: $\\alpha \\beta = \\frac{c}{a}$

## 5. Formation of Equation
$$x^2 - (\\text{Sum of roots})x + (\\text{Product of roots}) = 0$$
`
            },
            {
                id: 'm-03',
                title: 'Binomial Theorem',
                pageStart: 4,
                pageEnd: 6,
                content: `
# Binomial Theorem

## 1. Standard Expansion
For any positive integer $n$:
$$(x + y)^n = \\sum_{r=0}^{n} \\binom{n}{r} x^{n-r} y^r$$
$$(x + y)^n = \\binom{n}{0}x^n + \\binom{n}{1}x^{n-1}y + \\dots + \\binom{n}{n}y^n$$

## 2. General Term
The $(r+1)^{th}$ term is:
$$T_{r+1} = \\binom{n}{r} x^{n-r} y^r$$

## 3. Middle Term
*   If $n$ is even: $(\\frac{n}{2} + 1)^{th}$ term.
*   If $n$ is odd: $(\\frac{n+1}{2})^{th}$ and $(\\frac{n+3}{2})^{th}$ terms.

## 4. Key Properties
*   $\\sum_{r=0}^{n} \\binom{n}{r} = 2^n$
*   $\\sum_{r=0}^{n} (-1)^r \\binom{n}{r} = 0$
`
            },
            {
                id: 'm-04',
                title: 'Vectors',
                pageStart: 6,
                pageEnd: 8,
                content: `
# Vectors

## 1. Magnitude
For $\\vec{a} = x\\hat{i} + y\\hat{j} + z\\hat{k}$:
$$|\\vec{a}| = \\sqrt{x^2 + y^2 + z^2}$$

## 2. Scalar (Dot) Product
$$\\vec{a} \\cdot \\vec{b} = |\\vec{a}| |\\vec{b}| \\cos \\theta$$
Projections:
*   Projection of $\\vec{a}$ on $\\vec{b}$: $\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}$

## 3. Vector (Cross) Product
$$\\vec{a} \\times \\vec{b} = |\\vec{a}| |\\vec{b}| \\sin \\theta \\hat{n}$$
To calculate using determinant:
$$
\\vec{a} \\times \\vec{b} = \\begin{vmatrix} 
\\hat{i} & \\hat{j} & \\hat{k} \\\\ 
a_x & a_y & a_z \\\\ 
b_x & b_y & b_z 
\\end{vmatrix}
$$

## 4. Scalar Triple Product
$$[\\vec{a} \\vec{b} \\vec{c}] = \\vec{a} \\cdot (\\vec{b} \\times \\vec{c})$$
Volume of parallelepiped = $|[\\vec{a} \\vec{b} \\vec{c}]|$
`
            },
            {
                id: 'm-05',
                title: 'Parabola',
                pageStart: 8,
                pageEnd: 9,
                content: `
# Parabola

## 1. Standard Equation ($y^2 = 4ax$)
*   **Vertex**: $(0,0)$
*   **Focus**: $(a, 0)$
*   **Directrix**: $x = -a$
*   **Latus Rectum Length**: $4a$

## 2. Parametric Coordinates
For $y^2 = 4ax$:
$$x = at^2, \\quad y = 2at$$

## 3. Tangent Equations
*   **Point Form** $(x_1, y_1)$: $yy_1 = 2a(x + x_1)$
*   **Slope Form** ($m$): $y = mx + \\frac{a}{m}$
*   **Parametric Form** ($t$): $ty = x + at^2$

## 4. Normal Equation
$$y = -tx + 2at + at^3$$
`
            },
            {
                id: 'm-06',
                title: 'Definite Integration',
                pageStart: 9,
                pageEnd: 11,
                content: `
# Definite Integration

## 1. Newton-Leibniz Formula
If $\\int f(x) dx = F(x)$:
$$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$

## 2. Important Properties
*   $\\int_{a}^{b} f(x) dx = \\int_{a}^{b} f(t) dt$
*   $\\int_{a}^{b} f(x) dx = -\\int_{b}^{a} f(x) dx$
*   $\\int_{a}^{b} f(x) dx = \\int_{a}^{c} f(x) dx + \\int_{c}^{b} f(x) dx$
*   $\\int_{0}^{a} f(x) dx = \\int_{0}^{a} f(a-x) dx$ (King's Property)

## 3. Wallis Formula
For $n$ even:
$$\\int_{0}^{\\pi/2} \\sin^n x dx = \\frac{(n-1)(n-3)\\dots 1}{n(n-2)\\dots 2} \\cdot \\frac{\\pi}{2}$$
`
            },
            {
                id: 'm-07',
                title: 'Ellipse',
                pageStart: 11,
                pageEnd: 12,
                content: `
# Ellipse

## 1. Standard Equation
$$\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1 \\quad (a > b)$$

## 2. Key Terms
*   **Eccentricity**: $e = \\sqrt{1 - \\frac{b^2}{a^2}}$
*   **Foci**: $(\\pm ae, 0)$
*   **Directrices**: $x = \\pm \\frac{a}{e}$
*   **Length of Latus Rectum**: $\\frac{2b^2}{a}$

## 3. Tangent Equation (Slope Form)
$$y = mx \\pm \\sqrt{a^2m^2 + b^2}$$
`
            },
            {
                id: 'm-08',
                title: 'Inverse Trig Functions',
                pageStart: 12,
                pageEnd: 15,
                content: `
# Inverse Trigonometric Functions

## 1. Domains and Ranges
| Function | Domain | Range (Principal Value) |
| :--- | :--- | :--- |
| $\\sin^{-1} x$ | $[-1, 1]$ | $[-\\frac{\\pi}{2}, \\frac{\\pi}{2}]$ |
| $\\cos^{-1} x$ | $[-1, 1]$ | $[0, \\pi]$ |
| $\\tan^{-1} x$ | $R$ | $(-\\frac{\\pi}{2}, \\frac{\\pi}{2})$ |

## 2. Important Properties
*   $\\sin^{-1} x + \\cos^{-1} x = \\frac{\\pi}{2}$
*   $\\tan^{-1} x + \\cot^{-1} x = \\frac{\\pi}{2}$
*   $\\tan^{-1} x + \\tan^{-1} y = \\tan^{-1} \\left( \\frac{x+y}{1-xy} \\right)$ (if $xy < 1$)
`
            },
            {
                id: 'm-09',
                title: 'Straight Line',
                pageStart: 15,
                pageEnd: 16,
                content: `
# Straight Line

## 1. Forms of Equation
*   **Slope-Intercept**: $y = mx + c$
*   **Point-Slope**: $y - y_1 = m(x - x_1)$
*   **Two-Point**: $y - y_1 = \\frac{y_2 - y_1}{x_2 - x_1} (x - x_1)$
*   **Intercept Form**: $\\frac{x}{a} + \\frac{y}{b} = 1$
*   **Normal Form**: $x \\cos \\alpha + y \\sin \\alpha = p$

## 2. Distance Formulas
*   Distance between points: $\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$
*   Point $(x_1, y_1)$ to line $Ax + By + C = 0$:
$$d = \\left| \\frac{Ax_1 + By_1 + C}{\\sqrt{A^2 + B^2}} \\right|$$
*   Distance between parallel lines:
$$d = \\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}$$
`
            },
            {
                id: 'm-10',
                title: 'Indefinite Integration',
                pageStart: 17,
                pageEnd: 20,
                content: `
# Indefinite Integration

## 1. Standard Integrals
*   $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$
*   $\\int e^x dx = e^x + C$
*   $\\int \\frac{1}{x} dx = \\ln |x| + C$
*   $\\int \\sin x dx = -\\cos x + C$
*   $\\int \\cos x dx = \\sin x + C$

## 2. Special Integrals
*   $\\int \\frac{dx}{x^2 + a^2} = \\frac{1}{a} \\tan^{-1}(\\frac{x}{a}) + C$
*   $\\int \\frac{dx}{\\sqrt{a^2 - x^2}} = \\sin^{-1}(\\frac{x}{a}) + C$
*   $\\int \\sqrt{a^2 - x^2} dx = \\frac{x}{2}\\sqrt{a^2 - x^2} + \\frac{a^2}{2}\\sin^{-1}(\\frac{x}{a}) + C$

## 3. Integration by Parts
$$\\int u v dx = u \\int v dx - \\int (\\frac{du}{dx} \\int v dx) dx$$
(Use ILATE rule for priority)
`
            },
            {
                id: 'm-11',
                title: 'Application of Derivatives',
                pageStart: 20,
                pageEnd: 21,
                content: `
# Application of Derivatives

## 1. Tangent and Normal
*   Slope of tangent: $m = \\frac{dy}{dx}$ at $(x_1, y_1)$
*   Equation: $y - y_1 = m(x - x_1)$
*   Slope of normal: $-1/m$

## 2. Monotonicity
*   Increasing Function: $f'(x) > 0$
*   Decreasing Function: $f'(x) < 0$

## 3. Maxima and Minima
*   Find critical points where $f'(x) = 0$.
*   **Second Derivative Test**:
    *   If $f''(x) < 0$ at $x=c$: Local Maxima
    *   If $f''(x) > 0$ at $x=c$: Local Minima
`
            },
            {
                id: 'm-12',
                title: 'Sequence & Series',
                pageStart: 21,
                pageEnd: 23,
                content: `
# Sequence & Series

## 1. Arithmetic Progression (AP)
*   $n^{th}$ term: $a_n = a + (n-1)d$
*   Sum of $n$ terms: $S_n = \\frac{n}{2}[2a + (n-1)d]$

## 2. Geometric Progression (GP)
*   $n^{th}$ term: $a_n = a r^{n-1}$
*   Sum of $n$ terms: $S_n = \\frac{a(r^n - 1)}{r - 1}$
*   Sum of infinite GP ($|r| < 1$): $S_\\infty = \\frac{a}{1 - r}$

## 3. Special Series
*   $\\sum n = \\frac{n(n+1)}{2}$
*   $\\sum n^2 = \\frac{n(n+1)(2n+1)}{6}$
*   $\\sum n^3 = [\\frac{n(n+1)}{2}]^2$
`
            },
            {
                id: 'm-13',
                title: 'Hyperbola',
                pageStart: 23,
                pageEnd: 24,
                content: `
# Hyperbola

## 1. Standard Equation
$$\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$$

## 2. Key Terms
*   **Eccentricity**: $b^2 = a^2(e^2 - 1)$
*   **Foci**: $(\\pm ae, 0)$
*   **Directrices**: $x = \\pm \\frac{a}{e}$
*   **Latus Rectum**: $\\frac{2b^2}{a}$

## 3. Asymptotes
Equations: $y = \\pm \\frac{b}{a} x$

## 4. Parametric Coordinates
$$x = a \\sec \\theta, \\quad y = b \\tan \\theta$$
`
            },
        ]
    },
    {
        id: 'Physics',
        title: 'Physics',
        color: 'text-purple-500',
        chapters: [
            { id: 'p-01', title: 'Uniform Circular Motion Formula', pageStart: 25, pageEnd: 26, content: '# Uniform Circular Motion\n\nComing soon...' },
            { id: 'p-02', title: 'Alternating Current Formula', pageStart: 26, pageEnd: 28 },
            { id: 'p-03', title: 'Ampere’s Circuital Law', pageStart: 28, pageEnd: 29 },
            { id: 'p-04', title: 'Capacitance Formula', pageStart: 29, pageEnd: 31 },
            { id: 'p-05', title: 'Centre of Mass Formula', pageStart: 31, pageEnd: 33 },
            { id: 'p-06', title: 'Circular Motion', pageStart: 33, pageEnd: 34 },
            { id: 'p-07', title: 'De Broglie Wavelength Formula', pageStart: 34, pageEnd: 35 },
            { id: 'p-08', title: 'Current Electricity', pageStart: 35, pageEnd: 37 },
            { id: 'p-09', title: 'Electric Current Formula', pageStart: 37, pageEnd: 39 },
            { id: 'p-10', title: 'Electromagnetic Induction Formula', pageStart: 39, pageEnd: 40 },
            { id: 'p-11', title: 'Electromagnetic Waves', pageStart: 41, pageEnd: 41 },
            { id: 'p-12', title: 'Electrostatics Formula', pageStart: 41, pageEnd: 43 },
            { id: 'p-13', title: 'Friction Formula', pageStart: 43, pageEnd: 43 },
            { id: 'p-14', title: 'Linear Momentum Formula', pageStart: 43, pageEnd: 44 },
            { id: 'p-15', title: 'Geometrical Optics Formula', pageStart: 44, pageEnd: 45 },
            { id: 'p-16', title: 'Heat And Thermodynamics Formula', pageStart: 45, pageEnd: 47 },
            { id: 'p-17', title: 'Hooke\'s Law Formula', pageStart: 47, pageEnd: 48 },
            { id: 'p-18', title: 'Inductance Formula', pageStart: 48, pageEnd: 49 },
            { id: 'p-19', title: 'Faraday’s Law Formula', pageStart: 49, pageEnd: 50 },
            { id: 'p-20', title: 'Fluid Mechanics & Properties of Matter Formula', pageStart: 50, pageEnd: 52 },
            { id: 'p-21', title: 'Magnetic Effect of Current Formula', pageStart: 52, pageEnd: 54 },
            { id: 'p-22', title: 'Wave Formula (Part 1 & 2)', pageStart: 54, pageEnd: 56 },
            { id: 'p-23', title: 'Wave Optics Formula', pageStart: 56, pageEnd: 58 },
            { id: 'p-24', title: 'Work Power and Energy Formula', pageStart: 58, pageEnd: 59 },
            { id: 'p-25', title: 'Kinetic Theory Formula', pageStart: 59, pageEnd: 60 },
            { id: 'p-26', title: 'Kinetic Theory of Gases Formula', pageStart: 60, pageEnd: 61 },
            { id: 'p-27', title: 'Lenz\'s Law Formula', pageStart: 61, pageEnd: 63 },
        ]
    },
    {
        id: 'Chemistry',
        title: 'Chemistry',
        color: 'text-pink-500',
        chapters: [
            { id: 'c-01', title: 'Enthalpy Formula', pageStart: 64, pageEnd: 65, content: '# Enthalpy\n\nComing soon...' },
            { id: 'c-02', title: 'Entropy Formula', pageStart: 65, pageEnd: 65 },
            { id: 'c-03', title: 'Atomic Mass Formula', pageStart: 65, pageEnd: 66 },
            { id: 'c-04', title: 'Stoichiometry Formula', pageStart: 66, pageEnd: 67 },
            { id: 'c-05', title: 'Thermodynamics Formulas', pageStart: 67, pageEnd: 68 },
            { id: 'c-06', title: 'Gaseous State Formula', pageStart: 68, pageEnd: 73 },
            { id: 'c-07', title: 'Chemical Equilibrium Formula', pageStart: 73, pageEnd: 75 },
            { id: 'c-08', title: 'Ionic Equilibrium Formula', pageStart: 75, pageEnd: 77 },
            { id: 'c-09', title: 'Electrochemistry Formula', pageStart: 77, pageEnd: 80 },
            { id: 'c-10', title: 'Ideal Gas Equation Formula', pageStart: 80, pageEnd: 81 },
            { id: 'c-11', title: 'Diffusion Formula', pageStart: 81, pageEnd: 82 },
            { id: 'c-12', title: 'De-Broglie’s Formula', pageStart: 82, pageEnd: 83 },
        ]
    }
];
