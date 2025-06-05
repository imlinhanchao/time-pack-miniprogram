import { list } from "../../api/capsule"

// pages/my/my.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    capsules: [] as ICapsule[],
    total: 0,
    now: new Date().getTime(),
    timer: 0,
    loading: false,
  },
    onSearchInput(e: any) {
      this.setData({
        title: e.detail.value
      })
    },
    onSearchTap() {

    },
    getList() {
      if (this.data.loading) {
        return
      }
      this.setData({
        loading: true
      })
      let index = this.data.capsules.length
      list({
        title: this.data.title,
        index
      }).then(({ list, total }) => {
        if (index == 0) {
          this.setData({
            capsules: list,
            total,
            loading: false,
          })
        } else[
          this.setData({
            capsules: [...this.data.capsules, ...list],
            total,
            loading: false,
          })
        ]
      }).catch((e: Error) => {
        wx.showToast({
          title: '加载失败',
          icon: 'error',
          duration: 1000
        })
        this.setData({
          loading: false
        })
      })
    },


  onLoad() {
    this.getList();
    const timer = setInterval(() => {
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
  },

  onReachBottom() {
    console.log("onReachBottom");
    
    if(this.data.loading){
      return
    }
    this.getList()
  },
})