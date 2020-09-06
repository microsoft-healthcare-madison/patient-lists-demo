import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('has title', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/Patient Lists Demo App/i);
  expect(titleElement).toBeInTheDocument();
});
