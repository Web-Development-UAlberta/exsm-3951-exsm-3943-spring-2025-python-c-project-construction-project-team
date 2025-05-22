import { mockClientDetails } from '../../../../../mocks/mockContactDetails';
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useClientData } from '../../../../../api/clients/client';
import { Button } from '../../../../../components/ButtonComponent/Button';
import { useNavigate } from 'react-router-dom';
import ProjectSummaryPanel from './ProjectSummaryPanel';

interface ContactDetailsModalProps {
    show: boolean;
    onHide: () => void;
    contactId: string;
}

type TabType = 'Overview' | 'Projects' | 'Communications';

const ContactDetailsModal = ({ show, onHide, contactId }: ContactDetailsModalProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('Overview');
    const [useMockData, setUseMockData] = useState(false);
    const navigate = useNavigate();
    const { instance } = useMsal();
    const { getClientDetails } = useClientData(instance);

    const { data: apiClientDetails, isLoading, error } = getClientDetails(contactId);

    // Use mock data if API call fails or returns no data
    const clientDetails = useMockData || !apiClientDetails
        ? mockClientDetails(contactId)
        : apiClientDetails;
    
    useEffect(() => {
        if (error && error.message.includes('InvalidAuthenticationToken') || 
            error?.message?.includes('Authorization_RequestDenied')) {
            setUseMockData(true);
        }
    }, [error]);

    const renderOverviewTab = () => {
        return (
            <div className="row h-100">
                {/* Left Panel - Contact Info */}
                <div className="col-md-3 border-end">
                    <div className="card border-0">
                        <div className="card-body">
                            <h5 className="card-title">{clientDetails?.basicInfo.givenName} {clientDetails?.basicInfo.surname}</h5>
                            <p className="card-text">
                                <strong>Email:</strong><br />
                                {clientDetails?.basicInfo.mail}<br /><br />
                                <strong>Phone:</strong><br />
                                {clientDetails?.basicInfo.mobilePhone}<br /><br />
                                <strong>Location:</strong><br />
                                {clientDetails?.basicInfo?.streetAddress}<br />
                                {clientDetails?.basicInfo?.city}, {clientDetails?.basicInfo?.state} {clientDetails?.basicInfo?.postalCode}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Middle Panel - Project Summary Component */}
                {clientDetails && <ProjectSummaryPanel clientDetails={clientDetails} />}

                {/* Right Panel - Tasks */}
                <div className="col-md-3 border-start">
                    <h6 className="border-bottom pb-2 mb-3">Tasks</h6>
                    <div className="tasks-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {clientDetails?.tasks.map(task => (
                            <div key={task.id} className="card mb-2">
                                <div className="card-body py-2">
                                    <small className="text-muted">Project #{task.projectId}</small>
                                    <h6 className="mb-1">{task.title}</h6>
                                    <p className="mb-1 small">{task.description}</p>
                                    <span className={`badge bg-${task.status === 'Completed' ? 'success' : 'warning'}`}>
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderProjectsTab = () => (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {clientDetails?.projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.renovationType}</td>
                            <td>
                                <span className={`badge bg-${project.status === 'Completed' ? 'success' : 'primary'}`}>
                                    {project.status}
                                </span>
                            </td>
                            <td>{new Date(project.createdTimestamp).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="small"
                                    onClick={() => {
                                        onHide();
                                        navigate(`/admin/projects/${project.id}`);
                                    }}
                                    label="View Project"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderCommunicationsTab = () => (
        <div className="communications-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {clientDetails?.communications.map(comm => (
                <div key={comm.id} className="card mb-2">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-top">
                            <small className="text-muted">Project #{comm.projectId}</small>
                            <small className="text-muted">
                                {new Date(comm.createdTimestamp).toLocaleString()}
                            </small>
                        </div>
                        <p className="mb-1">{comm.message}</p>
                        {comm.createdBy && (
                            <small className="text-muted">By: {comm.createdBy}</small>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
            <Modal.Header closeButton>
                <Modal.Title>Contact Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                {isLoading ? (
                    <div className="text-center p-4">
                        <div className="spinner-border text-primary" role="status" />
                    </div>
                ) : (
                    <>
                        <ul className="nav nav-tabs">
                            {(['Overview', 'Projects', 'Communications'] as TabType[]).map(tab => (
                                <li className="nav-item" key={tab}>
                                    <button 
                                        className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="tab-content p-3">
                            {activeTab === 'Overview' && renderOverviewTab()}
                            {activeTab === 'Projects' && renderProjectsTab()}
                            {activeTab === 'Communications' && renderCommunicationsTab()}
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ContactDetailsModal;