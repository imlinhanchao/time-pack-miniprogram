import express from "express";
import modules from "../interface";
import loader from "./loader";
import access from "./access";
import lib from "./lib";
const router = express.Router();

// add the router in here
router.use(access);
router.use("/lib", lib);
router.use("/account", loader(modules.account));
router.use("/product", loader(modules.product));
router.use("/custom", loader(modules.custom));
router.use("/order", loader(modules.order));

router.get("/", function (req, res) {
  res.render("index", { title: "API" });
});

export default router;
