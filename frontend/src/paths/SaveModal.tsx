import { isAxiosError } from "axios";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import pathsService from "./pathsService";
import { geojson } from "../App";


interface IProps {
  isOpen: boolean,
  closeModal: () => void,
}

interface Inputs {
  title: string;
}

const PathsModal = ({ isOpen, closeModal }: IProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await pathsService.newPath(data.title, geojson);
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
    <Modal
      show={isOpen}
      onHide={closeModal}
    >
      <Modal.Body>
        <Modal.Header closeButton></Modal.Header>
        <Container className="mt-3">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                {...register("title")}
                isInvalid={!!errors.title}
                type="text"
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="me-1">
              Save as new path
            </Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PathsModal;
