'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getRestaurants, getFilters, getPriceRange, getOpenStatus } from '../services/api';
import { API_URL } from '../config/api';
import RightFilterMenu from './RightFilterMenu';
import TopFilterMenu from './TopFilterMenu';
import MobileFilter from './MobileFilter';
import Image from 'next/image';
import { Restaurant, Filter, OpenStatuses, DELIVERY_TIMES } from '../types';

const BASE_URL = API_URL.replace('/api', '');

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
    const [priceRanges, setPriceRanges] = useState<Map<string, string>>(new Map());
    const [openStatuses, setOpenStatuses] = useState<OpenStatuses>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch all data before updating any state
                const [restaurantsData, filtersData] = await Promise.all([
                    getRestaurants(),
                    getFilters()
                ]);

                // Fetch open statuses
                const statusPromises = restaurantsData.map(async (restaurant) => {
                    const isOpen = await getOpenStatus(restaurant.id);
                    return [restaurant.id, isOpen] as [string, boolean];
                });

                // Fetch price ranges
                const uniquePriceRangeIds = new Set(restaurantsData.map(r => r.price_range_id));
                const priceRangePromises = Array.from(uniquePriceRangeIds).map(async (priceRangeId) => {
                    try {
                        const priceRange = await getPriceRange(priceRangeId);
                        return [priceRangeId, priceRange?.range || '$$'] as [string, string];
                    } catch (error) {
                        console.error(`Error fetching price range for ID ${priceRangeId}:`, error);
                        return [priceRangeId, '$$'] as [string, string];
                    }
                });

                // Wait for all async operations to complete
                const [statuses, priceRangeEntries] = await Promise.all([
                    Promise.all(statusPromises),
                    Promise.all(priceRangePromises)
                ]);

                // Update all state at once
                setRestaurants(restaurantsData);
                setFilters(filtersData);
                setOpenStatuses(Object.fromEntries(statuses));
                setPriceRanges(new Map(priceRangeEntries));
                setFilteredRestaurants(restaurantsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!restaurants?.length || !priceRanges.size) return;

        let filtered = [...restaurants];

        // Apply category filters
        if (selectedFilters.length > 0) {
            filtered = filtered.filter(restaurant => 
                restaurant.filter_ids?.some(id => selectedFilters.includes(id))
            );
        }

        // Apply time filters
        if (selectedTimes.length > 0) {
            filtered = filtered.filter(restaurant => {
                const deliveryTime = restaurant.delivery_time_minutes;
                return selectedTimes.some(timeId => {
                    const timeRange = DELIVERY_TIMES.find(t => t.id === timeId);
                    if (!timeRange) return false;
                    
                    if (timeRange.min && timeRange.max) {
                        return deliveryTime >= timeRange.min && deliveryTime <= timeRange.max;
                    } else if (timeRange.max) {
                        return deliveryTime <= timeRange.max;
                    } else if (timeRange.min) {
                        return deliveryTime >= timeRange.min;
                    }
                    return false;
                });
            });
        }

        // Apply price range filters
        if (selectedPrices.length > 0) {
            filtered = filtered.filter(restaurant => {
                const priceRange = priceRanges.get(restaurant.price_range_id);
                return priceRange && selectedPrices.includes(priceRange);
            });
        }

        // Sort restaurants by open status (open restaurants first)
        filtered.sort((a, b) => {
            const aOpen = openStatuses[a.id] || false;
            const bOpen = openStatuses[b.id] || false;
            if (aOpen === bOpen) return 0;
            return aOpen ? -1 : 1;
        });

        setFilteredRestaurants(filtered);
    }, [restaurants, selectedFilters, selectedTimes, selectedPrices, priceRanges, openStatuses]);

    const handleFilterChange = useCallback((filters: string[]) => {
        setSelectedFilters(filters);
    }, []);

    const handleTimeChange = useCallback((times: string[]) => {
        setSelectedTimes(times);
    }, []);

    const handlePriceChange = useCallback((prices: string[]) => {
        setSelectedPrices(prices);
    }, []);

    if (isLoading) {
        return (
            <div className="flex gap-8">
                <div className="w-64 bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-8 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Right Filter Menu - Hidden on mobile */}
            <div className="hidden md:block">
                <RightFilterMenu 
                    filters={filters}
                    priceRanges={priceRanges}
                    selectedFilters={selectedFilters}
                    selectedTimes={selectedTimes}
                    selectedPrices={selectedPrices}
                    onFilterChange={handleFilterChange}
                    onTimeChange={handleTimeChange}
                    onPriceChange={handlePriceChange}
                />
            </div>

            {/* Main content */}
            <div className="flex-1 max-w-[1200px] overflow-x-hidden">
                {/* Mobile-only header section */}
                <div className="md:hidden space-y-6 mb-6">
                    <MobileFilter 
                        selectedTimes={selectedTimes}
                        onTimeChange={handleTimeChange}
                    />
                </div>

                {/* Category filter section */}
                <div className="w-full mb-6">
                    <TopFilterMenu 
                        filters={filters}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Restaurant section */}
                <div>
                    <h1 className="text-4xl text-black font-sf-pro mb-8">Restaurant's</h1>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 min-[1100px]:grid-cols-3 auto-rows-fr gap-[24px]">
                        {filteredRestaurants.map((restaurant) => (
                            <div 
                                key={restaurant.id} 
                                className="bg-white rounded-lg border border-[rgba(0,0,0,0.06)] p-4 relative cursor-pointer hover:shadow-sm transition-shadow w-full overflow-hidden shadow-md max-w-[320px] mx-auto"
                                style={{ 
                                    minHeight: '200px'
                                }}
                            >
                                {/* Grey overlay for closed restaurants */}
                                {!openStatuses[restaurant.id] && (
                                    <div className="absolute inset-0 bg-black/2 rounded-lg z-20" />
                                )}

                                {/* Image */}
                                <div className="absolute top-0 right-0 w-[100px] h-[100px] z-0">
                                    <Image
                                        src={`${BASE_URL}${restaurant.image_url}`}
                                        alt={restaurant.name}
                                        width={100}
                                        height={100}
                                        className={`rounded-tr-lg ${!openStatuses[restaurant.id] ? 'opacity-50' : ''}`}
                                    />
                                </div>

                                {/* Top section with pills */}
                                <div className="relative z-10">
                                    {/* Status and Time */}
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="inline-flex items-center shrink-0 gap-1.5 px-3 py-1.5 rounded-full font-sf-pro text-xs border border-[rgba(0,0,0,0.1)] whitespace-nowrap bg-white">
                                            <div className={`w-2 h-2 rounded-full ${openStatuses[restaurant.id] ? 'bg-[#22C55E]' : 'bg-black'}`}></div>
                                            <span>{openStatuses[restaurant.id] ? 'Open' : 'Closed'}</span>
                                        </div>
                                        {openStatuses[restaurant.id] && (
                                            <div className="inline-flex items-center shrink-0 px-3 py-1.5 rounded-full font-sf-pro text-xs border border-[rgba(0,0,0,0.1)] whitespace-nowrap bg-white">
                                                {restaurant.delivery_time_minutes} min
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Restaurant Name */}
                                <h3 
                                    className={`absolute bottom-4 left-4 text-black font-sf-pro pr-12 z-10 ${!openStatuses[restaurant.id] ? 'opacity-50' : ''}`}
                                    style={{
                                        fontSize: '24px',
                                        fontWeight: 400,
                                        lineHeight: '100%',
                                        letterSpacing: '-0.5px'
                                    }}
                                >
                                    {restaurant.name}
                                </h3>

                                {/* Arrow Button */}
                                <button className={`absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-[#22C55E] z-10`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 