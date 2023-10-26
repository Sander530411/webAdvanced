import express, {json} from "express";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

const users = [
    {username: "admin", password: "admin", type: "admin"},
    {username: "user", password: "user", type: "user"},
];

const secretKey = "secret-key-no-one-is-gonna-guess";

export function verifyTokenType(token, type) {
    return new Promise((resolve, reject) => {
        // verify token
        jsonwebtoken.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log(err);
                resolve(false); // Token is invalid
            } else {
                console.log(decoded);
                if (decoded.type === type) {
                    resolve(true); // Token is valid and matches the specified type
                } else {
                    resolve(false); // Token is valid but doesn't match the specified type
                }
            }
        });
    });
}

router.post("/", async (req, res) => {
    let credentials = req.body;

    const user = users.find(
        (u) =>
            u.username === credentials.username && u.password === credentials.password
    );
    console.log(user);
    if (user) {
        // return web token

        const token = jsonwebtoken.sign(user, secretKey, {expiresIn: "1h"});
        res.status(200).send({token});
    } else {
        res.status(401).send("Unauthorized");
    }
});

export default router;