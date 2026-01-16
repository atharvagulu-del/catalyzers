import { lectureData } from './lectureData';

export interface LectureSuggestion {
    title: string;
    chapterTitle: string;
    subject: string;
    url: string;
}

// Common stop words to ignore in search
const STOP_WORDS = new Set([
    'what', 'is', 'the', 'a', 'an', 'how', 'to', 'do', 'can', 'you', 'explain',
    'tell', 'me', 'about', 'please', 'help', 'with', 'in', 'of', 'for', 'and',
    'or', 'but', 'this', 'that', 'these', 'those', 'i', 'my', 'we', 'our',
    'concept', 'concepts', 'topic', 'topics', 'chapter', 'unit', 'important',
    'formula', 'work', 'does', 'from', 'give', 'one', 'are', 'there', 'short',
    'also', 'me', 'hey'
]);

// Words that indicate a test/quiz (exclude these chapters)
const TEST_KEYWORDS = ['test', 'quiz', 'pyq', 'pyqs', 'challenge', 'practice'];

// =============================================================================
// COMPREHENSIVE TOPIC MAPPINGS FOR ALL SUBJECTS
// =============================================================================
const TOPIC_MAPPINGS: Record<string, string[]> = {
    // ═══════════════════════════════════════════════════════════════════════
    // CHEMISTRY - PHYSICAL CHEMISTRY
    // ═══════════════════════════════════════════════════════════════════════
    'mole': ['Mole Concept'],
    'molar': ['Mole Concept', 'Concentration Terms'],
    'molarity': ['Concentration Terms'],
    'molality': ['Concentration Terms'],
    'stoichiometry': ['Stoichiometry'],
    'limiting': ['Stoichiometry'],
    'reagent': ['Stoichiometry'],

    'atomic': ['Atomic Models', 'Quantum Mechanical Model'],
    'bohr': ['Atomic Models'],
    'quantum': ['Quantum Mechanical Model'],
    'orbital': ['Quantum Mechanical Model', 'Hybridization & VBT'],
    'orbitals': ['Quantum Mechanical Model'],
    'electronic': ['Electronic Configuration'],
    'aufbau': ['Electronic Configuration'],
    'pauli': ['Electronic Configuration'],
    'hund': ['Electronic Configuration'],

    'periodic': ['Periodic Table Basics', 'Periodic Trends'],
    'periodicity': ['Periodic Trends'],
    'ionization': ['Periodic Trends'],
    'electronegativity': ['Periodic Trends'],

    'ionic': ['Ionic Bonding', 'Ionic Equilibrium'],
    'covalent': ['Covalent Bonding & VSEPR'],
    'vsepr': ['Covalent Bonding & VSEPR'],
    'lewis': ['Covalent Bonding & VSEPR'],
    'hybridization': ['Hybridization & VBT'],
    'mot': ['Molecular Orbital Theory (MOT)'],
    'molecular': ['Molecular Orbital Theory (MOT)'],
    'bond': ['Ionic Bonding', 'Covalent Bonding & VSEPR'],
    'bonding': ['Ionic Bonding', 'Covalent Bonding & VSEPR'],

    'enthalpy': ['First Law of Thermodynamics', 'Thermochemistry'],
    'entropy': ['Entropy & Second Law'],
    'gibbs': ['Gibbs Energy'],
    'hess': ['Thermochemistry'],
    'spontaneous': ['Entropy & Second Law', 'Gibbs Energy'],

    'equilibrium': ['Chemical Equilibrium', 'Ionic Equilibrium'],
    'chatelier': ['Chemical Equilibrium'],
    'lechatelier': ['Chemical Equilibrium'],
    'buffer': ['Buffer Solutions'],
    'solubility': ['Solubility Product (Ksp)'],
    'ksp': ['Solubility Product (Ksp)'],

    'redox': ['Oxidation Number', 'Balancing Redox'],
    'oxidation': ['Oxidation Number'],
    'reduction': ['Oxidation Number'],

    // ═══════════════════════════════════════════════════════════════════════
    // PHYSICS - MECHANICS
    // ═══════════════════════════════════════════════════════════════════════
    'dimension': ['Dimensional Analysis'],
    'dimensional': ['Dimensional Analysis'],
    'error': ['Errors in Measurement'],
    'vernier': ['Measuring Instruments'],
    'screw': ['Measuring Instruments'],

    'kinematics': ['1D Kinematics', 'Motion in a Straight Line', 'Projectile Motion'],
    'projectile': ['Projectile Motion'],
    'motion': ['Motion in a Straight Line', '1D Kinematics', 'Projectile Motion'],
    'velocity': ['1D Kinematics', 'Motion in a Straight Line'],
    'acceleration': ['1D Kinematics', 'Motion in a Straight Line'],

    'force': ['Newton\'s Laws', 'Forces in Nature'],
    'newton': ['Newton\'s Laws'],
    'friction': ['Friction'],
    'circular': ['Circular Motion Dynamics'],
    'pseudo': ['Newton\'s Laws'],
    'constraint': ['Constraint Motion & Pulleys'],
    'pulley': ['Constraint Motion & Pulleys'],
    'pulleys': ['Constraint Motion & Pulleys'],
    'pully': ['Constraint Motion & Pulleys'], // Common typo

    'work': ['Work, Energy & Power'],
    'energy': ['Work, Energy & Power', 'Conservation of Energy'],
    'power': ['Work, Energy & Power'],
    'conservation': ['Conservation of Energy', 'Conservation of Momentum'],

    'momentum': ['Momentum & Impulse', 'Conservation of Momentum', 'Angular Momentum'],
    'impulse': ['Momentum & Impulse'],
    'collision': ['Collisions'],

    'center': ['Center of Mass'],
    'mass': ['Center of Mass', 'Mole Concept'],
    'com': ['Center of Mass'],

    'rotational': ['Moment of Inertia', 'Torque & Equilibrium', 'Angular Momentum', 'Rolling Motion'],
    'rotation': ['Moment of Inertia', 'Torque & Equilibrium'],
    'torque': ['Torque & Equilibrium'],
    'inertia': ['Moment of Inertia'],
    'moi': ['Moment of Inertia'],
    'angular': ['Angular Momentum'],
    'rolling': ['Rolling Motion'],

    'gravity': ['Motion Under Gravity', 'Gravitation'],
    'gravitational': ['Gravitation'],
    'fall': ['Motion Under Gravity', 'Gravitation'],
    'falling': ['Motion Under Gravity', 'Gravitation'],
    'dropped': ['Motion Under Gravity'],
    'kepler': ['Gravitation'],
    'satellite': ['Gravitation'],

    'shm': ['Simple Harmonic Motion'],
    'harmonic': ['Simple Harmonic Motion'],
    'oscillation': ['Simple Harmonic Motion'],
    'pendulum': ['Simple Harmonic Motion'],

    'wave': ['Wave Motion', 'Sound Waves'],
    'waves': ['Wave Motion', 'Sound Waves'],
    'sound': ['Sound Waves'],
    'doppler': ['Sound Waves'],

    'fluid': ['Fluid Mechanics'],
    'pressure': ['Fluid Mechanics'],
    'bernoulli': ['Fluid Mechanics'],
    'viscosity': ['Fluid Mechanics'],

    'heat': ['Heat Transfer', 'Calorimetry'],
    'calorimetry': ['Calorimetry'],
    'conduction': ['Heat Transfer'],
    'radiation': ['Heat Transfer'],
    'thermodynamics': ['Laws of Thermodynamics'],

    // ═══════════════════════════════════════════════════════════════════════
    // MATHEMATICS
    // ═══════════════════════════════════════════════════════════════════════
    'set': ['Introduction to Sets', 'Types of Sets'],
    'sets': ['Introduction to Sets', 'Types of Sets', 'Venn Diagrams & Operations'],
    'venn': ['Venn Diagrams & Operations'],
    'relation': ['Relations'],
    'relations': ['Relations'],

    'function': ['Introduction to Functions', 'Types of Functions'],
    'functions': ['Introduction to Functions', 'Types of Functions'],

    'trigonometric': ['Trigonometric Functions', 'Angles & Measurement', 'Trig Functions & Graphs'],
    'trigonometry': ['Trigonometric Functions', 'Angles & Measurement'],
    'trig': ['Trigonometric Functions'],
    'sin': ['Trigonometric Functions'],
    'cos': ['Trigonometric Functions'],
    'tan': ['Trigonometric Functions'],
    'angle': ['Angles & Measurement'],
    'angles': ['Angles & Measurement'],

    'complex': ['Complex Numbers Basics', 'Argand Plane & Polar Form'],
    'argand': ['Argand Plane & Polar Form'],
    'quadratic': ['Quadratic Equations'],

    'sequence': ['Sequences', 'Arithmetic Progression'],
    'series': ['Arithmetic Progression', 'Geometric Progression'],
    'arithmetic': ['Arithmetic Progression'],
    'geometric': ['Geometric Progression'],
    'progression': ['Arithmetic Progression', 'Geometric Progression'],
    'ap': ['Arithmetic Progression'],
    'gp': ['Geometric Progression'],

    'permutation': ['Permutations'],
    'permutations': ['Permutations'],
    'combination': ['Combinations'],
    'combinations': ['Combinations'],
    'binomial': ['Binomial Theorem'],

    'limit': ['Limits & Derivatives'],
    'limits': ['Limits & Derivatives'],
    'derivative': ['Limits & Derivatives', 'Differentiation'],
    'derivatives': ['Limits & Derivatives'],
    'differentiation': ['Differentiation'],

    'integral': ['Integration', 'Definite Integrals'],
    'integration': ['Integration'],
    'definite': ['Definite Integrals'],

    'coordinate': ['Coordinate Geometry Basics'],
    'straight': ['Straight Lines'],
    'line': ['Straight Lines', 'Motion in a Straight Line'],
    'lines': ['Straight Lines'],
    'circle': ['Circles'],
    'conic': ['Parabola', 'Ellipse', 'Hyperbola'],
    'parabola': ['Parabola'],
    'ellipse': ['Ellipse'],
    'hyperbola': ['Hyperbola'],

    'vector': ['Vectors Basics', '3D Geometry'],
    'vectors': ['Vectors Basics'],
    '3d': ['3D Geometry'],

    'probability': ['Probability Basics', 'Conditional Probability'],
    'statistics': ['Statistics Basics', 'Measures of Dispersion'],
    'mean': ['Statistics Basics'],
    'variance': ['Measures of Dispersion'],
    'deviation': ['Measures of Dispersion'],

    'matrix': ['Matrices Basics'],
    'matrices': ['Matrices Basics', 'Matrix Operations'],
    'determinant': ['Determinants'],
    'determinants': ['Determinants'],
};

