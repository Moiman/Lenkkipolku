import "./Distance.css";

const Distance = ({ distance }: { distance: number; }) => {
  return (
    <>
      {distance > 0 &&
        <div className="distance-container">{distance.toFixed(2)} km</div>
      }
    </>
  );
};

export default Distance;
