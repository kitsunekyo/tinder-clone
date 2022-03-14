const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { getDb, close } = require("./db");

const requireAuth = require("./middleware/requireAuth");

const uri = process.env.CONNECTION_STRING;
const PORT = process.env.PORT || 8000;
const SECRET = process.env.SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const cookieLifetime = 24 * 2 * 60 * 60 * 1000; // 48h in seconds

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.post("/signup", async (req, res) => {
  const db = await getDb();
  const { email, password } = req.body;

  const userId = uuidv4();
  const sanitizedEmail = email.toLowerCase();
  const hash = bcrypt.hashSync(password, 10);

  const users = await db.collection("users");
  const existingUser = await users.findOne({ email: sanitizedEmail });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = {
    user_id: userId,
    email: sanitizedEmail,
    hashed_password: hash,
  };

  const createdUser = await users.insertOne(user);
  const token = jwt.sign({ sub: userId, email: user.email }, SECRET, {
    expiresIn: "2 days",
  });

  return res
    .status(201)
    .cookie("access-token", token, {
      // httpOnly: true,
      maxAge: cookieLifetime,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .send();
});

app.post("/login", async (req, res) => {
  const db = await getDb();

  const { email, password } = req.body;
  const sanitizedEmail = email.toLowerCase();

  const users = await db.collection("users");
  const user = await users.findOne({ email: sanitizedEmail });

  if (!user) {
    return res.status(403).send();
  }

  const isValid = bcrypt.compareSync(password, user.hashed_password);

  if (!isValid) {
    return res.status(403).send();
  }

  const token = jwt.sign({ sub: user.user_id, email: user.email }, SECRET, {
    expiresIn: "2days",
  });

  return res
    .status(201)
    .cookie("access-token", token, {
      // httpOnly: true,
      maxAge: cookieLifetime,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .send();
});

app.post("/logout", requireAuth, (req, res) => {
  return res.clearCookie("access-token").end();
});

app.get("/me", requireAuth, async (req, res) => {
  const db = await getDb();

  const users = await db.collection("users");
  const user = await users.findOne({ user_id: req.user.userId });

  if (!user) {
    return res.status(403).json({ message: "Could not find user" });
  }

  const { hashed_password, ...safeUser } = user;

  res.json(safeUser);
});

app.put("/me", requireAuth, async (req, res) => {
  const db = await getDb();

  const userDocs = db.collection("users");

  await userDocs.findOneAndUpdate(
    { user_id: req.user.userId },
    {
      $set: req.body,
    }
  );

  return res.status(204).send();
});

app.get("/users", requireAuth, async (req, res) => {
  const db = await getDb();

  const requestingUserId = req.user.userId;
  const genderFilter = req.query.gender;

  const filter = {
    ...(genderFilter
      ? {
          user_id: { $ne: requestingUserId },
          gender_identity: { $eq: genderFilter },
        }
      : undefined),
  };

  const userDocs = db.collection("users");

  const requestingUser = await userDocs.findOne({
    user_id: requestingUserId,
  });
  const users = await userDocs.find(filter).toArray();

  const potentialMatches = users.filter(
    (user) =>
      !requestingUser.likes?.includes(user.user_id) &&
      !requestingUser.dislikes?.includes(user.user_id)
  );

  return res.json(potentialMatches);
});

app.post("/swipe", requireAuth, async (req, res) => {
  const db = await getDb();

  const userId = req.user.userId;
  const { swipedUserId, result } = req.body;

  if (!swipedUserId || !result) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const userDocs = db.collection("users");

  const user = await userDocs.findOneAndUpdate(
    { user_id: userId },
    {
      $push: {
        [result === "like" ? "likes" : "dislikes"]: swipedUserId,
      },
    }
  );

  if (!user) {
    return res.status(404).json({ message: "Could not find user" });
  }

  return res.status(201).send();
});

app.delete("/matches", requireAuth, async (req, res) => {
  const db = await getDb();

  const userId = req.user.userId;
  const { unmatchUserId } = req.body;

  if (!unmatchUserId) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const userDocs = db.collection("users");

  const user = await userDocs.findOneAndUpdate(
    { user_id: userId },
    {
      $pull: {
        likes: unmatchUserId,
      },
    }
  );

  if (!user) {
    return res.status(404).json({ message: "Could not find user" });
  }

  return res.status(200).send();
});

app.get("/matches", requireAuth, async (req, res) => {
  const db = await getDb();
  const userId = req.user.userId;
  const userDocs = db.collection("users");

  const user = await userDocs.findOne({ user_id: userId });

  if (!user.likes) {
    return res.send([]);
  }

  const likedUsers = await userDocs
    .find({ user_id: { $in: user.likes } })
    .toArray();
  const matches = likedUsers.filter(
    (match) => Array.isArray(match.likes) && match.likes.includes(userId)
  );

  const sanitizedMatches = matches.map(({ user_id, url, first_name }) => ({
    user_id,
    url,
    first_name,
  }));

  return res.json(sanitizedMatches);
});

app.get("/messages/:partnerId", requireAuth, async (req, res) => {
  const db = await getDb();
  const userId = req.user.userId;
  const partnerId = req.params.partnerId;

  const messages = await db
    .collection("messages")
    .find({
      $or: [
        { from_userId: userId, to_userId: partnerId },
        { from_userId: partnerId, to_userId: userId },
      ],
    })
    .toArray();

  return res.json(messages);
});

app.post("/messages", async (req, res) => {
  const { to_userId, message } = req.body;
  const from_userId = req.user.userId;

  const db = await getDb();
  const messageDocs = db.collection("messages");
  const newMessage = await messageDocs.insertOne({
    from_userId,
    to_userId,
    message,
    timestamp: new Date().toUTCString(),
  });
  return res.status(201).send();
});

const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
