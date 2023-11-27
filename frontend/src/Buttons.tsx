import { useContext } from "react";
import type { RefObject } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import UserButton from "./auth/UserButton";
import PathListButton from "./paths/PathListButton";
import SaveButton from "./paths/SaveButton";
import EditButtons from "./paths/EditButtons";
import { AuthContext } from "./auth/AuthProvider";
import type { IPath } from "./paths/pathsTypes";
import "./Buttons.css";

interface IPorps {
  mapRef: RefObject<MapRef>,
  selectedPath: IPath | null,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
  isPathListOpen: boolean,
  setIsPathListOpen: React.Dispatch<React.SetStateAction<boolean>>,
  paths: IPath[],
  setPaths: React.Dispatch<React.SetStateAction<IPath[]>>,
  setDistance: React.Dispatch<React.SetStateAction<number>>,
}

const Buttons = ({ mapRef, selectedPath, setSelectedPath, isPathListOpen: isPathListOpen, setIsPathListOpen: setIsPathsOpen, paths, setPaths, setDistance }: IPorps) => {
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
      <EditButtons mapRef={mapRef} setSelectedPath={setSelectedPath} setDistance={setDistance} />
    </div>
  );
};

export default Buttons;
