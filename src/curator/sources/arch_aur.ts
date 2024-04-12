import express from "express";
import axios from "axios";
import "./data-source";
import cors from "cors";

const app = express();
const router = express.Router();
app.use(cors());

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

module.exports = router;
