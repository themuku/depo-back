import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";

import express from "express";
import router from "./routes.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());

const prisma = new PrismaClient();

app.use(router);

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
