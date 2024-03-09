import AccountApp from "./account";
import App from "./app";
import model from "@/model";
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
    this.saftKey = ["id"].concat(Capsule.keys);
    this.account = new AccountApp(session);
  }

  get error() {
    return __error__;
  }

  async create(data: ICapsule, onlyData = false) {
    const keys = Capsule.keys;

    data.create_user = this.account.user.openid;
    if (!App.haskeys(data, keys)) {
      throw this.error.param;
    }

    data = App.filter(data, Capsule.keys) as ICapsule;

    try {
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
      if (account.openid != capsule.user || !capsule.user) {
        throw this.error.limited;
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
      if (account.openid != capsule?.user || !capsule?.user) {
        throw this.error.limited;
      }

      if (capsule.time_out < new Date().valueOf()) {
        capsule.content = '封存中...';
      }

      if (onlyData) return capsule;
      
      return this.ok.get(App.filter(capsule, this.saftKey));
    } catch (err: any) {
      if (err.isdefine) throw err;
      throw this.error.db(err);
    }
  }

  async open(id: string, onlyData=false) {
    try {
      const account = this.account.user as any;
      let capsule = await Capsule.findOne({
        where: {
          id
        }
      });
      if (account.openid != capsule?.user || !capsule?.user) {
        throw this.error.limited;
      }

      if (capsule.time_out < new Date().valueOf()) {
        throw this.error.nottime;
      }

      capsule.status = 2;
      capsule.save();

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

    const query = App.filter(data.query, Object.keys(ops));

    try {
      if (query.type == 'my') {
        query.query.user = (await new AccountApp(this.session).user.openid);
      } else {
        query.create_user = (new AccountApp(this.session).user.openid);
        query.gift = true;
      }

      data = {
        index: 0,
        count: 20,
        fields: data.fields ? data.fields.split(',') : this.saftKey,
        ...data,
        query
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
}

export default CapsuleApp;