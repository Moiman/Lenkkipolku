import { useState } from "react";
import SaveModal from "./SaveModal";
import type { IPath } from "./pathsTypes";
import SaveSVG from "../assets/save.svg";

interface IProps {
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
}

const PathsButton = ({ selectedPath, setSelectedPath }: IProps) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  return (
    <>
      <div className="button" onClick={() => setIsSaveOpen(true)}>
        <img src={SaveSVG} />
      </div>
      <SaveModal
        isOpen={isSaveOpen}
        closeModal={() => setIsSaveOpen(false)}
        selectedPath={selectedPath}
        setSelectedPath={setSelectedPath}
      />

    </>
  );
};

export default PathsButton;
