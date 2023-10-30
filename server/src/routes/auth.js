import express, {json} from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const users = [
    {username: "admin", password: "$2a$10$BXUq9t.H8mdK1owr0fO3/eX0J9LmAzVkE.AatC2.1QDHCkzwz/A5W", type: "admin"},
    {username: "user", password: "$2a$10$YYm.Bm0eq2LnBHgaqjZlnuxWXCI1pPf8QMlV07gEfgTAwpA79VBOm", type: "user"},
];

const secretKey = "secret-key-no-one-is-gonna-guess";

export function verifyTokenType(token, type) {
    return new Promise((resolve, reject) => {
        // verify token
        jsonwebtoken.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error(err);
                resolve(false); // Token is invalid
            } else {
                if (decoded.type === type) {
                    resolve(true); // Token is valid and matches the specified type
                } else {
                    resolve(false); // Token is valid but doesn't match the specified type
                }
            }
        });
    });
}

router.post("/login", async (req, res) => {
    let credentials = req.body;

    const user = users.find((u) => u.username === credentials.username);

    if (user) {
        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (isPasswordMatch) {
            const token = jsonwebtoken.sign({ username: user.username, type: user.type }, secretKey, { expiresIn: "1h" });
            res.status(200).send({ token });
        } else {
            res.status(401).send("Unauthorized");
        }
    } else {
        res.status(401).send("Unauthorized");
    }
});

router.post("/register", async (req, res) => {
    let credentials = req.body;

    const user = users.find((u) => u.username === credentials.username);

    if (user) {
        res.status(409).send("Username already exists");
    } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        users.push({ username: credentials.username, password: hashedPassword, type: "user" });

        res.status(201).send("User created");
    }
});

export default router;