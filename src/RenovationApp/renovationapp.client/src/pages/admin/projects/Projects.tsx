// components/Requests.tsx
import { useState } from 'react';
import { getProjectStatusBadgeClass } from '../../../utils/getStatusBadgeClass';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

// Define the project type based on the columns shown in the design
interface Project {
    id: number;
    project_name: string;
    client_name: string;
    project_manager: string;
    status: string;
}

// Define the project status enum
enum ProjectStatus {
    Created = 'Created',
    InProgress = 'In Progress',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

// Available project managers for dropdown
const projectManagers = ['Name', 'Mike Smith', 'Sarah Johnson', 'Alex Wong', 'Emily Davis'];

// Mock project data 
const allProjects: Project[] = [
    {
        id: 1,
        project_name: 'Project',
        client_name: 'Client Name',
        project_manager: 'Name',
        status: ProjectStatus.Created
    },
    {
        id: 2,
        project_name: 'Project',
        client_name: 'Client Name',
        project_manager: 'Name',
        status: ProjectStatus.Created
    },
    {
        id: 3,
        project_name: 'Project',
        client_name: 'Client Name',
        project_manager: 'Name',
        status: ProjectStatus.Created
    },
    {
        id: 4,
        project_name: 'Project',
        client_name: 'Client Name',
        project_manager: 'Name',
        status: ProjectStatus.InProgress
    },
    {
        id: 5,
        project_name: 'Project',
        client_name: 'Client Name',
        project_manager: 'Name',
        status: ProjectStatus.InProgress
    }
];


const Projects = () => {
    // State for all projects
    const [projects, setProjects] = useState<Project[]>(allProjects);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();

    // Filter projects by status
    const ongoingProjects = projects.filter(project => project.status === ProjectStatus.InProgress);
    const completedProjects = projects.filter(project => project.status === ProjectStatus.Completed);
    const cancelledProjects = projects.filter(project => project.status === ProjectStatus.Cancelled);

    const navigate = useNavigate();

    // Handler for changing project manager
    const handleProjectManagerChange = (projectId: number, newManager: string) => {
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === projectId
                    ? { ...project, project_manager: newManager }
                    : project
            )
        );
    };

    // Render project table
    const renderProjectTable = (projectsToRender: Project[], title: string) => (
        <div className="mt-4">
            <h5 className="mb-3">{title}</h5>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Project</th>
                            <th>Client</th>
                            <th>Project Manager</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectsToRender.map(project => (
                            <tr key={project.id}>
                                <td>{project.id}</td>
                                <td>{project.project_name}</td>
                                <td>{project.client_name}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={project.project_manager}
                                        onChange={(e) => handleProjectManagerChange(project.id, e.target.value)}
                                        aria-label="Project Manager selection"
                                    >
                                        {projectManagers.map((manager, index) => (
                                            <option key={index} value={manager}>{manager}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <span className={`badge ${getProjectStatusBadgeClass(project.status)}`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => { navigate(`/admin/projects/${project.id}`); }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const { instance } = useMsal();

    const activeAccount = instance.getActiveAccount();
    if (!activeAccount) {
        return <p>Please login to proceed.</p>;
    }


    return (
        <div className="p-4">
            <h3 className="mb-3">Project Management Dashboard</h3>

            {/* Dashboard Summary */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="mb-0">{projects.length}</h2>
                            <p className="mb-0">Total Projects</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="mb-0">{ongoingProjects.length}</h2>
                            <p className="mb-0">InProgress</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="mb-0">{completedProjects.length}</h2>
                            <p className="mb-0">Completed</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="mb-0">{cancelledProjects.length}</h2>
                            <p className="mb-0">Cancelled</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* InProgress Projects Table */}
            {renderProjectTable(ongoingProjects, "InProgress Projects")}

            {/* All Projects Table */}
            {renderProjectTable(projects, "All Projects")}

        </div>
    );
};

export default Projects;