import express from "express";
import Idea from "../models/Idea.js";

const router = express.Router();

// @route       GET /api/ideas
// @description GET all ideas
// @access      public
router.get("/", async (req, res, next) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route       POST /api/ideas
// @description Create new idea
// @access      protected
router.post("/", (req, res) => {
  const { title, description } = req.body;
  res.send(`${title}, ${description}`);
});

export default router;
