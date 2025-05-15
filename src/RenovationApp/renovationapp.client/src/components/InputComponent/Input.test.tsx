/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import 'vitest-dom/extend-expect';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { composeStories } from '@storybook/react';
import * as stories from './Input.stories';

const { Default, Label, Disabled, TextError } = composeStories(stories);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Rendering Tests
describe('TextInput Component Rendering', () => {
    it('renders default input', () => {
        render(<Default />);
        const input = screen.getByPlaceholderText('Enter your name');
        expect(input).toBeInTheDocument();
    });
    it('renders input with label', () => {
        render(<Label />);
        const input = screen.getByLabelText('Name');
        expect(input).toBeInTheDocument();
    });

    it('renders helper text below input', () => {
        render(<Default helperText="This is a helper text" />);
        const helperText = screen.getByText('This is a helper text');
        expect(helperText).toBeInTheDocument();
    });
});

// Validation Tests
describe('TextInput Component Validation', () => {
    it('renders required input', () => {
        render(<Default required />);
        const input = screen.getByPlaceholderText('Enter your name');
        expect(input).toBeRequired();
    });
    it('renders input with error message', () => {
        render(<TextError />);
        const errorMessage = screen.getByText('Budget cannot be negative');
        expect(errorMessage).toBeInTheDocument();
    });
});

// Interaction Tests
describe('TextInput Component Interaction', () => {
    it('calls onChange when input value changes', () => {
        const handleChange = vi.fn();
        render(<Default onChange={handleChange} />);
        const input = screen.getByPlaceholderText('Enter your name');
        fireEvent.change(input, { target: { value: 'John Doe' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('disables the input when disabled prop is true', () => {
        render(<Disabled />);
        const input = screen.getByLabelText('Disabled Input');
        expect(input).toBeDisabled();
    });

    it('overrides story props', () => {
        render(<Label value="Overridden Value" />);
        const input = screen.getByLabelText('Name');
        expect(input).toHaveValue('Overridden Value');
    });
});

// Input Group Test
describe('TextInput Component Input Group', () => {
    it('renders input with prepend and append elements', () => {
        render(<Default prepend={<span>$</span>} append={<span>USD</span>} />);
        const prepend = screen.getByText('$');
        const append = screen.getByText('USD');
        expect(prepend).toBeInTheDocument();
        expect(append).toBeInTheDocument();
    });
});

