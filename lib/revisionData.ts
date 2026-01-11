export type Subject = 'Maths' | 'Physics' | 'Chemistry';

export interface RevisionChapter {
    id: string;
    title: string;
    pageStart: number;
    pageEnd: number;
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
            { id: 'm-01', title: 'Circle Formula', pageStart: 1, pageEnd: 1 },
            { id: 'm-02', title: 'Quadratic Equation Formula', pageStart: 2, pageEnd: 4 },
            { id: 'm-03', title: 'Binomial Theorem Formula', pageStart: 4, pageEnd: 6 },
            { id: 'm-04', title: 'Vectors Formula', pageStart: 6, pageEnd: 8 },
            { id: 'm-05', title: 'Parabola Formula', pageStart: 8, pageEnd: 9 },
            { id: 'm-06', title: 'Definite Integration Formula', pageStart: 9, pageEnd: 11 },
            { id: 'm-07', title: 'Ellipse Formula', pageStart: 11, pageEnd: 12 },
            { id: 'm-08', title: 'Inverse Trigonometric Functions Formula', pageStart: 12, pageEnd: 15 },
            { id: 'm-09', title: 'Straight Line Formula', pageStart: 15, pageEnd: 16 },
            { id: 'm-10', title: 'Indefinite Integration Formula', pageStart: 17, pageEnd: 20 },
            { id: 'm-11', title: 'Application of Derivatives Formula', pageStart: 20, pageEnd: 21 },
            { id: 'm-12', title: 'Sequence & Series', pageStart: 21, pageEnd: 23 },
            { id: 'm-13', title: 'Hyperbola Formula', pageStart: 23, pageEnd: 24 },
        ]
    },
    {
        id: 'Physics',
        title: 'Physics',
        color: 'text-purple-500',
        chapters: [
            { id: 'p-01', title: 'Uniform Circular Motion Formula', pageStart: 25, pageEnd: 26 },
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
            { id: 'c-01', title: 'Enthalpy Formula', pageStart: 64, pageEnd: 65 },
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
