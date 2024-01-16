import { Request } from 'express';
import path from "path";
import fs from "fs";
import crypto from "crypto";
import model from "../model";
import App from "./app";
import config from "../config.json";
import jwt from "jsonwebtoken";
const Account = model.account;

const __salt = config.salt;

const __error__ = Object.assign(
  {
    verify: App.error.reg("帐号或密码错误！"),
    captcha: App.error.reg("验证码错误！"),
    existed: App.error.existed("帐号"),
    existedmail: App.error.existed("邮箱"),
    existedphone: App.error.existed("电话"),
    notexisted: App.error.existed("帐号", false),
    usertooshort: App.error.reg("用户名太短！"),
    passtooshort: App.error.reg("密码太短！")
  },
  App.error
);

export interface ILogin {
  username: string;
  passwd: string;
}

export interface IAccount {
  username?: string;
  nickname: string;
  passwd?: string;
  avatar: string;
  email?: string;
  phone?: string;
  roles: string;
  lastlogin: number;
}

class AccountApp extends App {
  session: any;
  saftKey: string[];
  constructor(session: any) {
    super([
      { fun: App.ok, name: "login", msg: "登录成功" },
      { fun: App.ok, name: "logout", msg: "登出成功" },
      { fun: App.ok, name: "get", msg: "获取成功" }
    ]);
    this.session = session;
    this.name = "用户";
    this.saftKey = ["id"].concat(
      Account.keys.filter(k => ["passwd"].indexOf(k) < 0)
    );
  }

  get error() {
    return __error__;
  }

  static get cache() {
    return {
      avatar: 86900
    };
  }

  async login(data: ILogin) {
    const keys = ["username", "passwd"];

    if (!App.haskeys(data, keys)) {
      throw this.error.param;
    }

    if (data.username.length < 5) {
      throw this.error.usertooshort;
    }

    if (data.passwd.length < 5) {
      throw this.error.passtooshort;
    }

    data = App.filter(data, keys) as ILogin;

    try {
      const account = await this.exist(data.username, true);
      if (!account) {
        throw this.error.verify;
      } else {
        const sha256 = crypto.createHash("sha256");
        const passwd = sha256.update(data.passwd + __salt).digest("hex");
        if (account.passwd != passwd) {
          throw this.error.verify;
        }
      }

      account.lastlogin = new Date().valueOf() / 1000;
      account.save();

      const userInfo = App.filter(account, this.saftKey);
      userInfo.roles = JSON.parse(userInfo.roles);
      const accessToken = jwt.sign(userInfo, config.accessSecret, {
        expiresIn: "7d"
      });
      const refreshToken = jwt.sign(userInfo, config.refreshSecret, {
        expiresIn: "30d"
      });
      const expires = new Date().valueOf() + 7 * 24 * 60 * 60 * 1000;

      return this.ok.oklogin({ ...userInfo, accessToken, refreshToken, expires });
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.network(err);
    }
  }

  async refreshTokens(data: { refreshToken: string }) {
    const keys = ["refreshToken"];

    if (!App.haskeys(data, keys)) {
      throw this.error.param;
    }

    data = App.filter(data, keys) as { refreshToken: string };

    try {
      const decoded = jwt.verify(data.refreshToken, config.refreshSecret);
      const userInfo = App.filter(decoded, this.saftKey);
      const accessToken = jwt.sign(userInfo, config.accessSecret, {
        expiresIn: "7d"
      });
      const refreshToken = jwt.sign(userInfo, config.refreshSecret, {
        expiresIn: "30d"
      });
      const expires = new Date().valueOf() + 7 * 24 * 60 * 60 * 1000;

      return this.ok.login({ ...userInfo, accessToken, refreshToken, expires });
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.network(err);
    }
  }

