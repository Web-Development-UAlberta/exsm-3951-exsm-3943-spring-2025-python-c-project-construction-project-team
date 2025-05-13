import { useState } from "react";
import { useMsal } from '@azure/msal-react';
import RequestsTab from "./requests/RequestsTab";
import ProjectsTab from "./projects/ProjectsTab";
import ContactsTab from "./contacts/ContactsTab";

const AdminHome = () => {
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();
    const [activeTab, setActiveTab] = useState<'requests' | 'projects' | 'contacts'>('requests');

    if (!activeAccount) {
        return <div>Please login to proceed.</div>;
    }


    return (
        <div className="row mt-4">
            {/* Sidebar */}
            <div className="col-md-2 left-nav-bar bg-dark text-light">
                <div className="px-3 py-4">
                    <h3 className="mb-4">Dashboard</h3>
                    <div className="nav flex-column">
                        <button
                            className={`nav-link text-light py-2 text-start ${activeTab === 'requests' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('requests')}
                        >
                            Requests
                        </button>
                        <button
                            className={`nav-link text-light py-2 text-start ${activeTab === 'projects' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('projects')}
                        >
                            Projects
                        </button>
                        <button
                            className={`nav-link text-light py-2 text-start ${activeTab === 'contacts' ? 'active fw-bold' : ''}`}
                            onClick={() => setActiveTab('contacts')}
                        >
                            Contacts
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-md-10">
                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="p-4 shadow-sm">
                        <RequestsTab />
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="p-4 shadow-sm">
                        <ProjectsTab />
                    </div>
                )}
                {/* Contacts Tab */}
                {activeTab === 'contacts' && (
                    <div className="p-4 shadow-sm">
                        <ContactsTab />
                    </div>
                )}
            </div>

        </div>
    )
}

export default AdminHome