import "./Distance.css";

const Distance = ({ distance }: { distance: number; }) => {
  return (
    <>
      {distance > 0 &&
    <div className="distance-container"><p>{distance.toFixed(2)} km</p></div>
      }
    </>
  );
};

export default Distance;
