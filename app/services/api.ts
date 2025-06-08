import { ENDPOINTS } from '../config/api';
import { 
    Restaurant, 
    RestaurantsResponse, 
    Filter, 
    FiltersResponse, 
    PriceRange, 
    OpenStatus 
} from '../types';

const fetchWithAcceptHeader = (url: string) => {
    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });
};

export async function getRestaurants(): Promise<Restaurant[]> {
    try {
        const response = await fetchWithAcceptHeader(ENDPOINTS.RESTAURANTS);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch restaurants: ${response.status} ${errorText}`);
        }
        const jsonData: RestaurantsResponse = await response.json();
        
        if (jsonData && jsonData.restaurants && Array.isArray(jsonData.restaurants)) {
            return jsonData.restaurants;
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        throw error;
    }
}

export async function getFilters(): Promise<Filter[]> {
    try {
        const response = await fetchWithAcceptHeader(ENDPOINTS.FILTERS);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch filters: ${response.status}`);
        }
        const jsonData: FiltersResponse = await response.json();
        
        if (jsonData && jsonData.filters && Array.isArray(jsonData.filters)) {
            return jsonData.filters;
        } else {
            throw new Error('Invalid filters response structure');
        }
    } catch (error) {
        throw error;
    }
}

export async function getPriceRange(id: string): Promise<PriceRange | null> {
    if (!id) {
        console.error('Price range ID is required');
        return null;
    }

    try {
        const response = await fetchWithAcceptHeader(ENDPOINTS.PRICE_RANGE.replace('{id}', id));
        
        if (!response.ok) {
            console.error(`Failed to fetch price range for ID ${id}: ${response.status}`);
            return null;
        }

        const data = await response.json();
        if (!data || !data.range) {
            console.error(`Invalid price range data for ID ${id}:`, data);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Error fetching price range for ID ${id}:`, error);
        return null;
    }
}

export async function getOpenStatus(restaurantId: string): Promise<boolean> {
    try {
        const response = await fetchWithAcceptHeader(ENDPOINTS.OPEN_HOURS.replace('{id}', restaurantId));
        
        if (!response.ok) {
            return false;
        }
        
        const data: OpenStatus = await response.json();
        if (!data || typeof data.is_open !== 'boolean') {
            return false;
        }
        
        return data.is_open;
    } catch (error) {
        return false;
    }
} 