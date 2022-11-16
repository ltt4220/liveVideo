import { HttpService } from '../http/http.service';
const config = require('../config/config.service');

export class ApiService {

  // 总服务路由地址
  static whyUrl = config.url.why;
  static chinaUrl = config.url.china;
  static storeUrl = config.url.store;
  static gatewayUrl = config.url.gateway

  static why(apiName, _queryParam) {
    return HttpService.request('POST', this.whyUrl, apiName, _queryParam);
  }

  static china(apiName, _queryParam) {
    return HttpService.request('POST', this.chinaUrl, apiName, _queryParam);
  }

  static store(apiName, _queryParam) {
    return HttpService.request('POST', this.storeUrl, apiName, _queryParam);
  }

  static gateway(apiName, _queryParam) {
    return HttpService.jsonRequest('POST', this.storeUrl, apiName, _queryParam);
  }

}