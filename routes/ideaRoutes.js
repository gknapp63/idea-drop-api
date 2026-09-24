import express from "express";
import Idea from "../models/Idea.js";
import mongoose from "mongoose";

const router = express.Router();

// @route       GET /api/ideas
// @description GET all ideas
// @access      public
// @query       _limit (optional limit for ideas returned)
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Idea.find().sort({ createdAt: -1 }); //Sort Descending

    if(!isNaN(limit)) {
      query.limit(limit);
    }

    const ideas = await query.exec();
    //console.log(ideas);
    res.json(ideas);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route       GET /api/ideas/:id
// @description GET single idea by ID
// @access      public
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }
    const idea = await Idea.findById(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    //console.log(idea);
    res.json(idea);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route       POST /api/ideas
// @description Create new idea
// @access      protected
router.post("/", async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary, and description are required");
    }

    const newIdea = new Idea({
      title,
      summary,
      description,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
            ? tags
            : [],
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (err) {
    next(err); // forwards to errorHandler middleware
  }
});

// @route       DELETE /api/ideas/:id
// @description Delete idea by ID
// @access      public
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }
    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) {
      res.status(404);
      throw new Error("Idea not found");
    }
    res.json({ message: "Idea deleted" });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route       PUT /api/ideas/:id
// @description Update idea by ID
// @access      protected
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not found");
    }

    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary, and description are required");
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        description,
        tags:
          typeof tags === "string"
            ? tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : Array.isArray(tags)
              ? tags
              : [],
      },
      { new: true, runValidators: true },
    );

    if (!updatedIdea) {
      res.status(404);
      throw new Error("Idea not found");
    }

    res.json(updatedIdea);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
