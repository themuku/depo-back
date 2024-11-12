import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Salam, world!");
});

router.get("/all", async (req, res) => {
  const products = await prisma.product.findMany();

  if (products.length === 0) {
    return res.status(404).json({ error: "No products found" });
  }

  return res.json(products);
});

router.post("/add-one", async (req, res) => {
  const data = req.body;

  if (
    !data.productName ||
    !data.price ||
    !data.stockAmount ||
    !data.description
  ) {
    return res.status(400).json({
      error: "Please provide product name, price, stock and description",
    });
  }

  const product = await prisma.product.create({
    data,
  });

  if (!product) {
    return res.status(400).json({ error: "Error creating product" });
  }

  return res.json(product);
});

router.post("/add-many", async (req, res) => {
  const { data } = req.body;

  const createdProducts = await prisma.product.createMany({
    data,
  });

  if (!createdProducts) {
    return res.status(400).json({ error: "Error creating products" });
  }

  return res.json(createdProducts);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Bu id ile mehsul movcud deil!" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching product" });
  }
});

router.patch("/buy-one/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        stock: {
          decrement: 1,
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Bu id ile mehsul movcud deil!" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error buying product" });
  }
});

router.post("/add-user", async (req, res) => {
  try {
    const { data } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingUser)
      return res
        .status(409)
        .json({ message: "User with this email is already existing" });

    const user = await prisma.user.create({
      data,
    });

    console.log(user);

    res.cookie("token", user, { httpOnly: true });

    return res.status(201).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
});

export default router;
