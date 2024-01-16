import modules from "../interface";
import express from "express";
const App = modules.app;

function loader(Module: any) {
  const router = express.Router();
  router.all("/(:fn)*", function (req, res, next) {
    if (req.params.fn.slice(0, 1) == "_") return res.json(App.error.limited);
    const fn = req.params.fn;
    if (Module.cache && Module.cache[fn]) {
      res.header("Cache-Control", `public,max-age=${Module.cache[fn]}`);
    }
    next();
  });

  router.post("/:fn", function (req: any, res) {
    (async () => {
      try {
        const module = new Module(req.auth);
        const fn = req.params.fn;
        let ret = null;
        if (module[fn])
          ret = await module[fn](
            req.body instanceof Array
              ? [...req.body]
              : Object.assign({}, req.body)
          );
        else if (Module[fn])
          ret = await Module[fn](Object.assign({}, req.body));
        else throw module.error.param;
        if (ret instanceof Buffer) {
          res.write(ret);
          res.end();
        } else {
          res.json(ret);
        }
      } catch (err) {
        return res.json(App.err(err));
      }
    })();
  });

  router.get("/:fn/:param", function (req: any, res) {
    (async () => {
      try {
        const module = new Module(req.auth);
        const fn = req.params.fn;
        const param = req.params.param;
        let ret = null;
        if (module[fn]) ret = await module[fn](param);
        else if (Module[fn]) ret = await Module[fn](param);
        else throw module.error.param;
        if (ret instanceof Buffer) {
          res.write(ret);
          res.end();
        } else {
          res.json(ret);
        }
      } catch (err) {
        return res.json(App.err(err));
      }
    })();
  });

  router.get("/:fn", function (req: any, res) {
    (async () => {
      try {
        const module = new Module(req.auth);
        const fn = req.params.fn;
        const param = req.query;
        let ret = null;
        if (module[fn]) ret = await module[fn](param);
        else if (Module[fn]) ret = await Module[fn](param);
        else throw module.error.param;
        if (ret instanceof Buffer) {
          res.write(ret);
          res.end();
        } else {
          res.json(ret);
        }
      } catch (err) {
        return res.json(App.err(err));
      }
    })();
  });

  return router;
}

export default loader;
