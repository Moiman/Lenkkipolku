import jwt from "jsonwebtoken";

const createNewTokens = (id: number) => {
  const secret = process.env.SECRET;
  const refreshSecret = process.env.REFRESH_SECRET;
  if (secret && refreshSecret) {
    const payload = { id: id };
    const options = { expiresIn: "15s" };
    const token = jwt.sign(payload, secret, options);
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
    return { token, refreshToken };
  } else {
    throw new Error("Missing ENV SECRET or REFRESH_SECRET");
  }
};

export { createNewTokens };
