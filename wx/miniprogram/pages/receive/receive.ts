import { update,read } from "../../api/capsule"
const app = getApp<IAppOption>();
import { formatDate } from "../../utils/date";
// pages/receive/receive.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packData: {},
    imgUrl: app.globalData.imgUrl,
    openTime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let id = option.id
    if (!id) {
      return this.showToast('没找到胶囊哦~0.0')
    }
    read(id).then(res => {
      this.setData({
        packData: res,
        openTime: formatDate(res.time_out, 'YYYY年MM月DD日 HH点')
      })
    }).catch(e => {
      this.showToast(e.message || '查询胶囊出错了T_T')
    })
  },

  //接收胶囊
  onReceivePack() {
    if (!this.data.packData.id) {
      return this.showToast("没找到胶囊啊！")
    }
    update({
      id:this.data.packData.id,
      user:app.globalData.userInfo?.openid,
      status:1,
    }).then(res => {
      this.showToast('收下了~静待开启之日吧~')
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/home/home'
        })
      },3000)
 
    }).catch(e => {
      this.showToast(e.message || '接收胶囊出错了T_T')
    })
  },


  showToast(content: string) {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  },
})