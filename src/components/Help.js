import React from 'react';
import { Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Help = () => {
  return (
    <Container className="my-5 d-flex flex-column align-items-center">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-black display-6">Varad Consultants & Analyst Pvt. Ltd.</h2>
        <p className="text-secondary fs-4">How can we help you today?</p>
      </div>

      {/* Contact Info Card */}
      <Card className="shadow border-0 rounded-4" style={{ maxWidth: '700px', width: '100%' }}>
        <Card.Body className="p-5 text-center">
          <h4 className="fw-bold mb-5" style={{ color: '#5b2c91', fontSize: '1.75rem' }}>📞 Contact Us</h4>

          <div className="mb-4">
            <div className="fw-bold text-secondary mb-1 fs-5">Website</div>
            <a
              href="https://www.varadanalyst.com"
              target="_blank"
              rel="noopener noreferrer"
              className="fw-bold text-primary fs-5 text-decoration-none"
            >
              www.varadanalyst.com
            </a>
          </div>

          <div className="mb-4">
            <div className="fw-bold text-secondary mb-1 fs-5">Phone</div>
            <div className="text-dark fw-bold fs-5">+91 84464 48461</div>
          </div>

          <div>
            <div className="fw-bold text-secondary mb-1 fs-5">Address</div>
            <div className="text-dark fw-bold fs-5">
              505, Shivcity Center,<br />
              Vijaynagar, Sangli – 416416
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Help;
