// Code part

let products = [
    {ID: 1, title: "title1", description: "description1", img: "../src/assets/svelte.png", bids: {user1: 100, user2: 200}},
    {ID: 2, title: "title2", description: "description2", img: "../src/assets/svelte.png", bids: {user1: 100, user2: 200}},
    {ID: 3, title: "title3", description: "description3", img: "../src/assets/svelte.png", bids: {user1: 100, user2: 200}},
];

// API part

import express from 'express';

const app = express()
import cors from 'cors';
import auth, {verifyTokenType} from "./routes/auth.js";

const port = 3000

app.use(express.json());
app.use(cors());

app.use("/auth", auth);

// default
app.get('/', (req, res) => {
    console.log(req);
    res.status(200).send("hello world");
})

// products
app.get("/products", (req, res) => {
    // filter products to query parameters
    let title = req.query.name;
    let description = req.query.description;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;

    // get all products
    res.status(200).send(JSON.stringify(products));
})

app.get("/products/:productID", (req, res) => {
    // get product with id
    let productID = req.params.productID;
    res.status(200).send(JSON.stringify(products[productID]));
})

app.post("/products", (req, res) => {
    // add a new product
    // body: {title, description, img}
    // return: {ID, title, description, img}
    verifyTokenType(req.headers.authorization, 'admin')
        .then((isValid) => {
            if (isValid) {
                try {
                    let product = req.body;
                    product.ID = products.length + 1;
                    console.log(product.img);
                    products.push(product);
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

app.put("/products/:productID", (req, res) => {
    // update product with id
    // body: {title, description}
    // return: {ID, title, description}
    let product = req.body;
    let productID = req.params.productID;
    products[productID] = product;
    res.status(200).send(JSON.stringify(product));
})

app.delete("/products/:productID", (req, res) => {
    //delete product with id
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

