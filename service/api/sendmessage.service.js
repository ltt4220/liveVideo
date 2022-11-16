import { HttpService } from '../http/http.service';
const config = require('../config/config.service');

export class send {

  // 总服务路由地址
  static _whyUrl = config.url.why; //测试地址

  static _gateWay = config.url.gateway

  constructor() {}

  // 发送小程序通知
  static sendMessage(_queryParam) {
    return HttpService.jsonRequest('POST', this._gateWay, 'why/wxApplet/sendMessage', _queryParam);
  }
  //生成小程序码二维码
  static wxAcode(_queryParam){
    return HttpService.jsonRequest('POST', this._gateWay, 'why/wxApplet/getWXACode', _queryParam);
  }
}