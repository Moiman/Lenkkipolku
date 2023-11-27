import { useContext } from "react";
import UserButton from "./auth/UserButton";
import PathListButton from "./paths/PathListButton";
import SaveButton from "./paths/SaveButton";
import { AuthContext } from "./auth/AuthProvider";
import type { IPath } from "./paths/pathsTypes";
import "./Buttons.css";

interface IPorps {
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
  isPathListOpen: boolean,
  setIsPathListOpen: React.Dispatch<React.SetStateAction<boolean>>,
  paths: IPath[],
  setPaths: React.Dispatch<React.SetStateAction<IPath[]>>,
}

const Buttons = ({ selectedPath, setSelectedPath, isPathListOpen: isPathListOpen, setIsPathListOpen: setIsPathsOpen, paths, setPaths }: IPorps) => {
  const authContext = useContext(AuthContext);
  return (
    <div className="buttons">
      <UserButton />
      {authContext.authState.authenticated &&
        <>
          <PathListButton isPathListOpen={isPathListOpen} setIsPathListOpen={setIsPathsOpen} />
          <SaveButton selectedPath={selectedPath} setSelectedPath={setSelectedPath} paths={paths} setPaths={setPaths} />
        </>
      }
    </div>
  );
};

export default Buttons;
