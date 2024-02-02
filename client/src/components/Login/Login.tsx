import { useState, useEffect } from "react";
import "./Login.css";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";


function Login() {
  // username and password state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // redirect after successful login
  const [redirect, setRedirect] = useState(false);
  if (redirect) {
    window.location.href = "/home";
  }

  const loginHandler = (e: any) => {
    e.preventDefault();
    console.log("loginHandler");
    axios
      .post("/api/auth/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setRedirect(true);
          window.location.href = "/home";
        }
      })
  };

  const validPassword = (password: string) => {
    return password.length >= 8;
  };

  return (
    <div className="login">
      <Form onSubmit={loginHandler}>
        <Form.Group controlId="username-form" className="mb-3">
          <Form.Control
            type="text"
            name="username"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password-form" className="mb-3">
          <Form.Control
            type="text"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <button
          type="submit"
          className="btn btn-success"
          disabled={
            !username ||
            !validPassword(password)
          }
        >
          Submit
        </button>
      </Form>
    </div>
  );
}

export default Login;
