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
      this.getList(0)
    },
    getList(index:number) {
      if (this.data.loading) {
        wx.stopPullDownRefresh()
        return
      }
      this.setData({
        loading: true
      })
      list({
        title: this.data.title,
        index
      }).then(({ list, total }) => {
        wx.stopPullDownRefresh()
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
        wx.stopPullDownRefresh()
        wx.showToast({
          title: e.message,
          icon: 'none',
          duration: 2000
        })
        this.setData({
          loading: false
        })
      })
    },


  onLoad() {
    this.getList(0);
    const timer = setInterval(() => {
      this.setData({
        now: new Date().getTime(),
      });
    }, 1000);
    this.setData({
      timer,
    });
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  onReachBottom() {
    if(this.data.loading){
      return
    }
    if(this.data.capsules.length>=this.data.total){
      return
    }
    this.getList(this.data.capsules.length)
  },
  onPullDownRefresh(){
    this.getList(0);
  }
})