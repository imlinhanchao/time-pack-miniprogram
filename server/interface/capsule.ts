import { Op } from "sequelize";
import AccountApp, { IAccount } from "./account";
import App from "./app";
import model from "@/model";
import WxApi from "@lib/wx";
const Capsule = model.capsule;

export interface ICapsule {
  id?: string;
  user: string;
  title: string;
  content: string;
  time_out: number;
  type: number;
  gift: boolean;
  status: number;
  create_user: string;
  create_nick: string;
  create_avatar: string;
}
const __error__ = Object.assign(
  {
    nottime: App.error.reg("还没到时间"),
    notfound: App.error.reg("胶囊不存在"),
    notyours: App.error.reg("这不是你的胶囊"),
    canopen: App.error.reg("你还不能打开胶囊"),
  },
  App.error
);

class CapsuleApp extends App {
  session: any;
  saftKey: string[];
  account: AccountApp;
  constructor(session: any) {
    super([
    ]);
    this.session = session;
    this.name = "胶囊";
    this.saftKey = ["id", "create_time", "update_time"].concat(Capsule.keys);
    this.account = new AccountApp(session);
  }

  get error() {
    return __error__;
  }

  async create(data: ICapsule, onlyData = false) {
    const keys = Capsule.keys;

    const creator = await this.account.info(true) as IAccount;

    data.user = '';
    data.status = !data.gift ? 1 : 0; // 如果不是礼物，则状态为1（已封存），否则为0（待领取）
    data.type = data.type || 1; // 默认类型为1
    data.create_nick = creator.nickname;
    data.create_avatar = creator.avatar;
    data.create_user = creator.openid!;

    if (!App.haskeys(data, keys)) {
      throw this.error.param;
    }

    data = App.filter(data, Capsule.keys) as ICapsule;

    try {
      data.type = data.type || 1; // 默认类型为1
      if (!data.gift) data.user = this.account.user.openid; 
      const modelData = await super.new(data, Capsule);
      if (onlyData) return modelData;
      return this.ok.create(
        App.filter(modelData, this.saftKey.filter(k => k != 'content'))
      );
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async update(data: ICapsule, onlyData = false) {
    const keys = ['id'];

    if (!App.haskeys(data, keys)) {
      throw this.error.param;
    }

    data = App.filter(data, ['id', 'user', 'status']) as ICapsule;

    try {
      const account = this.account.user;
      let capsule = await this.read(data.id!, true);
      if (account.openid != capsule.user && capsule.user || capsule.status !== 0) {
        throw this.error.notyours;
      }
      
      capsule = await super.set(data, Capsule)

      if (onlyData) return capsule;
      return this.ok.update(
        App.filter(capsule, this.saftKey.filter(k => k != 'content'))
      );
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async read(id: string, onlyData=false) {
    try {
      const account = this.account.user as any;
      let capsule = (await Capsule.findOne({
        where: {
          id
        }
      })).dataValues;
      if (account.openid != capsule?.user && capsule?.user) {
        throw this.error.notyours;
      }

      if (capsule.time_out < Date.now()) {
        capsule.content = '封存中...';
      }

      if (onlyData) return capsule;
      
      return this.ok.get(App.filter(capsule, this.saftKey));
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async open({ id }: { id: string }, onlyData=false) {
    try {
      const account = this.account.user as any;
      let capsule = await Capsule.findOne({
        where: {
          id
        }
      });

      if (!capsule) {
        throw this.error.notfound;
      }

      if (!capsule.user && capsule?.create_user != account.openid) {
        throw this.error.notyours;
      } else if (capsule.user && account.openid != capsule.user && capsule?.create_user != account.openid) {
        throw this.error.notyours;
      }

      if (capsule.time_out > Date.now()) {
        throw this.error.nottime;
      }

      if (capsule.user && account.openid != capsule.user && capsule.status == 1) {
        throw this.error.canopen;
      }

      if (capsule.status != 2 && (!capsule.user || capsule.user == account.openid)) {
        capsule.status = 2;
        await capsule.save();
      }

      if (onlyData) return capsule;
      
      return this.ok.get(App.filter(capsule, this.saftKey));
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async list(data: any, onlyData = false) {
    const ops = {
      title: App.ops.like,
    };

    const query = App.filter(data.query || data, Object.keys(ops));

    try {
      const where = {
          [Op.or]: [
            { user: (await new AccountApp(this.session).user.openid) },
            { create_user: (new AccountApp(this.session).user.openid) }
          ],
      };

      data = {
        index: data.index || 0,
        count: data.count || 20,
        fields: data.fields ? data.fields.split(',') : this.saftKey,
        where,
        ...data,
        ...query
      };

      const queryData = await super.query(data, Capsule, ops);
      queryData.list.forEach((item: any) => {
        if (item.status != 1) return;
        item.content = '封存中...';
      });

      if (onlyData) return queryData;

      return this.ok.query(queryData);
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  static async _notice(timeout: number) {
    timeout = timeout || new Date().getTime();

    const capsules = await Capsule.findAll({
      where: {
        time_out: {
          [Op.lte]: timeout
        },
        status: 1,
        is_notice: false
      }
    });

    if (!capsules || capsules.length == 0) return 0;

    const { access_token } = await WxApi.getAccessToken();
    for (let capsule of capsules) {
      // 埋藏天数
      const days = Math.floor((timeout - capsule.time_out) / (1000 * 60 * 60 * 24));
      const data = {
        thing1: { value: capsule.title },
        thing3: { value: days + '天' },
        time4: { value: new Date(capsule.time_out).toLocaleString() },
        time6: { value: new Date(capsule.create_time).toLocaleString() },
      };

      try {
        const res = await WxApi.sendSubscribeMessage(
          access_token,
          capsule.create_user,
          'pages/read/read?id=' + capsule.id,
          data
        );
        if (res.errcode == 0) {
          capsule.is_notice = true;
          await capsule.save();
        }
      } catch (err: any) {
        console.error('发送通知失败', err);
      }

      return capsules.length;
    }
  }
}

export default CapsuleApp;