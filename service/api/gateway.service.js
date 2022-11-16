import { HttpService } from '../http/http.service';
const config = require('../config/config.service');

export class gatewayService {

  // 总服务路由地址
  static url = config.url.gateway;

  constructor() {}


}