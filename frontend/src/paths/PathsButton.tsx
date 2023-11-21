import PathSVG from "../assets/path.svg";

interface IProps {
  isPathsOpen: boolean,
  setIsPathsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const PathsButton = ({ isPathsOpen, setIsPathsOpen }: IProps) => {
  return (
    <>
      <div className="button" onClick={() => setIsPathsOpen(!isPathsOpen)}>
        <img src={PathSVG} />
      </div>
    </>
  );
};

export default PathsButton;
