import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('should render a text', () => {
    render(<Home />);

    const p = screen.getByText(/Find in-depth information/i);

    expect(p).toBeInTheDocument();
  });
});
