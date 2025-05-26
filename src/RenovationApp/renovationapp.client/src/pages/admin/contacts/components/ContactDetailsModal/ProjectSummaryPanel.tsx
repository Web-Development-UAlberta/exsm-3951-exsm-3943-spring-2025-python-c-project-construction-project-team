import { ClientDetailsResponse } from '../../../../../api/clients/client.types';

interface ProjectSummaryPanelProps {
    clientDetails: ClientDetailsResponse | undefined;
}

const ProjectSummaryPanel = ({ clientDetails }: ProjectSummaryPanelProps) => {
    // Calculate project statistics
    const totalProjects = clientDetails?.projects?.length || 0;
    const activeProjects = clientDetails?.projects?.filter(p => 
        p.status !== 'Completed' && p.status !== 'Cancelled'
    ).length || 0;
    const completedProjects = clientDetails?.projects?.filter(p => 
        p.status === 'Completed'
    ).length || 0;

    // Get status color helper
    const getStatusColor = (status?: string) => {
        switch(status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'in progress': case 'active': return 'primary';
            case 'on hold': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    // Get active projects
    const activeProjectsList = clientDetails?.projects?.filter(
        project => project.status !== 'Completed' && project.status !== 'Cancelled'
    ) || [];

    // Get recently completed projects
    const recentlyCompletedProjects = clientDetails?.projects?.filter(
        project => project.status === 'Completed'
    ).slice(0, 2) || [];

    return (
        <div className="col-md-6">
            <h6 className="border-bottom pb-2 mb-3">Project Overview</h6>
            
            {/* Quick Stats Row */}
            <div className="row mb-3">
                <div className="col-4">
                    <div className="card bg-secondary text-white text-center">
                        <div className="card-body py-2">
                            <h5 className="mb-0">{totalProjects}</h5>
                            <small>Total Projects</small>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card bg-primary text-white text-center">
                        <div className="card-body py-2">
                            <h5 className="mb-0">{activeProjects}</h5>
                            <small>Active</small>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card bg-success text-white text-center">
                        <div className="card-body py-2">
                            <h5 className="mb-0">{completedProjects}</h5>
                            <small>Completed</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current/Active Projects List */}
            <div className="current-projects" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <h6 className="text-muted mb-2">Current Projects</h6>
                
                {activeProjectsList.map(project => (
                    <div key={project.id} className="card mb-2">
                        <div className="card-body py-2">
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="mb-0">Project #{project.id}</h6>
                                        <span className={`badge bg-${getStatusColor(project.status)}`}>
                                            {project.status || 'Unknown'}
                                        </span>
                                    </div>
                                    <p className="text-muted mb-1 small">
                                        <i className="bi bi-hammer me-1"></i>
                                        {project.renovationType || 'General Renovation'}
                                    </p>
                                    <p className="text-muted mb-0 small">
                                        <i className="bi bi-calendar me-1"></i>
                                        Started: {new Date(project.createdTimestamp).toLocaleDateString()}
                                    </p>
                                    {project.quoteScheduleEndOverride && (
                                        <p className="text-info mb-0 small">
                                            <i className="bi bi-clock me-1"></i>
                                            Due: {new Date(project.quoteScheduleEndOverride).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* If no active projects */}
                {activeProjectsList.length === 0 && (
                    <div className="text-center text-muted py-3">
                        <i className="bi bi-check-circle display-6 opacity-25"></i>
                        <p className="mt-2">No active projects</p>
                    </div>
                )}

                {/* Recent Completed Projects */}
                {completedProjects > 0 && (
                    <>
                        <h6 className="text-muted mb-2 mt-3">Recently Completed</h6>
                        {recentlyCompletedProjects.map(project => (
                            <div key={project.id} className="card mb-2">
                                <div className="card-body py-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">Project #{project.id}</h6>
                                            <p className="text-muted mb-0 small">
                                                <i className="bi bi-hammer me-1"></i>
                                                {project.renovationType || 'General Renovation'}
                                            </p>
                                        </div>
                                        <span className="badge bg-success">
                                            <i className="bi bi-check-lg me-1"></i>
                                            Completed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectSummaryPanel;