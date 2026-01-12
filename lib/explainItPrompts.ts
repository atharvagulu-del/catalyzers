"use client";

// Prompt bank for Explain It feature
// 5-10 prompts per chapter, randomly rotated

export interface ExplainItPrompt {
    id: string;
    text: string;
    keyConcepts: string[]; // For AI to check against
}

export interface ChapterPrompts {
    chapterTitle: string;
    prompts: ExplainItPrompt[];
}

// Physics Prompts
const physicsPrompts: Record<string, ChapterPrompts> = {
    "laws-of-motion": {
        chapterTitle: "Laws of Motion",
        prompts: [
            {
                id: "lom-1",
                text: "Explain Newton's First Law in your own words.",
                keyConcepts: ["inertia", "net force zero", "state of rest or uniform motion", "no external force"]
            },
            {
                id: "lom-2",
                text: "Why does a body at rest remain at rest when no force acts on it?",
                keyConcepts: ["inertia", "tendency to resist change", "net force zero"]
            },
            {
                id: "lom-3",
                text: "Many students think force is needed to keep motion going. Why is this incorrect?",
                keyConcepts: ["friction misconception", "ideal conditions", "Newton's first law", "inertia"]
            },
            {
                id: "lom-4",
                text: "Explain the relationship between force, mass, and acceleration.",
                keyConcepts: ["F=ma", "directly proportional", "inversely proportional", "Newton's second law"]
            },
            {
                id: "lom-5",
                text: "What is Newton's Third Law? Give a real-life example.",
                keyConcepts: ["action-reaction", "equal and opposite", "pairs of forces", "different bodies"]
            },
            {
                id: "lom-6",
                text: "Explain why a free body diagram is useful in solving problems.",
                keyConcepts: ["isolate body", "all forces", "direction", "net force", "systematic approach"]
            }
        ]
    },
    "kinematics": {
        chapterTitle: "Kinematics",
        prompts: [
            {
                id: "kin-1",
                text: "What is the difference between distance and displacement?",
                keyConcepts: ["scalar vs vector", "path length", "shortest distance", "direction"]
            },
            {
                id: "kin-2",
                text: "Explain what uniform acceleration means with an example.",
                keyConcepts: ["constant rate of change", "velocity changes equally", "free fall example"]
            },
            {
                id: "kin-3",
                text: "Why can an object have zero velocity but non-zero acceleration?",
                keyConcepts: ["instantaneous velocity", "projectile at peak", "changing direction"]
            },
            {
                id: "kin-4",
                text: "Explain projectile motion in your own words.",
                keyConcepts: ["horizontal and vertical components", "parabolic path", "gravity only vertical"]
            },
            {
                id: "kin-5",
                text: "What does the area under a velocity-time graph represent?",
                keyConcepts: ["displacement", "integration concept", "positive and negative areas"]
            }
        ]
    },
    "work-energy-power": {
        chapterTitle: "Work, Energy and Power",
        prompts: [
            {
                id: "wep-1",
                text: "When is work done considered negative?",
                keyConcepts: ["force opposite to displacement", "angle > 90 degrees", "friction example"]
            },
            {
                id: "wep-2",
                text: "Explain the work-energy theorem in simple terms.",
                keyConcepts: ["net work equals change in kinetic energy", "cause and effect"]
            },
            {
                id: "wep-3",
                text: "What is the difference between conservative and non-conservative forces?",
                keyConcepts: ["path independence", "potential energy", "energy conservation"]
            },
            {
                id: "wep-4",
                text: "Explain why power is sometimes more important than work.",
                keyConcepts: ["rate of doing work", "time factor", "efficiency"]
            }
        ]
    }
};

