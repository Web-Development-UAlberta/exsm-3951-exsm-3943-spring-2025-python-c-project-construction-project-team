import type { Meta, StoryObj } from '@storybook/react';
import ButtonComponent from './Button';

const meta = {
    title: 'Components/Button',
    component: ButtonComponent,
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
            control: { type: 'select', options: ['button', 'submit', 'reset'] },
            description: 'The type of the button.',
            defaultValue: 'button',
        },
        variant: {
            control: { type: 'select', options: ['primary', 'secondary', 'tertiary'] },
            description: 'The variant of the button.',
            defaultValue: 'primary',
        },
        size: {
            control: { type: 'select', options: ['small', 'medium', 'large'] },
            description: 'The size of the button.',
            defaultValue: 'medium',
        },
        // iconPosition: {
        //     control: { type: 'select', options: ['left', 'right'] },
        //     description:
        //         "The position of the icon relative to the text. Use `iconOnly` prop to show only the icon.",
        //     defaultValue: 'left',
        // },
        // iconOnly:{
        //   control:'boolean',
        //   description:'If true, only the icon will be shown without any text.',
        //   defaultValue:false,
        // }
    }
} satisfies Meta<typeof ButtonComponent>;
export default meta;
type Story = StoryObj<typeof ButtonComponent>;

const baseArgs = {
    OnClick: () => console.log('Button clicked!'),
    disabled: false,
    loading: false,
    type: 'button' as 'button',
    size: 'medium' as 'medium',
    iconPosition: 'left' as 'left',
    iconOnly: false,
}

// Default story
export const Default: Story = {
    args: {
        ...baseArgs,
        label: 'Click Me',
        variant: 'primary',
    },
};

// Primary button story
export const Primary: Story = {
    args: {
        ...baseArgs,
        label: 'Primary Button',
        variant: 'primary',
    },
};

// Secondary button story
export const Secondary: Story = {
    args: {
        ...baseArgs,
        label: 'Secondary Button',
        variant: 'secondary',
    },
};

// Tertiary button story
export const Tertiary: Story = {
    args: {
        ...baseArgs,
        label: 'Tertiary Button',
        variant: 'tertiary',
    },
};

// Size variations
export const Small: Story = {
    args: {
        ...baseArgs,
        label: 'Small Button',
        size: 'small',
    },
};

export const Medium: Story = {
    args: {
        ...baseArgs,
        label: 'Medium Button',
        size: 'medium',
    },
};

export const Large: Story = {
    args: {
        ...baseArgs,
        label: 'Large Button',
        size: 'large',
    },
};

// State variations
export const Disabled: Story = {
    args: {
        ...baseArgs,
        label: 'Disabled Button',
        disabled: true,
    },
};
export const Loading: Story = {
    args: {
        ...baseArgs,
        label: 'Loading Button',
        loading: true,
    },
};

// Icon variations
// export const IconLeft: Story = {
//     args: {
//         ...baseArgs,
//         label: 'Icon Left',
//         icon: <span className="material-icons">check</span>,
//         iconPosition: 'left',
//     },
// };

// export const IconRight: Story = {
//     args: {
//         ...baseArgs,
//         label: 'Icon Right',
//         icon: <span className="material-icons">check</span>,
//         iconPosition: 'right',
//     },
// };

// export const IconOnly: Story = {
//     args: {
//         ...baseArgs,
//         icon: <span className="material-icons">check</span>,
//         iconOnly: true,
//     },
// };
