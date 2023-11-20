import jwt from "jsonwebtoken";

const secret = process.env.SECRET!;
const refreshSecret = process.env.REFRESH_SECRET!;


const createNewTokens = (id: number) => {
  const payload = { id: id };
  const options = { expiresIn: "15s" };
  const token = jwt.sign(payload, secret, options);
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
  return { token, refreshToken };
};

export { createNewTokens };
