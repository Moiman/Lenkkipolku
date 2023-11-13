import React, { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";

const initialState = { username: "", password: "" };

const LoginModal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void; }) => {
  const [formsInputs, setFormsInputs] = useState(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormsInputs({ ...formsInputs, [name]: value });
  };

  const handleForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formsInputs);
    closeModal();
    setFormsInputs(initialState);
  };
  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>
        <Container>
          <Form onSubmit={handleForm}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formsInputs.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formsInputs.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" className="me-1">
              Submit
            </Button>
            <Button type="reset"
              variant="outline-primary"
              onClick={() => { setFormsInputs(initialState); }}
            >
              Reset
            </Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
