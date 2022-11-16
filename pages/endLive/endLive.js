const moment = require("../../lib/moment")
import {LiveDetailService} from '../../service/api/live.detail.service';
Page({
    data:{
        detailData:{},
        // 礼物总数
        giftNum:0,
    },
    // 生命周期函数--监听页面加载
    onLoad(options){
        this.getDetail(options.id)
        this.setData({
            giftNum:options.giftNum
        })
    },
    goBack(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    // 获取详情
    async getDetail(id){
        const result = await LiveDetailService.getLiveDetail({
            liveActivityId:id
        })
        result.data.liveHot = result.data.liveHot > 10000 ? result.data.liveHot.toFixed(1) + '万' : result.data.liveHot
        result.data.liveEndTime = moment(result.data.liveEndTime).format("HH:mm:ss")
        this.setData({
            detailData:result.data,
        })
    },
    redirect() {
        return wx.navigateTo({
            url: '/pages/index/index',
        })
    },  
    // 生命周期函数--监听页面初次渲染完成
    onReady(){
    },
    onShow(){
        // 生命周期函数--监听页面显示
    },
    onHide(){
        // 生命周期函数--监听页面隐藏
    },
    onUnload(){
        // 生命周期函数--监听页面卸载
    },
    onPullDownRefresh() {
        // 页面相关事件处理函数--监听用户下拉动作
    },
    onReachBottom() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage() {
        // 用户点击右上角分享
        return {
          title: this.data.detailData.liveTitle, // 分享标题
          desc: '', // 分享描述
          path: '/pages/endLive/endLive' // 分享路径
        }
    }
})