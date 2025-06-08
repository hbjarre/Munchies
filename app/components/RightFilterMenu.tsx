import React from 'react';
import FilterPill from './FilterPill';
import { Filter, DELIVERY_TIMES } from '../types';

interface RightFilterMenuProps {
    filters: Filter[];
    priceRanges: Map<string, string>;
    selectedFilters: string[];
    selectedTimes: string[];
    selectedPrices: string[];
    onFilterChange: (filters: string[]) => void;
    onTimeChange: (times: string[]) => void;
    onPriceChange: (prices: string[]) => void;
}

export default function RightFilterMenu({ 
    filters, 
    priceRanges, 
    selectedFilters,
    selectedTimes,
    selectedPrices,
    onFilterChange, 
    onTimeChange, 
    onPriceChange 
}: RightFilterMenuProps) {
    const handleFilterClick = (id: string) => {
        const newFilters = selectedFilters.includes(id)
            ? selectedFilters.filter(f => f !== id)
            : [...selectedFilters, id];
        onFilterChange(newFilters);
    };

    const handleTimeClick = (id: string) => {
        const newTimes = selectedTimes.includes(id)
            ? selectedTimes.filter(t => t !== id)
            : [...selectedTimes, id];
        onTimeChange(newTimes);
    };

    const handlePriceClick = (price: string) => {
        const newPrices = selectedPrices.includes(price)
            ? selectedPrices.filter(p => p !== price)
            : [...selectedPrices, price];
        onPriceChange(newPrices);
    };

    // Get unique price ranges
    const uniquePriceRanges = Array.from(new Set(priceRanges.values()));

    return (
        <div className="w-64 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-sf-pro mb-6">Filters</h2>

            {/* Categories */}
            <div className="mb-8">
                <h3 className="text-sm font-sf-pro mb-4 text-black/60 uppercase">Categories</h3>
                <div className="flex flex-col gap-2">
                    {filters.map(filter => (
                        <FilterPill
                            key={filter.id}
                            label={filter.name}
                            isSelected={selectedFilters.includes(filter.id)}
                            onClick={() => handleFilterClick(filter.id)}
                            className="w-fit"
                        />
                    ))}
                </div>
            </div>

            {/* Delivery Time */}
            <div className="mb-8">
                <h3 className="text-sm font-sf-pro mb-4 text-black/60 uppercase">Delivery Time</h3>
                <div className="flex flex-wrap gap-2">
                    {DELIVERY_TIMES.map(time => (
                        <FilterPill
                            key={time.id}
                            label={time.name}
                            isSelected={selectedTimes.includes(time.id)}
                            onClick={() => handleTimeClick(time.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-sm font-sf-pro mb-4 text-black/60 uppercase">Price Range</h3>
                <div className="flex flex-wrap gap-2">
                    {Array.from(uniquePriceRanges)
                        .sort((a, b) => a.length - b.length)
                        .map(price => (
                            <FilterPill
                                key={price}
                                label={price}
                                isSelected={selectedPrices.includes(price)}
                                onClick={() => handlePriceClick(price)}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
} 