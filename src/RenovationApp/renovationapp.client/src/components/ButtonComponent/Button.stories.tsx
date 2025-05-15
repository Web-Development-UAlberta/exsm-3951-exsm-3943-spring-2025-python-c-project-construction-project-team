import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Button } from './Button';

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
            description: 'The text label of the button.',
            defaultValue: 'Click Me',
        },
        onClick: {
            action: 'clicked',
            description: 'Function to call when the button is clicked.',
        },
        active: {
            control: 'boolean',
            description: 'Renders the button in active state when true.',
            defaultValue: false,
        },
        hover: {
            control: 'boolean',
            description: 'Renders the button in hover state when true.',
            defaultValue: false,
        },
        disabled: {
            control: 'boolean',
            description: 'Disables the button when true.',
            defaultValue: false,
        },
        loading: {
            control: 'boolean',
            description: 'Shows a loading spinner when true.',
            defaultValue: false,
        },
        type: {
            control: { type: 'select', options: ['button', 'submit'] },
            description: 'The type of the button.',
            defaultValue: 'button',
        },
        variant: {
            control: { 
                type: 'select', 
                options: ['primary', 'secondary', 'success', 'danger', 'link'] 
            },
            description: 'The variant of the button.',
            defaultValue: 'primary',
        },
        size: {
            control: { type: 'select', options: ['small', 'medium', 'large'] },
            description: 'The size of the button.',
            defaultValue: 'medium',
        },
        iconPosition: {
            control: { type: 'select', options: ['left', 'right'] },
            description:
                "The position of the icon relative to the text. Use `iconOnly` prop to show only the icon.",
            defaultValue: 'left',
        },
        iconOnly:{
          control:'boolean',
          description:'If true, only the icon will be shown without any text.',
          defaultValue:false,
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes to apply to the button.',
            defaultValue: '',
        }
    }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

const baseArgs = {
    onClick: () => console.log('Button clicked!'),
    active: false,
    hover: false,
    disabled: false,
    loading: false,
    type: 'button' as 'button',
    size: 'medium' as 'medium',
    iconPosition: 'left' as 'left',
    iconOnly: false,
    className: '',
}

// Primary button story
export const Primary: Story = {
    args: {
        ...baseArgs,
        label: 'Primary Button',
        variant: 'primary',
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const button = canvas.getByRole('button');

      expect(button.textContent).toContain('Primary Button');
      expect(button.classList.contains('custom-primary')).toBe(true);
    }
};

// Secondary button story
export const Secondary: Story = {
    args: {
        ...baseArgs,
        label: 'Secondary Button',
        variant: 'secondary',
    },
};

// Success button story
export const Success: Story = {
  args: {
    ...baseArgs,
    label: 'Success Button',
    variant: 'success',
  },
};

// Danger button story
export const Danger: Story = {
  args: {
    ...baseArgs,
    label: 'Danger Button',
    variant: 'danger',
  },
};

// Link button story
export const Link: Story = {
  args: {
    ...baseArgs,
    label: 'Link Button',
    variant: 'link',
  },
};

// Size variations
export const Small: Story = {
    args: {
        ...baseArgs,
        label: 'Small Button',
        variant: 'primary',
        size: 'small',
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const button = canvas.getByRole('button');

      expect(button.classList.contains('btn-sm')).toBe(true);
    }
};

export const Medium: Story = {
    args: {
        ...baseArgs,
        label: 'Medium Button',
        variant: 'primary',
        size: 'medium',
    },
};

export const Large: Story = {
    args: {
        ...baseArgs,
        label: 'Large Button',
        variant: 'primary',
        size: 'large',
    },
};

// States
export const Active: Story = {
  args: {
    ...baseArgs,
    label: 'Active Button',
    variant: 'primary',
    active: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    expect(button.classList.contains('active')).toBe(true);
  },
};

export const Hover: Story = {
  args: {
    ...baseArgs,
    label: 'Hover Button',
    variant: 'primary',
    hover: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    expect(button.classList.contains('hover')).toBe(true);
  },
};

export const Disabled: Story = {
  args: {
    ...baseArgs,
    label: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    expect(button).toBeDisabled();
  },
};

// Test loading state prevents clicking - Interaction
export const Loading: Story = {
  args: {
    ...baseArgs,
    label: 'Loading Button',
    variant: 'primary',
    loading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // Verify spinner exists
    expect(button.querySelector('.spinner-border')).toBeInTheDocument();
  }
};

// Icon variations
export const IconLeft: Story = {
  args: {
    ...baseArgs,
    label: 'Icon Left',
    variant: 'primary',
    children: <i className="bi bi-plus-lg"></i>,
    iconPosition: 'left',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    const html = button.innerHTML;
    const iconPos = html.indexOf('bi-plus-lg');
    const textPos = html.indexOf('Icon Left');
    expect(iconPos).toBeLessThan(textPos); // icon should be before text
  }
};

export const IconRight: Story = {
  args: {
    ...baseArgs,
    label: 'Icon Right',
    variant: 'primary',
    children: <i className="bi bi-arrow-right"></i>,
    iconPosition: 'right',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    const html = button.innerHTML;
    const iconPos = html.indexOf('bi-arrow-right');
    const textPos = html.indexOf('Icon Right');
    expect(iconPos).toBeGreaterThan(textPos); // icon should be after text
  }
};

export const IconOnly: Story = {
  args: {
    ...baseArgs,
    variant: 'primary',
    children: <i className="bi bi-check-lg"></i>,
    iconOnly: true,
  },
};

// Button types
export const ButtonType: Story = {
  args: {
    ...baseArgs,
    label: 'Button Type',
    variant: 'primary',
    type: 'button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
  }
};

export const SubmitType: Story = {
  args: {
    ...baseArgs,
    label: 'Submit Type',
    variant: 'primary',
    type: 'submit',
  },
};

// Click behaviour
export const Clickable: Story = {
  args: {
    label: 'Click Me',
    onClick: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);

    expect(button).toHaveTextContent('Click Me');
  },
};