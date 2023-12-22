import React from "react";
import { Col, Row, Container, Card } from "react-bootstrap";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/Config";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  //Sign In Function
  const navigate = useNavigate();
  const handleGoogle = async (e) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      localStorage.setItem("token", result.user.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };
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
                    <GoogleButton onClick={handleGoogle} />
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
