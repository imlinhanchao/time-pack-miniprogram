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
    isSelfCreate:true,
    imgUrl: app.globalData.imgUrl,
    openTime: '',
    showNoPermisson:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(option) {
    let id = option.id
    if (!id) {
      return this.showToast('没找到胶囊哦~0.0')
    }
    this.selectComponent("#loading").show({title:'正在读取胶囊'});
    read(id).then(res => {
      this.selectComponent("#loading").hide();
      this.setData({
        packData: res,
        isSelfCreate:res.create_user == app.globalData.userInfo?.openid,
        openTime: formatDate(res.time_out, 'YYYY年MM月DD日 HH点')
      })
    }).catch(e => {
      this.selectComponent("#loading").hide();
      if(e.message=="权限不足"){
        this.setData({
          showNoPermisson:true
        })
      }else{
        this.showToast(e.message || '查询胶囊出错了T_T')
      }
    })
  },

  //接收胶囊
  onReceivePack() {
    if (!this.data.packData.id) {
      return this.showToast("没找到胶囊啊！")
    }
    this.selectComponent("#loading").show({title:'正在接收胶囊'});
    update({
      id:this.data.packData.id,
      user:app.globalData.userInfo?.openid,
      status:1,
    }).then(res => {
      this.selectComponent("#loading").hide();
      this.showToast('收下了~静待开启之日吧~')
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/home/home'
        })
      },1500)
    }).catch(e => {
      this.selectComponent("#loading").hide();
      this.showToast(e.message || '接收胶囊出错了T_T')
    })
  },


  onShareAppMessage() {
    return {
      title:'赠送你一个时间胶囊',
      path:'/pages/receive/receive?id='+this.data.packData.id
    }
  },


  showToast(content: string) {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  },
})