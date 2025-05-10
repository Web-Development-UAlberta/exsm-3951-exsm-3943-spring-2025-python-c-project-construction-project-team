import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/fileUploadHandlers';

export const worker = setupWorker(...handlers);