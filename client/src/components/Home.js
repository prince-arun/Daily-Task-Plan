import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { signOut } from "firebase/auth";
import { auth } from "../config/Config";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Home = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (!token) {
    navigate("/");
  }
  return (
    <div className="home">
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Daily Planner</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>{user && user.displayName}</Navbar.Text>
            {user && (
              <img
                src={user.photoURL}
                alt="dp"
                className="rounded-circle img-fluid ms-3"
                style={{ width: "60px", height: "60px" }}
              />
            )}
            <Button className="ms-3" onClick={handleLogout} variant="danger">
              SignOUt
            </Button>{" "}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <section>
        <Container className="my-4">
          <Row className="h-100">
            <Col xs={12} md={4} className="d-flex">
              {/* Content for the first child */}
              <div className="w-100 bg-primary p-4">Child 1</div>
            </Col>
            <Col xs={12} md={4} className="d-flex">
              {/* Content for the second child */}
              <div className="w-100 bg-secondary p-4">Child 2</div>
            </Col>
            <Col xs={12} md={4} className="d-flex">
              {/* Content for the third child */}
              <div className="w-100 bg-success p-4">Child 3</div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
