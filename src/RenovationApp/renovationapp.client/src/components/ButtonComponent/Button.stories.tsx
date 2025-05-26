import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import '../../styles/custom.scss';

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
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
                options: ['primary', 'secondary', 'success', 'danger', 'link', 'transparent'] 
            },
            description: 'The variant of the button.',
            defaultValue: 'primary',
        },
        size: {
            control: { type: 'select', options: ['sm', 'lg'] },
            description: 'The size of the button. Use "sm" for small, "lg" for large, or leave undefined for default.',
            defaultValue: undefined,
        },
        outline: {
            control: 'boolean',
            description: 'Shows the button outline.',
            defaultValue: false,
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
    size: undefined,
    iconPosition: 'left' as 'left',
    iconOnly: false,
    outline: false,
}

// Button variants
export const Primary: Story = {
    args: {
        ...baseArgs,
        children: 'Primary Button',
        variant: 'primary',
    }
};

export const OutlinePrimary: Story = {
    args: {
        ...baseArgs,
        children: 'Outline Primary Button',
        variant: 'primary',
        outline: true,
    }
};

export const Secondary: Story = {
    args: {
        ...baseArgs,
        children: 'Secondary Button',
        variant: 'secondary',
    },
};

export const Success: Story = {
  args: {
    ...baseArgs,
    children: 'Success Button',
    variant: 'success',
  },
};

export const Danger: Story = {
  args: {
    ...baseArgs,
    children: 'Danger Button',
    variant: 'danger',
  },
};

export const Link: Story = {
  args: {
    ...baseArgs,
    children: 'Link Button',
    variant: 'link',
  },
};

// Size variations
export const Small: Story = {
    args: {
        ...baseArgs,
        children: 'Small Button',
        variant: 'primary',
        size: 'sm',
    }
};

export const Large: Story = {
    args: {
        ...baseArgs,
        children: 'Large Button',
        variant: 'primary',
        size: 'lg',
    },
};

// States
export const Disabled: Story = {
  args: {
    ...baseArgs,
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  }
};

export const Loading: Story = {
  args: {
    ...baseArgs,
    children: 'Loading Button',
    variant: 'primary',
    loading: true,
  }
};

// Icon variations
export const IconLeft: Story = {
  args: {
    ...baseArgs,
    children: (
      <>
        <i className="bi bi-plus-lg"></i>
        Icon Left
      </>
    ),
    variant: 'primary',
    iconPosition: 'left',
  }
};

export const IconRight: Story = {
  args: {
    ...baseArgs,
    variant: 'primary',
    children: (
      <>
        <i className="bi bi-arrow-right"></i>
        Icon Right
      </>
    ),
    iconPosition: 'right',
  }
};

export const IconOnly: Story = {
  args: {
    ...baseArgs,
    children: <i className="bi bi-check-lg"></i>,
    iconOnly: true,
  },
};

export const TransparentIconButton: Story = {
  args: {
    ...baseArgs,
    children: <i className="bi bi-check-lg"></i>,
    variant: 'transparent',
    iconOnly: true
  },
};

// Button types
export const ButtonType: Story = {
  args: {
    children: 'Submit Type',
    variant: 'primary',
    type: 'button',
  }
};
export const SubmitType: Story = {
  args: {
    children: 'Click Me',
    variant: 'primary',
    type: 'submit',
  },
};

export const Clickable: Story = {
  args: {
    ...baseArgs,
    children: 'This is an extremely long text that should be truncated or wrapped depending on the button size and CSS properties.',
    variant: 'primary',
    onClick: () => console.log('Button clicked!'),
  }
};

export const ExtremelyLongText: Story = {
  args: {
    children: 'This is an extremely long text that should be truncated or wrapped depending on the button size and CSS properties.',
    variant: 'primary',
    size: 'sm',
  }
};

export const EmptyLabel: Story = {
  args: {
    ...baseArgs,
    children: '',
    variant: 'primary',
  }
};

export const LoadingAndDisabled: Story = {
  args: {
    ...baseArgs,
    children: 'Loading and Disabled',
    variant: 'primary',
    loading: true,
    disabled: true,
  }
};