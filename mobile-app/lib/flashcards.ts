// mobile-app/lib/flashcards.ts - Local Mock Data Version (Mirrors Web)

export interface FlashcardDeck {
    id: string;
    subject: string;
    topic: string;
    title: string;
    card_count: number;
    created_at: string;
}

export interface Flashcard {
    id: string;
    deck_id: string;
    question: string;
    hint: string | null;
    answer: string;
    order: number;
}

// Hardcoded Standard JEE Chapters (Same as Web)
export const JEE_CHAPTERS: Record<string, string[]> = {
    'Physics': [
        'Units and Measurements',
        'Motion in a Straight Line',
        'Motion in a Plane',
        'Laws of Motion',
        'Work, Energy and Power',
        'System of Particles and Rotational Motion',
        'Gravitation',
        'Mechanical Properties of Solids',
        'Mechanical Properties of Fluids',
        'Thermal Properties of Matter',
        'Thermodynamics',
        'Kinetic Theory',
        'Oscillations',
        'Waves',
        'Electric Charges and Fields',
        'Electrostatic Potential and Capacitance',
        'Current Electricity',
        'Moving Charges and Magnetism',
        'Magnetism and Matter',
        'Electromagnetic Induction',
        'Alternating Current',
        'Electromagnetic Waves',
        'Ray Optics and Optical Instruments',
        'Wave Optics',
        'Dual Nature of Radiation and Matter',
        'Atoms',
        'Nuclei',
        'Semiconductor Electronics'
    ],
    'Chemistry': [
        'Some Basic Concepts of Chemistry',
        'Structure of Atom',
        'Classification of Elements and Periodicity in Properties',
        'Chemical Bonding and Molecular Structure',
        'States of Matter',
        'Thermodynamics',
        'Equilibrium',
        'Redox Reactions',
        'Hydrogen',
        'The s-Block Elements',
        'The p-Block Elements',
        'Organic Chemistry - Some Basic Principles and Techniques',
        'Hydrocarbons',
        'Environmental Chemistry',
        'The Solid State',
        'Solutions',
        'Electrochemistry',
        'Chemical Kinetics',
        'Surface Chemistry',
        'General Principles and Processes of Isolation of Elements',
        'The d- and f- Block Elements',
        'Coordination Compounds',
        'Haloalkanes and Haloarenes',
        'Alcohols, Phenols and Ethers',
        'Aldehydes, Ketones and Carboxylic Acids',
        'Amines',
        'Biomolecules',
        'Polymers',
        'Chemistry in Everyday Life'
    ],
    'Maths': [
        'Sets',
        'Relations and Functions',
        'Trigonometric Functions',
        'Principle of Mathematical Induction',
        'Complex Numbers and Quadratic Equations',
        'Linear Inequalities',
        'Permutations and Combinations',
        'Binomial Theorem',
        'Sequence and Series',
        'Straight Lines',
        'Conic Sections',
        'Introduction to Three Dimensional Geometry',
        'Limits and Derivatives',
        'Mathematical Reasoning',
        'Statistics',
        'Probability',
        'Inverse Trigonometric Functions',
        'Matrices',
        'Determinants',
        'Continuity and Differentiability',
        'Application of Derivatives',
        'Integrals',
        'Application of Integrals',
        'Differential Equations',
        'Vector Algebra',
        'Three Dimensional Geometry',
        'Linear Programming'
    ]
};

