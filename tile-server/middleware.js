const requestLog = (req, _res, next) => {
  const date = new Date();
  const dateString = date.toISOString().split("T")[0] + " " + date.toLocaleTimeString();

  console.log(
    dateString + " " +
    req.method + " " +
    req.path
  );

  next();
};

const unknownEndpoint = (_req, res) => {
  res.status(404).json({ error: "Not Found" });
};

export { requestLog, unknownEndpoint };
