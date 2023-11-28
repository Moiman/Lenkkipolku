import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import userService from "./userService";

interface IProps {
  isOpen: boolean,
  closeModal: () => void,
  openRegister: () => void,
  openLogin: () => void,
}

const UserModal = ({ isOpen, closeModal, openRegister, openLogin }: IProps) => {
  const authContext = useContext(AuthContext);

  const OpenRegisterModal = () => {
    openRegister();
    closeModal();
  };

  const OpenLoginModal = () => {
    openLogin();
    closeModal();
  };

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
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>
        <Container className="d-flex justify-content-around mt-3">
          <Row className="justify-content-around">
            {authContext.authState.authenticated
              ? <>
                <Col>
                  <Button onClick={authContext.logout}>Logout</Button>
                </Col>
                <Col>
                  <Button onClick={deleteUser}>Delete account</Button>
                </Col>
              </>
              : <>
                <Col>
                  <Button onClick={OpenRegisterModal}>Register</Button>
                </Col>
                <Col>
                  <Button onClick={OpenLoginModal}>Login</Button>
                </Col>
              </>
            }
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default UserModal;
