import { isAxiosError } from "axios";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import userService from "./userService";

interface Inputs {
  password: string;
  confirmPassword: string;
}

const PasswordChangeModal = ({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void; }) => {
  const validationSchema = Yup.object({
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
      await userService.changePassword(data);
      closeModal();
      reset();
    } catch (err) {
      if (isAxiosError(err)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const errorMessage = err.response?.data.error;
        if (errorMessage && typeof errorMessage === "string") {
          setError("password", {
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
          Change password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control
                {...register("password")}
                isInvalid={!!errors.password}
                type="password"
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                {...register("confirmPassword")}
                isInvalid={!!errors.confirmPassword}
                type="password"
                autoComplete="new-password"
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

export default PasswordChangeModal;
