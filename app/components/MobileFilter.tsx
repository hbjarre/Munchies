import FilterPill from './FilterPill';
import { DELIVERY_TIMES } from '../types';

interface MobileFilterProps {
    selectedTimes: string[];
    onTimeChange: (times: string[]) => void;
}

export default function MobileFilter({ selectedTimes, onTimeChange }: MobileFilterProps) {
    const handleTimeClick = (id: string) => {
        const newTimes = selectedTimes.includes(id)
            ? selectedTimes.filter(t => t !== id)
            : [...selectedTimes, id];
        onTimeChange(newTimes);
    };

    return (
        <section className="w-full">
            <h3 className="text-sm font-sf-pro mb-4 text-black/60 uppercase">Delivery Time</h3>
            <div className="w-full overflow-x-auto hide-scrollbar">
                <div className="flex gap-2 min-w-min pb-4" role="group" aria-label="Delivery time options">
                    {DELIVERY_TIMES.map(time => (
                        <FilterPill
                            key={time.id}
                            label={time.name}
                            isSelected={selectedTimes.includes(time.id)}
                            onClick={() => handleTimeClick(time.id)}
                            className="text-[14px]"
                        />
                    ))}
                </div>
            </div>
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
} 