// Code part

let products = [
    {ID: 1, title: "title1", description: "description1", img: "../src/assets/svelte.png", bids: {user1: 100, user2: 200}},
    {ID: 2, title: "title2", description: "description2", img: "../src/assets/svelte.png", bids: {user1: 100, user2: 200}},
    {ID: 3, title: "title3", description: "description3", img: "../src/assets/svelte.png", bids: {user1: 100, user2: 200}},
];

// API part

import express from 'express';
import cors from 'cors';
import auth, {verifyTokenType} from "./routes/auth.js";

const app = express()

const port = 3000

app.use(express.json({limit: '10mb'}));
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

    let findLowest = obj => {
        return Object.keys(obj).reduce((acc, val) => {
            return Math.min(acc, obj[val]);
        }, Infinity);
    }

    let findHighest = obj => {
        return Object.keys(obj).reduce((acc, val) => {
            return Math.max(acc, obj[val]);
        }, -Infinity);
    }

    // filter products
    let filteredProducts = products.filter((p) => {
        if (title && !p.title.includes(title)) {
            return false;
        }
        if (description && !p.description.includes(description)) {
            return false;
        }
        if (minPrice && findLowest(p.bids) <= minPrice-1) {
            return false;
        }
        console.log(findHighest(p.bids));
        if (maxPrice && maxPrice <= findHighest(p.bids)-1) {
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
    // return: {ID, title, description, img}
    verifyTokenType(req.headers.authorization, 'admin')
        .then((isValid) => {
            if (isValid) {
                try {
                    let product = req.body;
                    product.ID = products.length + 1;
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

