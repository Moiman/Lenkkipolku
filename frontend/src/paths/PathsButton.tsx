import PathSVG from "../assets/path.svg";

interface IProps {
  isPathListOpen: boolean,
  setIsPathListOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const PathsButton = ({ isPathListOpen: isPathListOpen, setIsPathListOpen: setIsPathListOpen }: IProps) => {
  return (
    <>
      <div className="button" onClick={() => setIsPathListOpen(!isPathListOpen)}>
        <img src={PathSVG} />
      </div>
    </>
  );
};

export default PathsButton;
