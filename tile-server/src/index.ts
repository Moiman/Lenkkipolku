import express from "express";
import cors from "cors";
import MBTiles from "@mapbox/mbtiles";
import { requestLog, unknownEndpoint } from "./middleware.js";

const app = express();

app.use(requestLog);
app.use(cors());
app.use(express.static("public"));

const header = {
  "Content-Type": "application/x-protobuf",
  "Content-Encoding": "gzip"
};

// Route which handles requests like the following: /<mbtiles-name>/0/1/2.pbf
app.get("/:z/:x/:y.pbf", (req, res) => {
  new MBTiles("./data/tampere.mbtiles?mode=ro", (err, mbtiles) => {
    if (err) {
      console.error("error opening database");
      res.status(404).json({ error: "Error opening databes: " + err });
    }
    mbtiles.getTile(req.params.z, req.params.x, req.params.y, (err, tile, _headers) => {
      if (err) {
        res.status(404).json({ error: "Tile rendering error: " + err });
      } else {
        res.set(header);
        res.send(tile);
      }
    });
  });
});

app.use(unknownEndpoint);

const PORT = 8081;
console.log("Listening on port: " + PORT);
app.listen(PORT);
