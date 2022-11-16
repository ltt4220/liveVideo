export class StorageService {

  static STORAGE_PREFIX = 'LIVE_';
  constructor() {}

  /**
   * 存储数据到缓存
   * @param key 存储的key
   * @param value 存储的值
   */
  static set(key, value) {
    try {
      wx.setStorageSync(this.STORAGE_PREFIX + key, value)
    } catch (e) { }
  }

  /**
   * 读取缓存数据
   * @param key 存储的key
   */
  static get(key) {
    try {
      return wx.getStorageSync(this.STORAGE_PREFIX + key)
    } catch(e) {
      return null;
    }
  }

  /**
   * 从本地缓存中移除指定 key
   * @param key 存储的key
   */
  static remove(key) {
    try {
      wx.removeStorageSync(this.STORAGE_PREFIX + key)
    } catch (e) {
    }
  }

  /**
   * 清理本地数据缓存
   */
  static clear() {
    try {
      wx.clearStorageSync()
    } catch(e) {
    }
  }

}
