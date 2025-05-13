import { useState } from "react";

//mock data

const project = {
    id: 1,
    project_name: "Project Name",
    status: "Quoted",
    project_manager: "Manager Name",
    start_date: "01/01/2025",
    end_date: "03/01/2025",
    project_address: {
        street: "99 Maple St",
        city: "Calgary",
        province: "Alberta",
        postal_code: "Q1Q 0P0",
        country: "Canada"
    },
    client: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "123-456-7890",
        address: {
            street: "99 Maple St",
            city: "Calgary",
            province: "Alberta",
            postal_code: "Q1Q 0P0",
            country: "Canada"
        }
    }
}


const Overview = () => {
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState<any[]>([
        { id: 1, note: "Note a", created: "Jan-01-2025" },
        { id: 1, note: "Note b", created: "Jan-18-2025" }
    ]);
    const [tasks, setTasks] = useState([
        { id: 1, label: "Task Name", description: "Description", completed: true },
        { id: 2, label: "Task Name", description: "Description", completed: true },
        { id: 3, label: "Task Name", description: "Description", completed: true }
    ]);

    const [taskLabel, setTaskLabel] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [showTaskInput, setShowTaskInput] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);

    const handleAddNote = () => {
        if (noteInput.trim()) {
            setNotes([
                ...notes,
                {
                    id: notes.length + 1,
                    note: noteInput.trim(),
                    created: new Date().toLocaleDateString()
                }
            ]);
            setNoteInput('');
            setShowNoteInput(false);
        }
    };

    const handleAddTask = () => {
        if (taskLabel.trim()) {
            setTasks([
                ...tasks,
                {
                    id: tasks.length + 1,
                    label: taskLabel.trim(),
                    description: taskDescription.trim(),
                    completed: false
                }
            ]);
            setTaskLabel('');
            setTaskDescription('');
            setShowTaskInput(false);
        }
    };

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
                                    <div className="d-inline-block ms-2">
                                        <select className="form-select form-select-sm" defaultValue={project.status}>
                                            <option>Created</option>
                                            <option>On Holding</option>
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">Start Date:</label>
                                    <span className="ms-2">{project.start_date}</span>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">End Date:</label>
                                    <span className="ms-2">{project.end_date}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="fw-bold">Project Manager:</label>
                                    <span className="ms-2">{project.project_manager}</span>
                                </div>
                                <div>
                                    <label className="fw-bold">Project Address:</label>
                                    <address className="mb-0 mt-1">
                                        {project.project_address.street}<br />
                                        {project.project_address.city}, {project.project_address.province} {project.project_address.postal_code}<br />
                                        {project.project_address.country}
                                    </address>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">
                            Contact Details
                            <span className="ms-2">
                                <i className="bi bi-envelope"></i>
                                <i className="bi bi-telephone ms-2"></i>
                            </span>
                        </h5>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="fw-bold">Client:</label>
                                    <span className="ms-2">{project.client.name}</span>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">Email:</label>
                                    <span className="ms-2">{project.client.email}</span>
                                </div>
                                <div className="mb-3">
                                    <label className="fw-bold">Phone Number:</label>
                                    <span className="ms-2">{project.client.phone}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div>
                                    <label className="fw-bold">Address:</label>
                                    <address className="mb-0 mt-1">
                                        {project.client.address.street}<br />
                                        {project.client.address.city}, {project.client.address.province} {project.client.address.postal_code}<br />
                                        {project.client.address.country}
                                    </address>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="card">
                    <div className="card-body">

                        <div className="d-flex justify-content-between">
                            <h5 className="card-title">Notes</h5>
                            <button className="btn btn-outline-secondary" style={{ padding: "0px 4px" }} onClick={() => setShowNoteInput(true)}>
                                <i className="bi bi-plus fs-4"></i>
                            </button>
                        </div>

                        {/* Inline Note Add Form */}
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
                                    <button className="btn btn-outline-secondary" onClick={() => setShowNoteInput(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleAddNote}>
                                        Add Note
                                    </button>
                                </div>
                            </div>
                        )}

                        {notes.length > 0 && (
                            <div className="mt-3">
                                {notes.map((note, index) => (
                                    <div key={index} className=" mb-2">
                                        <p className="mb-1">{note.note}</p>
                                        <small className="text-muted">
                                            Added on {note.created}
                                        </small>
                                    </div>
                                ))}
                            </div>
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
                            <button className="btn btn-outline-secondary" style={{ padding: "0px 4px" }} onClick={() => setShowTaskInput(true)}>
                                <i className="bi bi-plus fs-4"></i>
                            </button>
                        </div>

                        {/* Inline Task Add Form */}
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
                                    <button className="btn btn-outline-secondary" onClick={() => setShowTaskInput(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleAddTask}>
                                        Add Task
                                    </button>
                                </div>
                            </div>
                        )}

                        {tasks.map((task) => (
                            <div key={task.id} className="mb-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`task-${task.id}`}
                                        defaultChecked={task.completed}
                                    />
                                    <label className="form-check-label" htmlFor={`task-${task.id}`}>
                                        <div>{task.label}</div>
                                        <small className="text-muted">{task.description}</small>
                                    </label>
                                </div>
                            </div>
                        ))}


                    </div>
                </div>
            </div>
        </div>
    )
}


export default Overview