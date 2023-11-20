import { useContext } from "react";
import UserButton from "./auth/UserButton";
import PathsButton from "./paths/PathsButton";
import SaveButton from "./paths/SaveButton";
import { AuthContext } from "./auth/AuthProvider";
import "./Buttons.css";

const Buttons = () => {
  const authContext = useContext(AuthContext);
  return (
    <div className="buttons">
      <UserButton />
      {authContext.authState.authenticated &&
        <>
          <PathsButton />
          <SaveButton />
        </>
      }
    </div>
  );
};

export default Buttons;
