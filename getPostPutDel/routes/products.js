const express = require("express");
const router = express.Router();
const { products } = require("../data");

// GET /api/products
router.get("/", (req, res) => {
  res.json({ products: products });
});

// GET /api/products/:id
//get product by id (path param)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((item) => item.id === parseInt(id));
  if (product) res.json(product);
  else res.status(404).json({ message: `Product with ID: ${id} not found` });
});

// POST /api/products
//add product (body data)
router.post("/", (req, res) => {
  const { id, name, price, stock } = req.body;

  //check if id, name, price, stock are present in body data
  if (!id || !name || !price || !stock) {
    return res.status(400).json({
      message: "Missing required fields: id, name, price, and stock.",
    });
  }
  //check if price are valid
  if (typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid price: must be a positive number" });
  }
  //check if stock are valid
  if (typeof stock !== "number" || stock < 0) {
    return res
      .status(400)
      .json({ message: "Invalid stock: must be positive number" });
  }
  //check if id is unique(not already in array)
  if (products.find((p) => p.id === id)) {
    return res.status(400).json({ message: "Product id must be unique" });
  }

  // add product to array
  const newProduct = { id, name, price, stock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
//update product by id (path param + body data)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const productData = req.body;
  //find index of product by id in array
  const productInd = products.findIndex((item) => item.id === parseInt(id));

  // if product not found, return 404
  if (productInd === -1)
    return res.status(404).json({ message: `Product not found` });

  if (typeof productData.price !== "number" || productData.price <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid price: must be a positive number" });
  }
  //check if stock are valid
  if (typeof productData.stock !== "number" || productData.stock < 0) {
    return res
      .status(400)
      .json({ message: "Invalid stock: must be positive number" });
  }

  // update product in array
  products[productInd] = productData;
  res.json({ message: `product with ID: ${id} updated`, products: products });
});

// DELETE /api/products
//delete product by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const productInd = products.findIndex((item) => item.id === parseInt(id));

  if (productInd !== -1) {
    //delete product into array
    products.splice(productInd, 1);
    res.json({ message: `Product with ID: ${id} deleted`, products: products });
  } else {
    res.status(404).json({ message: `Product not found` });
  }
});

module.exports = router;
