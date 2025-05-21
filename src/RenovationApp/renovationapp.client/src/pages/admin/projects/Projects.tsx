import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { getProjectStatusBadgeClass } from '../../../utils/getStatusBadgeClass';
import { useProjects } from '../../../api/projects/useProjectOutput';
import { ProjectOutputDTO } from '../../../api/projects/project.types';

const projectManagers = ['Name', 'Mike Smith', 'Sarah Johnson', 'Alex Wong', 'Emily Davis'];

const Projects = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const { data: projects = [], isLoading, isError, error } = useProjects(instance);
  const [localProjects, setLocalProjects] = useState<ProjectOutputDTO[]>([]);

  // Update localProjects only after API fetch
  useState(() => {
    if (projects.length > 0) setLocalProjects(projects);
  });

  const handleProjectManagerChange = (projectId: number, newManager: string) => {
    setLocalProjects(prev =>
      prev.map(project =>
        project.id === projectId ? { ...project, createdByEmployee: newManager } : project
      )
    );
  };

  if (isLoading) return <p>Loading projects...</p>;
  if (isError)
    return (
      <div className="alert alert-danger" role="alert">
        Failed to load projects. {error instanceof Error ? error.message : 'Try again later.'}
      </div>
    );
  if (projects.length === 0)
    return (
      <div className="alert alert-warning" role="alert">
        No projects found.
      </div>
    );

  const ongoing = localProjects.filter(p => p.status === 'In Progress');
  const completed = localProjects.filter(p => p.status === 'Completed');
  const cancelled = localProjects.filter(p => p.status === 'Cancelled');

  const renderTable = (rows: ProjectOutputDTO[], title: string) => (
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
            {rows.map(project => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.renovationType ?? 'Untitled'}</td>
                <td>{project.client?.name ?? 'Unknown'}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={project.createdByEmployee ?? ''}
                    onChange={e => handleProjectManagerChange(project.id, e.target.value)}
                  >
                    {projectManagers.map((manager, i) => (
                      <option key={i} value={manager}>{manager}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`badge ${getProjectStatusBadgeClass(project.status ?? '')}`}>
                    {project.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => navigate(`/admin/projects/${project.id}`)}
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

  return (
    <div className="p-4">
      <h3 className="mb-3">Project Management Dashboard</h3>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card"><div className="card-body text-center">
            <h2>{localProjects.length}</h2>
            <p>Total Projects</p>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card"><div className="card-body text-center">
            <h2>{ongoing.length}</h2>
            <p>In Progress</p>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card"><div className="card-body text-center">
            <h2>{completed.length}</h2>
            <p>Completed</p>
          </div></div>
        </div>
        <div className="col-md-3">
          <div className="card"><div className="card-body text-center">
            <h2>{cancelled.length}</h2>
            <p>Cancelled</p>
          </div></div>
        </div>
      </div>

      {renderTable(ongoing, 'Ongoing Projects')}
      {renderTable(localProjects, 'All Projects')}
    </div>
  );
};

export default Projects;