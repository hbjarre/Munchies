import React from 'react';
import Image from 'next/image';
import { API_URL } from '../config/api';

const BASE_URL = API_URL.replace('/api', '');

interface Filter {
    id: string;
    name: string;
    image_url: string;
}

interface TopFilterMenuProps {
    filters: Filter[];
    selectedFilters: string[];
    onFilterChange: (filters: string[]) => void;
}

export default function TopFilterMenu({ filters, selectedFilters, onFilterChange }: TopFilterMenuProps) {
    const toggleFilter = (filterId: string) => {
        const newFilters = selectedFilters.includes(filterId)
            ? selectedFilters.filter(id => id !== filterId)
            : [...selectedFilters, filterId];
        onFilterChange(newFilters);
    };

    return (
        <div className="w-full">
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex gap-4 min-w-min">
                    {filters.map((filter) => (
                        <div
                            key={filter.id}
                            onClick={() => toggleFilter(filter.id)}
                            className={`
                                flex-shrink-0 cursor-pointer relative bg-white
                                w-[160px] h-[80px] rounded-[8px] shadow-md
                                border-[0.6px] transition-all duration-200
                                ${selectedFilters.includes(filter.id)
                                    ? 'border-[#22C55E] bg-[#22C55E]/5'
                                    : 'border-[rgba(0,0,0,0.06)] hover:border-[#22C55E]/50'
                                }
                            `}
                        >
                            {/* Image container */}
                            <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-r-[8px] overflow-hidden">
                                <Image
                                    src={`${BASE_URL}${filter.image_url}`}
                                    alt={filter.name}
                                    width={80}
                                    height={80}
                                    className="object-cover"
                                    priority={true}
                                />
                            </div>

                            {/* Text in top left */}
                            <div className="absolute top-3 left-3 z-10">
                                <span className="text-black font-sf-pro text-[14px] font-normal leading-[100%] tracking-[-0.5px] whitespace-nowrap">
                                    {filter.name}
                                </span>
                            </div>
                        </div>
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
        </div>
    );
} 