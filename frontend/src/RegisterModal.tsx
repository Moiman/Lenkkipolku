import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const RegisterModal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void; }) => {
  const initialState = { username: "", password: "", rePassword: "" };
  const [formsInputs, setFormsInputs] = useState(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormsInputs({ ...formsInputs, [name]: value });
  };

  const handleForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formsInputs);
    if (formsInputs.password !== formsInputs.rePassword) {
      alert("moi");
    } else {
      closeModal();
      setFormsInputs(initialState);
    }
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
            <Form.Group className="mb-3">
              <Form.Label>Retype password</Form.Label>
              <Form.Control
                type="password"
                name="rePassword"
                value={formsInputs.rePassword}
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

export default RegisterModal;
