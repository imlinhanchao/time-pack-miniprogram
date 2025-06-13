// components/rwj-loading/index.js
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
    loadingState: false,
    maskState: false,
    loadingText: "加载中..."
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    show({ mask = false, title = "加载中..." } = {}){
      this.setData({
        loadingState: true,
        maskState: mask,
        loadingText: title
      })
    },
    hide(){
      this.setData({
        loadingState: false
      })
    }
  }
})