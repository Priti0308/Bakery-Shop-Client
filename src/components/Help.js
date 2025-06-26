import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Help = () => {
  return (
    <Container className="my-5 d-flex justify-content-center align-items-center flex-column">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark">Varad Consultants & Analyst Pvt. Ltd.</h2>
        <p className="text-muted fs-5">How can we help you today?</p>
      </div>

      <Card className="shadow-sm border-0 rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body className="p-4 text-center">
          <h4 className="mb-4" style={{ color: '#6f42c1' }}>📞 Contact Us</h4>

          <p className="mb-3">
            <strong>🌐 Website:</strong><br />
            <a href="https://www.varadanalyst.com" target="_blank" rel="noopener noreferrer">
              www.varadanalyst.com
            </a>
          </p>

          <p className="mb-3">
            <strong>📱 Phone:</strong><br />
            +91 84464 48461
          </p>

          <p className="mb-0">
            <strong>📍 Address:</strong><br />
            505, Shivcity Center,<br />
            Vijaynagar, Sangli – 416416
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Help;
