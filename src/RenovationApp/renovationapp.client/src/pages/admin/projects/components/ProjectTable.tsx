import { ProjectOutputDTO } from '../../../../api/projects/project.types';
import { getProjectStatusBadgeClass } from '../../../../utils/getStatusBadgeClass';
import { projectManagers } from '../../projects/Projects';

interface ProjectTableProps {
  rows: ProjectOutputDTO[];
  title: string;
  onProjectManagerChange: (projectId: number, managerId: string) => void;
  onView: (projectId: number) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ 
  rows, 
  title, 
  onProjectManagerChange,
  onView
}) => {
  return (
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
              <tr key={project.id.toString()}>
                <td>{project.id.toString()}</td>
                <td>{project.renovationType}</td>
                <td>{project.clientId || 'Unknown'}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={project.createdByEmployee ?? ''}
                    onChange={e => onProjectManagerChange(project.id, e.target.value)}
                  >
                    {projectManagers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
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
                    onClick={() => onView(project.id)}
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
};