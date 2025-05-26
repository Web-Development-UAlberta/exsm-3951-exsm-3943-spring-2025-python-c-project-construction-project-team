import { useState } from "react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useClientInvoices,
  useCreateClientInvoice,
  useDeleteClientInvoice,
  useUpdateClientInvoice,
} from "../../../../api/projects/children/clientInvoice";
import { useProject } from "../../../../api/projects/useProjectOutput";
import { ClientInvoiceDTO, ProjectOutClientInvoice, ProjectServiceInvoice } from "../../../../api/projects/project.types";

type TransformedInvoice = {
  id: number;
  invoice_number: string;
  date: string;
  amount: number;
  status: string;
  due_date: string;
};

const Invoices = ({ projectId, instance }: { projectId: bigint; instance: IPublicClientApplication }) => {
  const { data: project } = useProject(projectId, instance);
  const { data: clientInvoices = [] } = useClientInvoices(projectId, instance);

  const createInvoice = useCreateClientInvoice(projectId, instance);
  const updateInvoice = useUpdateClientInvoice(instance);
  const deleteInvoice = useDeleteClientInvoice(instance);

  const [showModal, setShowModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState<ProjectOutClientInvoice | null>(null);
  const [formData, setFormData] = useState({
    invoice_number: '',
    date: '',
    amount: 0,
    due_date: '',
    status: 'Draft'
  });

  const handleEditFromTransformed = (invoice: TransformedInvoice) => {
  setEditInvoice(null); // clear reference to original object
  setFormData({
    invoice_number: invoice.invoice_number,
    date: invoice.date,
    amount: invoice.amount,
    due_date: invoice.due_date,
    status: invoice.status
  });
  setShowModal(true);
};

  const handleSubmit = () => {
  const invoiceDto: ClientInvoiceDTO = {
    description: formData.invoice_number,
    paid: formData.status === 'Paid' ? new Date().toISOString() : undefined,
    amount: formData.amount
  };

  if (editInvoice) {
    updateInvoice.mutate(
      { projectId, invoiceId: BigInt(editInvoice.id), invoice: invoiceDto },
      {
        onSuccess: () => toast.success("Invoice updated"),
        onError: () => toast.error("Failed to update invoice")
      }
    );
  } else {
    createInvoice.mutate(invoiceDto, {
      onSuccess: () => toast.success("Invoice created"),
      onError: () => toast.error("Failed to create invoice")
    });
  }

  setShowModal(false);
  setEditInvoice(null);
  setFormData({ invoice_number: '', date: '', amount: 0, due_date: '', status: 'Draft' });
};

  const handleDelete = (id: number) => {
    deleteInvoice.mutate({ projectId, invoiceId: BigInt(id) }, {
      onSuccess: () => toast.success("Invoice deleted"),
      onError: () => toast.error("Failed to delete invoice")
    });
  };

  const handleSend = (invoiceId: number) => {
    toast.info(`Sending invoice #${invoiceId} to client...`);
  };

  const renderInvoiceTable = (invoices: TransformedInvoice[], title: string) => (
  <>
    <h6 className="mt-4 mb-3">{title}</h6>
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
                <span className={`badge ${
                  invoice.status === 'Paid' ? 'bg-success' :
                  invoice.status === 'Pending' ? 'bg-warning' : 'bg-secondary'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td>{invoice.due_date}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary me-2" title="Edit" onClick={() => handleEditFromTransformed(invoice)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-sm btn-outline-primary me-2" title="Send to Client" onClick={() => handleSend(invoice.id)}>
                  <i className="bi bi-send"></i>
                </button>
                <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => handleDelete(invoice.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-4">
          <h5 className="card-title">Project Invoices</h5>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"></i> Create Invoice
          </button>
        </div>

        {renderInvoiceTable(
  clientInvoices.map((invoice): TransformedInvoice => ({
    id: invoice.id,
    invoice_number: invoice.description ?? `INV-${invoice.id}`,
    date: invoice.createdTimestamp?.split("T")[0] ?? "N/A",
    amount: invoice.amount ?? 0,
    status: invoice.paid ? "Paid" : "Pending",
    due_date: invoice.createdTimestamp?.split("T")[0] ?? "N/A"
  })),
  "Client Invoices"
)}

        {project?.projectServices?.map((service) => (
          <div key={service.id}>
            {renderInvoiceTable(
              service.projectServiceInvoices.map((inv: ProjectServiceInvoice) => ({
                ...inv,
                invoice_number: `SERV-${inv.id}`,
                date: inv.createdTimeStamp,
                due_date: inv.createdTimeStamp,
                status: inv.paid ? "Paid" : "Unpaid",
                amount: inv.amount
              })),
              `Service: ${service.name}`
            )}
          </div>
        ))}

        {showModal && (
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editInvoice ? "Edit Invoice" : "Create Invoice"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Invoice Number"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                  />
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  />
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>Draft</option>
                    <option>Pending</option>
                    <option>Paid</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;