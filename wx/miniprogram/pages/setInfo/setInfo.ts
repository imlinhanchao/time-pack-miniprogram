import { updateUserInfo,upload } from "../../api/account"
const app = getApp<IAppOption>();
// pages/send/send.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      nickname:'',
      avatar:'',
      openid:''
    },
    imgUrl:app.globalData.imgUrl,
    tempAvatar: '',
    tempNick: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      userInfo:app.globalData.userInfo,
    })
  },

  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    wx.uploadFile({
      url:`${app.globalData.apiUrl}/lib/upload`,
      filePath: avatarUrl,
      name:'file',
      header:{
        Authorization:`Bearer ${app.globalData.userInfo?.accessToken}`
      },
      success:(res)=>{
        console.log(res);
        let data = JSON.parse(res.data)
        if(data.state==0){
          this.setData({
            tempAvatar: data.data[0].url
          })
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  onUpdateInfo() {
    let { tempAvatar, tempNick } = this.data
    if (!tempAvatar) {
      return this.showToast("设置个头像？")
    }
    if (!tempNick) {
      return this.showToast("设置个昵称？")
    }
    updateUserInfo({
      openid: app.globalData.userInfo?.openid,
      nickname: tempNick,
      avatar:tempAvatar
    }).then(e=>{
      let userInfo = {...this.data.userInfo}
      userInfo.nickname = tempNick
      userInfo.avatar = tempAvatar
      this.setData({
        userInfo
      })
      app.globalData.userInfo = userInfo
      // 设置信息成功返回
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('setInfo', {success: true});
    }).catch(e=>{
      this.showToast(e.message || "设置失败了")
    })
  },
  
  // 不想送了，返回
  onDontSend(){
    wx.navigateBack()
  },

  showToast(content: string) {
    wx.showToast({
      title: content,
      icon: 'none'
    })
  },

})