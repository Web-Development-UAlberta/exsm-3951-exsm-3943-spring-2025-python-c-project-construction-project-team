import { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
    title: 'Components/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
        docs: {
        description: {
            component: 'A reusable dropdown component with auto-scrolling for selected options',
        },
        },
    },
    tags: ['autodocs'],
    
    argTypes: {
        options: {
        description: 'Array of options to display in the dropdown',
        control: 'object',
        },
        label: {
        description: 'Default text to display when no option is selected',
        control: 'text',
        },
        onSelect: {
        description: 'Callback function called when an option is selected',
        action: 'option selected',
        },
        className: {
        description: 'Additional CSS class names',
        control: 'text',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const options = [
    { value: 'Option 1', id: 'option1' },
    { value: 'Option 2', id: 'option2' },
    { value: 'Option 3', id: 'option3' },
    { value: 'Option 4', id: 'option4' },
    { value: 'Option 5', id: 'option5' },
];

export const Default: Story = {
    args: {
        options,
        label: 'Select an option',
        onSelect: (value) => console.log(`Selected: ${value}`),
        className: '',
    },
};

export const WithSelectedOption: Story = {
    args: {
        options,
        label: 'Select an option',
        initialValue: 'Option 2',
        onSelect: (value) => console.log(`Selected: ${value}`),
        className: '',
    }
};