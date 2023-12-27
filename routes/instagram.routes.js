/* eslint-disable no-unused-vars */
import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/user.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";

const router = express.Router();

// GET request to render the "index" page
router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

// POST request to handle user registration
router.post("/register", registerController);
router.post("/login", loginController);

router.get("/login", function (req, res) {
  res.render("login", { footer: false });
});

router.get("/feed", function (req, res) {
  res.render("feed", { footer: true });
});

router.get("/profile", function (req, res) {
  res.render("profile", { footer: true });
});

router.get("/search", function (req, res) {
  res.render("search", { footer: true });
});

router.get("/edit", function (req, res) {
  res.render("edit", { footer: true });
});

router.get("/upload", function (req, res) {
  res.render("upload", { footer: true });
});

export default router;
