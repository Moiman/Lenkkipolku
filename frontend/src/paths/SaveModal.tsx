/* eslint-disable @typescript-eslint/no-misused-promises */
import { isAxiosError } from "axios";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import pathsService from "./pathsService";
import type { IPath } from "./pathsTypes";
import { geojson } from "../map/geojson";


interface IProps {
  isOpen: boolean,
  closeModal: () => void,
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
  paths: IPath[],
  setPaths: React.Dispatch<React.SetStateAction<IPath[]>>,
}

interface Inputs {
  title: string,
  pathError: string,
}

const PathsModal = ({ isOpen, closeModal, selectedPath, setSelectedPath, paths, setPaths }: IProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    if (geojson.features.length === 0) {
      setError("pathError", { message: "Path has to have at least one point" });
      return;
    }
    try {
      if (selectedPath) {
        const updatedPath = await pathsService.updatePath(selectedPath.id, data.title, geojson);
        setSelectedPath(updatedPath);
        setPaths(
          paths.map(path =>
            path.id === selectedPath.id
              ? updatedPath
              : path
          )
        );
      } else {
        const newPath = await pathsService.newPath(data.title, geojson);
        setSelectedPath(newPath);
        setPaths(paths.concat(newPath));
      }
      reset();
      closeModal();
    } catch (err) {
      if (isAxiosError(err)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const errorMessage = err.response?.data.error;
        if (errorMessage && typeof errorMessage === "string") {
          setError("title", {
            type: "server",
            message: errorMessage
          });
        }
      }
    }
  };

  return (
    <Modal show={isOpen} onHide={() => { closeModal(); reset(); }}>
      <Modal.Header closeButton>
        <Modal.Title className="text-break">
          {selectedPath
            ? <>Editing path: <b>{selectedPath.title}</b></>
            : "Unsaved path"
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="mt-3">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                {...register("title")}
                isInvalid={!!errors.title}
                defaultValue={selectedPath?.title}
                type="text"
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Control
                {...register("pathError")}
                isInvalid={!!errors.pathError}
                type="hidden"
              />
              <Form.Control.Feedback type="invalid">
                {errors.pathError?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="me-1">
              {selectedPath
                ? "Save"
                : "Save as new path"
              }
            </Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PathsModal;
