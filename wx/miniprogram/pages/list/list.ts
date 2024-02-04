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
    }
  },

  attached() {
    this.load();
  }
})