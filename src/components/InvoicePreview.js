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
        className="p-5 bg-white border"
        style={{ width: '100%', fontFamily: 'Arial, sans-serif', color: '#000', minHeight: '900px' }}
      >
        {/* Company Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-uppercase" style={{ fontSize: '28px' }}>
            इंद्रायणी बेकर्स, स्वीट्स अँड केक्स
          </h2>
          <p className="mb-1 fw-semibold" style={{ fontSize: '16px' }}>
            Khanapur Road, Vita - 415311
          </p>
          <p className="mb-0 fw-semibold" style={{ fontSize: '15px' }}>
            Contact: +91 9146006006 | UPI: 9146006006@okbizaxis
          </p>
        </div>

        {/* Invoice Info */}
        <div className="d-flex justify-content-between mb-4">
          {/* Bill To */}
          <div>
            <h6 className="fw-bold">Bill To:</h6>
            <p className="mb-0">{customer.name || '-'}</p>
            <p className="mb-0">{customer.address || '-'}</p>
            <p className="mb-0">{customer.contact || '-'}</p>
          </div>

          {/* Invoice Details */}
          <div className="text-end">
            <p className="mb-1"><strong>Date:</strong> {currentDate}</p>
            <p className="mb-1"><strong>Invoice No:</strong> {invoiceNo || '-'}</p>
            <p className="mb-1"><strong>For:</strong> Product Purchase</p>
          </div>
        </div>

        {/* Item Table */}
        <table className="table table-bordered border-dark">
          <thead>
            <tr className="bg-light text-center">
              <th style={{ width: '75%' }}>DESCRIPTION</th>
              <th style={{ width: '25%' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {saleItems.map(item => {
              const product = products.find(p => p._id === item.product);
              if (!product) return null;

              return (
                <tr key={item.product}>
                  <td>{product.name} × {item.quantity}</td>
                  <td className="text-end">₹{(product.price * item.quantity).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total */}
        <div className="d-flex justify-content-end mt-3">
          <table className="table w-50">
            <tbody>
              <tr>
                <td className="fw-bold text-end">TOTAL:</td>
                <td className="fw-bold text-end">₹{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment QR */}
        <div className="text-center mt-4">
          <p className="fw-bold mb-2">Scan to Pay</p>
          <img src={qrCodeBase64} alt="QR Code" style={{ height: '160px' }} />
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-3 border-top">
          <small className="text-muted fw-semibold">Make all checks payable to <strong>इंद्रायणी बेकर्स</strong></small>
          <br />
          <small className="text-muted">THANK YOU FOR YOUR BUSINESS!</small>
        </div>
      </div>
    );
  }
);

export default InvoicePreview;
