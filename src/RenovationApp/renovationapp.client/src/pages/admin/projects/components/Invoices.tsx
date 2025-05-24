// mock data
const invoices = [
    {
        id: 1,
        invoice_number: "INV-2025-001",
        date: "01/15/2025",
        amount: 2500.00,
        status: "Paid",
        due_date: "01/30/2025"
    },
    {
        id: 2,
        invoice_number: "INV-2025-002",
        date: "02/01/2025",
        amount: 3750.00,
        status: "Pending",
        due_date: "02/15/2025"
    },
    {
        id: 3,
        invoice_number: "INV-2025-003",
        date: "02/15/2025",
        amount: 5000.00,
        status: "Draft",
        due_date: "03/01/2025"
    }
]
const Invoices = () => {
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-4">
                    <h5 className="card-title">Project Invoices</h5>
                    <button className="btn btn-primary">
                        <i className="bi bi-plus-lg me-1"></i> Create Invoice
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th>Invoice #</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Due Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{invoice.invoice_number}</td>
                                    <td>{invoice.date}</td>
                                    <td>${invoice.amount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${invoice.status === 'Paid' ? 'bg-success' :
                                            invoice.status === 'Pending' ? 'bg-warning' :
                                                'bg-secondary'
                                            }`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td>{invoice.due_date}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-secondary me-2">
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-primary me-2">
                                            <i className="bi bi-printer"></i>
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


export default Invoices