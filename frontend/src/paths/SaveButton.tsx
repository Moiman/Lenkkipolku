import { useState } from "react";
import { geojson } from "../App";
import SaveModal from "./SaveModal";
import SaveSVG from "../assets/save.svg";

const PathsButton = () => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  const savePath = () => {
    console.log(geojson);
  };
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