  async create(data: IAccount, onlyData = false) {
    const keys = ["username", "passwd"];

    if (!App.haskeys(data, keys)) {
      throw this.error.param;
    }

    data = App.filter(data, Account.keys) as IAccount;

    try {
      data.nickname = data.username!;
      data.lastlogin = new Date().valueOf() / 1000;
      const sha256 = crypto.createHash("sha256");
      data.passwd = sha256.update(data.passwd + __salt).digest("hex");
      data.avatar = data.avatar || "";
      data.roles = "[]";
      const account = await super.new(data, Account, "username");
      if (onlyData) return account;
      return this.ok.create(App.filter(account, this.saftKey));
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async update(data: IAccount & { oldpasswd: string }) {
    const keys = ["username"];

    if (!App.haskeys(data, keys)) {
      throw this.error.param;
    }

    data = App.filter(data, Account.keys.concat(["id", "oldpasswd"])) as IAccount & { oldpasswd: string };

    try {
      const account = await this.info(true, Account.keys) as any;
      if (account.username != data.username) {
        throw this.error.limited;
      }
      // 用户名不可更改
      data.username = undefined;
      if (data.passwd) {
        let sha256 = crypto.createHash("sha256");
        const passwd = sha256.update(data.oldpasswd + __salt).digest("hex");
        if (account.passwd != passwd) {
          throw this.error.verify;
        }
        sha256 = crypto.createHash("sha256");
        data.passwd = sha256.update(data.passwd + __salt).digest("hex");
      }

      // Mail 更新重复检查
      if (data.email && data.email != account.email) {
        const account = await Account.findOne({
          where: {
            email: data.email
          }
        });
        if (account) {
          throw this.error.existedmail;
        }
      }

      // Phone 更新重复检查
      if (data.phone && data.phone != account.phone) {
        const account = await Account.findOne({
          where: {
            phone: data.phone
          }
        });
        if (account) {
          throw this.error.existedphone;
        }
      }
      return this.ok.update(
        App.filter(await super.set(data, Account), this.saftKey)
      );
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async exist(username: string, onlyData = false) {
    try {
      const data = await Account.findOne({
        where: {
          username: username
        }
      });
      if (onlyData) return data;
      return this.ok.get(!!data);
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async exists(data: { email?: string, phone?: string }, onlyData = false) {
    const keys = ["email", "phone"];

    if (!App.hasone(data, keys)) {
      throw this.error.param;
    }

    data = App.filter(data, keys);
    try {
      const account = await Account.findOne({
        where: data
      });
      if (onlyData) return account;
      return this.ok.get(!!account);
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  logout() {
    if (!this.islogin) {
      throw this.error.nologin;
    }
    this.session.account_login = undefined;
    return this.ok.logout();
  }

  get islogin() {
    return this.session && this.session.account_login;
  }

  async info(onlyData = false, fields?: string[]) {
    if (!this.islogin) {
      throw this.error.nologin;
    }
    fields = fields || this.saftKey;
    const data = await Account.findOne({
      where: {
        username: this.session.account_login.username
      }
    });

    data.lastlogin = new Date().valueOf() / 1000;
    data.save();

    if (onlyData == true) return App.filter(data, fields);
    return this.ok.get(App.filter(data, fields));
  }

  async avatar(username: any) {
    const data = await Account.findOne({
      where: {
        username
      },
      attributes: ["avatar"]
    });

    let avatar = path.join(process.cwd(), "/public/img/user.png");

    if (data && data.avatar)
      avatar = path.join(process.cwd(), config.file.upload, data.avatar);

    const buffer = fs.readFileSync(avatar);
    return buffer;
  }

  async find(query: any, fields?: string[], onlyData = false) {
    const ops = {
      id: App.ops.in,
      username: App.ops.in
    };
    query = App.filter(query, Object.keys(ops));
    try {
      const data: any = {
        index: 0,
        count: -1,
        query
      };
      data.fields =
        fields || this.saftKey.filter(k => ["email", "phone"].indexOf(k) < 0);
      const queryData = await super.query(data, Account, ops);
      if (onlyData) return queryData;
      return this.ok.query(queryData);
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  get user() {
    if (!this.islogin) {
      throw this.error.nologin;
    }
    return this.session.account_login;
  }

  static isAuthenticated(req: Request) {
    try {
      let token = req.get("authorization");
      if (!token) {
        throw this.error.nologin;
      }
      token = token.split(" ")[1];
      return jwt.verify(token, config.accessSecret);
    } catch (error) {
      throw App.error.nologin;
    }
  }
}

export default AccountApp;
