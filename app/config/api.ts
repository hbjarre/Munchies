export const API_URL = 'https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api';

export const ENDPOINTS = {
    RESTAURANTS: `${API_URL}/restaurants`,
    RESTAURANT: `${API_URL}/restaurants/{id}`,
    FILTERS: `${API_URL}/filter`,
    FILTER: `${API_URL}/filter/{id}`,
    OPEN_HOURS: `${API_URL}/open/{id}`,
    PRICE_RANGE: `${API_URL}/price-range/{id}`
} as const; 