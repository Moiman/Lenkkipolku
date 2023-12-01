import express from "express";
// @ts-ignore
import MBTiles from "@mapbox/mbtiles"; // No types

const router = express.Router();

const header = {
  "Content-Type": "application/x-protobuf",
  "Content-Encoding": "gzip"
};

// Route which handles requests like the following: /0/1/2.pbf
router.get("/:z/:x/:y.pbf", (req, res) => {
  new MBTiles("./data/tampere.mbtiles?mode=ro", (err: any, mbtiles: any) => {
    if (err) {
      console.error("error opening database");
      res.status(404).json({ error: "Error opening databes: " + err });
    }
    mbtiles.getTile(req.params.z, req.params.x, req.params.y, (err: any, tile: any, _headers: any) => {
      if (err) {
        if (err.message === "Tile does not exist") {
          res.status(204).end();
        } else {
          return res.status(500).json({ error: err.message });
        }
      } else {
        res.set(header);
        res.send(tile);
      }
    });
  });
});

export default router;
