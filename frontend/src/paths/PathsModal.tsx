import { Container } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthProvider";
import pathsService from "./pathsService";
import { useEffect, useState } from "react";

interface IProps {
  isOpen: boolean,
  closeModal: () => void,
}

interface IPath {
  id: number,
  user_id: number,
  title: string,
  path: object,
  created_at: string,
  updated_at: string,
}

const PathsModal = ({ isOpen, closeModal }: IProps) => {
  // const authContext = useContext(AuthContext);
  const [paths, setPaths] = useState([] as IPath[]);
  useEffect(() => {
    if (isOpen) {
      pathsService.getAll().then(data => setPaths(data));
    }
  }, [isOpen]);

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>
        <Container className="mt-3">
          {paths.map(path => (
            <Row key={path.id}>
              <Col>{path.title}</Col>
              <Col>
                {new Date(path.created_at).toLocaleDateString()}
              </Col>
            </Row>
          ))}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PathsModal;
