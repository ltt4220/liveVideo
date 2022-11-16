import { HttpService } from '../http/http.service';
const config = require('../config/config.service');

export class LiveDetailService {

  // 总服务路由地址
  static _whyUrl = config.url.why; //测试地址

  static _gateWay = config.url.gateway

  static _meme = config.url.meme
  constructor() {}

  // 获取直播详情
  static getLiveDetail(_queryParam) {
    return HttpService.request('POST', this._whyUrl, 'apiLive/liveActivityDetail.do', _queryParam);
  }
  // 获取点赞数
  static getPraiseInfo(_queryParam) {
    return HttpService.request('POST', this._whyUrl, 'apiLive/saveLiveUserInfo.do', _queryParam);
  }
  // 获取评论
  static getCommentList(_queryParam) {
    return HttpService.request('POST', this._whyUrl, 'apiLive/getLiveMessageList.do', _queryParam);
  }
  // 新增评论评论
  static addComment(_queryParam) {
    return HttpService.request('POST', this._whyUrl, 'apiLive/createMessage.do', _queryParam);
  }
  // 获取活动推荐
  static getActivityRecommendList(_queryParam) {
    return HttpService.jsonRequest('POST', this._gateWay, 'why/home/recommend', _queryParam);
  }
  // 获取直播状态
  static getLiveStatus(_queryParam) {
    return HttpService.request('POST', this._whyUrl, 'apiLive/simpleDetail.do', _queryParam);
  }
  // 获取礼物
  static getGiftList(_queryParam) {
    return HttpService.jsonRequest('POST', this._gateWay, 'why/liveGift/list', _queryParam);
  }
  // 获取商品
  static getGoodsList(_queryParam) {
    return HttpService.jsonRequest('POST', this._gateWay, 'why/liveEntityRelate/list', _queryParam);
  }
  // 统计礼物记录
  static submitGift(_queryParam) {
    return HttpService.request('POST', this._whyUrl, 'apiLive/saveLiveGiftLog.do', _queryParam);
  }
  // 直播结束
  static endLive(_queryParam) {
    return HttpService.request('POST', this._whyUrl, 'apiLive/endLiveResult.do', _queryParam);
  }
}