import { HttpService } from '../http/http.service';
const config = require('../config/config.service');

export class ChinaService {

  // 总服务路由地址
  static url = config.url.china;

  constructor() {}

  // 获取短信验证码
  static loginSendCode(_queryParam) {
    return HttpService.request('POST', this.url, 'muser/loginSendCode.do', _queryParam);
  }

  // 短信验证码登录
  static codeLogin(_queryParam) {
    return HttpService.request('POST', this.url, 'muser/codeLogin.do', _queryParam);
  }
  
}