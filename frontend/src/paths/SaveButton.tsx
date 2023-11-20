import { useState } from "react";
import SaveModal from "./SaveModal";
import SaveSVG from "../assets/save.svg";

const PathsButton = () => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  return (
    <>
      <div className="button" onClick={() => setIsSaveOpen(true)}>
        <img src={SaveSVG} />
      </div>
      <SaveModal
        isOpen={isSaveOpen}
        closeModal={() => setIsSaveOpen(false)}
      />

    </>
  );
};

export default PathsButton;
