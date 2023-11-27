import { useState } from "react";
import SaveModal from "./SaveModal";
import type { IPath } from "./pathsTypes";
import SaveSVG from "../assets/save.svg";

interface IProps {
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
  paths: IPath[],
  setPaths: React.Dispatch<React.SetStateAction<IPath[]>>,
}

const PathsButton = ({ selectedPath, setSelectedPath, paths, setPaths }: IProps) => {
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
        paths={paths}
        setPaths={setPaths}
      />

    </>
  );
};

export default PathsButton;
