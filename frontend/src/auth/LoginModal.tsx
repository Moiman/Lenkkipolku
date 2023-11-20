import { isAxiosError } from "axios";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
// import userService from "./userService";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import userService from "./userService";

interface Inputs {
  username: string;
  password: string;
}

const LoginModal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void; }) => {
  const authContext = useContext(AuthContext);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required"),
    password: Yup.string()
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>(
    { resolver: yupResolver(validationSchema) }
  );

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const tokens = await userService.login(data);
      authContext.setAuthState({ authenticated: true, token: tokens.token, refreshToken: tokens.refreshToken });
      closeModal();
      reset();
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.data.error) {
          setError("username", {
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
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                {...register("username")}
                isInvalid={!!errors.username}
                type="text"
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password")}
                isInvalid={!!errors.password}
                type="password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="me-1">
              Submit
            </Button>
            <Button type="reset"
              variant="outline-primary"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
