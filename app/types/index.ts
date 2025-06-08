export interface Restaurant {
    id: string;
    name: string;
    rating: number;
    filter_ids: string[];
    image_url: string;
    delivery_time_minutes: number;
    price_range_id: string;
}

export interface RestaurantsResponse {
    restaurants: Restaurant[];
}

export interface Filter {
    id: string;
    name: string;
    image_url: string;
}

export interface FiltersResponse {
    filters: Filter[];
}

export interface PriceRange {
    id: string;
    range: string;
}

export interface OpenStatus {
    restaurant_id: string;
    is_open: boolean;
}

export interface DeliveryTime {
    id: string;
    name: string;
    min?: number;
    max?: number;
}

export interface OpenStatuses {
    [key: string]: boolean;
}

export const DELIVERY_TIMES: DeliveryTime[] = [
    { id: 'under10', name: '0-10 min', max: 10 },
    { id: '10to30', name: '10-30 min', min: 10, max: 30 },
    { id: '30to60', name: '30-60 min', min: 30, max: 60 },
    { id: 'over60', name: '1 hour+', min: 60 }
]; 