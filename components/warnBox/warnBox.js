// components/warnBox/warnBox.js
Component({
  externalClasses: ["i-mask"],
  properties: {
    title:{
      type: String,
      value: '设置开播提醒成功'
    },
    hideModal: {
      type: Boolean,
      value: true
    }, //弹出框隐藏
    warnImg: { //自定义标签输入框值
      type:String, // 类型（必填）
      value: "../../images/user/success.png",//0 为警告图  1 为loading图  2 为 success图
    } //输入框是否为空
  },
  /**
   * 页面的初始数据
   */

  data: {
    warnImg: "",
    // title: '请选择模板',
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
     },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    // let _this = this;
    // console.log("-------**********", this.data.hideModal)
    // setTimeout(() => {
    //   _this.hideModal();
    // }, 2000)
   },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
     },
  },
  methods: {
    onLoad(options) {
    },
    /**
 * 隐藏模态对话框
 */

    hideModal: function () {

      this.setData({
        hideModal: false
      });
      console.log("-------**********", this.data.hideModal)
      // this.triggerEvent('onEventModal', this.data.hideModal);
    },

    /**
  
     * 对话框取消按钮点击事件
  
     */

    onCancel: function () {

      this.hideModal();

    },

    /**
  
     * 对话框确认按钮点击事件
  
     */

    onConfirm: function () {

      this.hideModal();

    }
  }
})
