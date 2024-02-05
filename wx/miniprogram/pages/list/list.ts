import { list } from "../../api/capsule"

// pages/list/list.ts
Component({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    capsules: [] as ICapsule[],
    total: 0,
    now: new Date().getTime(),
    timer: 0,
  },

  methods: {
    load() {
      list({
        title: this.data.title,
        index: this.data.capsules.length,
      }).then(({ list, total }) => {
        this.setData({
          capsules: list,
          total,
        })
      });
    },
  },

  attached() {
    this.load();
    const timer = setInterval(() => {
      console.log('setInterval');
      this.setData({
        now: new Date().getTime(),
      });
    }, 1000);
    this.setData({
      timer,
    });
  },

  detached() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  }
})