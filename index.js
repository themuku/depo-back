import bodyParser from "body-parser";
import cors from "cors";

import express from "express";
import router from "./routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/products", router);

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
