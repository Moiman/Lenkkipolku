import { useState } from "react";
import UserModal from "./UserModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import userSVG from "../assets/user.svg";
import "./User.css";


const User = () => {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <div className="user-button" onClick={() => setIsUserOpen(true)}>
        <img src={userSVG}></img>
      </div>
      <UserModal
        isOpen={isUserOpen}
        closeModal={() => setIsUserOpen(false)}
        openRegister={() => setIsRegisterOpen(true)}
        openLogin={() => setIsLoginOpen(true)}
      />
      <RegisterModal isOpen={isRegisterOpen} closeModal={() => setIsRegisterOpen(false)} />
      <LoginModal isOpen={isLoginOpen} closeModal={() => setIsLoginOpen(false)} />
    </>
  );
};

export default User;
