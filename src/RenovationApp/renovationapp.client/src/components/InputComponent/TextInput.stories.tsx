import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Form/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'number', 'tel'],
      description: 'HTML input type'
    },
    label: {
      control: 'text',
      description: 'Label for the input'
    },
    size: {
      control: 'radio',
      options: ['', 'sm'],
      description: 'Size of the input (Bootstrap sizing)'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the input should take full width'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input'
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required'
    },
    prepend: {
      control: 'text',
      description: 'Content to prepend to the input (text or JSX)'
    },
    append: {
      control: 'text',
      description: 'Content to append to the input (text or JSX)'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input'
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

// Basic examples
export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
  },
};

export const Label: Story = {
  args: {
    label: 'Name',
    value: 'John Doe',
  },
};

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
};

export const HelperText: Story = {
  args: {
    label: 'Preferred Materials',
    placeholder: 'Materials',
    helperText: 'What types of materials do you prefer?',
  },
};

export const TextError: Story = {
  args: {
    label: 'Budget',
    type: 'number',
    value: '-2',
    prepend: '$',
    error: 'Budget cannot be negative',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'You cannot change this',
    disabled: true,
  },
};

// Size variations
export const SmallSize: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size input',
    size: 'sm',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This input takes full width',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Input types
export const NumberInput: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
  },
};

export const TelInput: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter your phone number',
  },
};

// Input groups
export const WithPrepend: Story = {
  args: {
    label: 'Price',
    type: 'number',
    placeholder: '0.00',
    prepend: '$',
  },
};

export const WithAppend: Story = {
  args: {
    label: 'Username',
    placeholder: 'Username',
    append: '@example.com',
  },
};

export const WithPrependAndAppend: Story = {
  args: {
    label: 'Weight',
    type: 'number',
    placeholder: '0',
    prepend: '≈',
    append: 'kg',
  },
};

// Interactive example with state
export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      if (newValue.length < 3 && newValue.length > 0) {
        setError('Input must be at least 3 characters');
      } else {
        setError('');
      }
    };
    
    return (
      <div style={{ width: '300px' }}>
        <TextInput
          label="Interactive Input"
          value={value}
          onChange={handleChange}
          error={error}
          helperText="Try typing less than 3 characters"
          fullWidth
        />
        <div style={{ marginTop: '20px' }}>
          Current value: {value ? `"${value}"` : '(empty)'}
        </div>
      </div>
    );
  }
};
