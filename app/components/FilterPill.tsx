interface FilterPillProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
    className?: string;
}

export default function FilterPill({ label, isSelected, onClick, className = '' }: FilterPillProps) {
    return (
        <div
            onClick={onClick}
            role="button"
            aria-pressed={isSelected}
            className={`
                inline-flex items-center gap-1.5 px-0.5 md:px-3 py-0.5 md:py-1.5 rounded-full cursor-pointer 
                font-sf-pro text-xs border transition-all duration-200
                whitespace-nowrap bg-white
                ${isSelected
                    ? 'border-[#22C55E] text-black'
                    : 'border-[rgba(0,0,0,0.1)] text-black hover:border-[#22C55E]/50'
                }
                ${className}
            `}
        >
            {label}
        </div>
    );
} 