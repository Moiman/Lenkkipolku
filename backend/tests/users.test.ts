import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import server from "../src/server.js";

const secret = process.env.SECRET;

if (!secret) {
  throw new Error("Missing env SECRET");
}

describe("Server", () => {
  it("Register with valid data", async () => {
    const response = await request(server)
      .post("/users/register")
      .send({ username: "pekka", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(() => jwt.verify(response.body.token, secret)).not.toThrow();
  });
  it("Register with invalid data", async () => {
    const response = await request(server)
      .post("/users/register")
      .send({ usernam: "pekka", password: "salainen" });
    expect(response.statusCode).toBe(400);
  });
  it("Register with no username", async () => {
    const response = await request(server)
      .post("/users/register")
      .send({ password: "salainen" });
    expect(response.statusCode).toBe(400);
  });
  it("Register with no password field", async () => {
    const response = await request(server)
      .post("/users/register")
      .send({ usernam: "pekka" });
    expect(response.statusCode).toBe(400);
  });
  it("Register with username conflict", async () => {
    await request(server)
      .post("/users/register")
      .send({ username: "pekka", password: "salainen" })
      .expect(409);
  });
  it("Register with no data", async () => {
    const response = await request(server).post("/users/register").send();
    expect(response.statusCode).toBe(400);
  });
  it("Login with valid data", async () => {
    const response = await request(server)
      .post("/users/login")
      .send({ username: "pekka", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(() => jwt.verify(response.body.token, secret)).not.toThrow();
  });
  it("Login with wrong password", async () => {
    await request(server)
      .post("/users/login")
      .send({ username: "pekka", password: "VÄÄRÄ" })
      .expect(401);
  });
  it("Login without account", async () => {
    await request(server)
      .post("/users/login")
      .send({ username: "EiOleOlemassa", password: "VÄÄRÄ" })
      .expect(401);
  });
  it("Login with invalid username field", async () => {
    const response = await request(server)
      .post("/users/login")
      .send({ usernamwrong: "pekka", password: "salainen" });
    expect(response.statusCode).toBe(400);
  });
  it("Login with invalid password field", async () => {
    const response = await request(server)
      .post("/users/login")
      .send({ usernam: "pekka", passwrong: "salainen" });
    expect(response.statusCode).toBe(400);
  });
  it("Login with no data", async () => {
    const response = await request(server).post("/users/login").send();
    expect(response.statusCode).toBe(400);
  });
  it("Refresh Token test", async () => {
    await request(server)
      .post("/users/register")
      .send({ username: "pekka", password: "salainen" })
      .expect("Content-Type", /json/);
    const response = await request(server)
      .post("/users/login")
      .send({ username: "pekka", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(() => jwt.verify(response.body.token, secret)).not.toThrow();
    await request(server)
      .get("/users/refresh")
      .set("Authorization", "Bearer " + response.body.refreshToken)
      .expect("Content-Type", /json/)
      .expect(200);
  });
  it("Refresh Token test with wrong token", async () => {
    await request(server)
      .post("/users/register")
      .send({ username: "pekka", password: "salainen" })
      .expect("Content-Type", /json/);
    const response = await request(server)
      .post("/users/login")
      .send({ username: "pekka", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(() => jwt.verify(response.body.token, secret)).not.toThrow();
    await request(server)
      .get("/users/refresh")
      .set("Authorization", "Bearer " + response.body.token)
      .expect(401);
  });
  it("Refresh Token test with no token", async () => {
    await request(server).get("/users/refresh").expect(401);
  });
  it("Delete account", async () => {
    const res = await request(server)
      .post("/users/login")
      .send({ username: "pekka", password: "salainen" })
      .expect(200)
      .expect("Content-Type", /json/);
    await request(server)
      .delete("/users/delete")
      .set("Authorization", "Bearer " + res.body.token)
      .expect(204);
  });
});
