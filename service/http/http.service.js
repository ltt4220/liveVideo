import Promise from '../js/es6-promise.min';
import { CreateService } from '../create/create.service';
const whyConfig = require('../config/why.service');
export class HttpService {

  constructor() {}

  /**
   * 调用后端接口
   * @param method GET | POST | PUT | DELETE
   * @param apiUrl 接口网关地址
   * @param apiName 接口地址及路由传参
   * @param body 请求体数据，可不传
   * @param headers 请求头，可不传
   */
  static request(method, apiUrl, apiName, body = {}, headers = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        url: apiUrl + apiName,
        data: {
          'shopPath': whyConfig.shopPath,
          ...body
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'sysPlatform': 'wxMiniProgram',
          ...headers,
        },
        success: (res) => {
          console.log('http', res);
          let data = res.data;
          if(res.statusCode === 200) {
            resolve(data);
          } else {
            CreateService.alertDialog('服务暂停，请联系管理员');
            reject(data);
          }
        },
        fail: (error) => {
          reject(error);
        }
      })
    });
  }

  static jsonRequest(method, apiUrl, apiName, body = {}, headers = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        url: apiUrl + apiName,
        data: {
          'shopPath': whyConfig.shopPath,
          'shopProvince':whyConfig.shopProvince,
          ...body
        },
        header: {
          'content-type': 'application/json',
          'sysPlatform': 'wxMiniProgram',
          ...headers,
        },
        success: (res) => {
          console.log('http', res);
          let data = res.data;
          if(res.statusCode === 200) {
            resolve(data);
          } else {
            CreateService.alertDialog('服务暂停，请联系管理员');
            reject(data);
          }
        },
        fail: (error) => {
          reject(error);
        }
      })
    });
  }

}