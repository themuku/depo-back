import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Salam, world!");
});

router.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();

  if (products.length === 0) {
    return res.status(404).json({ error: "No products found" });
  }

  return res.json(products);
});

router.post("/products/add-one", async (req, res) => {
  const prodBody = req.body;

  const product = await prisma.product.create({
    data: prodBody,
  });

  if (!product) {
    return res.status(400).json({ error: "Error creating product" });
  }

  return res.json(product);
});

router.post("/products/add-many", async (req, res) => {
  const { data } = req.body;

  const createdProducts = await prisma.product.createMany({
    data,
  });

  if (!createdProducts) {
    return res.status(400).json({ error: "Error creating products" });
  }

  return res.json(createdProducts);
});

router.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.json(product);
});

export default router;