// Extract meaningful keywords from a query
function extractKeywords(query: string): string[] {
    return query
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// Check if a chapter is a test/quiz
function isTestChapter(title: string): boolean {
    const lower = title.toLowerCase();
    return TEST_KEYWORDS.some(keyword => lower.includes(keyword));
}

// Check if chapter matches any topic mapping
function getTopicMappingScore(keywords: string[], chapterTitle: string): number {
    let score = 0;
    const lowerChapter = chapterTitle.toLowerCase();

    for (const keyword of keywords) {
        const mappedChapters = TOPIC_MAPPINGS[keyword];
        if (mappedChapters) {
            for (const mapped of mappedChapters) {
                if (lowerChapter.includes(mapped.toLowerCase())) {
                    score += 30; // High bonus for mapped match
                }
            }
        }
    }

    return score;
}

// Calculate match score
function calculateMatchScore(keywords: string[], unitTitle: string, chapterTitle: string, description?: string): number {
    const lowerUnit = unitTitle.toLowerCase();
    const lowerChapter = chapterTitle.toLowerCase();
    const lowerDesc = (description || '').toLowerCase();
    let score = 0;

    // First check topic mappings (highest priority)
    score += getTopicMappingScore(keywords, chapterTitle);

    for (const keyword of keywords) {
        // Chapter title match - high value
        if (lowerChapter.includes(keyword)) {
            score += 12;
        }
        // Unit title match
        if (lowerUnit.includes(keyword)) {
            score += 8;
        }
        // Description match
        if (lowerDesc.includes(keyword)) {
            score += 3;
        }
    }

    return score;
}

// Find video lectures related to a user's doubt
export function findRelatedLectures(query: string, maxResults: number = 1): LectureSuggestion[] {
    const keywords = extractKeywords(query);

    if (keywords.length === 0) {
        return [];
    }

    const results: { suggestion: LectureSuggestion; score: number }[] = [];

    for (const [_, subjectData] of Object.entries(lectureData)) {
        const subjectName = subjectData.subject;
        const exam = subjectData.exam;
        const grade = subjectData.grade;

        for (const unit of subjectData.units) {
            for (const chapter of unit.chapters) {
                // SKIP tests, quizzes, and PYQs
                if (isTestChapter(chapter.title)) {
                    continue;
                }

                // Check if chapter has video resources
                const hasVideo = chapter.resources?.some(r => r.type === 'video');
                if (!hasVideo) {
                    continue;
                }

                // Find the first video resource to link to
                const videoResource = chapter.resources.find(r => r.type === 'video');
                const videoIndex = chapter.resources.indexOf(videoResource!);

                const score = calculateMatchScore(keywords, unit.title, chapter.title, chapter.description);

                // Must have meaningful match
                if (score >= 8) {
                    const subjectSlug = `${subjectData.subject.toLowerCase()}-${grade.replace('th', '')}`;
                    // We construct a PARSED url that we can use, OR just pass the raw IDs
                    // Let's pass raw IDs in the URL object for easier parsing, or add new fields.
                    // To keep interface compatible, let's put params in the URL string but in a way we can parse, 
                    // OR just rely on the existing ID structure.
                    // Actually, let's add fields to the interface.

                    const url = `/lectures/player?subjectId=${chapter.id.split('-')[0] === 'phy' ? 'jee-physics-11' : 'jee-maths-11'}&unitId=${unit.id}&chapterId=${chapter.id}&videoId=${videoResource?.url}&resourceIndex=${videoIndex}`;

                    // Wait, constructing subjectId 'jee-physics-11' manually is risky. 
                    // The subjectData keys are like 'jee-physics-11'.
                    // Let's get the key from the loop.
                    const subjectKey = Object.keys(lectureData).find(k => lectureData[k] === subjectData) || 'jee-physics-11';

                    results.push({
                        suggestion: {
                            title: chapter.title,
                            chapterTitle: unit.title,
                            subject: `${subjectName} • ${exam}`,
                            url: JSON.stringify({
                                pathname: '/lectures/player',
                                params: {
                                    subjectId: subjectKey,
                                    unitId: unit.id,
                                    chapterId: chapter.id,
                                    resourceIndex: videoIndex,
                                    videoId: videoResource?.url,
                                    title: videoResource?.title
                                }
                            })
                        },
                        score
                    });
                }
            }
        }
    }

    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(r => r.suggestion);
}

// =============================================================================
// AI-POWERED LECTURE FINDER - Export all chapters for AI to choose from
// =============================================================================
export interface ChapterInfo {
    title: string;
    unitTitle: string;
    subject: string;
    url: string;
    description?: string;
}

// Build reverse mapping: chapter title -> keywords
function getKeywordsForChapter(chapterTitle: string): string[] {
    const keywords: string[] = [];
    const lowerTitle = chapterTitle.toLowerCase();

    for (const [keyword, chapters] of Object.entries(TOPIC_MAPPINGS)) {
        for (const mappedChapter of chapters) {
            if (lowerTitle.includes(mappedChapter.toLowerCase()) ||
                mappedChapter.toLowerCase().includes(lowerTitle)) {
                keywords.push(keyword);
            }
        }
    }

    return [...new Set(keywords)]; // Remove duplicates
}

// Get all video chapters for AI to choose from
export function getAllChaptersForAI(): ChapterInfo[] {
    const chapters: ChapterInfo[] = [];

    for (const [_, subjectData] of Object.entries(lectureData)) {
        const subjectName = subjectData.subject;
        const exam = subjectData.exam;
        const grade = subjectData.grade;

        for (const unit of subjectData.units) {
            for (const chapter of unit.chapters) {
                // Skip tests
                if (isTestChapter(chapter.title)) continue;

                // Only include chapters with videos
                const hasVideo = chapter.resources?.some(r => r.type === 'video');
                if (!hasVideo) continue;

                const subjectSlug = `${subjectData.subject.toLowerCase()}-${grade.replace('th', '')}`;
                const url = `/lectures/${exam.toLowerCase()}/${subjectSlug}/${unit.id}/${chapter.id}`;

                // Get related keywords for this chapter
                const relatedKeywords = getKeywordsForChapter(chapter.title);
                const keywordString = relatedKeywords.length > 0
                    ? `Keywords: ${relatedKeywords.join(', ')}`
                    : '';

                // Build enhanced description with keywords
                const enhancedDescription = [
                    chapter.description || '',
                    keywordString
                ].filter(Boolean).join('. ');

                chapters.push({
                    title: chapter.title,
                    unitTitle: unit.title,
                    subject: `${subjectName} (${exam} ${grade})`,
                    url,
                    description: enhancedDescription
                });
            }
        }
    }

    return chapters;
}
