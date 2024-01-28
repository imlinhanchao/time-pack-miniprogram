import { addTime, formatDate } from "../../utils/date";

// components/time-form.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    user: '',
    title: '',
    content: '',
    time_out: 0,
    type: '1',
    gift: false,
    create_user: getApp().globalData.userInfo?.openid,
    create_nick: '',
    create_avatar: '',
    status: 1,
    today: formatDate(new Date()),
    date: formatDate(addTime(new Date(), 10, 'year')),
    time: formatDate(new Date(), 'HH:mm'),
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindTimeoutDate() {
      this.setData({
        time_out: new Date(this.data.date + ' ' + this.data.time + ':00').getTime()
      })
    },
    save() {
      if (!this.data.title) {
        wx.showToast({
          title: '请输入标题',
          icon: 'none'
        })
        return;
      }
      if (!this.data.content) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
        return;
      }
      if (!this.data.time_out) {
        wx.showToast({
          title: '请选择时间',
          icon: 'none'
        })
        return;
      }
      this.triggerEvent('save', this.data, {})
    }
  },
  attached() {
    this.bindTimeoutDate();
  }
})