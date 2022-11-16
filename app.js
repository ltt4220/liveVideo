//app.js
import {StoreService} from './service/api/store.service';
import {StorageService} from './service/storage/storage.service';

const util = require('./lib/util.js');
const co = require('./lib/co.js');
const config = require('./lib/config.js');
App({
  onLaunch: function () {
    this.loadShopInfo();
  },
  // 文化馆信息
  loadShopInfo() {
    StoreService.getShopInfo({}).then(res => {
      wx.setNavigationBarTitle({
        title: res.shopName + '·直播'
      });
      StorageService.set('SHOP_INFO', res);//存储文化馆信息
    });
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    timer:null,
    bool:null
  },
  teplIds: "YUP3UhmKYfVIfH13WBtqiRjV03VBszwfRxquOuxyh7U",//订阅消息模板id
  appid: "wx974326cae70520f7",//appid
  secret: "b797892d90ce108703bc17fa81f1d2c7",//小程序密钥;
  miniprogramState:"trial",//developer为开发版；trial为体验版；formal为正式版
  config: config,
  util: util,
  co: co
})