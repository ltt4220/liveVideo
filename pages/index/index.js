// pages/index/index.js
import {
  WhyService
} from '../../service/api/why.service';
import {
  CreateService
} from '../../service/create/create.service';
import {
  StorageService
} from '../../service/storage/storage.service';
import {
  LoginService
} from '../../service/login/login.service';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    liveStatus: '0',
    page: {
      end: false, //数据结束
      isLoading: false, //加载中
      total: 0, // 记录总条数
      size: 9, // 每页显示条数
      current: 1 // 当前的页数
    },
    liveList: [],

  },

  loadData() {
    if (this.data.page.end) return;

    this.setData({
      'page.isLoading': true
    });

    //列表
    let query = {
      liveSearchName: '',
      resultIndex: this.data.page.current,
      resultSize: this.data.page.size,
      liveActivityTimeStatus: this.data.liveStatus,
      liveType: 2,
      liveCheck: 2,
      sortType: 'multiple',
      from: 'wxApplet'
    }
    WhyService.getLiveActivityList(query).then(res => {
      console.log('列表', res);
      this.setData({
        'page.isLoading': false
      });
      if (res.status != 200) return;
      let list = res.data.list;
      for (let i = 0; i < list.length; i++) {
        list[i].liveHotNew = this.parseNum(list[i].liveHot);
      }

      if (list.length > 0) {
        this.push(list);
      } else {
        this.setData({
          'page.end': true
        })
      }

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

    }).catch(err => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    });

  },
  push: function (arr) {
    if (!arr || arr.length == 0) this.data.page.current--;
    if (this.data.page.current < 1) this.data.page.current = 1;
    this.data.liveList.push.apply(this.data.liveList, arr);
    this.setData({
      liveList: this.data.liveList
    });
  },
  parseNum(num) {
    if (parseInt(num) >= 10000) {
      const val = Math.round((num / 10000) * 100) / 100;
      return `${val}w`
    } else {
      return num;
    }
  },
  goDetail(e) {
    let item = e.currentTarget.dataset.item;
    if (item.liveActivityTimeStatus == 1) {

      if (!LoginService.userInfo.userId) {
        return LoginService.checkLogin();
      }
      wx.navigateTo({
        url: '/pages/liveDetail/liveDetail?id=' + item.liveActivityId
      });


    } else if (item.liveActivityTimeStatus == 2) {
      wx.navigateTo({
        url: '/pages/trailerDetail/trailerDetail?id=' + item.liveActivityId
      });
    } else if (item.liveActivityTimeStatus == 3) {
      wx.navigateTo({
        url: '/pages/playbackVideo/playbackVideo?id=' + item.liveActivityId
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      'page.end': false,
      'page.isLoading': false,
      'page.current': 1,
      liveList: []
    });
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.page.isLoading) {
      this.data.page.current += 1;
      this.loadData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '5G+4K超高清直播盛宴！'
    }
  }
})