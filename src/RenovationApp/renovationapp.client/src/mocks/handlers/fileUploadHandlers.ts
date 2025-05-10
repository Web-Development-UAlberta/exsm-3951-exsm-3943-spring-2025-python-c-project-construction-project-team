import { http, HttpResponse } from 'msw';

export const handlers = [
    // mocks upload URL endpoint
    http.post('/upload-url', async ({ request }) => {
        const data = await request.json() as { fileType: string };

        if (data.fileType === 'image')
        {
            return HttpResponse.json({
                url: 'https://mock-upload.com/images',
                key: 'mock-image'
            });
        } else {
            return HttpResponse.json({
                url: 'https://mock-upload.com/documents',
                key: 'mock-document'
            })
        }
    }),

    // mock successful file upload
    http.put('https://mock-upload.com', () => {
        return HttpResponse.json(
            { success: true },
            { status: 200 }
        );
    })
];

export const networkErrorHandlers = [
    http.post('/upload-url', () => {
        return HttpResponse.error();
    })
];