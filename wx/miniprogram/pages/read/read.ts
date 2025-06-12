// pages/read/read.ts
import { open } from "../../api/capsule"
const app = getApp<IAppOption>();
import {  formatDate } from "../../utils/date";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packData:{},
    imgUrl:app.globalData.imgUrl,
    openTime:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let id = option.id
    open(id).then(res=>{
      this.setData({
        packData:res,
        openTime: formatDate(res.time_out,'YYYY年MM月DD日 HH点')
      })
    }).catch(e=>{
      wx.showToast({
        title:e.message||'读取胶囊失败了~T_T',
        icon:'none'
      })
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