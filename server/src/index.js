// Code part

import jsonwebtoken from "jsonwebtoken";
import express from 'express';
import cors from 'cors';
import auth, {verifyTokenType} from "./routes/auth.js";

let products = [
    {
        ID: 1,
        title: "title1",
        description: "description1",
        img: "../src/assets/svelte.png",
        bids: [{user1: 100}, {user2: 200}],
        expDate: "1709299200"
    },
    {
        ID: 2,
        title: "title2",
        description: "description2",
        img: "../src/assets/svelte.png",
        bids: [{user1: 100}, {user2: 200}],
        expDate: "1709299200"
    },
    {
        ID: 3,
        title: "title3",
        description: "description3",
        img: "../src/assets/svelte.png",
        bids: [{user1: 100}, {user2: 200}],
        expDate: "1709299200"
    },
];

const secretKey = "secret-key-no-one-is-gonna-guess";

// API part

const app = express()

const port = 3000

app.use(express.json({limit: '10mb'}));
app.use(cors());

app.use("/auth", auth);

// default
app.get('/', (req, res) => {
    res.status(200).send("hello world");
})

// products
app.get("/products", (req, res) => {
    // filter products to query parameters
    let title = req.query.name;
    let description = req.query.description;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;

    // find the highest bid
    function findHighest(product) {
        let highest = 0;
        console.log(product.bids);
        for (let i = 0; i < product.bids.length; i++) {
            if (Object.values(product.bids[i])[0] > highest) {
                highest = Object.values(product.bids[i])[0];
            }
        }
        return highest;
    }

    // filter products
    let filteredProducts = products.filter((p) => {
        if (title && !p.title.includes(title)) {
            return false;
        }
        if (description && !p.description.includes(description)) {
            return false;
        }
        if (minPrice && findHighest(p) <= minPrice - 1) {
            return false;
        }
        if (maxPrice && maxPrice <= findHighest(p) - 1) {
            return false;
        }
        return true;
    });

    // get all products
    res.status(200).send(JSON.stringify(filteredProducts));
})

app.get("/products/:productID", (req, res) => {
    // get product with id
    let productID = req.params.productID;
    res.status(200).send(JSON.stringify(products.find((p) => p.ID.toString() === productID.toString())));
})

app.post("/products", (req, res) => {
    // add a new product
    // body: {title, description, img}
    // return: {ID, title, description, img, bids, expDate}
    verifyTokenType(req.headers.authorization, 'admin')
        .then((isValid) => {
            if (isValid) {
                try {
                    let product = req.body;
                    product.ID = products.length + 1;
                    product.bids = [];
                    products.push(product);
                    res.status(201).send(JSON.stringify(product));
                } catch (e) {
                    res.status(500).send("Internal server error");
                }
            } else {
                res.status(401).send("Unauthorized");
            }
        })
        .catch((error) => {
            console.error(error);
        });
})

app.put("/products/:productID", (req, res) => {
    // update product with id
    // body: {title, description, img}
    // return: {ID, title, description, img, bids, expDate}
    verifyTokenType(req.headers.authorization, 'admin')
        .then((isValid) => {
            if (isValid) {
                try {
                    let productID = req.params.productID;
                    let product = req.body;
                    product.ID = productID;
                    let index = products.findIndex((p) => p.ID.toString() === productID.toString());
                    product.bids = products[index].bids;
                    if (!product.bids) {
                        product.bids = products[index].bids;
                    }
                    products[index] = product;
                    res.status(200).send(JSON.stringify(product));
                } catch (e) {
                    res.status(500).send("Internal server error");
                }
            } else {
                res.status(401).send("Unauthorized");
            }
        })
        .catch((error) => {
            console.error(error);
        });
})

app.put("/products/:productID/bid", (req, res) => {
    // bid on product with id
    // body: {bid}
    // return: {ID, title, description, img}
    verifyTokenType(req.headers.authorization, 'user')
        .then((isValid) => {
            if (isValid) {
                try {
                    let productID = req.params.productID;
                    let bid = req.body.bid;
                    let user = jsonwebtoken.decode(req.headers.authorization, secretKey).username;
                    let product = products.find((p) => p.ID.toString() === productID.toString());
                    product.bids.push({[user]: bid});
                    product.bids.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);
                    res.status(200).send(JSON.stringify(bid));
                } catch (e) {
                    res.status(500).send("Internal server error");
                }
            } else {
                res.status(401).send("Unauthorized");
            }
        })
        .catch((error) => {
            console.error(error);
        });
})

app.delete("/products/:productID", (req, res) => {
    //delete product with id
    // check if account is admin
    verifyTokenType(req.headers.authorization, 'admin')
        .then((isValid) => {
            if (isValid) {
                try {
                    let productID = req.params.productID;
                    products = products.filter((p) => p.ID.toString() !== productID.toString());
                    res.status(200).send("Product deleted");
                } catch (e) {
                    res.status(500).send("Internal server error");
                }
            } else {
                res.status(401).send("Unauthorized");
            }
        });
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

