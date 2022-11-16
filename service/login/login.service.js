import {StorageService} from '../storage/storage.service';

export class LoginService {

  constructor() {}

  /**
   * 获取用户信息
   */
  static getUser() {
    return new Promise((resolve, reject) => {
      if(this.userInfo.userId) {
        resolve(this.userInfo);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * 检测是否登录，如果没有登录，就去登录
   */
  static checkLogin() {
    return new Promise((resolve, reject) => {
      this.getUser().then(user => {
        if(!!user) {
          resolve(user);
        } else {
          wx.navigateTo({
            url: '/pages/login/index/index'
          });
        }
      });
    });
  }

  /** 
   * 存储登录用户的信息
   * @param _userInfo
   */
  static set userInfo(_userInfo) {
    StorageService.set('USER_INFO', _userInfo);
  }

  /**
   * 读取登录用户的信息
   */
  static get userInfo() {
    return StorageService.get('USER_INFO');
  }

  /** 
   * 存储微信授权的用户信息
   * @param _userInfo
   */
  static set weChatInfo(_wechatInfo) {
    StorageService.set('WECHAT_INFO', _wechatInfo);
  }

  /**
   * 读取微信授权的用户信息
   */
  static get weChatInfo() {
    return StorageService.get('WECHAT_INFO');
  }

  /** 
   * 存储初始授权的openId
   * @param _openId 
   */
  static set openId(_openId) {
    StorageService.set('OPEN_ID', _openId);
  }

  /**
   * 读取初始openId 
   */
  static get openId() {
    return StorageService.get('OPEN_ID');
  }

  /** 
   * 存储初始授权的unionId
   * @param _openId 
   */
  static set unionId(_unionId) {
    StorageService.set('UNION_ID', _openId);
  }

  /**
   * 读取初始unionId
   */
  static get unionId() {
    return StorageService.get('UNION_ID');
  }

}