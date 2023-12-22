import React from "react";
import { Col, Button, Row, Container, Card } from "react-bootstrap";

const Login = () => {
  return (
    <div className="login">
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <div className="border border-3 border-primary"></div>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-uppercase ">
                    Daily Task Planner
                  </h2>
                  <p className=" mb-5">Login Using Google Account</p>
                  <div className="mb-3">
                    <Button variant="outline-primary">Google Sign In</Button>{" "}
                    <div className="mt-3"></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
