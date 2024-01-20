import express from "express";
import multer from "multer";
const router = express.Router();
import modules from "../interface";
const App = modules.app;
const Lib = modules.lib;

router.post("/upload", multer().array("file"), (req: any, res, _) => {
  (async () => {
    try {
      res.json(await new Lib(req.auth).upload(req));
    } catch (err: any) {
      return res.json(App.err(err));
    }
  })();
});

export default router;
