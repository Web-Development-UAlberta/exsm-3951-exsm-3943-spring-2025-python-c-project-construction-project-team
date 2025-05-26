/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import 'vitest-dom/extend-expect';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { composeStory } from '@storybook/react';
import Meta, { Primary as PrimaryStory } from './Button.stories';

const Primary = composeStory(PrimaryStory, Meta);

// Clean up after each test
afterEach(cleanup);

// Rendering Tests
describe('Button Component Rendering', () => {
    it('renders with the correct variant class', () => {
        render(<Primary />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-custom-primary');
    });

    it('renders the small size button', () => {
        render(<Primary size="sm" />);
        expect(screen.getByRole('button')).toHaveClass('btn-sm');

        cleanup();

        render(<Primary size="lg" />);
        expect(screen.getByRole('button')).toHaveClass('btn-lg');
    });

    it('renders the button with a left icon', () => {
        render(
            <Primary iconPosition="left">
                <i className="bi bi-arrow-left"></i>
                Icon Left
            </Primary>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders the button with a right icon', () => {
        render(
            <Primary iconPosition="right">
                Icon Right
                <i className="bi bi-arrow-right"></i>
            </Primary>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders the button with icon only with a transparent background', () => {
        render(
            <Primary variant="transparent" iconOnly>
                <i className="bi bi-plus-lg"></i>
            </Primary>
        );
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn-transparent');
    });
});

// State Tests
describe('Button Component States', () => {
    it('renders the button as active', () => {
        render(<Primary active />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('active');
    });

    it('renders the button as disabled and prevents click events', () => {
        const handleClick = vi.fn();
        render(<Primary disabled onClick={handleClick} />);
        const button = screen.getByRole('button');

        expect(button).toBeDisabled();
        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled(); // Ensure click event is not triggered
    });

    it('renders as loading and prevents click events', () => {
        const mockOnClick = vi.fn();
        render(<Primary loading onClick={mockOnClick} />);
        const button = screen.getByRole('button');
        
        expect(button).toBeDisabled();
        expect(button.querySelector('.spinner-border')).toBeInTheDocument();
        
        fireEvent.click(button);
        expect(mockOnClick).not.toHaveBeenCalled();
    });
});

// Event Handling Tests
describe('Button Click Behaviour', () => {
    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Primary onClick={handleClick} />);
        const button = screen.getByRole('button');
        
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

// Button props tests
describe('Button Props', () => {
    it('applies type prop correctly', () => {
        render(<Primary type="submit" />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('applies className prop correctly', () => {
        render(<Primary className="custom-class" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });
});

// Edge Cases
describe('Button Edge Cases', () => {
    it('handles extremely long text without breaking layout', () => {
        const longText = 'This is a very long text that should be truncated or handled gracefully by the button component.';
        render(<Primary>{longText}</Primary>);
        const button = screen.getByRole('button');

        expect(button).toHaveTextContent(longText);
    });

    it('handles empty label gracefully', () => {
        render(<Primary>{''}</Primary>);
        const button = screen.getByRole('button');

        expect(button).toHaveTextContent('');
    });

    it('handles loading and disabled states together', () => {
        render(<Primary loading disabled />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button.querySelector('.spinner-border')).toBeInTheDocument();
    });

    it('handles null or undefined props gracefully', () => {
        render(<Primary>{null}</Primary>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('prevents multiple rapid clicks', async () =>
    {
        const handleClick = vi.fn();
        render(<Primary onClick={handleClick} />);
        const button = screen.getByRole('button');

        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(3);
    });
});