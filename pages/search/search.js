// pages/search/search.js
import {
  WhyService
} from '../../service/api/why.service';
import {
  CreateService
} from '../../service/create/create.service';
import {
  StorageService
} from '../../service/storage/storage.service';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchStr: '',
    historyList: [], //搜索历史记录 
    isFocus: true, //input获取焦点
    isShowClear: false, //是否显示清除input内容的按钮
    isShowLiveList: false, //是否显示搜索结果列表

    liveStatus: '0',
    page: {
      end: false, //数据结束
      isLoading: false, //加载中
      total: 0, // 记录总条数
      size: 10, // 每页显示条数
      current: 1 // 当前的页数
    },
    liveList: [],

  },
  // 加载历史记录
  loadHistoryList() {
    this.setData({
      historyList: StorageService.get('HISTORY_LIST') || []
    });
  },
  // input的绑定
  searchInput(e) {
    this.setData({
      searchStr:  e.detail.value
    });
    if (this.data.searchStr.length <= 0) {
      this.setData({
        isShowLiveList: false,
        liveList: []
      });
      this.setData({
        isShowClear: false
      });

    } else {
      this.setData({
        isShowClear: true
      });
    }
  },

  // 获取焦点事件
  searchFocus(e) {
    if (this.data.searchStr.length > 0) {
      this.setData({
        isShowClear: true
      });
    } else {
      this.setData({
        isShowClear: false
      });
    }
  },
  // 失去焦点事件
  searchBlur(e) {
    this.setData({
      searchStr: this.data.searchStr,
      isShowClear: false
    });
  },
  // 清除搜索框内容
  clearInput() {
    this.setData({
      // isFocus: true,
      isShowClear: false
    });
    this.setData({
      searchStr: '',
      isShowLiveList: false,
      liveList: []
    });
  },
  // 搜索
  search() {
    this.setData({
      isShowLiveList: true
    });
    if (this.data.searchStr.length <= 0) return;

    for (let i = 0; i < this.data.historyList.length; i++) {
      if (this.data.historyList[i].text == this.data.searchStr) {
        this.data.historyList.splice(i, 1);
        break;
      }
    }
    this.data.historyList.unshift({
      text: this.data.searchStr
    });

    this.setData({
      historyList: this.data.historyList
    });
    StorageService.set('HISTORY_LIST', this.data.historyList);

    this.setData({
      'page.end': false,
      'page.isLoading': false,
      'page.current': 1,
      liveList: []
    });
    this.loadData();

  },
  // 清空历史记录
  clearHistory() {
    this.setData({
      historyList: []
    });
    StorageService.remove('HISTORY_LIST');
  },
  // 删除历史记录
  removeHistoryItem(e) {
    let index = e.currentTarget.dataset.index;
    this.data.historyList.splice(index, 1);
    this.setData({
      historyList: this.data.historyList
    });
    StorageService.set('HISTORY_LIST', this.data.historyList);
  },
  // 点击历史记录
  selectHistoryItem(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      searchStr: this.data.historyList[index].text
    }, () => {
      this.setData({
        isShowLiveList: true
      });
      this.setData({
        'page.end': false,
        'page.isLoading': false,
        'page.current': 1,
        liveList: []
      });
      this.loadData();
    });
  },

  loadData() {
    if (this.data.page.end) return;

    this.setData({
      'page.isLoading': true
    });

    //列表
    let query = {
      liveSearchName: this.data.searchStr,
      resultIndex: this.data.page.current,
      resultSize: this.data.page.size,
      liveActivityTimeStatus: this.data.liveStatus,
      liveType: 2,
      liveCheck: 2,
      sortType: 'multiple',
      from: 'wxApplet'
    }
    WhyService.getLiveActivityList(query).then(res => {
      // console.log('列表', res);
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
    this.loadHistoryList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

})