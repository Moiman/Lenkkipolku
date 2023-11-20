import { useState } from "react";
import PathsModal from "./PathsModal";
import PathSVG from "../assets/path.svg";

const PathsButton = () => {
  const [isPathsOpen, setIsPathsOpen] = useState(false);
  return (
    <>
      <div className="button" onClick={() => setIsPathsOpen(true)}>
        <img src={PathSVG} />
      </div>
      <PathsModal
        isOpen={isPathsOpen}
        closeModal={() => setIsPathsOpen(false)}
      />
    </>
  );
};

export default PathsButton;
