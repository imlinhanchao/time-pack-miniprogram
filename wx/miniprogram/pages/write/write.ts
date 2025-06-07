import { addTime, formatDate } from "../../utils/date";
const DATE_FORMAT1 = 'YYYY-MM-DD';
import { create } from "../../api/capsule"
// pages/write/write.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minWriteHeight:0,
    dateValue: formatDate(addTime(new Date(), 10, 'year'),DATE_FORMAT1),
    date:formatDate(addTime(new Date(), 10, 'year')),
    time: formatDate(new Date(), 'HH:mm'),
    title:'',
    content:'',
    time_out:addTime(new Date(), 10, 'year').getTime(),
    today: formatDate(new Date(),DATE_FORMAT1),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const windowInfo = wx.getWindowInfo()
    this.setData({
      minWriteHeight:windowInfo.windowHeight
    })
  },

  bindTimeoutDate() {
    this.setData({
      date:formatDate(new Date(this.data.dateValue)),
      time_out: new Date(this.data.date + ' ' + this.data.time + ':00').getTime()
    })
  },

  createPack(e){

    if(!this.data.title){
      this.showToast('写个标题？')
      return
    }
    if(!this.data.content){
      this.showToast('写点内容？')
      return
    }
    let gift = e.currentTarget.dataset.gift
    const {title,content,time_out} = this.data
    create({
      title,
      content,
      time_out,
      gift,
      type:1
    } as any).then(data=>{
      const id = data.id
      const time_out = data.time_out
      const create_nick = data.create_nick
      wx.navigateTo({
        url: `../send/send`,
        success:(res)=>{
          res.eventChannel.emit('acceptSendData',{
            id,time_out,gift,create_nick
          })
        }
      })
    }).catch(e=>{
      this.showToast(e.message)
    })



  },

  showToast(content:string){
    wx.showToast({
      title: content,
      icon:'none'
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