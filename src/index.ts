import express from "express";
import axios from "axios";
import "./data-source";
import cors from "cors";
import fs from "fs";

const port = process.env.PORT || 3001;
const app = express();
const router = express.Router();
const aurRoutes = require("./curator/sources/arch_aur");

app.use(express.json());
app.use(cors());

router.use("/aur", aurRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "If you can read this the backend is running" });
});

app.get("/data", (_req, res) => {
  try {
    const rawData = fs.readFileSync("src/data.json");
    const data = JSON.parse(rawData.toString());
    console.log(rawData);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/*

PACKAGE SEARCH ENDPOINT

takes input from search query
returns a list of packages that match the search query from unified package database

query database with search string



*/

app.get("/aur/info/:name", async (req, res) => {
  try {
    const rawData = await fetch(
      process.env.ARCH_AUR + "/info/" + req.params.name
    );
    res.send(await rawData.json());
    return;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

app.listen(port, () => {
  console.log(`App running on Port ${port}`);
});

module.exports = router;
