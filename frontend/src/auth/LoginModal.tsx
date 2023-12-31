import { isAxiosError } from "axios";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const errorMessage = err.response?.data.error;
        if (errorMessage && typeof errorMessage === "string") {
          setError("username", {
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
          Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                {...register("username")}
                isInvalid={!!errors.username}
                type="text"
                autoComplete="username"
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password")}
                isInvalid={!!errors.password}
                type="password"
                autoComplete="current-password"
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
