// Code part

// format: {ID, title, description, bids:{user amount}}
// example: {1, "title", "description", {{"user1", 100}, {"user2", 200}}}
let products = [];


// API part

import express from 'express';
const app = express()
import cors from 'cors';

const port = 3000

import auth from './routes/auth.js';

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
  // body: {title, description}
  // return: {ID, title, description}
  let product = req.body;
  product.ID = products.length+1;
  products.push(product);
  res.status(200).send(JSON.stringify(product));
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

