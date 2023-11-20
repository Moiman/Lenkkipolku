import { useState } from "react";
import type { IPath } from "./pathsTypes";
import PathsModal from "./PathsModal";
import PathSVG from "../assets/path.svg";

interface IProps {
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
}

const PathsButton = ({ selectedPath, setSelectedPath }: IProps) => {
  const [isPathsOpen, setIsPathsOpen] = useState(false);
  return (
    <>
      <div className="button" onClick={() => setIsPathsOpen(true)}>
        <img src={PathSVG} />
      </div>
      <PathsModal
        isOpen={isPathsOpen}
        closeModal={() => setIsPathsOpen(false)}
        selectedPath={selectedPath}
        setSelectedPath={setSelectedPath}
      />
    </>
  );
};

export default PathsButton;
