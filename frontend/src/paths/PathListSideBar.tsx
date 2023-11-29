import { Button, Row, Col, CloseButton, ButtonGroup } from "react-bootstrap";
import pathsService from "./pathsService";
import type { IPath } from "./pathsTypes";
import "./PathListSideBar.css";

interface IProps {
  close: () => void,
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
  paths: IPath[],
  setPaths: React.Dispatch<React.SetStateAction<IPath[]>>,
}

const PathListSideBar = ({ close, selectedPath, setSelectedPath, paths, setPaths }: IProps) => {
  const deletePath = (id: number) => {
    pathsService.deletePath(id)
      .then(() => {
        setPaths(paths.filter(path => path.id !== id));
        setSelectedPath(null);
      })
      .catch(err => console.log(err));
  };

  const loadPath = (path: IPath) => {
    if (path.id === selectedPath?.id) {
      setSelectedPath(null);
    } else {
      setSelectedPath(path);
    }
  };

  return (
    <div className="paths-side-bar overflow-y-auto">
      <Row>
        <Col>
          <h2>Path list</h2>
        </Col>
        <Col xs="2">
          <CloseButton onClick={close} />
        </Col>
      </Row>
      <ButtonGroup className="d-flex" vertical>
        {paths.map(path => (
          <ButtonGroup
            key={path.id}
            size="lg"
          >
            <Button
              className="col-10"
              onClick={() => loadPath(path)}
              variant={selectedPath?.id === path.id ? "primary" : "outline-primary"}
            >
              <Row>
                <Col sm className="text-break">{path.title}</Col>
                <Col sm>
                  {new Date(path.created_at).toLocaleDateString()}
                </Col>
              </Row>
            </Button>
            <Button
              variant="danger"
              onClick={() => deletePath(path.id)}
            >
              X
            </Button>
          </ButtonGroup>
        ))}
      </ButtonGroup>
    </div >
  );
};

export default PathListSideBar;
