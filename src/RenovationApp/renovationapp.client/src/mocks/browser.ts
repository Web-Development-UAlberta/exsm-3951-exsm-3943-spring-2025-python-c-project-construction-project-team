import { setupWorker } from 'msw/browser';
import { handlers } from '../mocks/handlers/FileUploadHandlers';

export const worker = setupWorker(...handlers);