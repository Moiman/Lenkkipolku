import { useContext } from "react";
import { Button, Container, Modal, Row, Col } from "react-bootstrap";
import userService from "./userService";
import { AuthContext } from "./AuthProvider";

interface IProps {
  message: string,
  isOpen: boolean,
  closeModal: () => void,
}

const ConfirmModal = ({ message, isOpen, closeModal }: IProps) => {
  const authContext = useContext(AuthContext);

  const deleteUser = () => {
    userService.remove()
      .then(() => authContext.logout())
      .catch(() => console.log("Deleting user failed"));
  };

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-break">
          {message}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="mt-3">
          <Row className="justify-content-evenly">
            <Col xs={2} className="mx-auto">
              <Button variant="outline-danger" onClick={deleteUser}>Yes</Button>
            </Col>
            <Col xs={2} className="mx-auto">
              <Button variant="outline-primary" onClick={closeModal}>No</Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal >
  );
};

export default ConfirmModal;
