const Files = () => {
    //mock data:
    const files = [
        {
            id: 1,
            name: "project_plan.pdf",
            type: "PDF",
            size: "2.3 MB",
            uploaded_date: "01/05/2025",
            uploaded_by: "John Doe"
        },
        {
            id: 2,
            name: "measurements.xlsx",
            type: "Excel",
            size: "1.5 MB",
            uploaded_date: "01/07/2025",
            uploaded_by: "Manager Name"
        },
        {
            id: 3,
            name: "site_photos.zip",
            type: "Archive",
            size: "15.2 MB",
            uploaded_date: "01/10/2025",
            uploaded_by: "Manager Name"
        }
    ]

    
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-4">
                    <h5 className="card-title">Project Files</h5>
                    <button className="btn btn-primary">
                        <i className="bi bi-upload me-1"></i> Upload File
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th>File Name</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Uploaded Date</th>
                                <th>Uploaded By</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.id}>
                                    <td>{file.name}</td>
                                    <td>{file.type}</td>
                                    <td>{file.size}</td>
                                    <td>{file.uploaded_date}</td>
                                    <td>{file.uploaded_by}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-secondary me-2">
                                            <i className="bi bi-download"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Files