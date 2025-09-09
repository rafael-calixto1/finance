import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders compound interest simulator title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Compound Interest Simulator/i);
  expect(linkElement).toBeInTheDocument();
});
