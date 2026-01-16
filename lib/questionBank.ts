// Pre-generated question bank for free flashcard usage
// These are high-quality JEE/NEET questions generated once and cached
// Users will get shuffled versions of these without API calls

export interface QuestionCard {
    question: string;
    hint: string | null;
    answer: string;
}

export const QUESTION_BANK: Record<string, Record<string, QuestionCard[]>> = {
    "Physics": {
        "Units and Measurements": [
            { question: "What is the dimensional formula of Planck's constant $h$?", hint: "Energy = h × frequency", answer: "The dimensional formula is $[ML^2T^{-1}]$. Since $E = h\\nu$, we have $h = E/\\nu = [ML^2T^{-2}]/[T^{-1}] = [ML^2T^{-1}]$." },
            { question: "If the error in measuring radius is 2%, what is the error in volume of a sphere?", hint: "Volume depends on $r^3$", answer: "Volume $V = \\frac{4}{3}\\pi r^3$. Percentage error in V = 3 × (error in r) = 3 × 2% = 6%." },
            { question: "Which of the following has the same dimensions as impulse?", hint: "Impulse = Force × Time", answer: "Impulse has dimensions $[MLT^{-1}]$, which is same as momentum ($p = mv$)." },
            { question: "The unit of permittivity of free space $\\epsilon_0$ is?", hint: "From Coulomb's law: $F = \\frac{1}{4\\pi\\epsilon_0}\\frac{q_1q_2}{r^2}$", answer: "$[M^{-1}L^{-3}T^4A^2]$ or $C^2N^{-1}m^{-2}$ or $Fm^{-1}$" },
            { question: "What is the number of significant figures in 0.00340?", hint: "Leading zeros don't count", answer: "3 significant figures (3, 4, and the trailing 0). Leading zeros are not significant." },
            { question: "The dimensional formula of angular momentum is same as?", hint: "$L = r \\times p = mvr$", answer: "$[ML^2T^{-1}]$, same as Planck's constant and action." },
            { question: "Convert 1 Newton into dynes.", hint: "1 N = 1 kg⋅m/s², 1 dyne = 1 g⋅cm/s²", answer: "1 N = $10^5$ dynes. Since 1 kg = 1000g and 1 m = 100 cm." },
            { question: "What is the dimension of coefficient of viscosity?", hint: "$F = \\eta A \\frac{dv}{dx}$", answer: "$[ML^{-1}T^{-1}]$ or Pa⋅s or Poise (CGS)" },
            { question: "If velocity, time and force are taken as fundamental quantities, dimension of mass is?", hint: "Mass = Force/Acceleration = Force × Time/Velocity", answer: "$[FTV^{-1}]$. Since $F = ma$, $m = F/a = F/(V/T) = FT/V$" },
            { question: "The percentage error in measurement of mass and velocity are 2% and 3%. What is max error in kinetic energy?", hint: "$KE = \\frac{1}{2}mv^2$", answer: "Error in KE = error in m + 2×(error in v) = 2% + 2×3% = 8%" },
        ],
        "Kinematics": [
            { question: "A particle moves in a circle of radius R with constant speed v. What is its acceleration?", hint: "Think about centripetal acceleration", answer: "Centripetal acceleration $a = \\frac{v^2}{R}$, directed towards the center." },
            { question: "For a projectile, at what angle is the range maximum?", hint: "$R = \\frac{u^2\\sin 2\\theta}{g}$", answer: "Range is maximum at $\\theta = 45°$. At this angle, $\\sin 2\\theta = \\sin 90° = 1$." },
            { question: "A ball is thrown vertically upward. At the highest point, what are velocity and acceleration?", hint: "Gravity always acts downward", answer: "Velocity = 0, Acceleration = g (downward). Acceleration due to gravity doesn't become zero." },
            { question: "If $\\vec{v} = 3\\hat{i} + 4\\hat{j}$ m/s, find the magnitude of velocity.", hint: "Use Pythagorean theorem", answer: "$|\\vec{v}| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$ m/s" },
            { question: "A car starts from rest with acceleration 2 m/s². Distance covered in 5th second?", hint: "$s_n = u + a(n - 0.5)$", answer: "Distance in nth second = $u + a(n - 0.5) = 0 + 2(5 - 0.5) = 9$ m" },
            { question: "Two projectiles have same range. If one is projected at 30°, at what angle is the other?", hint: "Complementary angles give same range", answer: "60°. For same range, angles must be complementary: $\\theta_1 + \\theta_2 = 90°$" },
            { question: "What is the relation between linear velocity and angular velocity?", hint: "arc length = radius × angle", answer: "$v = r\\omega$, where r is radius and $\\omega$ is angular velocity." },
            { question: "A body has positive velocity and negative acceleration. What happens?", hint: "Think about braking", answer: "The body is slowing down (decelerating) but still moving forward." },
            { question: "Time of flight for a projectile is $T$. What is time to reach maximum height?", hint: "Symmetry of projectile motion", answer: "$T/2$. The projectile takes equal time to go up and come down." },
            { question: "Rain is falling vertically. A man runs at 10 m/s. Rain appears at 45° to him. Find rain's velocity.", hint: "Use relative velocity", answer: "Rain velocity = 10 m/s. Since $\\tan 45° = v_{man}/v_{rain} = 1$" },
        ],
        "Laws of Motion": [
            { question: "State Newton's first law of motion.", hint: "Also called law of inertia", answer: "An object at rest stays at rest, and an object in motion stays in motion with same velocity, unless acted upon by an external unbalanced force." },
            { question: "A body of mass 5 kg is acted upon by a force of 10 N. Find acceleration.", hint: "$F = ma$", answer: "$a = F/m = 10/5 = 2$ m/s²" },
            { question: "What is the relation between momentum and force?", hint: "Newton's second law in terms of momentum", answer: "$F = \\frac{dp}{dt}$. Force equals rate of change of momentum." },
            { question: "Two blocks of masses m and 2m are connected by a string over a pulley. Find acceleration.", hint: "Net force = (2m-m)g", answer: "$a = \\frac{(2m-m)g}{2m+m} = \\frac{g}{3}$" },
            { question: "What is the coefficient of friction if angle of repose is 30°?", hint: "$\\mu = \\tan\\theta$", answer: "$\\mu = \\tan 30° = \\frac{1}{\\sqrt{3}} \\approx 0.577$" },
            { question: "A lift accelerates upward at 2 m/s². What is apparent weight of 50 kg person?", hint: "Apparent weight = m(g+a)", answer: "Apparent weight = 50(10+2) = 600 N" },
            { question: "What is the maximum velocity of a car on a banked road without friction?", hint: "Centripetal force from normal component", answer: "$v_{max} = \\sqrt{rg\\tan\\theta}$, where θ is banking angle." },
            { question: "Why does a passenger lean forward when bus suddenly stops?", hint: "Newton's first law", answer: "Due to inertia of motion. Upper body tends to maintain its velocity while lower body stops with bus." },
            { question: "Force of 100 N acts on 10 kg body for 2 seconds. Find change in momentum.", hint: "Impulse = Change in momentum", answer: "Change in momentum = F × t = 100 × 2 = 200 kg⋅m/s" },
            { question: "A horse pulls a cart. What force moves the horse forward?", hint: "Newton's third law + friction", answer: "The friction force from ground on horse's hooves. Horse pushes ground backward, ground pushes horse forward." },
        ],
        "Work, Energy and Power": [
            { question: "A body of mass 2 kg falls from height 10 m. Find kinetic energy just before hitting ground.", hint: "Conservation of energy: PE → KE", answer: "KE = mgh = 2 × 10 × 10 = 200 J" },
            { question: "What is the work done by centripetal force?", hint: "Force perpendicular to displacement", answer: "Zero. Centripetal force is always perpendicular to velocity/displacement." },
            { question: "Power is 60 W. How much work is done in 5 seconds?", hint: "$P = W/t$", answer: "$W = P \\times t = 60 \\times 5 = 300$ J" },
            { question: "A spring has spring constant 200 N/m. Energy stored when stretched by 0.1 m?", hint: "$E = \\frac{1}{2}kx^2$", answer: "$E = \\frac{1}{2} \\times 200 \\times (0.1)^2 = 1$ J" },
            { question: "Work done by friction is always?", hint: "Friction opposes relative motion", answer: "Negative (when considering work done on the moving body). Friction force is opposite to displacement." },
            { question: "What happens to kinetic energy if momentum is doubled?", hint: "$KE = \\frac{p^2}{2m}$", answer: "KE becomes 4 times. Since $KE \\propto p^2$." },
            { question: "A ball is dropped from height h and bounces to height h'. Find coefficient of restitution.", hint: "$e = $ ratio of velocities", answer: "$e = \\sqrt{\\frac{h'}{h}}$. Velocity after bounce = $\\sqrt{2gh'}$, velocity before = $\\sqrt{2gh}$" },
            { question: "Work done in moving a body in a closed path against conservative force is?", hint: "Path independence of conservative forces", answer: "Zero. Work done by/against conservative force in closed loop is always zero." },
            { question: "What is the dimensional formula of power?", hint: "$P = W/t$", answer: "$[ML^2T^{-3}]$. Since P = Work/Time = $[ML^2T^{-2}]/[T]$" },
            { question: "Two balls of masses m and 2m have same kinetic energy. Find ratio of their momenta.", hint: "$p = \\sqrt{2mKE}$", answer: "$p_1:p_2 = \\sqrt{m_1}:\\sqrt{m_2} = \\sqrt{m}:\\sqrt{2m} = 1:\\sqrt{2}$" },
        ],
        "Waves": [
            { question: "What is the relation between frequency, wavelength and velocity of a wave?", hint: "Basic wave equation", answer: "$v = f\\lambda$, where v is velocity, f is frequency, λ is wavelength." },
            { question: "A wave has frequency 100 Hz and wavelength 2 m. Find its velocity.", hint: "$v = f\\lambda$", answer: "$v = 100 \\times 2 = 200$ m/s" },
            { question: "What happens to the frequency of a wave when it travels from one medium to another?", hint: "Source determines frequency", answer: "Frequency remains constant. Only wavelength and velocity change." },
            { question: "Define intensity of a wave.", hint: "Energy per unit area per unit time", answer: "Intensity is power transmitted per unit area perpendicular to wave direction. $I = \\frac{P}{A}$, unit: W/m²" },
            { question: "What is the phase difference between particle velocity and particle displacement in SHM?", hint: "v = dx/dt", answer: "90° or $\\pi/2$ radians. Velocity leads displacement by 90°." },
            { question: "What are nodes and antinodes in a standing wave?", hint: "Points of zero and maximum amplitude", answer: "Nodes: points of zero amplitude (destructive interference). Antinodes: points of maximum amplitude (constructive interference)." },
            { question: "Sound wave is which type of wave - transverse or longitudinal?", hint: "Direction of oscillation vs propagation", answer: "Longitudinal wave. Particles oscillate parallel to direction of wave propagation." },
            { question: "What is the speed of sound in air at 20°C approximately?", hint: "Standard value", answer: "Approximately 343 m/s or 340 m/s." },
            { question: "What is Doppler effect?", hint: "Change in frequency due to relative motion", answer: "The apparent change in frequency of a wave when there is relative motion between source and observer." },
            { question: "Ratio of intensities of two waves is 9:1. What is the ratio of their amplitudes?", hint: "$I \\propto A^2$", answer: "$A_1:A_2 = \\sqrt{I_1}:\\sqrt{I_2} = 3:1$" },
        ],
        "Electromagnetic Waves": [
            { question: "What is the source of electromagnetic waves?", hint: "Accelerated charge", answer: "Accelerated electric charges produce electromagnetic waves." },
            { question: "Arrange EM waves in increasing order of frequency.", hint: "Radio to Gamma", answer: "Radio waves < Microwaves < Infrared < Visible < UV < X-rays < Gamma rays" },
            { question: "Which layer of atmosphere reflects radio waves?", hint: "Ionized layer", answer: "Ionosphere reflects radio waves back to earth." },
            { question: "What is the speed of EM waves in vacuum?", hint: "Universal constant c", answer: "$c = 3 \\times 10^8$ m/s" },
            { question: "Which EM waves are used in radar systems?", hint: "Short wavelength radio waves", answer: "Microwaves are used in radar systems." },
            { question: "What is the relation between $\\vec{E}$, $\\vec{B}$ and wave direction?", hint: "Target direction", answer: "$\\vec{E} \\times \\vec{B}$ gives the direction of wave propagation. $\\vec{E}$ and $\\vec{B}$ are perpendicular to each other and to direction of propagation." },
            { question: "What is displacement current?", hint: "Maxwell's correction", answer: "Current due to changing electric flux. $I_d = \\epsilon_0 \\frac{d\\phi_E}{dt}$" },
            { question: "Which EM waves cause heating effect (greenhouse effect)?", hint: "Heat waves", answer: "Infrared waves." },
            { question: "What is the ratio of amplitude of electric and magnetic fields?", hint: "E/B", answer: "$E_0 / B_0 = c$, where c is speed of light." },
            { question: "Who experimentally verified the existence of EM waves?", hint: "After Maxwell predicted them", answer: "Hertz experimentally verified existence of EM waves." },
        ],
    },
    "Chemistry": {
        "Chemical Bonding": [
            { question: "What type of bond is formed between $Na$ and $Cl$ in NaCl?", hint: "Metal + Non-metal", answer: "Ionic bond. Na loses one electron to form Na⁺, Cl gains one electron to form Cl⁻." },
            { question: "How many lone pairs are present on oxygen in water molecule?", hint: "Oxygen has 6 valence electrons, 2 used for bonding", answer: "2 lone pairs. Oxygen has 6 valence electrons, uses 2 for bonding with H atoms, leaving 4 as lone pairs." },
            { question: "What is the hybridization of carbon in methane ($CH_4$)?", hint: "Tetrahedral geometry", answer: "$sp^3$ hybridization. Carbon forms 4 equivalent bonds with H atoms in tetrahedral arrangement." },
            { question: "Why does $PCl_5$ exist but $NCl_5$ does not?", hint: "d-orbital availability", answer: "P has vacant d-orbitals for expansion of octet, N doesn't. N is in 2nd period with no d-orbitals." },
            { question: "What is the bond order of $O_2$ molecule?", hint: "Bond order = (bonding - antibonding)/2", answer: "Bond order = 2. O₂ has 8 bonding and 4 antibonding electrons: (8-4)/2 = 2." },
            { question: "What is the shape of $SF_6$ molecule?", hint: "6 bonding pairs around S", answer: "Octahedral. S is $sp^3d^2$ hybridized with 6 equivalent bonds." },
            { question: "Which has higher bond angle: $H_2O$ or $H_2S$?", hint: "Electronegativity and lone pair repulsion", answer: "$H_2O$ (104.5°) > $H_2S$ (92°). O is more electronegative, bonds closer to nucleus, more bp-lp repulsion." },
            { question: "What is the formal charge on nitrogen in $NH_4^+$?", hint: "Formal charge = valence - (bonds + lone pairs)", answer: "+1. N has 5 valence electrons, forms 4 bonds, no lone pairs. FC = 5 - 4 = +1." },
            { question: "Define hydrogen bonding.", hint: "H attached to highly electronegative atom", answer: "Intermolecular attraction between H atom bonded to F, O, or N and lone pair of another F, O, or N atom." },
            { question: "Which is stronger: ionic bond or covalent bond?", hint: "Depends on compounds being compared", answer: "Generally ionic bonds are stronger in solid state (lattice energy), but some covalent bonds can be stronger." },
        ],
        "Atomic Structure": [
            { question: "What is the maximum number of electrons in n=3 shell?", hint: "Max electrons = $2n^2$", answer: "$2n^2 = 2(3)^2 = 18$ electrons." },
            { question: "What are the quantum numbers for 3d orbital?", hint: "n, l, m values", answer: "n=3, l=2, m = -2,-1,0,+1,+2. For d orbital, l=2." },
            { question: "Which subshell is filled after 4s according to Aufbau principle?", hint: "Order: 1s,2s,2p,3s,3p,4s,3d...", answer: "3d subshell. Following (n+l) rule, 3d is filled after 4s." },
            { question: "State Pauli's exclusion principle.", hint: "About quantum numbers", answer: "No two electrons in an atom can have all four quantum numbers identical. At most 2 electrons per orbital." },
            { question: "What is de Broglie wavelength formula?", hint: "Wave-particle duality", answer: "$\\lambda = \\frac{h}{mv} = \\frac{h}{p}$, where h is Planck's constant, m is mass, v is velocity." },
            { question: "In Bohr model, what is the radius of nth orbit?", hint: "Proportional to $n^2$", answer: "$r_n = 0.529 \\times n^2/Z$ Å, where Z is atomic number." },
            { question: "What is Heisenberg's uncertainty principle?", hint: "Position and momentum", answer: "$\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}$. Cannot simultaneously know exact position and momentum." },
            { question: "How many electrons can a single orbital hold?", hint: "Pauli's principle", answer: "Maximum 2 electrons, with opposite spins (spin quantum numbers +1/2 and -1/2)." },
            { question: "What is the shape of s, p, and d orbitals?", hint: "Spherical, dumbbell, cloverleaf", answer: "s: spherical, p: dumbbell (2 lobes), d: cloverleaf (4 lobes, except $d_{z^2}$)." },
            { question: "What is the ground state electronic configuration of Fe (Z=26)?", hint: "Anomalous filling", answer: "$[Ar]3d^64s^2$ or $1s^22s^22p^63s^23p^63d^64s^2$. Note: 4s fills before 3d." },
        ],
    },
    "Maths": {
        "Trigonometry": [
            { question: "What is $\\sin^2\\theta + \\cos^2\\theta$?", hint: "Fundamental identity", answer: "1 (for all values of θ). This is the Pythagorean identity." },
            { question: "What is the value of $\\sin 30°$?", hint: "Standard angle", answer: "$\\frac{1}{2}$ or 0.5" },
            { question: "Express $\\tan\\theta$ in terms of $\\sin\\theta$ and $\\cos\\theta$.", hint: "Basic ratio", answer: "$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$" },
            { question: "What is $\\sin(90° - \\theta)$?", hint: "Complementary angle formula", answer: "$\\cos\\theta$. Similarly, $\\cos(90° - \\theta) = \\sin\\theta$." },
            { question: "Find $\\cos 0° + \\cos 90°$.", hint: "Standard values", answer: "$1 + 0 = 1$. $\\cos 0° = 1$ and $\\cos 90° = 0$." },
            { question: "What is the period of $\\sin x$?", hint: "After how much angle does it repeat?", answer: "$2\\pi$ radians or 360°." },
            { question: "What is $1 + \\tan^2\\theta$?", hint: "Derived from Pythagorean identity", answer: "$\\sec^2\\theta$. Dividing $\\sin^2\\theta + \\cos^2\\theta = 1$ by $\\cos^2\\theta$." },
            { question: "What is $\\sin 2\\theta$ in terms of $\\sin\\theta$ and $\\cos\\theta$?", hint: "Double angle formula", answer: "$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$" },
            { question: "In which quadrant is $\\tan\\theta$ positive?", hint: "ASTC rule", answer: "1st quadrant (all positive) and 3rd quadrant (tan positive, sin & cos both negative)." },
            { question: "What is $\\cos 60°$?", hint: "Half of cos 0°", answer: "$\\frac{1}{2}$ or 0.5. Also, $\\cos 60° = \\sin 30°$." },
        ],
        "Calculus": [
            { question: "What is $\\frac{d}{dx}(x^n)$?", hint: "Power rule", answer: "$nx^{n-1}$. The power rule of differentiation." },
            { question: "What is $\\int x^n dx$ where $n \\neq -1$?", hint: "Reverse of power rule", answer: "$\\frac{x^{n+1}}{n+1} + C$, where C is constant of integration." },
            { question: "What is $\\frac{d}{dx}(\\sin x)$?", hint: "Standard derivative", answer: "$\\cos x$" },
            { question: "What is $\\int e^x dx$?", hint: "Exponential function is its own derivative", answer: "$e^x + C$. The exponential function is unchanged by integration." },
            { question: "What is $\\frac{d}{dx}(e^x)$?", hint: "Special property of e", answer: "$e^x$. The exponential function is its own derivative." },
            { question: "Find $\\lim_{x \\to 0} \\frac{\\sin x}{x}$.", hint: "Standard limit", answer: "1. This is a fundamental limit in calculus." },
            { question: "What is $\\frac{d}{dx}(\\ln x)$?", hint: "Natural logarithm derivative", answer: "$\\frac{1}{x}$" },
            { question: "What is $\\int \\frac{1}{x} dx$?", hint: "What function has derivative 1/x?", answer: "$\\ln|x| + C$" },
            { question: "What is the chain rule?", hint: "Composite function differentiation", answer: "$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$" },
            { question: "What is $\\frac{d}{dx}(\\cos x)$?", hint: "Related to sine", answer: "$-\\sin x$. Note the negative sign!" },
        ],
    },
};

// Helper function to get shuffled cards from bank
export function getShuffledCards(subject: string, topic: string, count: number): QuestionCard[] {
    const subjectBank = QUESTION_BANK[subject];
    if (!subjectBank) return [];

    const topicCards = subjectBank[topic];
    if (!topicCards || topicCards.length === 0) return [];

    // Shuffle using Fisher-Yates algorithm
    const shuffled = [...topicCards].sort(() => Math.random() - 0.5);

    // Return requested count (or all if fewer available)
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Check if topic has banked questions
export function hasQuestionBank(subject: string, topic: string): boolean {
    const subjectBank = QUESTION_BANK[subject];
    if (!subjectBank) return false;
    return !!(subjectBank[topic] && subjectBank[topic].length > 0);
}
