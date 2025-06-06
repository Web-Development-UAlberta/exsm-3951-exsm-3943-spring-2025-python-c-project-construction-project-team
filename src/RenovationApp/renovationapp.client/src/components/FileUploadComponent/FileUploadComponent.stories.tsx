import type { Meta, StoryObj } from '@storybook/react';
import FileUploadComponent from './FileUploadComponent';
import { handlers, networkErrorHandlers } from '../../mocks/handlers/fileUploadHandlers';
import { expect, waitFor } from '@storybook/test';

// Mocking the MSAL instance
const meta: Meta<typeof FileUploadComponent> = {
    title: 'Upload/FileUploadComponent',
    component: FileUploadComponent,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        msw: {
            handlers: handlers,
        },
    },
    args: {
        projectId: '123',
        apiBaseUrl: 'https://api.example.com',
        backendRootUrl: 'https://backend.example.com',
        msalInstance: {
            acquireTokenSilent: async () => ({
                accessToken: 'mock-access-token' })
        } as any,
    }
} satisfies Meta<typeof FileUploadComponent>;

export default meta;
type Story = StoryObj<typeof FileUploadComponent>;

// Default story
export const Default: Story = {};

const setFileUploadTest = async ({ 
    canvasElement, 
    fileName = 'test',
    fileType = 'image/png',
    fileExtension = 'png',
    selectRadioOption = 'Image',
    description = 'Test description'
}: {
    canvasElement: HTMLElement;
    fileName?: string;
    fileType?: string;
    fileExtension?: string;
    selectRadioOption?: string;
    description?: string;
}) => {
    const { userEvent, within } = await import('@storybook/testing-library');
    const canvas = within(canvasElement);

    // Select a file
    const fileInput = canvas.getByTestId('file-input')
    await userEvent.upload(
        fileInput, 
        new File(['test'], `${fileName}.${fileExtension}`, { type: fileType })
    );

    // Fill out form fields
    await userEvent.type(canvas.getByTestId('file-name-input'), fileName);
    const descriptionInput = canvas.getByTestId('description-input');
    await userEvent.type(descriptionInput, description);
    await userEvent.click(canvas.getByRole('radio', { name: new RegExp(selectRadioOption, 'i') }));

    // Click the upload button
    const uploadButton = canvas.getByTestId('upload-button');
    await userEvent.click(uploadButton);

    return { canvas, userEvent };
};

// Success story for image upload
export const UploadImage: Story = {
    play: async ({ canvasElement }) => {
        await setFileUploadTest({
            canvasElement,
            fileType: 'image/png',
            fileExtension: 'png',
            selectRadioOption: 'Image',
        });
    }
}

// Success story for document upload
export const UploadDocument: Story = {
    play: async ({ canvasElement }) => {
        await setFileUploadTest({
            canvasElement,
            fileType: 'text/plain',
            fileExtension: 'txt',
            selectRadioOption: 'File',
        });
    }
}

// Invalid file type story
export const InvalidFileType: Story = {
    play: async ({ canvasElement }) => {
        const { canvas } = await setFileUploadTest({
            canvasElement,
            fileType: 'application/pdf',
            fileExtension: 'pdf',
            selectRadioOption: 'Image',
        });

        // Wait for error message to appear
        await waitFor(() => {
            const statusMessage = canvas.getByTestId('status-message');
            expect(statusMessage).toBeInTheDocument();
            expect(statusMessage.textContent).toContain('Error');
        });
    }
}

// Network error story
export const NetworkError: Story = {
    parameters: {
        msw: {
            handlers: networkErrorHandlers,
        },
    },
    play: async ({ canvasElement }) => {
        const { canvas } = await setFileUploadTest({
            canvasElement,
            fileType: 'text/plain',
            fileExtension: 'txt',
            selectRadioOption: 'File',
        });

        // Wait for error message to appear
        await waitFor(() => {
            const statusMessage = canvas.getByTestId('status-message');
            expect(statusMessage).toBeInTheDocument();
            expect(statusMessage.textContent).toContain('Error');
        });
    }
}