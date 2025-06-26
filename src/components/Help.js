import React from 'react';
import { Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Help = () => {
  return (
    <Container className="my-5 d-flex justify-content-center align-items-center flex-column">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-black">Varad Consultants & Analyst Pvt. Ltd.</h2>
        <p className="text-secondary fs-5">How can we help you today?</p>
      </div>

      <Card className="shadow border-0 rounded-4" style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Body className="p-4 text-center">
          <h4 className="fw-bold mb-4" style={{ color: '#5b2c91' }}>📞 Contact Us</h4>

          <div className="mb-3">
            <div className="fw-semibold text-muted">🌐 Website</div>
            <a href="https://www.varadanalyst.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
              www.varadanalyst.com
            </a>
          </div>

          <div className="mb-3">
            <div className="fw-semibold text-muted">📱 Phone</div>
            <div className="text-dark fs-6">+91 84464 48461</div>
          </div>

          <div>
            <div className="fw-semibold text-muted">📍 Address</div>
            <div className="text-dark">
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
