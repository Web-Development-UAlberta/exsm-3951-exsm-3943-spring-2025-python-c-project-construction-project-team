// components/components/QuoteEstimateModal.tsx
import React, { useState, useEffect } from 'react';

interface QuoteItem {
    id: number;
    description: string;
    price: number;
}

interface QuoteDetails {
    companyName: string;
    companyAddress: string;
    companyCity: string;
    clientName: string;
    clientAddress: string;
    clientCity: string;
    quoteNumber: string;
    issueDate: string;
    validUntil: string;
    items: QuoteItem[];
}

interface QuoteEstimateModalProps {
    show: boolean;
    requestId: number | null;
    onClose: () => void;
}

export const QuoteEstimateModal: React.FC<QuoteEstimateModalProps> = ({
    show,
    requestId,
    onClose,
}) => {
    const [quoteDetails, setQuoteDetails] = useState<QuoteDetails>({
        companyName: 'Bob & Susan Renovations',
        companyAddress: '123 Example St',
        companyCity: 'City, Province A2A, 0X0',
        clientName: 'John Doe',
        clientAddress: '99 Maple St',
        clientCity: 'Calgary, Alberta Q1Q 0P0',
        quoteNumber: '',
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        items: [
            { id: 1, description: 'Lorem ipsum dolor sit amet consectetur.', price: 400 }
        ]
    });

    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    // Calculate subtotal and total when items change
    useEffect(() => {
        const newSubtotal = quoteDetails.items.reduce((sum, item) => sum + item.price, 0);
        const newTotal = Math.round(newSubtotal * 1.05); // Example: Adding 5% tax
        setSubtotal(newSubtotal);
        setTotal(newTotal);
    }, [quoteDetails.items]);

    // Add a new item to the quote
    const addItem = () => {
        const newId = quoteDetails.items.length > 0
            ? Math.max(...quoteDetails.items.map(item => item.id)) + 1
            : 1;

        setQuoteDetails({
            ...quoteDetails,
            items: [
                ...quoteDetails.items,
                { id: newId, description: '', price: 0 }
            ]
        });
    };

    // Update an existing item
    const updateItem = (id: number, field: keyof QuoteItem, value: string | number) => {
        setQuoteDetails({
            ...quoteDetails,
            items: quoteDetails.items.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        });
    };

    // Remove an item from the quote
    const removeItem = (id: number) => {
        setQuoteDetails({
            ...quoteDetails,
            items: quoteDetails.items.filter(item => item.id !== id)
        });
    };

    // Handle form field changes
    const handleChange = (field: keyof QuoteDetails, value: string) => {
        setQuoteDetails({
            ...quoteDetails,
            [field]: value
        });
    };

    // Save the quote
    const handleSave = () => {
        console.log("Saved!")
        onClose();
    };

    const handleSend = () => {
        console.log("Sent!")
        onClose();
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">Quote Estimate</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            {/* Company and Client Information */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="fw-bold">{quoteDetails.companyName}</div>
                                    <div>{quoteDetails.companyAddress}</div>
                                    <div>{quoteDetails.companyCity}</div>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <h2 className="mb-4">RENOVATION QUOTE</h2>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="mb-2 fw-bold">Bill To</div>
                                    <div>{quoteDetails.clientName}</div>
                                    <div>{quoteDetails.clientAddress}</div>
                                    <div>{quoteDetails.clientCity}</div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Quote Number</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Number"
                                                value={quoteDetails.quoteNumber}
                                                onChange={(e) => handleChange('quoteNumber', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Issue Date</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={quoteDetails.issueDate}
                                                onChange={(e) => handleChange('issueDate', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <label className="col-sm-4 col-form-label">Valid Until</label>
                                        <div className="col-sm-8">
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={quoteDetails.validUntil}
                                                onChange={(e) => handleChange('validUntil', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quote Items Table */}
                            <div className="table-responsive mb-4">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quoteDetails.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="input-group">
                                                        <span className="input-group-text">$</span>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.price}
                                                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary me-2"
                                                        onClick={() => console.log(`Edit item ${item.id}`)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeItem(item.id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-end mb-4">
                                <button className="btn btn-secondary" onClick={addItem}>
                                    Add Item
                                </button>
                            </div>

                            {/* Quote Summary */}
                            <div className="row mb-4">
                                <div className="col-md-6"></div>
                                <div className="col-md-6">
                                    <div className="row mb-2">
                                        <div className="col-6 text-end">Subtotal</div>
                                        <div className="col-6 text-end">${subtotal}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6 text-end">Total</div>
                                        <div className="col-6 text-end">${total}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer justify-content-between">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleSend}
                            style={{width:160}}
                        >
                            Send To Client
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                            style={{width:160}}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteEstimateModal;