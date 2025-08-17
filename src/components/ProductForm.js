import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', weight: '', expiryDate: '', manufacturingDate: '' });
  const [editForm, setEditForm] = useState({ name: '', quantity: '', price: '', weight: '', expiryDate: '', manufacturingDate: '', barcode: '' });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const barcodeRefs = useRef({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("vendorToken");
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
      setTimeout(() => {
        res.data.forEach((p) => generateBarcodes(p._id, p.quantity));
      }, 100);
    } catch (err) {
      console.error('Error while fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateBarcodes = (id, quantity) => {
    for (let i = 0; i < quantity; i++) {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, id.toString(), {
        format: "CODE128",
        displayValue: false,
        width: 1,
        height: 20,
        margin: 0,
      });
      barcodeRefs.current[`${id}-${i}`] = canvas;
    }
  };

const generatePDFWithBarcodes = (product) => {
  const pdf = new jsPDF();
  const barcodeWidth = 80;
  const barcodeHeight = 25;
  const labelHeight = 60;
  const marginX = 15;
  const marginY = 10;

  const labelsPerRow = 2;
  const rowsPerPage = 5;

  const startX = 20;
  const startY = 20;

  let x = startX;
  let y = startY;
  let count = 0;

  for (let i = 0; i < product.quantity; i++) {
    const canvas = barcodeRefs.current[`${product._id}-${i}`];
    if (!canvas) continue;

    const imgData = canvas.toDataURL("image/png");

    // Product Name
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(`Product Name: ${product.name}`, x, y);

    // Product Info 
    pdf.setFontSize(9);
    let textY = y;

    if (product.manufacturingDate) {
      textY += 5;
      pdf.setFont("helvetica", "bold");
      pdf.text("MFG:", x, textY);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${new Date(product.manufacturingDate).toLocaleDateString('en-IN')}`, x + 20, textY);
    }

    if (product.expiryDate) {
      textY += 5;
      pdf.setFont("helvetica", "bold");
      pdf.text("EXP:", x, textY);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${new Date(product.expiryDate).toLocaleDateString('en-IN')}`, x + 20, textY);
    }

    if (product.price) {
      textY += 5;
      pdf.setFont("helvetica", "bold");
      pdf.text("MRP:", x, textY);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${product.price}`, x + 20, textY);
    }

    // Barcode
    pdf.addImage(imgData, "PNG", x, textY + 5, barcodeWidth, barcodeHeight);

    count++;

    // Layout positioning
    if (count % labelsPerRow === 0) {
      x = startX;
      y += labelHeight + marginY;
    } else {
      x += barcodeWidth + marginX;
    }

    // New page if full
    if (count % (labelsPerRow * rowsPerPage) === 0 && i !== product.quantity - 1) {
      pdf.addPage();
      x = startX;
      y = startY;
    }
  }

  pdf.save(`${product.name}_barcodes.pdf`);
};

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, quantity, price } = form;
    if (!name.trim() || quantity <= 0 || price <= 0) return;

    try {
      const token = localStorage.getItem("vendorToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        {
          ...form,
          name: name.trim(),
          quantity: Number(quantity),
          price: Number(price),
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setForm({ name: '', quantity: '', price: '', weight: '', expiryDate: '', manufacturingDate: '' });
      fetchProducts();
      toast.success('Product added successfully');
    } catch (err) {
      console.error('Error while adding product:', err);
      toast.error('Failed to add product');
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditForm({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      weight: product.weight || '',
      expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : '',
      manufacturingDate: product.manufacturingDate ? product.manufacturingDate.split('T')[0] : '',
      barcode: product._id,
    });
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    const { name, quantity, price } = editForm;
    if (!name.trim() || quantity <= 0 || price <= 0) return;

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/products/${editId}`, editForm);
      fetchProducts();
      setShowModal(false);
      setEditId(null);
      toast.success('Product updated successfully');
    } catch (err) {
      console.error('Error editing product:', err);
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`);
        fetchProducts();
        toast.info('Product deleted');
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2 className="text-center mb-4 text-primary fw-bold">🛍 Add Product</h2>

      <form onSubmit={handleSubmit} className="p-4 border rounded-4 shadow-lg bg-white mb-5">
        <h5 className="mb-3 pb-2 border-bottom text-dark fw-semibold">Product Details</h5>
        <div className="row g-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Product Name</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Choco Muffin" required />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Quantity</label>
            <input type="number" className="form-control" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 12" required />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Price (₹)</label>
            <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 60" required />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Weight</label>
            <input type="text" className="form-control" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 250g" />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Manufacturing Date</label>
            <input type="date" className="form-control" name="manufacturingDate" value={form.manufacturingDate} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Expiry Date</label>
            <input type="date" className="form-control" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
          </div>
          <div className="col-12 text-end mt-2">
            <button className="btn btn-success px-4" type="submit">Save Product</button>
          </div>
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center gap-3 mb-4">
        <input type="text" className="form-control shadow-sm" value={searchQuery} onChange={handleSearchChange} placeholder="🔍 Search Products..." />
      </div>

      <h4 className="text-center mb-3 fw-bold text-dark">📦 Product List</h4>
      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Weight</th>
                <th>Barcode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>{p.price}</td>
                  <td>{p.weight}</td>
                  <td>
                    <button className="btn btn-outline-success btn-sm" onClick={() => generatePDFWithBarcodes(p)}>
                      📄 PDF
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3"><label className="form-label">Name</label><input type="text" className="form-control" name="name" value={editForm.name} onChange={handleEditChange} /></div>
          <div className="mb-3"><label className="form-label">Quantity</label><input type="number" className="form-control" name="quantity" value={editForm.quantity} onChange={handleEditChange} /></div>
          <div className="mb-3"><label className="form-label">Price</label><input type="number" className="form-control" name="price" value={editForm.price} onChange={handleEditChange} /></div>
          <div className="mb-3"><label className="form-label">Weight</label><input type="text" className="form-control" name="weight" value={editForm.weight} onChange={handleEditChange} /></div>
          <div className="mb-3"><label className="form-label">Expiry Date</label><input type="date" className="form-control" name="expiryDate" value={editForm.expiryDate} onChange={handleEditChange} /></div>
          <div className="mb-3"><label className="form-label">Manufacturing Date</label><input type="date" className="form-control" name="manufacturingDate" value={editForm.manufacturingDate} onChange={handleEditChange} /></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductForm;
