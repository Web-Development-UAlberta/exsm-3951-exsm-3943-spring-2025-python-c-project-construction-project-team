import { Meta, StoryObj } from '@storybook/react';
import { successHandlers, networkErrorHandlers } from '../../mocks/handlers/RFQImageUploadHandler';
import { expect, waitFor } from '@storybook/test';
import { userEvent, within } from '@storybook/testing-library';
import { RFQImageUploadComponent } from './RFQImgUploadComponent';

// Mocking the MSAL instance
const mockMsalInstance: any = {
    acquireTokenSilent: async () => ({
        accessToken: 'mock-access-token',
    })
};

const meta: Meta<typeof RFQImageUploadComponent> = {
    title: 'Upload/RFQImageUploadComponent',
    component: RFQImageUploadComponent,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        msw: {
            handlers: [
                // Add your MSW handlers here
            ],
        },
    },
    args: {
        rfqId: 'rfq-123',
        apiBaseUrl: 'https://api.example.com',
        backendRootUrl: 'https://backend.example.com',
        msalInstance: mockMsalInstance,
    },
    argTypes: {
        rfqId: {
            control: 'text',
            description: 'The ID of the RFQ.',
            defaultValue: 'rfq-123',
        },
        apiBaseUrl: {
            control: 'text',
            description: 'The base URL for the API.',
            defaultValue: 'https://api.example.com',
        },
        backendRootUrl: {
            control: 'text',
            description: 'The root URL for the backend.',
            defaultValue: 'https://backend.example.com',
        },
        msalInstance: {
            control: 'object',
            description: 'The MSAL instance for authentication.',
            defaultValue: mockMsalInstance,
        },
    }
};

export default meta;
type Story = StoryObj<typeof RFQImageUploadComponent>;

const setRFQUploadTest = async ({
    canvasElement,
    fileName = 'test-image',
    fileType = 'image/png',
    fileExtension = 'png',
}: {
    canvasElement: HTMLElement;
    fileName?: string;
    fileType?: string;
    fileExtension?: string;
}) => {
    const canvas = within(canvasElement);

    // Select a file
    const fileInput = canvas.getByTestId('rfq-file-input');
    await userEvent.upload(
        fileInput, 
        new File(['test-image'], `${fileName}.${fileExtension}`, { type: fileType })
    );

    // Set file name
    const fileNameInput = canvas.getByTestId('rfq-file-name-input');
    await userEvent.clear(fileNameInput);
    await userEvent.type(fileNameInput, fileName);

    // Click upload button
    const uploadButton = canvas.getByTestId('rfq-upload-button');
    await userEvent.click(uploadButton);

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for the upload to complete

    return { canvas, userEvent };
};

export const Default: Story = {};

// Success upload story
export const SuccessfulUpload: Story = {
    parameters: {
        msw: {
            handlers: successHandlers,
        },
    },
    play: async ({ canvasElement }) => {
        const { canvas } = await setRFQUploadTest({
            canvasElement,
            fileName: 'successful-upload',
        });

        // Wait for success message
        await waitFor(() => {
            const statusMessage = canvas.getByTestId('rfq-status-message');
            expect(statusMessage).toBeInTheDocument();
            expect(statusMessage.textContent).toContain('successfully');
        });
    }
};

// Network error story
export const NetworkError: Story = {
    parameters: {
        msw: {
            handlers: networkErrorHandlers,
        },
    },
    play: async ({ canvasElement }) => {
        const { canvas } = await setRFQUploadTest({
            canvasElement,
            fileName: 'network-error'
        });

        // Wait for error message
        await waitFor(() => {
            expect(canvas.getByText(/Error:/i)).toBeInTheDocument();
        });
    }
};