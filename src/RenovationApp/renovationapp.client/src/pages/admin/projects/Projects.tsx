import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useProjects } from '../../../api/projects/useProjectOutput';
import { useUpdateProject } from '../../../api/projects/useProjectOutput';
import { ProjectTable } from './components/ProjectTable';

interface ProjectManager {
  id: string;
  name: string;
  email: string;
}

export const projectManagers: ProjectManager[] = [
  {
    id: '2caf9d13-45db-4960-8a81-a4ffb48dc8f3',
    name: 'Clarisse Buniel',
    email: 'buniel@ualberta.ca'
  },
  {
    id: '3a40d159-f5b2-4740-9fd2-c7da499d5daa',
    name: 'David Rochefort',
    email: 'drochefo+bob@ualberta.ca'
  },
  {
    id: 'c701d842-5da1-44b2-8783-eb6d9696b314',
    name: 'Nina Shi',
    email: 'sxjdehj@163.com'
  }
];

const Projects = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const { data: projects = [], isLoading, isError, error } = useProjects(instance);
  const updateProject = useUpdateProject(instance);

  const handleProjectManagerChange = (projectId: number, managerId: string) => {
    updateProject.mutate({
      id: projectId,
      data: { createdByEmployee: managerId }
    });
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

  const ongoing = projects.filter(p => p.status === 'In Progress');
  const completed = projects.filter(p => p.status === 'Completed');
  const cancelled = projects.filter(p => p.status === 'Cancelled');

  return (
    <div className="p-4">
      <h3 className="mb-3">Project Management Dashboard</h3>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card"><div className="card-body text-center">
            <h2>{projects.length}</h2>
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

      <ProjectTable 
        rows={ongoing} 
        title="Ongoing Projects" 
        onProjectManagerChange={handleProjectManagerChange}
        onView={(projectId) => navigate(`/admin/projects/${projectId}`)}
      />
      
      <ProjectTable 
        rows={projects} 
        title="All Projects" 
        onProjectManagerChange={handleProjectManagerChange}
        onView={(projectId) => navigate(`/admin/projects/${projectId}`)}
      />
    </div>
  );
};

export default Projects;