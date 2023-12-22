import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { signOut } from "firebase/auth";
import { auth } from "../config/Config";

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
    </div>
  );
};

export default Home;
