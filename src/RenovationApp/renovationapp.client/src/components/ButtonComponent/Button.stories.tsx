import type { Meta, StoryObj } from '@storybook/react';
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

// Button variants
export const Primary: Story = {
    args: {
        ...baseArgs,
        label: 'Primary Button',
        variant: 'primary',
    }
};

export const Secondary: Story = {
    args: {
        ...baseArgs,
        label: 'Secondary Button',
        variant: 'secondary',
    },
};

export const Success: Story = {
  args: {
    ...baseArgs,
    label: 'Success Button',
    variant: 'success',
  },
};

export const Danger: Story = {
  args: {
    ...baseArgs,
    label: 'Danger Button',
    variant: 'danger',
  },
};

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
  }
};

export const Hover: Story = {
  args: {
    ...baseArgs,
    label: 'Hover Button',
    variant: 'primary',
    hover: true,
  }
};

export const Disabled: Story = {
  args: {
    ...baseArgs,
    label: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  }
};

export const Loading: Story = {
  args: {
    ...baseArgs,
    label: 'Loading Button',
    variant: 'primary',
    loading: true,
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
  }
};

export const IconRight: Story = {
  args: {
    ...baseArgs,
    label: 'Icon Right',
    variant: 'primary',
    children: <i className="bi bi-arrow-right"></i>,
    iconPosition: 'right',
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
    onClick: () => console.log('Button clicked!'),
  }
};

// Edge Cases
export const ExtremelyLongText: Story = {
  args: {
    ...baseArgs,
    label: 'This is an extremely long text that should be truncated or wrapped depending on the button size and CSS properties.',
    variant: 'primary',
    size: 'small',
  }
};

export const EmptyLabel: Story = {
  args: {
    ...baseArgs,
    label: '',
    variant: 'primary',
  }
};

export const LoadingAndDisabled: Story = {
  args: {
    ...baseArgs,
    label: 'Loading and Disabled',
    variant: 'primary',
    loading: true,
    disabled: true,
  }
};