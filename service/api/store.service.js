import { HttpService } from '../http/http.service';
const config = require('../config/config.service');

export class StoreService {

  // 总服务路由地址
  static url = config.url.store;

  constructor() {}

  // 获取头像和文化馆名称
  static getShopInfo(_queryParam) {
    return HttpService.request('POST', this.url, 'wechatShop/getShopInfo.do', _queryParam);
  }
  
}