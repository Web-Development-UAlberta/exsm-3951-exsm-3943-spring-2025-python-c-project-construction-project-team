import { http, HttpResponse } from 'msw';

export const successHandlers = [
    // mocks upload URL
    http.post('https://api.example.com/RFQImage/upload-url', async () => {
        return HttpResponse.json({ 
            url: 'https://backend.example.com/upload/image123'
        });
    }),

    http.put('https://backend.example.com/upload/image123', async () => {
        return new HttpResponse(null, { status: 200 });
    })
];

// Mock handlers for network error
export const networkErrorHandlers = [
    http.post('https://api.example.com/RFQImage/upload-url', async () => {
        return new HttpResponse(null, { status: 500 });
    })
];