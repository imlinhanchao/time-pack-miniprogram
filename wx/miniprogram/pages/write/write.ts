import { addTime, formatDate } from "../../utils/date";
const DATE_FORMAT1 = 'YYYY-MM-DD';
import { create } from "../../api/capsule"
import { MsgType, wxSubscribe } from "../../utils/wx";
const app = getApp<IAppOption>();
// pages/write/write.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minWriteHeight: 0,
    dateValue: formatDate(addTime(new Date(), 10, 'year'), DATE_FORMAT1),
    date: formatDate(addTime(new Date(), 10, 'year')),
    time: formatDate(new Date(), 'HH:mm'),
    title: '',
    content: '',
    time_out: addTime(new Date(), 10, 'year').getTime(),
    today: formatDate(new Date(), DATE_FORMAT1),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const windowInfo = wx.getWindowInfo()
    this.setData({
      minWriteHeight: windowInfo.windowHeight
    })
  },

  bindTimeoutDate() {
    this.setData({
      date: formatDate(new Date(this.data.dateValue)),
      time_out: new Date(this.data.date + ' ' + this.data.time + ':00').getTime()
    })
  },

  async createPack(e: any) {
    if (!this.data.title) {
      this.showToast('写个标题？')
      return
    }
    if (!this.data.content) {
      this.showToast('写点内容？')
      return
    }
    let gift = e.currentTarget.dataset.gift
    const { title, content, time_out } = this.data
    const reqData = { title, content, time_out, gift }
    // 如果是送礼，并且没有头像 先去设置
    console.log(app.globalData.userInfo);

    if (gift && !app.globalData.userInfo?.nickname) {
      await this.setUserInfo();
    }
    await this.createPackReq(reqData);
    const msgTypes = [MsgType.open];
    if (gift && MsgType.receive) msgTypes.push(MsgType.receive);
    wxSubscribe(msgTypes);
  },

  setUserInfo(): Promise<void> {
    return new Promise((resolve) => {
      wx.navigateTo({
        url: `../setInfo/setInfo`,
        events: {
          setInfo: () => {
            // 设置头像成功了
            resolve()
          }
        }
      })
    })
  },
  
  createPackReq(data: any) {
    return new Promise((resolve, reject) => {
      this.selectComponent("#loading").show({title:'正在封装'});
      create(data).then(res => {
        this.selectComponent("#loading").hide();
        let { id, gift, time_out } = res;
        resolve(id)
        wx.navigateTo({
          url: `../send/send`,
          events: {
            clearData: () => {
              this.setData({
                dateValue: formatDate(addTime(new Date(), 10, 'year'), DATE_FORMAT1),
                date: formatDate(addTime(new Date(), 10, 'year')),
                time: formatDate(new Date(), 'HH:mm'),
                title: '',
                content: '',
                time_out: addTime(new Date(), 10, 'year').getTime(),
                today: formatDate(new Date(), DATE_FORMAT1),
              })
            },
          },
          success: (res) => {
            res.eventChannel.emit('acceptSendData', {
              id, gift, time_out
            })
          }
        })
      }).catch(err => {
        reject(err);
        this.selectComponent("#loading").hide();
        this.showToast(err.message || "封装失败了T_T~")
      })
    })
  },

  showToast(content: string) {
    wx.showToast({
      title: content,
      icon: 'none'
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