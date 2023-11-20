import { isAxiosError } from "axios";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import pathsService from "./pathsService";
import type { IPath } from "./pathsTypes";
import { geojson } from "../App";


interface IProps {
  isOpen: boolean,
  closeModal: () => void,
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
}

interface Inputs {
  title: string,
  pathError: string,
}

const PathsModal = ({ isOpen, closeModal, selectedPath, setSelectedPath }: IProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (selectedPath) {
        const updatedPath = await pathsService.updatePath(selectedPath.id, data.title, geojson);
        setSelectedPath(updatedPath);
      } else {
        if (geojson.features.length === 0) {
          setError("pathError", { message: "Missing path" });
          return;
        }
        const newPath = await pathsService.newPath(data.title, geojson);
        setSelectedPath(newPath);
      }
      reset();
      closeModal();
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.data.error) {
          setError("title", {
            type: "server",
            message: err.response?.data.error
          });
        }
      }
    }
  };

  return (
    <>
      {isOpen &&
        <Modal
          show={isOpen}
          onHide={() => { reset(); closeModal(); }}
        >
          <Modal.Body>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedPath
                  ? <>Editing path: <b>{selectedPath.title}</b></>
                  : "Unsaved path"
                }
              </Modal.Title>
            </Modal.Header>
            <Container className="mt-3">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
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
      }
    </>
  );
};

export default PathsModal;
