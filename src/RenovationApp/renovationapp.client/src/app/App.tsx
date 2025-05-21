import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import { Gallery, Home, MyAccount, RequestQuote, Service } from '../pages/client';
import AdminLayout from '../layouts/AdminLayout';
import { Contacts, ProjectDetail, Projects, Requests } from '../pages/admin';
import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient()

function App({ instance }: { instance: IPublicClientApplication }) {
    return (
        <MsalProvider instance={instance}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        {/* Client Portal */}
                        <Route path="/" element={<ClientLayout />}>
                            <Route index element={<Home />} />
                            <Route path="service" element={<Service />} />
                            <Route path="gallery" element={<Gallery />} />
                            <Route path="rfq" element={<RequestQuote />} />
                            <Route path="account" element={<MyAccount />} />
                            {/* Admin Portal */}
                            <Route path="admin" element={<AdminLayout />}>
                                <Route index element={<Requests />} />
                                <Route path="requests" element={<Requests />} />
                                <Route path="projects" element={<Projects />} />
                                <Route path="projects/:id" element={<ProjectDetail />} />
                                <Route path="contacts" element={<Contacts />} />
                            </Route>
                        </Route>

                        {/* Redirect unmatched routes */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </QueryClientProvider>
        </MsalProvider>
    );
}

export default App;
