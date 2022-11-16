export class UtilService {
  constructor() {}

  /**
   * 获取视频第一秒作为封面封面
   * @param url 视频地址
   */
  static getVideoCover(url, time = 1000) {
    return url + '?x-oss-process=video/snapshot,t_' + time + ',f_jpg'
  }

  /**
   * 判断对象不为空
   * @param obj 对象
   */
  static isSomeObject(obj) {
    return Object.keys(obj).length > 0;
  }


}