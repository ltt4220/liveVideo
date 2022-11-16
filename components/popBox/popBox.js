// components/popBot/popBox.js
Component({
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {} // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String, // 简化的定义方式
    showPopModal: {
      type: Boolean,
      value: true
    },
    showTab: {
      type: Boolean,
      value: false
    },
    showCreat: {
      type: Boolean,
      value: true
    },
    selectid: {
      type: String,
      value: ""
    },
    lists: {
      type: Array,
      value: [{
        title: "高清",
        active: true
      }, {
        title: "1080P",
        active: false
      }, {
        title: "4K",
        active: false
      }]
    }
  },

  /**
   * 页面的初始数据
   */

  data: {
    index: -1,
    showPop: false,
    showPopModal: true,
    isCheck: false,
    clickState: false,
    createCardeState: false //true为自己创建,false为他人创建
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {},
  },
  methods: {
    showBox() {
      this.setData({
        showPopModal: true
      })
    },
    check(e) {
      let idx = e.target.dataset.index;
      let arr = this.data.lists.map((item, i) => {
        item.active = false;
        if (i == idx) {
          item.active = true;
        }
        return item;
      })
      this.setData({
        lists: arr
      })
      this.triggerEvent("definition",{
        definition:this.data.lists[idx]
      })
    },
    closeHid() {
      this.setData({
        showPopModal: false
      })
    },
    createcards() {
      this.triggerEvent('shareTit', 'dd')
    },
    mycards() {
      console.log("11111113232323232")
      this.triggerEvent('createPoster', {
        paramBtoA: true
      });
      this.setData({
        showPopModal: false
      })
    }

  }
})