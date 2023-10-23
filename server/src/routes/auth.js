import express, { json } from "express";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

const users = [
  { username: "admin", password: "admin" },
  { username: "user", password: "user" },
];

const secretKey = "secret-key-no-one-is-gonna-guess";

router.post("/", async (req, res) => {
  // @todo check the credentials and return an appropriate response
  // For testing purposes a dummy token is returned.
  let credentials = req.body;

  const user = users.find(
    (u) =>
      u.username === credentials.username && u.password === credentials.password
  );
  console.log(user);
  if (user) {
    // return web token
    const token = jsonwebtoken.sign(user, secretKey, { expiresIn: "1h" });
    res.status(200).send({ token });
  } else {
    res.status(401).send("Unauthorized");
  }
});

export default router;