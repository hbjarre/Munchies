import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RestaurantList from '../RestaurantList';
import { getRestaurants, getFilters, getPriceRange } from '../../services/api';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="mock-image" {...props} />,
}));

// Mock the API calls
jest.mock('../../services/api');

const mockRestaurants = [
  { id: '1', name: 'Restaurant 1', filter_ids: ['1'], delivery_time_minutes: 30, price_range_id: '1' },
  { id: '2', name: 'Restaurant 2', filter_ids: ['2'], delivery_time_minutes: 45, price_range_id: '2' },
  { id: '3', name: 'Restaurant 3', filter_ids: ['1', '2'], delivery_time_minutes: 20, price_range_id: '1' },
  { id: '4', name: 'Restaurant 4', filter_ids: ['3'], delivery_time_minutes: 10, price_range_id: '3' },
];

const mockFilters = [
  { id: '1', name: 'Pizza', image_url: '/pizza.png' },
  { id: '2', name: 'Burrito', image_url: '/burrito.png' },
  { id: '3', name: 'Coffee', image_url: '/coffee.png' },
];

const mockPriceRanges = {
  '1': '$',
  '2': '$$',
  '3': '$$$'
};

describe('RestaurantList', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock responses
    (getRestaurants as jest.Mock).mockResolvedValue(mockRestaurants);
    (getFilters as jest.Mock).mockResolvedValue(mockFilters);
    (getPriceRange as jest.Mock).mockImplementation((id: string) => 
      Promise.resolve({ range: mockPriceRanges[id as keyof typeof mockPriceRanges] })
    );
  });

  it('should show all restaurants when first loading the page', async () => {
    render(<RestaurantList />);
    
    // Wait for the restaurants to load
    await waitFor(() => {
      mockRestaurants.forEach(restaurant => {
        expect(screen.getByText(restaurant.name)).toBeInTheDocument();
      });
    });
  });

  it('should filter restaurants when selecting a filter', async () => {
    render(<RestaurantList />);
    
    // Find and click the Pizza filter in the sidebar
    await waitFor(() => {
      const pizzaFilter = screen.getAllByRole('button', { name: 'Pizza' })
        .find(filter => filter.className.includes('w-fit'));
      expect(pizzaFilter).toBeInTheDocument();
      fireEvent.click(pizzaFilter!);
    });

    // Should only show Pizza restaurants
    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 3')).toBeInTheDocument();
      expect(screen.queryByText('Restaurant 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Restaurant 4')).not.toBeInTheDocument();
    });
  });

  it('should allow selecting multiple category filters', async () => {
    render(<RestaurantList />);
    
    // Find and click both filters in the sidebar
    await waitFor(() => {
      const filters = screen.getAllByRole('button')
        .filter(filter => filter.className.includes('w-fit'));
      
      const pizzaFilter = filters.find(filter => filter.textContent === 'Pizza');
      const burritoFilter = filters.find(filter => filter.textContent === 'Burrito');
      
      expect(pizzaFilter).toBeInTheDocument();
      expect(burritoFilter).toBeInTheDocument();
      
      fireEvent.click(pizzaFilter!);
      fireEvent.click(burritoFilter!);
    });

    // Should show restaurants with either Pizza or Burrito filters
    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 3')).toBeInTheDocument();
      expect(screen.queryByText('Restaurant 4')).not.toBeInTheDocument();
    });
  });

  it('should filter by price range', async () => {
    render(<RestaurantList />);
    
    // Wait for price range filters to load and click '$'
    await waitFor(() => {
      const cheapFilter = screen.getByRole('button', { name: '$' });
      fireEvent.click(cheapFilter);
    });

    // Should only show $ restaurants
    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 3')).toBeInTheDocument();
      expect(screen.queryByText('Restaurant 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Restaurant 4')).not.toBeInTheDocument();
    });
  });

  it('should combine category and price range filters', async () => {
    render(<RestaurantList />);
    
    // Select Pizza category and $$ price range
    await waitFor(() => {
      const pizzaFilter = screen.getAllByRole('button', { name: 'Pizza' })
        .find(filter => filter.className.includes('w-fit'));
      fireEvent.click(pizzaFilter!);
      
      const mediumPriceFilter = screen.getByRole('button', { name: '$$' });
      fireEvent.click(mediumPriceFilter);
    });

    // Should only show Pizza restaurants with $$ price range (none in our mock data)
    await waitFor(() => {
      mockRestaurants.forEach(restaurant => {
        expect(screen.queryByText(restaurant.name)).not.toBeInTheDocument();
      });
    });

    // Change to $ price range
    const cheapFilter = screen.getByRole('button', { name: '$' });
    fireEvent.click(cheapFilter);

    // Should show Pizza restaurants with $ price range
    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 3')).toBeInTheDocument();
      expect(screen.queryByText('Restaurant 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Restaurant 4')).not.toBeInTheDocument();
    });
  });
}); 