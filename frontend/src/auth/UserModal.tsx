import { useContext, useState } from "react";
import { ButtonGroup, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AuthContext } from "./AuthProvider";
import PasswordChangeModal from "./PasswordChangeModal";
import ConfirmModal from "./ConfirmModal";

interface IProps {
  isOpen: boolean,
  closeModal: () => void,
  openRegister: () => void,
  openLogin: () => void,
}

const UserModal = ({ isOpen, closeModal, openRegister, openLogin }: IProps) => {
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const authContext = useContext(AuthContext);

  const OpenRegisterModal = () => {
    openRegister();
    closeModal();
  };

  const OpenLoginModal = () => {
    openLogin();
    closeModal();
  };

  const OpenPasswordChangeModal = () => {
    setIsPasswordChangeModalOpen(true);
    closeModal();
  };

  const OpenDeleteUserModal = () => {
    setIsConfirmModalOpen(true);
    closeModal();
  };

  return (
    <>
      <Modal show={isOpen} onHide={closeModal}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Container className="d-flex justify-content-around mt-3">
            {authContext.authState.authenticated
              ?
              <ButtonGroup>
                <Button onClick={authContext.logout}>Logout</Button>
                <Button variant="outline-primary" onClick={OpenPasswordChangeModal}>
                  Change password
                </Button>
                <Button variant="outline-danger" onClick={OpenDeleteUserModal}>
                  Delete account</Button>
              </ButtonGroup>
              :
              <Row className="justify-content-around">
                <Col>
                  <Button onClick={OpenRegisterModal}>Register</Button>
                </Col>
                <Col>
                  <Button onClick={OpenLoginModal}>Login</Button>
                </Col>
              </Row>
            }
          </Container>
        </Modal.Body>
      </Modal>
      <PasswordChangeModal
        isOpen={isPasswordChangeModalOpen}
        closeModal={() => setIsPasswordChangeModalOpen(false)} />
      <ConfirmModal
        message={"Are you sure you want to delete your account?"}
        isOpen={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)} />
    </>
  );
};

export default UserModal;
