import React from 'react';

// Common props
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}

// --- Quick Action Icons (Colorful & Illustrative) ---

export const RevisionNotesIcon = ({ size = 48, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <rect width="48" height="48" rx="12" fill="#F3E8FF" />
        <path d="M14 12C14 10.8954 14.8954 10 16 10H32C33.1046 10 34 10.8954 34 12V36C34 37.1046 33.1046 38 32 38H16C14.8954 38 14 37.1046 14 36V12Z" fill="#9333EA" />
        <rect x="18" y="16" width="12" height="2" rx="1" fill="white" fillOpacity="0.8" />
        <rect x="18" y="22" width="12" height="2" rx="1" fill="white" fillOpacity="0.8" />
        <rect x="18" y="28" width="8" height="2" rx="1" fill="white" fillOpacity="0.8" />
        <circle cx="32" cy="12" r="3" fill="#C084FC" stroke="white" strokeWidth="2" />
    </svg>
);

export const CustomPracticeIcon = ({ size = 48, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <rect width="48" height="48" rx="12" fill="#F0FDF4" />
        <circle cx="24" cy="24" r="14" fill="#DCFCE7" />
        <circle cx="24" cy="24" r="10" stroke="#16A34A" strokeWidth="3" />
        <circle cx="24" cy="24" r="4" fill="#16A34A" />
        <path d="M32 16L36 12" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        <path d="M28 20L38 10" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const ImprovementBookIcon = ({ size = 48, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <rect width="48" height="48" rx="12" fill="#FFF7ED" />
        <path d="M12 36V24" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 36V18" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M28 36V28" stroke="#FB923C" strokeWidth="3" strokeLinecap="round" />
        <path d="M36 36V14" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
        <path d="M10 36H38" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const FlashcardsIcon = ({ size = 48, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <rect width="48" height="48" rx="12" fill="#FEFCE8" />
        <path d="M26 8L16 26H24L22 40L32 22H24L26 8Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" strokeLinejoin="round" />
    </svg>
);

export const PyqIcon = ({ size = 48, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <rect width="48" height="48" rx="12" fill="#EFF6FF" />
        <path d="M14 10H34V38H14V10Z" fill="#3B82F6" />
        <path d="M34 10H24L34 20V10Z" fill="#2563EB" />
        <path d="M18 20H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 26H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 32H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <text x="17" y="36" fill="white" fontSize="8" fontWeight="bold">PYQ</text>
    </svg>
);

// --- Subject Icons (Colorful & Illustrative) ---

export const PhysicsIcon = ({ size = 64, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <path d="M32 12L54 50H10L32 12Z" fill="#4F46E5" fillOpacity="0.2" stroke="#4F46E5" strokeWidth="3" strokeLinejoin="round" />
        <path d="M16 38L28 32" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
        <path d="M36 32L58 42" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
        <defs>
            <linearGradient id="paint0_linear" x1="36" y1="32" x2="58" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#F472B6" />
            </linearGradient>
        </defs>
    </svg>
);

export const MathsIcon = ({ size = 64, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <path d="M12 52H52V12L12 52Z" fill="#0EA5E9" fillOpacity="0.1" stroke="#0284C7" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="28" cy="36" r="6" stroke="#0284C7" strokeWidth="2" />
        <path d="M20 52V48" stroke="#0284C7" strokeWidth="2" />
        <path d="M28 52V48" stroke="#0284C7" strokeWidth="2" />
        <path d="M36 52V48" stroke="#0284C7" strokeWidth="2" />
        <path d="M44 52V48" stroke="#0284C7" strokeWidth="2" />
    </svg>
);

export const ChemistryIcon = ({ size = 64, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <path d="M32 10V24L18 48H46L32 24" fill="#A855F7" fillOpacity="0.2" stroke="#9333EA" strokeWidth="3" strokeLinejoin="round" />
        <path d="M32 10H38" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 42H42" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="36" r="2" fill="#C084FC" />
        <circle cx="28" cy="40" r="3" fill="#C084FC" />
    </svg>
);

export const BiologyIcon = ({ size = 64, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <rect width="64" height="64" rx="16" fill="#DCFCE7" fillOpacity="0.3" />
        <path d="M32 12V52" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 20C20 20 26 26 32 26C38 26 44 20 44 20" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 32C20 32 26 38 32 38C38 38 44 32 44 32" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 44C20 44 26 50 32 50C38 50 44 44 44 44" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="12" r="4" fill="#15803D" />
    </svg>
);

// --- Sidebar Icons (Outline / Duotone) ---

export const OverviewIcon = ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
);

export const LecturesIcon = ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M8 12h8" strokeOpacity="0.2" />
    </svg>
);

export const TestsIcon = ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

export const DoubtsIcon = ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
    </svg>
);

export const PerformanceIcon = ({ size = 24, className, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);
