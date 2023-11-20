import { useEffect, useState } from "react";
import { Button, Container, Modal, Row, Col, ListGroup } from "react-bootstrap";
import pathsService from "./pathsService";
import type { IPath } from "./pathsTypes";

interface IProps {
  isOpen: boolean,
  closeModal: () => void,
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
}

const PathsModal = ({ isOpen, closeModal, selectedPath, setSelectedPath }: IProps) => {
  const [paths, setPaths] = useState([] as IPath[]);
  useEffect(() => {
    if (isOpen) {
      pathsService.getAll().then(data => setPaths(data));
    }
  }, [isOpen]);

  const deletePath = async (id: number) => {
    await pathsService.deletePath(id);
    setPaths(paths.filter(path => path.id !== id));
    setSelectedPath(null);
  };

  const loadPath = (path: IPath) => {
    if (path.id === selectedPath?.id) {
      setSelectedPath(null);
    } else {
      setSelectedPath(path);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>
        <Container className="mt-3">
          <ListGroup>
            {paths.map(path => (
              <ListGroup.Item
                key={path.id}
                action onClick={() => loadPath(path)}
                active={selectedPath?.id === path.id}
              >
                <Row>
                  <Col>{path.title}</Col>
                  <Col>
                    {new Date(path.created_at).toLocaleDateString()}
                  </Col>
                  <Col xs={1}>
                    <Button as="div" variant="danger" size="sm" onClick={() => deletePath(path.id)}>
                      X
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PathsModal;
