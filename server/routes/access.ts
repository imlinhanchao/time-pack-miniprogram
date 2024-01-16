import express from "express";
import modules from "../interface";
const router = express.Router();
const Account = modules.account;
const App = modules.app;

router.all("/:interface/(:fn)*", function (req: any, res, next) {
  try {
    // 允许不登录访问的接口，若所有函数都允许，则写为 interface: '*'
    const no_login_interface: Record<string, string[] | '*'> = {
      account: ["login", "query", "exist", "create", "exists", "avatar"]
    };

    if (
      !no_login_interface[req.params.interface] ||
      (no_login_interface[req.params.interface] != "*" &&
        !no_login_interface[req.params.interface].includes(req.params.fn))
    ) {
      const account_login = Account.isAuthenticated(req);
      req.auth = { account_login };
    }

    next();
  } catch (err) {
    return res.json(App.err(err));
  }
});

export default router;
