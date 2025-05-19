/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import 'vitest-dom/extend-expect';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { FileUploadComponent } from './FileUploadComponent';
import * as ButtonModule from '../ButtonComponent/Button';

afterEach(() => {
    cleanup();
})

// Mock MSAL module
vi.mock('@azure/msal-browser', () => {
    return {
        PublicClientApplication: vi.fn().mockImplementation(() => ({
            acquireTokenSilent: vi.fn().mockResolvedValue({
                accessToken: 'mock-access-token'
            }),
        })),
        InteractionType: {
            Silent: 'silent',
            Redirect: 'redirect',
            Popup: 'popup',
        }
    };
});

// Mock the Button component
vi.mock('../ButtonComponent/Button', async () => {
  const actual = await vi.importActual<typeof ButtonModule>('../ButtonComponent/Button');
  return {
    ...actual,
    Button: vi.fn(({ label, onClick, loading, disabled, 'data-testid': testId, ...rest }) => (
      <button 
        onClick={onClick} 
        disabled={disabled} 
        data-testid={testId || 'custom-button'}
        aria-busy={loading ? 'true' : 'false'}
      >
        {loading && <span role="status" className="spinner-border" />}
        {label}
        {...rest}
      </button>
    ))
  };
});

global.fetch = vi.fn();

// Mock file for testing
const createTestFile = (name = 'test.jpg', type = 'image/jpeg') => {
    return new File(['test file'], name, { type });
}

describe('FileUploadComponent', () => {
  // Default props
  const defaultProps = {
    projectId: '123',
    apiBaseUrl: 'https://api.example.com',
    backendRootUrl: 'https://backend.example.com',
    msalInstance: new (require('@azure/msal-browser').PublicClientApplication)({
        auth: {
            clientId: 'test-client-id',
            authority: 'https://login.microsoftonline.com/common',
        }
    })
  };

    beforeEach(() => {
        vi.clearAllMocks();
        (global.fetch as any).mockReset();
        render(<FileUploadComponent {...defaultProps} />);
    });

    it('renders initial state', () => {
        expect(screen.getByText('Upload a File')).toBeInTheDocument();
        expect(screen.getByLabelText('File:')).toBeInTheDocument();
        expect(screen.getByTestId('file-name-input')).toBeInTheDocument();

        // File type radio buttons
        const imageRadio = screen.getByTestId('image-radio');
        expect(imageRadio).toBeInTheDocument();
        const fileRadio = screen.getByTestId('document-radio');
        expect(fileRadio).toBeInTheDocument();

        expect(screen.getByTestId('description-input')).toBeInTheDocument();
        // Upload button
        const button = screen.getByTestId('upload-button');
        expect(button).toHaveTextContent('Upload');
    });

    // File Selection Tests
    it('renders file input correctly', () => {
        const fileInput = screen.getByTestId('file-input');
        expect(fileInput).toBeInTheDocument();
        expect(fileInput).toHaveAttribute('type', 'file');
    });

    it('selecting a file updates the component state', () => {
        const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
        const testFile = createTestFile();
        fireEvent.change(fileInput, { target: { files: [testFile] } });
        expect(fileInput.files![0]).toEqual(testFile);
    });

    // Form Validation Tests
    it('shows error when uploading without selecting a file', async () => {
        const uploadButton = screen.getByTestId('upload-button');
        fireEvent.click(uploadButton);
        await waitFor(() => {
        expect(screen.getByText('Please select a file and provide a file name.')).toBeInTheDocument();
      });
    });

    it('shows error when uploading without a file name', async () => {
        const fileInput = screen.getByTestId('file-input');
        fireEvent.change(fileInput, { target: { files: [createTestFile()] } });
        const uploadButton = screen.getByTestId('upload-button');
        fireEvent.click(uploadButton);
        await waitFor(() => {
            expect(screen.getByText('Please select a file and provide a file name.')).toBeInTheDocument();
        });
    });

    // User Interaction Tests
    it('updates file name on input change', () => {
        const fileName = screen.getByTestId('file-name-input');
        fireEvent.change(fileName, { target: { value: 'test-file' } });
        expect(fileName).toHaveValue('test-file');
    });

    it('updates description on input change', () => {
        const descriptionInput = screen.getByTestId('description-input');
        fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
        expect(descriptionInput).toHaveValue('Test description');
    });
});