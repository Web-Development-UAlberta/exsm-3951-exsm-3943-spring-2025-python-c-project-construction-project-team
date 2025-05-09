import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from '../layouts/ClientLayout';
import { Gallery, Home, UserProfile, RequestQuote, Service } from '../pages/client';
import AdminLayout from '../layouts/AdminLayout';
import { Projects, Requests } from '../pages/admin';
import { IPublicClientApplication } from '@azure/msal-browser';
    return (
        <MsalProvider instance={instance}>
            <Router>
                <Routes>
                    {/* Client Portal */}
                    <Route path="/" element={<ClientLayout />}>
                        <Route index element={<Home />} />
                        <Route path="service" element={<Service />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="rfq" element={<RequestQuote />} />
                        <Route path="profile" element={<UserProfile />} />
                    </Route>

                    {/* Admin Portal */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="requests" element={<Requests />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="contacts" element={<Requests />} />
                    </Route>

                    {/* Redirect unmatched routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </MsalProvider>
    );
}

export default App;