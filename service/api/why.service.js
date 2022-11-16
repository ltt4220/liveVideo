import { HttpService } from '../http/http.service';
const config = require('../config/config.service');

export class WhyService {

  // 总服务路由地址
  static url = config.url.why;

  constructor() {}

  // 微信登录
  static weChatLogin(_queryParam) {
    return HttpService.request('POST', this.url, 'wxAppletUser/wxAppletLogin.do', _queryParam);
  }

  // 账户密码登录
  static accountLogin(_queryParam) {
    return HttpService.request('POST', this.url, 'apiTerminalUser/login.do', _queryParam);
  }

  // 获取直播列表
  static getLiveActivityList(_queryParam) {
    return HttpService.request('POST', this.url, 'apiLive/getLiveActivityList.do', _queryParam);
  }
}