// SalesForm.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoicePreview from './InvoicePreview';
import html2pdf from 'html2pdf.js';

const SalesForm = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [savedSaleId, setSavedSaleId] = useState(null);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerContact, setNewCustomerContact] = useState('');
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("vendorToken");
        const res1 = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const res2 = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/customers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res1.data);
        setCustomers(res2.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (saleItems.length > 0 || customerId) {
      setInvoiceNo('#' + Math.floor(100000 + Math.random() * 900000));
      const total = saleItems.reduce((acc, item) => {
        const product = products.find(p => p._id === item.product);
        return acc + (product ? product.price * item.quantity : 0);
      }, 0);
      setTotalAmount(total);
    }
  }, [saleItems, customerId, products]);

  const addItem = (productId) => {
    const existing = saleItems.find(item => item.product === productId);
    if (existing) {
      setSaleItems(saleItems.map(item =>
        item.product === productId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSaleItems([...saleItems, { product: productId, quantity: 1 }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (!customerId && (!newCustomerName.trim() || !newCustomerAddress.trim() || !newCustomerContact.trim())) ||
      saleItems.length === 0
    ) {
      toast.error("Please complete customer details and add at least one product.");
      return;
    }

    try {
      let finalCustomerId = customerId;
      if (!finalCustomerId) {
        const newCustomer = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/customers`, {
          name: newCustomerName.trim(),
          address: newCustomerAddress.trim(),
          contact: newCustomerContact.trim()
        });
        finalCustomerId = newCustomer.data._id;
      }
      const token = localStorage.getItem("vendorToken");
      const saleRes = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/sales`,
        {
          customer: finalCustomerId,
          items: saleItems
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSavedSaleId(saleRes.data._id);
      setShowModal(true);
      toast.success("Sale saved successfully!");
    } catch (err) {
      console.error('Error saving sale:', err);
      toast.error("Failed to save sale.");
    }
  };

  const handleAddLedger = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/ledger`, {
        sale: savedSaleId,
        customer: customerId,
        total: totalAmount,
        products: saleItems.map(item => item.product),
      });
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      const ledgerRes = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/ledger`, {
        sale: savedSaleId,
        customer: customerId,
        total: totalAmount,
        products: saleItems.map(item => item.product),
      });

      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/${ledgerRes.data._id}/pay`);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
    }
  };

  const resetForm = () => {
    setSaleItems([]);
    setCustomerId('');
    setSavedSaleId(null);
    setTotalAmount(0);
    setNewCustomerName('');
    setNewCustomerAddress('');
    setNewCustomerContact('');
  };

  const handleGeneratePDF = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.3,
      filename: `Invoice_${invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const selectedCustomer = customerId
    ? customers.find(c => c._id === customerId)
    : {
        name: newCustomerName,
        contact: newCustomerContact,
        address: newCustomerAddress,
      };

  return (
    <div className="container py-5">
  <div className="bg-white shadow-lg rounded-4 p-5">
    <h2 className="text-center text-primary mb-4 fw-bold border-bottom pb-3">
      🧾 Sales Billing Form
    </h2>

    <form onSubmit={handleSubmit} className="row g-4">
      <div className="col-md-6">
        <label className="form-label fw-semibold text-secondary">Select Existing Customer</label>
        <Select
          options={customers.map(c => ({
            value: c._id,
            label: `${c.name} - ${c.contact}`
          }))}
          onChange={option => {
            setCustomerId(option ? option.value : '');
            setNewCustomerName('');
          }}
          placeholder="🔍 Search customer..."
          isClearable
          className="shadow-sm"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label fw-semibold text-secondary">New Customer Name</label>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="👤 Enter name"
          value={newCustomerName}
          onChange={e => {
            setNewCustomerName(e.target.value);
            setCustomerId('');
          }}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label fw-semibold text-secondary">Contact Number</label>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="📞 Enter contact"
          value={newCustomerContact}
          onChange={e => setNewCustomerContact(e.target.value)}
        />
      </div>

      <div className="col-md-6">
        <label className="form-label fw-semibold text-secondary">Customer Address</label>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="🏠 Enter address"
          value={newCustomerAddress}
          onChange={e => setNewCustomerAddress(e.target.value)}
        />
      </div>

      <div className="col-md-12">
        <label className="form-label fw-semibold text-secondary">Select Product</label>
        <Select
          options={products.map(p => ({
            value: p._id,
            label: `${p.name} (₹${p.price})`
          }))}
          onChange={option => addItem(option.value)}
          placeholder="🛒 Type to search product"
          isClearable
          className="shadow-sm"
        />
      </div>
    </form>

    {saleItems.length > 0 && (
      <div className="mt-5">
        <h5 className="text-dark fw-bold mb-3">🧾 Selected Products</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
                <th>❌</th>
              </tr>
            </thead>
            <tbody>
              {saleItems.map((item, index) => {
                const product = products.find(p => p._id === item.product);
                if (!product) return null;

                return (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 1;
                          const updatedItems = [...saleItems];
                          updatedItems[index].quantity = newQty;
                          setSaleItems(updatedItems);
                        }}
                        className="form-control form-control-sm mx-auto shadow-sm"
                        style={{ width: '70px' }}
                      />
                    </td>
                    <td>₹{product.price}</td>
                    <td>₹{(product.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          const updatedItems = saleItems.filter((_, i) => i !== index);
                          setSaleItems(updatedItems);
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}

    <div className="mt-5 bg-light rounded p-4 border">
      <h5 className="text-primary fw-bold mb-3">🧾 Invoice Preview</h5>
      <InvoicePreview
        customer={selectedCustomer || {}}
        saleItems={saleItems}
        products={products}
        invoiceNo={invoiceNo}
        totalAmount={totalAmount}
      />
    </div>

    <div style={{ display: 'none' }}>
      <InvoicePreview
        ref={componentRef}
        customer={selectedCustomer || {}}
        saleItems={saleItems}
        products={products}
        invoiceNo={invoiceNo}
        totalAmount={totalAmount}
      />
    </div>

    <div className="mt-4 d-flex flex-wrap gap-3 justify-content-center">
      <button type="submit" onClick={handleSubmit} className="btn btn-success px-4 fw-bold">
        💾 Save Sale
      </button>
      <button type="button" onClick={handleGeneratePDF} className="btn btn-outline-primary px-4 fw-bold">
        📄 Download Invoice
      </button>
    </div>
  </div>

  {/* Modal */}
  {showModal && (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg rounded-4">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Select Ledger Option</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body text-center">
              <p className="text-secondary">What would you like to do with this sale?</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button onClick={handleAddLedger} className="btn btn-outline-primary px-4">
                ➕ Add to Ledger
              </button>
              <button onClick={handleMarkAsPaid} className="btn btn-success px-4">
                ✅ Mark as Paid
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )}

  <ToastContainer position="top-center" autoClose={2000} />
</div>

  );
};

export default SalesForm;
