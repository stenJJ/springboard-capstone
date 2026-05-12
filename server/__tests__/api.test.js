const fs = require("fs");
const path = require("path");
const request = require("supertest");
const app = require("../app");

const usersFile = path.join(__dirname, "../data/users.json");
const clipsFile = path.join(__dirname, "../data/clips.json");

function resetTestData() {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  fs.writeFileSync(clipsFile, JSON.stringify([], null, 2));
}

async function registerTestUser(username = "testuser", email = "test@example.com") {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      username,
      email,
      password: "password123"
    });

  return response.body.token;
}

beforeEach(() => {
  resetTestData();
});

describe("ClipVault API", () => {
  test("GET /api returns API health message", async () => {
    const response = await request(app).get("/api");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("ClipVault API is running");
  });

  test("POST /api/auth/register creates a user and returns token", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe("testuser");
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  test("POST /api/auth/login logs in an existing user", async () => {
    await registerTestUser();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: "testuser",
        password: "password123"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toBe("testuser");
  });

  test("GET /api/clips blocks unauthenticated users", async () => {
    const response = await request(app).get("/api/clips");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthorized");
  });

  test("POST /api/clips creates a clip for logged-in user", async () => {
    const token = await registerTestUser();

    const response = await request(app)
      .post("/api/clips")
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://www.youtube.com/watch?v=abc123&t=30s",
        title: "Test Clip",
        status: "watch_later",
        tags: "test, youtube",
        notes: "Testing clip creation"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.clip.title).toBe("Test Clip");
    expect(response.body.clip.normalizedUrl).toBe(
      "https://www.youtube.com/watch?v=abc123"
    );
  });

  test("POST /api/clips prevents duplicate normalized URLs for the same user", async () => {
    const token = await registerTestUser();

    await request(app)
      .post("/api/clips")
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://www.youtube.com/watch?v=abc123&t=30s",
        title: "First Clip"
      });

    const duplicateResponse = await request(app)
      .post("/api/clips")
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://www.youtube.com/watch?v=abc123",
        title: "Duplicate Clip"
      });

    expect(duplicateResponse.statusCode).toBe(409);
    expect(duplicateResponse.body.error).toBe("This clip is already saved");
  });

  test("GET /api/clips returns clips for logged-in user", async () => {
    const token = await registerTestUser();

    await request(app)
      .post("/api/clips")
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://www.youtube.com/watch?v=abc123",
        title: "Saved Clip"
      });

    const response = await request(app)
      .get("/api/clips")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.clips).toHaveLength(1);
    expect(response.body.clips[0].title).toBe("Saved Clip");
  });
});