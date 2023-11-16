import request from "supertest";
import server from "../src/server.js";
import { createPathsTable, createUsersTable, executeQuery, pool } from "../src/db.js";

let token = "";
beforeAll(async () => {
  await createUsersTable();
  const res = await request(server)
    .post("/users/register")
    .send({ username: "test", password: "salainen" });
  token = res.body.token;
});

beforeEach(async () => {
  return createPathsTable();
});

afterEach(async () => {
  await executeQuery("DROP TABLE paths;");
});

afterAll(async () => {
  await executeQuery("DROP TABLE users;");
  return pool.end();
});

describe("Server", () => {
  it("Get all paths", async () => {
    const res = await request(server)
      .get("/paths/")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res.body).toHaveLength(0);
  });
  it("Get paths without token", async () => {
    await request(server)
      .get("/paths/")
      .set("Authorization", "Bearer " + "WRONG TOKEN")
      .expect(401);
  });
  it("Get paths with expired token", async () => {
    await request(server)
      .get("/paths/")
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzAwMTI1ODg0LCJleHAiOjE3MDAxMjY3ODR9.4xUz7OnluIzdCHtCC7QvvfB0KNQQNbzUHrR-nkqfpA0")
      .expect(401);
  });
  it("Insert path", async () => {
    await request(server)
      .post("/paths/")
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti", path: [1, 2, 3] })
      .expect(200)
      .expect("Content-Type", /json/);
  });
  it("Insert path and check it", async () => {
    const res = await request(server)
      .post("/paths/")
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti", path: [1, 2, 3] })
      .expect(200)
      .expect("Content-Type", /json/);
    await request(server)
      .get("/paths/" + res.body.id)
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /json/);
    const res2 = await request(server)
      .get("/paths")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res2.body).toHaveLength(1);
  });
  it("Insert path and update it", async () => {
    const res = await request(server)
      .post("/paths/")
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti", path: [1, 2, 3] })
      .expect(200)
      .expect("Content-Type", /json/);
    const res2 = await request(server)
      .put("/paths/" + res.body.id)
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti2", path: [1, 2, 3, 4] })
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res2.body.title).toBe("reitti2");
    const res3 = await request(server)
      .put("/paths/" + res.body.id)
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti3"})
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res3.body.title).toBe("reitti3");
    expect(res3.body.path).toStrictEqual(res2.body.path);
    const res4 = await request(server)
      .put("/paths/" + res.body.id)
      .set("Authorization", "Bearer " + token)
      .send({ path: [1,2]})
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res4.body.path).toStrictEqual([1,2]);
    expect(res4.body.title).toBe(res3.body.title);
  });
  it("Insert path and delete it", async () => {
    const res = await request(server)
      .post("/paths/")
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti", path: [1, 2, 3] })
      .expect(200)
      .expect("Content-Type", /json/);
    const res2 = await request(server)
      .del("/paths/" + res.body.id)
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res2.body.id).toBe(res.body.id);
    const res3 = await request(server)
      .get("/paths/")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /json/);
    expect(res3.body).toHaveLength(0);
  });
  it("Delete non-existent path", async () => {
    await request(server)
      .del("/paths/1000")
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
  it("Get non-existent path", async () => {
    await request(server)
      .get("/paths/1000")
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
  it("Update non-existent path", async () => {
    await request(server)
      .put("/paths/1000")
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti2", path: [1, 2, 3, 4] })
      .expect(404);
  });
  it("Delete non-numeric id", async () => {
    await request(server)
      .del("/paths/a")
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
  it("Get non-numeric id", async () => {
    await request(server)
      .get("/paths/a")
      .set("Authorization", "Bearer " + token)
      .expect(404);
  });
  it("Update non-numeric id", async () => {
    await request(server)
      .put("/paths/a")
      .set("Authorization", "Bearer " + token)
      .send({ title: "reitti2", path: [1, 2, 3, 4] })
      .expect(404);
  });
});
