import {  formatDate } from "../../utils/date";
const app = getApp<IAppOption>();
// pages/send/send.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packData: {
      id:'',
      "time_out": 2064720972364,
      "gift": true,
    },
    openTime:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    // this.setData({
    //   openTime: formatDate(2064720972364,'YYYY年MM月DD日 HH点')
    // })
    eventChannel.on("acceptSendData", data => {
      this.setData({
        packData: data,
        openTime: formatDate(data.time_out,'YYYY年MM月DD日 HH点')
      })
    })
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title:'赠送你一个时间胶囊',
      path:'/pages/receive/receive?id='+this.data.packData.id
    }
  },

  onContinueWrite(){
    this.clearWriteData()
    wx.navigateBack()
  },

  clearWriteData(){
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('clearData', {data: ''});
  },

  showToast(content: string) {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  },

})