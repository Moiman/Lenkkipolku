import type { NextFunction, Request, Response } from "express";

const requestLog = (req: Request, _res: Response, next: NextFunction) => {
  const date = new Date();
  const dateString = date.toISOString().split("T")[0] + " " + date.toLocaleTimeString();

  console.log(
    dateString + " " +
    req.method + " " +
    req.path
  );

  next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
};

export { requestLog, unknownEndpoint };
