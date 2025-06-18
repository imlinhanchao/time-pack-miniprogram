// components/navigation-button/navigation-button.ts
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

  },

  lifetimes: {
    attached() {
      const rect = wx.getMenuButtonBoundingClientRect()
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            leftWidth: `width: ${rect.width}px; height: ${rect.height}px;margin-left:${res.windowWidth - rect.right}px;top:${rect.top}px`,
          })
        },
        fail: (err) => {

        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    back() {
      wx.navigateBack()
    },

    home() {
      wx.reLaunch({
        url: '../home/home',
      })
    },

  }
})