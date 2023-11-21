import { useEffect, useState } from "react";
import { Button, Row, Col, ListGroup } from "react-bootstrap";
import pathsService from "./pathsService";
import type { IPath } from "./pathsTypes";
import "./PathsSideBar.css";

interface IProps {
  isOpen: boolean,
  close: () => void,
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
}

const PathsSideBar = ({ isOpen, close, selectedPath, setSelectedPath }: IProps) => {
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
    <div className="paths-side-bar">
      <Row>
        <Col>
          <h2>Path list</h2>
        </Col>
        <Col xs="2">
          <Button variant="outline-danger" onClick={close}>X</Button>
        </Col>
      </Row>
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
              <Col xs={2}>
                <Button as="div" variant="danger" size="sm" onClick={() => deletePath(path.id)}>
                  X
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default PathsSideBar;
