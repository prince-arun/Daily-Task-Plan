import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { signOut } from "firebase/auth";
import { auth } from "../config/Config";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card, Form } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import axios from "axios";
import TaskItem from "./TaskItem";

const Home = () => {
  const navigate = useNavigate();

  //Managing states
  const [user, setUser] = useState();
  const [title, setTitle] = useState();
  const [tag, setTag] = useState();
  const [status, setStatus] = useState();
  const [tasks, setTasks] = useState();

  //Getting Data From Loal Storage
  const userDetails = JSON.parse(localStorage.getItem("user"));

  //Dynamically Storing Google uid
  useEffect(() => {
    if (userDetails && userDetails.uid) {
      setUser(userDetails.uid);
    }
  }, [userDetails]);

  //if user present Fetch the details.
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const token = localStorage.getItem("token");

  //Post Requests For adding Tasks
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && tag && status) {
      axios
        .post("http://localhost:5000/api/tasks", {
          user,
          title,
          tag,
          status,
        })
        .then((res) => {
          console.log(res.data);
          alert("task added successfully");
          window.location.reload();
        })
        .catch((err) => console.log(err.message));
    }
  };

  //Get Requests for Getting the tasks
  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks for user:", user);
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${user}`
      );

      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };
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

  //Removing Tasks From UI
  const removeTaskFromContainer2 = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  if (!token) {
    navigate("/");
  }

  //Bootstrap code for UI
  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">New Tasks</Popover.Header>
      <Popover.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTag">
            <Form.Label>Tag</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task tag"
              onChange={(e) => setTag(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select</option>

              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Task
          </Button>
        </Form>
      </Popover.Body>
    </Popover>
  );
  return (
    <div className="home">
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Daily Planner</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>{userDetails && userDetails.displayName}</Navbar.Text>
            {userDetails && (
              <img
                src={userDetails.photoURL}
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
            <Col xs={12} md={6} className="d-flex">
              <div
                className="w-100 bg-primary p-4 h-100"
                style={{ minHeight: "500px" }}
              >
                {}
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={popover}
                >
                  <Button variant="success">Create Tasks</Button>
                </OverlayTrigger>
              </div>
            </Col>
            <Col xs={12} md={6} className="d-flex">
              <div className="w-100 bg-secondary p-4">
                {tasks ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      user={user}
                      removeTaskFromContainer2={removeTaskFromContainer2}
                    />
                  ))
                ) : (
                  <p>No tasks available</p>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
