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
        time_out: new Date(this.data.date + ' ' + this.data.time).getTime()
      })
    }
  }
})