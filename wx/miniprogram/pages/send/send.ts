
const app = getApp<IAppOption>();
// pages/send/send.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packData: {
      "title": "11111",
      "content": "封存中...",
      "time_out": 2064720972364,
      "gift": true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on("acceptSendData", data => {
      this.setData({
        packData: data,
      })
    })
  },

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  showToast(content: string) {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  },

})