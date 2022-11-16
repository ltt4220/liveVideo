import {LiveDetailService} from '../../service/api/live.detail.service';
import {WhyService} from '../../service/api/why.service';
import {LoginService}from '../../service/login/login.service'
const moment = require("../../lib/moment")
const _defaultNavData = [
    {
        value:0,
        title: '评论',
    },
    {
        value:1,
        title: '详情'
    },
    {
        value:2,
        title: '视频推荐'
    },
    {
        value:3,
        title: '活动推荐'
    }
]
Page({
    data:{
        keyboardHeight:0,
        // 详情数据
        detailData:{},
        // 详情id
        liveActivityId:'',
        // 当前nav
        currentNav:0,
        // 评论数据
        commentData:[],
        // 评论
        commentValue:'',
        // 直播推荐
        liveFilterParams:{
            liveSearchName: '',
            resultIndex: 1,
            resultSize: 10,
            liveActivityTimeStatus: 3,
            liveType: 2,
            liveCheck: 2,
            sortType: 'liveHot',
        },
        // 直播推荐列表
        liveData:[],
        navData:_defaultNavData.slice(0),
        // 活动推荐
        activityList:[],
        // 评论提示
        isShowSuccess:false,
        isShowError:false,
    },
    // 生命周期函数--监听页面加载
    onLoad(options){
        this.setData({
            liveActivityId:options.id
        }, () => {
            this.getDetail()
            this.getActivityRecommendList()
        })
    },
    // 获取详情
    async getDetail(){
        const result = await LiveDetailService.getLiveDetail({
            liveActivityId: this.data.liveActivityId
        })
        // 时间处理
        result.data._liveStartTime = moment(result.data.liveStartTime).format('HH:mm')
        result.data._liveEndTime = moment(result.data.liveEndTime).format('HH:mm')
        result.data._time = moment(result.data.liveStartTime).format('MM/DD')
        result.data.liveIntroduction = result.data.liveIntroduction.replace(/\<img/gi, '<img class="detail-img"')
        // 直播中去除评论
        if(result.data.liveActivityTimeStatus === 1){
            this.data.navData.splice(0,1)
        }
        wx.setNavigationBarTitle({
            title: result.data.liveTitle
        })
        this.setData({
            detailData:result.data,
            navData: this.data.navData,
            currentNav:result.data.liveActivityTimeStatus === 1 ? 1 : 0,
            liveFilterParams: this.data.liveFilterParams
        }, () => {
            if(result.data.liveActivityTimeStatus !== 1){
                this.getCommentList()
            }
            this.getLiveRecommendList()
        })
    },
    getFocus(e){
        this.setData({
            keyboardHeight:e.detail.height,
        })
    },
    bindblur(){
        this.setData({
            keyboardHeight:0,
            commentValue:''
        })
    },
    bindinput(e){
        this.setData({
            commentValue:e.detail.value
        })
    },
    // 获取评论列表
    async getCommentList(){
        const result = await LiveDetailService.getCommentList({
            messageActivity: this.data.liveActivityId, // liveActivityId
            messageIsInteraction: 1, //是否是互动直播信息 0.否 1.是
            messageIsRecommend:0,//互动信息是否推荐 0.否 1.是
        })

        result.data.list.map(item => {
            item.messageCreateTime = moment(item.messageCreateTime).format('DD月HH日 HH:mm')
        })

        this.setData({
            commentData:result.data.list
        })
    },
    async addComment(e) {
        if(!LoginService.userInfo.userId){
            return LoginService.checkLogin()
        }
        if(!this.data.commentValue){
            return
        }
        const result = await LiveDetailService.addComment({
            messageCreateUser: this.data.userInfo,//userId
            messageActivity: this.data.liveActivityId,//liveActivityId
            messageIsInteraction:1,  //'是否是互动直播信息 0.否 1.是',这里传1
            messageIsRecommend:0,
            messageContent:this.data.commentValue
        })
        const _isSuccess = result.status === 200
        this.setData({
            errmsg: _isSuccess ? '' : result.msg.errmsg,
            isShowSuccess:_isSuccess,
            isShowError:!_isSuccess
        })
        setTimeout(() => {
            this.setData({
                isShowError: false,
                isShowSuccess:false,
            })
        }, 1500);
    },
    // 获取活动推荐
    async getActivityRecommendList(){
        const result = await LiveDetailService.getActivityRecommendList({
            advertIsNat: '0',
            advertUserLevel: '1',
            userId: LoginService.userInfo.userId,
            type: 'h5'
        })  
        result.data.map(item => {
            this.data.activityList = this.data.activityList.concat(item.activity)
        })
        this.data.activityList.map(item => {
            item.startDate = moment(item.startDate).format('YYYY/MM/DD')
        })
        this.setData({
            activityList: this.data.activityList
        })
    },
    // 获取直播推荐
    async getLiveRecommendList(){
        const result = await WhyService.getLiveActivityList(this.data.liveFilterParams)
        result.data.list.map(item => {
            item.liveHot = item.liveHot > 10000 ? (item.liveHot / 10000).toFixed(2) + '万' : item.liveHot
        })

        this.data.liveData = this.data.liveData.concat(result.data.list)
        this.setData({
            liveData: this.data.liveData
        })
    },
    redirect(e){
        const {type,item:{liveActivityId,liveActivityTimeStatus},id } = e.currentTarget.dataset
        if(type == 1){
            let _url = ''
            switch(liveActivityTimeStatus) {
                case 1:
                    _url = 'liveDetail/liveDetail'
                    break
                case 2:
                    _url = 'trailerDetail/trailerDetail'
                    break
                case 3:
                    _url = 'playbackVideo/playbackVideo'
                    break
            }
            return wx.navigateTo({
                url: '/pages/'+_url+'?id='+liveActivityId,
            })
        }else {
            return wx.navigateTo({
                url:'/pages/webView/webView?url='+encodeURIComponent(LiveDetailService._meme+'sh_sh/activity/detail.html?id='+id)
            })
        }
        
    },
    // 页面上拉触底事件的处理函数
    onReachBottom() {
        if(this.data.currentNav === 2){
            this.data.liveFilterParams.resultIndex += 1
            this.setData({
                liveFilterParams: this.data.liveFilterParams
            }, () => {
                this.getLiveRecommendList()
            })
        }
    },
    // 生命周期函数--监听页面初次渲染完成
    onReady(){
        
    },
    onChangeNav(e){
        this.setData({
            currentNav: e.currentTarget.dataset.value
        })
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
    onShareAppMessage() {
        // 用户点击右上角分享
        return {
          title: 'title', // 分享标题
          desc: 'desc', // 分享描述
          path: 'path' // 分享路径
        }
    }
})