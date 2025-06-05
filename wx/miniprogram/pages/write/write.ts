import { addTime, formatDate } from "../../utils/date";
// pages/write/write.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minWriteHeight:0,
    date: formatDate(addTime(new Date(), 10, 'year')),
    time: formatDate(new Date(), 'HH:mm'),
    title:'',
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const windowInfo = wx.getWindowInfo()
    console.log(windowInfo,2222)
    this.setData({
      minWriteHeight:windowInfo.windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})