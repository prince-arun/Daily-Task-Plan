import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Card from "react-bootstrap/Card";

const TaskItem = ({ task, user, removeTaskFromContainer2 }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [displayTimePeriod, setDisplayTimePeriod] = useState(false);

  const [timer, setTimer] = useState(() => {
    // Loading  the timer value from localStorage
    const storedTimer = localStorage.getItem(`timer_${task._id}`);
    return storedTimer ? parseInt(storedTimer, 10) : 0;
  });

  useEffect(() => {
    if (isTimerRunning) {
      const id = setInterval(() => {
        // Saving the updated timer value to localStorage
        setTimer((prevTimer) => {
          localStorage.setItem(`timer_${task._id}`, String(prevTimer + 1));
          return prevTimer + 1;
        });
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setDisplayTimePeriod(true);
    }
    return () => clearInterval(intervalId);
  }, [isTimerRunning, displayTimePeriod]);

  const handleStartEndTask = async () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
      try {
        // Patch Request to Update time Period
        await axios.patch(`http://localhost:5000/api/tasks/${task._id}`, {
          user,
          timePeriod: timer,
        });
        setDisplayTimePeriod(true);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsTimerRunning(true);
      // Setting displayTimePeriod to false when starting a new task for rerender purposes
      setDisplayTimePeriod(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      // Delete Requests
      localStorage.removeItem(`timer_${task._id}`);
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
        data: { user },
      });
      removeTaskFromContainer2(task._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="task-item">
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{task.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Status: {task.status}
          </Card.Subtitle>
          <Card.Text>
            {isTimerRunning && <p>Timer: {formatTimer(timer)}</p>}
          </Card.Text>
          <Card.Text>
            {displayTimePeriod && <p>Time Spend: {task.timePeriod}</p>}
          </Card.Text>
          <Card.Link>
            {" "}
            <Button
              className="ms-3"
              variant="primary"
              onClick={handleStartEndTask}
            >
              {isTimerRunning ? "End Task" : "Start Task"}
            </Button>
          </Card.Link>
          <Card.Link>
            {" "}
            <Button
              className="ms-3 mt-2"
              variant="danger"
              onClick={handleDeleteTask}
            >
              Delete Task
            </Button>
          </Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
};

const formatTimer = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
};

export default TaskItem;