// Mock Content - Subject-wise example cards with LaTeX (Same as Web)
const MOCK_CARDS: Record<string, { question: string; hint: string | null; answer: string }[]> = {
    'Physics': [
        { question: "What is the formula for Kinetic Energy?", hint: "It depends on mass and velocity squared.", answer: "$K.E. = \\frac{1}{2}mv^2$" },
        { question: "State Newton's Second Law of Motion.", hint: "Force is related to mass and acceleration.", answer: "$\\vec{F} = m\\vec{a}$" },
        { question: "What is the escape velocity from Earth?", hint: "Approximately 11.2 km/s", answer: "$v_e = \\sqrt{\\frac{2GM}{R}} \\approx 11.2 \\text{ km/s}$" },
        { question: "Define gravitational potential energy.", hint: "Related to height and mass.", answer: "$U = mgh$ (near surface) or $U = -\\frac{GMm}{r}$" },
        { question: "What is the time period of a simple pendulum?", hint: "Depends on length and gravity.", answer: "$T = 2\\pi\\sqrt{\\frac{l}{g}}$" }
    ],
    'Chemistry': [
        { question: "What is the shape of $NH_3$ molecule?", hint: "Consider the lone pair on Nitrogen.", answer: "Trigonal Pyramidal with bond angle $\\approx 107^\\circ$" },
        { question: "State the Ideal Gas Equation.", hint: "Relates Pressure, Volume, and Temperature.", answer: "$PV = nRT$" },
        { question: "What is Avogadro's number?", hint: "Number of particles in one mole.", answer: "$N_A = 6.022 \\times 10^{23}$" },
        { question: "Define electronegativity.", hint: "Ability to attract electrons.", answer: "The tendency of an atom to attract shared electrons in a chemical bond." },
        { question: "What is the formula for molarity?", hint: "Moles per liter.", answer: "$M = \\frac{\\text{moles of solute}}{\\text{liters of solution}}$" }
    ],
    'Maths': [
        { question: "What is the quadratic formula?", hint: "Used to find roots of $ax^2 + bx + c = 0$", answer: "$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$" },
        { question: "State the Pythagorean theorem.", hint: "Relates sides of a right triangle.", answer: "$a^2 + b^2 = c^2$" },
        { question: "What is the derivative of $\\sin(x)$?", hint: "A basic trigonometric derivative.", answer: "$\\frac{d}{dx}\\sin(x) = \\cos(x)$" },
        { question: "What is the integral of $e^x$?", hint: "The exponential function is special.", answer: "$\\int e^x dx = e^x + C$" },
        { question: "What is Euler's identity?", hint: "The most beautiful equation in mathematics.", answer: "$e^{i\\pi} + 1 = 0$" }
    ]
};

// Helper: Generate a URL-safe ID from subject+topic
function generateDeckId(subject: string, topic: string): string {
    const raw = `${subject}::${topic}`;
    return encodeURIComponent(raw).replace(/%/g, '_');
}

// Helper: Decode deckId back to subject+topic
function decodeDeckId(deckId: string): { subject: string; topic: string } | null {
    try {
        const decoded = decodeURIComponent(deckId.replace(/_/g, '%'));
        const [subject, topic] = decoded.split('::');
        if (subject && topic) return { subject, topic };
        return null;
    } catch {
        return null;
    }
}

// Get all subjects and their chapters
export async function getSubjectsAndTopics(): Promise<{ subject: string; topics: string[] }[]> {
    return Object.entries(JEE_CHAPTERS).map(([subject, topics]) => ({ subject, topics }));
}

// Get deck for a specific topic (generates ID and mock cards)
export async function getDeckForTopic(subject: string, topic: string): Promise<{ deck: FlashcardDeck; cards: Flashcard[] } | null> {
    const deckId = generateDeckId(subject, topic);
    const mockCards = MOCK_CARDS[subject] || MOCK_CARDS['Physics']; // Fallback to Physics

    const deck: FlashcardDeck = {
        id: deckId,
        subject,
        topic,
        title: topic,
        card_count: mockCards.length,
        created_at: new Date().toISOString()
    };

    const cards: Flashcard[] = mockCards.map((c, i) => ({
        id: `${deckId}-card-${i}`,
        deck_id: deckId,
        question: c.question,
        hint: c.hint,
        answer: c.answer,
        order: i
    }));

    return { deck, cards };
}

// Get deck by ID (decodes and fetches)
export async function getDeckWithCards(deckId: string): Promise<{ deck: FlashcardDeck; cards: Flashcard[] } | null> {
    const decoded = decodeDeckId(deckId);
    if (!decoded) return null;
    return getDeckForTopic(decoded.subject, decoded.topic);
}

// Update card progress (mock)
export async function updateCardProgress(
    studentId: string,
    deckId: string,
    cardId: string,
    status: 'known' | 'learning'
): Promise<boolean> {
    console.log(`[Mobile mock] Progress: ${cardId} -> ${status}`);
    return true;
}

// Get shuffled cards with count (Mock)
export function getShuffledCards(subject: string, topic: string, count: number = 5): Flashcard[] {
    const mockCards = MOCK_CARDS[subject] || MOCK_CARDS['Physics'];
    // Duplicate cards if we need more than we have for mock
    let pool = [...mockCards];
    while (pool.length < count) {
        pool = [...pool, ...mockCards];
    }

    // Shuffle
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, count);

    const deckId = generateDeckId(subject, topic);
    return shuffled.map((c, i) => ({
        id: `${deckId}-card-${i}`,
        deck_id: deckId,
        question: c.question,
        hint: c.hint,
        answer: c.answer,
        order: i
    }));
}
