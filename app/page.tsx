'use client';

import React from 'react';
import RestaurantList from './components/RestaurantList';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <RestaurantList />
      </div>
    </main>
  );
}
