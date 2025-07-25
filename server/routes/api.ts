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
router.use("/capsule", loader(modules.capsule));

router.get("/", function (req, res) {
  res.redirect('http://doc.time-pack.com');
});

export default router;
