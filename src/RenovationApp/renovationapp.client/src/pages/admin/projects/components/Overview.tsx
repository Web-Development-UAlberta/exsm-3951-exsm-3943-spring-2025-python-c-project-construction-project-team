import { useState, useEffect } from "react";
import { IPublicClientApplication } from "@azure/msal-browser";
import {
  useProjectComments,
  useCreateProjectComment
} from "../../../../api/projects/children/projectComment";
import {
  useProjectTasks,
  useCreateProjectTask,
  useUpdateProjectTask
} from "../../../../api/projects/children/projectTask";
import {
  useProject,
  useUpdateProject
} from "../../../../api/projects/useProjectOutput";
import "react-toastify/dist/ReactToastify.css";
import { ProjectOutputDTO } from "../../../../api/projects/project.types";

type Props = {
  projectId: bigint;
  instance: IPublicClientApplication;
};

const Overview = ({ projectId, instance }: Props) => {
  const [noteInput, setNoteInput] = useState('');
  const [taskLabel, setTaskLabel] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [status, setStatus] = useState('');

  const { data: projectData, isLoading: projectLoading } = useProject(projectId, instance);
  const project: ProjectOutputDTO | undefined = projectData;

  const updateProject = useUpdateProject(instance);
  const { data: notes = [], isLoading: notesLoading } = useProjectComments(BigInt(projectId), instance);
  const createNote = useCreateProjectComment(BigInt(projectId), instance);
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(BigInt(projectId), instance);
  const createTask = useCreateProjectTask(BigInt(projectId), instance);
  const updateTask = useUpdateProjectTask(instance);

  useEffect(() => {
    if (project?.status) {
      setStatus(project.status);
    }
  }, [project?.status]);

  const handleAddNote = () => {
    if (noteInput.trim()) {
      createNote.mutate({ comment: noteInput.trim() });
      setNoteInput('');
      setShowNoteInput(false);
    }
  };

  const handleAddTask = () => {
    if (taskLabel.trim()) {
      createTask.mutate({
        description: taskDescription.trim(),
        completed: false,
      });
      setTaskLabel('');
      setTaskDescription('');
      setShowTaskInput(false);
    }
  };

  const handleToggleTaskCompletion = (taskId: bigint, currentStatus: boolean) => {
    updateTask.mutate({
      projectId: BigInt(projectId),
      taskId,
      task: {
        status: currentStatus ? "Pending" : "Completed"}    });
  };

  const handleStatusSave = () => {
    updateProject.mutate({ id: projectId, data: { status } });
  };

  if (projectLoading && !projectData) return <p>Loading project...</p>;

  return (
    <div className="row">
      <div className="col-md-8">
        {/* Project Details */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Project Details</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold">Status:</label>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select form-select-sm"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option>Created</option>
                      <option>On Holding</option>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <button className="btn btn-sm btn-outline-primary" onClick={handleStatusSave}>
                      Save
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="fw-bold">Start Date:</label>
                  <span className="ms-2">{project?.quoteScheduleStartOverride ?? "N/A"}</span>
                </div>
                <div className="mb-3">
                  <label className="fw-bold">End Date:</label>
                  <span className="ms-2">{project?.quoteScheduleEndOverride ?? "N/A"}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold">Project Manager:</label>
                  <span className="ms-2">{project?.createdByEmployee ?? "N/A"}</span>
                </div>
                <div>
                  <label className="fw-bold">Project Address:</label>
                  <address className="mb-0 mt-1">
                    {project?.projectAddress?.street}<br />
                    {project?.projectAddress?.city}, {project?.projectAddress?.province} {project?.projectAddress?.postalCode}<br />
                    {project?.projectAddress?.country}
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Contact Details</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="fw-bold">Client:</label>
                  <span className="ms-2">{project?.client?.name}</span>
                </div>
                <div className="mb-3">
                  <label className="fw-bold">Email:</label>
                  <span className="ms-2">{project?.client?.email}</span>
                </div>
                <div className="mb-3">
                  <label className="fw-bold">Phone Number:</label>
                  <span className="ms-2">{project?.client?.phone}</span>
                </div>
              </div>
              <div className="col-md-6">
                <label className="fw-bold">Address:</label>
                <address className="mb-0 mt-1">
                  {project?.client?.address?.street}<br />
                  {project?.client?.address?.city}, {project?.client?.address?.province} {project?.client?.address?.postalCode}<br />
                  {project?.client?.address?.country}
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5 className="card-title">Notes</h5>
              <button className="btn btn-outline-secondary" onClick={() => setShowNoteInput(true)}>
                <i className="bi bi-plus fs-4"></i>
              </button>
            </div>

            {showNoteInput && (
              <div className="my-4">
                <textarea
                  className="form-control mb-3"
                  rows={3}
                  placeholder="Add a note"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary" onClick={() => setShowNoteInput(false)}>Cancel</button>
                  <button className="btn btn-secondary" onClick={handleAddNote}>Add Note</button>
                </div>
              </div>
            )}

            {notesLoading ? (
              <p>Loading notes...</p>
            ) : (
              notes.map((note, index) => (
                <div key={index} className="mb-2">
                  <p className="mb-1">{note.comment}</p>
                  <small className="text-muted">Added on {new Date(note.createdTimestamp).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5 className="card-title">Tasks</h5>
              <button className="btn btn-outline-secondary" onClick={() => setShowTaskInput(true)}>
                <i className="bi bi-plus fs-4"></i>
              </button>
            </div>

            {showTaskInput && (
              <div className="my-4">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Task name"
                  value={taskLabel}
                  onChange={(e) => setTaskLabel(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Task description"
                  value={taskDescription}
                  rows={2}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary" onClick={() => setShowTaskInput(false)}>Cancel</button>
                  <button className="btn btn-secondary" onClick={handleAddTask}>Add Task</button>
                </div>
              </div>
            )}

            {tasksLoading ? (
              <p>Loading tasks...</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={task.status === "Completed"}
                      onChange={() => handleToggleTaskCompletion(BigInt(task.id), task.status === "Completed")}
                    />
                    <label className="form-check-label">
                      <div>
                        <small className="text-muted">{task.description}</small>
                      </div>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;