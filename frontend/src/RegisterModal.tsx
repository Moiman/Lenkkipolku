import { isAxiosError } from "axios";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import userService from "./userService";
import { useAuth } from "./AuthProvider";

interface Inputs {
  username: string;
  password: string;
  confirmPassword: string;
}

const RegisterModal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void; }) => {
  const { setToken } = useAuth();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .min(1, "Username must be at least 1 characters")
      .max(20, "Username must not exceed 20 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Confirm Password does not match"),
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
      const res = await userService.register(data);
      console.log(res);
      setToken(res.token);
      closeModal();
    } catch(err) {
      if( isAxiosError(err)) {
        if( err.response?.data.error) {
          setError("username",  {
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
            <Form.Group className="mb-3">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                {...register("confirmPassword")}
                isInvalid={!!errors.confirmPassword}
                type="password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword?.message}
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

export default RegisterModal;