// Chemistry Prompts
const chemistryPrompts: Record<string, ChapterPrompts> = {
    "atomic-structure": {
        chapterTitle: "Atomic Structure",
        prompts: [
            {
                id: "as-1",
                text: "Explain the Bohr model of the atom and its limitations.",
                keyConcepts: ["quantized orbits", "energy levels", "hydrogen only", "doesn't explain spectra of multi-electron"]
            },
            {
                id: "as-2",
                text: "What are quantum numbers and why are they important?",
                keyConcepts: ["n, l, m, s", "electron address", "energy and shape", "Pauli exclusion"]
            },
            {
                id: "as-3",
                text: "Explain Heisenberg's Uncertainty Principle in simple terms.",
                keyConcepts: ["position and momentum", "cannot measure both precisely", "probability"]
            },
            {
                id: "as-4",
                text: "Why do electrons fill orbitals in a specific order?",
                keyConcepts: ["Aufbau principle", "energy order", "n+l rule", "stability"]
            }
        ]
    },
    "chemical-bonding": {
        chapterTitle: "Chemical Bonding",
        prompts: [
            {
                id: "cb-1",
                text: "Explain the difference between ionic and covalent bonds.",
                keyConcepts: ["electron transfer vs sharing", "electronegativity difference", "metals and non-metals"]
            },
            {
                id: "cb-2",
                text: "What is hybridization and why does it occur?",
                keyConcepts: ["mixing of orbitals", "equivalent orbitals", "geometry", "energy minimization"]
            },
            {
                id: "cb-3",
                text: "Explain VSEPR theory and how it predicts molecular shape.",
                keyConcepts: ["electron pair repulsion", "bond pairs and lone pairs", "geometry"]
            },
            {
                id: "cb-4",
                text: "What makes hydrogen bonding special compared to other intermolecular forces?",
                keyConcepts: ["F, O, N with H", "partial charges", "stronger than van der Waals", "water properties"]
            }
        ]
    },
    "equilibrium": {
        chapterTitle: "Chemical Equilibrium",
        prompts: [
            {
                id: "eq-1",
                text: "Explain Le Chatelier's Principle with an example.",
                keyConcepts: ["system opposes change", "shift direction", "concentration, pressure, temperature"]
            },
            {
                id: "eq-2",
                text: "What does the equilibrium constant K tell us about a reaction?",
                keyConcepts: ["ratio of concentrations", "position of equilibrium", "forward vs backward"]
            },
            {
                id: "eq-3",
                text: "Why doesn't a catalyst change the equilibrium position?",
                keyConcepts: ["speeds both directions equally", "activation energy", "reaches equilibrium faster"]
            }
        ]
    }
};

// Mathematics Prompts
const mathsPrompts: Record<string, ChapterPrompts> = {
    "sets-relations-functions": {
        chapterTitle: "Sets, Relations and Functions",
        prompts: [
            {
                id: "srf-1",
                text: "Explain the difference between a relation and a function.",
                keyConcepts: ["one input one output", "vertical line test", "domain and codomain"]
            },
            {
                id: "srf-2",
                text: "What makes a function one-one (injective)?",
                keyConcepts: ["distinct inputs give distinct outputs", "horizontal line test", "no two x same y"]
            },
            {
                id: "srf-3",
                text: "Explain what onto (surjective) function means.",
                keyConcepts: ["every element of codomain has preimage", "range equals codomain"]
            },
            {
                id: "srf-4",
                text: "Why is the concept of inverse function important?",
                keyConcepts: ["bijection required", "undo operation", "composition gives identity"]
            }
        ]
    },
    "trigonometric-functions": {
        chapterTitle: "Trigonometric Functions",
        prompts: [
            {
                id: "tf-1",
                text: "Why do we use radians instead of degrees in calculus?",
                keyConcepts: ["natural measure", "arc length formula", "derivative formulas simpler"]
            },
            {
                id: "tf-2",
                text: "Explain the unit circle approach to trigonometry.",
                keyConcepts: ["coordinates as sin and cos", "all quadrant values", "special angles"]
            },
            {
                id: "tf-3",
                text: "What is the relationship between sin, cos, and tan?",
                keyConcepts: ["tan = sin/cos", "Pythagorean identity", "complementary angles"]
            }
        ]
    },
    "limits-continuity": {
        chapterTitle: "Limits and Continuity",
        prompts: [
            {
                id: "lc-1",
                text: "Explain what a limit means in simple terms.",
                keyConcepts: ["approaching a value", "not necessarily reaching", "left and right limits"]
            },
            {
                id: "lc-2",
                text: "What are the conditions for a function to be continuous at a point?",
                keyConcepts: ["function defined", "limit exists", "limit equals function value"]
            },
            {
                id: "lc-3",
                text: "Why is the concept of limits foundational to calculus?",
                keyConcepts: ["derivatives and integrals built on limits", "instantaneous rate", "area under curve"]
            }
        ]
    }
};

// All prompts organized by subject
export const explainItPrompts = {
    physics: physicsPrompts,
    chemistry: chemistryPrompts,
    maths: mathsPrompts
};

// Helper to get random prompt for a chapter
export function getRandomPrompt(subject: string, chapterSlug: string): ExplainItPrompt | null {
    const subjectPrompts = explainItPrompts[subject as keyof typeof explainItPrompts];
    if (!subjectPrompts) return null;

    const chapter = subjectPrompts[chapterSlug];
    if (!chapter || chapter.prompts.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * chapter.prompts.length);
    return chapter.prompts[randomIndex];
}

// Get all chapters for a subject
export function getChaptersForSubject(subject: string): { slug: string; title: string }[] {
    const subjectPrompts = explainItPrompts[subject as keyof typeof explainItPrompts];
    if (!subjectPrompts) return [];

    return Object.entries(subjectPrompts).map(([slug, data]) => ({
        slug,
        title: data.chapterTitle
    }));
}

// Get all available subjects
export function getSubjects() {
    return [
        { id: "physics", title: "Physics", color: "blue" },
        { id: "chemistry", title: "Chemistry", color: "purple" },
        { id: "maths", title: "Mathematics", color: "green" }
    ];
}
