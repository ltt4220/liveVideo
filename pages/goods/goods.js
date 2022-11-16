import moment from '../../lib/moment';
import {LiveDetailService} from '../../service/api/live.detail.service';
import {LoginService}from '../../service/login/login.service'

Page({
    data:{
        liveActivityId:'',
        currentNav:1,
        navData:[
            {
                value:1,
                title: '直播购物'
            },
            {
                value:2,
                title: '直播抢票'
            }
        ],
        currentShopping: '1',
        currentTickets: '1',
        listData:[],
    },
    // 获取列表
    async getGoodsList(){
        const result = await LiveDetailService.getGoodsList({
            liveActivityId:this.data.liveActivityId,
            isRecommend:0,
            entityType:1
        })
        result.data.map(item => {
            item.startDate = moment(item.startDate).format('YYYY/MM/DD')
        })
        this.setData({
            listData:result.data
        })
    },
    // 生命周期函数--监听页面加载
    onLoad(options){
        this.setData({
            liveActivityId:options.id
        }, () => {
            this.getGoodsList()
        })
    },
    onChangeNav(e){
        this.setData({
            currentNav: e.currentTarget.dataset.value
        })
    },
    onRedirectShopping(e){
        this.setData({
            currentShopping: e.currentTarget.dataset.value
        })
    },
    onRedirectTickets(e){
        this.setData({
            currentTickets: e.currentTarget.dataset.id
        }, () => {
            return wx.navigateTo({
                url:'/pages/webView/webView?url='+encodeURIComponent(LiveDetailService._meme +'sh_sh/activity/detail.html?id='+e.currentTarget.dataset.id + '&&liveActivityId' + this.data.liveActivityId)
            })
        })
    },
    // 生命周期函数--监听页面显示
    onShow(){
        wx.setNavigationBarTitle({
            title: "抢票"
        })
    },
    onShareAppMessage() {
        // 用户点击右上角分享
        return {
          title: '抢票', // 分享标题
          desc: '', // 分享描述
          path: '/pages/goods/goods' // 分享路径
        }
    }
})