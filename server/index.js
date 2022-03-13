const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const uri = process.env.CONNECTION_STRING;
const PORT = 8000;
const SECRET = process.env.SECRET;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const userId = uuidv4();
  const sanitizedEmail = email.toLowerCase();
  const hash = bcrypt.hashSync(password, 10);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("tinderclone");
    const users = await db.collection("users");
    const existingUser = await users.findOne({ email: sanitizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = {
      userId,
      email: sanitizedEmail,
      hashed_password: hash,
    };

    const createdUser = await users.insertOne(user);
    const token = jwt.sign({ sub: user.email }, SECRET, {
      expiresIn: 60 * 24,
    });

    return res
      .status(201)
      .cookie("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .send();
  } catch (e) {
    return res.status(500).json(e);
  } finally {
    client.close();
  }
});

app.post("/logout", (req, res) => {
  return res.clearCookie("access-token").end();
});

app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  const sanitizedEmail = email.toLowerCase();

  try {
    await client.connect();
    const db = client.db("tinderclone");
    const users = await db.collection("users");
    const user = await users.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(403).send();
    }

    const isValid = bcrypt.compareSync(password, user.hashed_password);

    if (!isValid) {
      return res.status(403).send();
    }

    const token = jwt.sign({ sub: user.email }, SECRET, {
      expiresIn: 60 * 24,
    });

    console.log(user.email);

    return res
      .status(201)
      .cookie("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .send();
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/me", (req, res) => {
  const client = new MongoClient(uri);
  const token = req.cookies["access-token"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    jwt.verify(token, SECRET, async (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: "Invalid token" });
      }

      await client.connect();
      const db = client.db("tinderclone");
      const users = await db.collection("users");
      const user = await users.findOne({ email: decoded.sub });

      if (!user) {
        return res.status(403).json({ message: "Could not find user" });
      }

      const { hashed_password, ...safeUser } = user;

      res.json(safeUser);
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("tinderclone");
    const userDocs = db.collection("users");

    const users = await userDocs.find().toArray();

    return res.json(users);
  } catch (e) {
    return res.status(500).json(e);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});