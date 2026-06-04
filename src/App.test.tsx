import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders War Era Rankings app', () => {
  render(<App />);
  const titleElement = screen.getByText(/War Era API Token/i);
  expect(titleElement).toBeInTheDocument();
});
