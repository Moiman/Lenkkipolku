import { useContext } from "react";
import UserButton from "./auth/UserButton";
import PathsButton from "./paths/PathsButton";
import SaveButton from "./paths/SaveButton";
import { AuthContext } from "./auth/AuthProvider";
import type { IPath } from "./paths/pathsTypes";
import "./Buttons.css";

interface IPorps {
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
  isPathsOpen: boolean,
  setIsPathsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const Buttons = ({ selectedPath, setSelectedPath, isPathsOpen, setIsPathsOpen }: IPorps) => {
  const authContext = useContext(AuthContext);
  return (
    <div className="buttons">
      <UserButton />
      {authContext.authState.authenticated &&
        <>
          <PathsButton isPathsOpen={isPathsOpen} setIsPathsOpen={setIsPathsOpen} />
          <SaveButton selectedPath={selectedPath} setSelectedPath={setSelectedPath} />
        </>
      }
    </div>
  );
};

export default Buttons;
