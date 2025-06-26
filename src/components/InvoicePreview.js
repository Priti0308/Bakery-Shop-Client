import React, { forwardRef } from 'react';
import qrCodeBase64 from '../components/assets/img.jpeg';

const InvoicePreview = forwardRef(
  ({ customer = {}, saleItems = [], products = [], invoiceNo = '', totalAmount = 0 }, ref) => {
    const total = saleItems.reduce((sum, item) => {
      const product = products.find(p => p._id === item.product);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const currentDate = new Date().toLocaleDateString();

    return (
      <div
        ref={ref}
        className="p-5 bg-white border rounded"
        style={{
          fontFamily: 'Segoe UI, sans-serif',
          color: '#000',
          width: '100%',
          minHeight: '900px',
        }}
      >
        {/* Company Info */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-uppercase">इंद्रायणी बेकर्स, स्वीट्स अँड केक्स</h2>
          <p className="mb-1 fw-semibold">Khanapur Road, Vita - 415311</p>
          <p className="mb-0 fw-semibold">Contact: +91 9146006006 | UPI: 9146006006@okbizaxis</p>
          <hr className="my-4" />
        </div>

        {/* Invoice Metadata and Customer Info */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <h6 className="fw-bold mb-1">Customer Details:</h6>
            <p className="mb-0"><strong>Name:</strong> {customer.name || '-'}</p>
            <p className="mb-0"><strong>Contact:</strong> {customer.contact || '-'}</p>
            <p className="mb-0"><strong>Address:</strong> {customer.address || '-'}</p>
          </div>
          <div className="text-end">
            <p className="mb-1"><strong>Date:</strong> {currentDate}</p>
            <p className="mb-0"><strong>Invoice No:</strong> {invoiceNo || '-'}</p>
          </div>
        </div>

        {/* Product Table */}
        <table className="table table-borderless align-middle">
          <thead className="border-bottom bg-light">
            <tr className="text-uppercase small text-muted">
              <th>Product</th>
              <th className="text-center">Qty</th>
              <th className="text-end">Price</th>
              <th className="text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {saleItems.map(item => {
              const product = products.find(p => p._id === item.product);
              if (!product) return null;

              return (
                <tr key={item.product}>
                  <td>{product.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">₹{product.price.toFixed(2)}</td>
                  <td className="text-end">₹{(product.price * item.quantity).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total */}
        <div className="d-flex justify-content-end mt-4">
          <div className="w-50">
            <div className="d-flex justify-content-between border-bottom py-2">
              <span className="fw-semibold">Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom py-2">
              <span className="fw-semibold">Tax (0%)</span>
              <span>₹0.00</span>
            </div>
            <div className="d-flex justify-content-between py-2 fs-5 fw-bold">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center mt-5">
          <p className="fw-bold mb-2">Scan to Pay</p>
          <img src={qrCodeBase64} alt="QR Code" style={{ height: '180px' }} />
          <p className="text-muted mt-2">Google Pay / PhonePe / Paytm UPI ID: <strong>9146006006@okbizaxis</strong></p>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 pt-3 border-top">
          <p className="mb-0 small">Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

export default InvoicePreview;
