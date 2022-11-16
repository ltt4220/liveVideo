const wxappIo = require('../../lib/weapp.socket.io.js');
const app = getApp();
import moment from '../../lib/moment';
import * as patInfo from '../../utils/astricts'
import {
    LiveDetailService
} from '../../service/api/live.detail.service';
import {
    LoginService
} from '../../service/login/login.service';
import {
    send
} from '../../service/api/sendmessage.service';
let _idTime = ''
Page({
    data: {
        keyboardHeight: 0,
        statusBarHeight: app.globalData.statusBarHeight,
        // 用户信息
        userInfo: {},
        // 详情数据
        detailData: {},
        // 详情id
        liveActivityId: '',
        // 点赞数据
        praiseInfo: {},
        // 清晰度
        clarityInfo: {},
        // 是否显示清晰度弹窗
        isShowClarity: false,
        //显示海报
        shareStatus: false,
        // 海报
        goods: {
            title: "",
            userName: "",
            img: "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/live.png",
            userImg: "",
            imageUrl: '', //封面图
            codeUrl: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/weCode.jpg', //二维码网络路径
        },
        // 是否显示礼物弹窗
        isShowGift: false,
        // 选中礼物
        currentGift: '',
        commentTime: {},
        // 礼物集合
        sendGiftData: [{}],

        goodsList: [],
        // 礼物信息
        giftNum: 0,
        giftName: '',
        giftImg: '',
        giftFileName: '',
        // 礼物
        giftValue: 1,
        // 总共礼物数
        allGiftNum: 0,
        // 屏幕高度
        wxScrrenHeight: 0,
        // 是否显示评论弹窗
        isShowComment: false,
        // 评论
        commentValue: '',
        endLiveData: {},
        // 是否显示分享弹窗
        showModal: false,
        // 礼物列表
        giftData: [],
        commentData: [],
        recommendList: [],
        isEnd: false,
        canvasType: false,
        _width: 0, //手机屏宽
        _heigth: 0, //手机屏高
        swiperHeight: 0, //主图图片高度
        canvasType: false, //canvas是否显示
        loadImagePath: '', //下载的图片
        loadType: false, //保存图片，分享好友 Btn
        canvasH: 724,
        canvasW: 570,
        img0: "", //绘制的商品图片本地路径
        img1: "", //绘制的二维码图片本地路径
        img2: "", //绘制的状态图片本地路径
        img3: "", //绘制的用户图片本地路径
        photoStatus: false,
        status: 1,
        count: 0,
        likeBot: 104,
        time: null,
        time2: null,
        countStatus: false
    },
    //分享
    showShare() {
        this.setData({
            showModal: true,
        })
    },
    closePos() {
        this.setData({
            canvasType: false,
        })
    },
    closeHid() {
        this.setData({
            showModal: false
        })
    },
    /*按生成图片按钮时*/
    getSysInfo: function () {
        console.log(this.data.goods, "*(((((()))))))))))))")
        /*获取手机宽高*/
        let that = this
        let imgUrl = this.data.goods.imageUrl
        let qrcodeUrl = this.data.goods.codeUrl;
        let img = this.data.goods.img;
        let userImg = this.data.goods.userImg;
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    _width: res.windowWidth,
                    _heigth: res.windowHeight,
                })
                // 获取图片信息生成canvas
                that.getImginfo([imgUrl, img, userImg, qrcodeUrl]);
            }
        })
    },
    // 获取图片信息
    getImginfo: function (urlArr) {
        console.log(urlArr, "-======eeeeee")
        let that = this;
        const getImage = (url, i) => {
            return new Promise((resolve, reject) => {
                wx.getImageInfo({
                    src: url, //服务器返回的带参数的小程序码地址
                    success: function (res) {
                        let obj = {};
                        let str = "img" + i;
                        obj[str] = res.path;
                        if (i == urlArr.length - 1) { //商品图片
                            obj.loadType = true;
                        }
                        console.log(obj, "-===========obj")
                        that.setData(obj)
                        resolve(res);
                    },
                    fail: function (res) {
                        //失败回调
                        console.log('错误-res', res)
                        reject();
                    }
                })
            })
        }
        // loading-start
        Promise.all(urlArr.map((v, i) => getImage(v, i))).then(res => {
            // loading-end
            this.createNewImg();
        })

    }, //绘制canvas
    createNewImg: function () {
        let _width = this.data._width;
        let that = this;
        let imgH = (_width - 80) / 3 * 2; //绘制时图片显示高度  
        let ctx = wx.createCanvasContext('mycanvas', this);
        // 绘制背景
        ctx.setFillStyle("#fff");
        ctx.fillRect(20, 80, _width - 40, imgH + 220);
        //绘制图片
        ctx.drawImage(this.data.img0, 40, 100, _width - 80, imgH);

        // 绘制标题
        ctx.setFontSize(18);
        ctx.setFillStyle('#333');

        let txtWidth = _width - 80; //文字的宽度

        //商品名称 最多两行显示 写法有点LOW，但思路是这样的
        let title = this.data.goods.title; //商品名称
        let title2 = ""; //商品名称
        let num = this.data.status == 1 ? 16 : 20;
        if (title.length > num) {
            title2 = title.slice(num, title.length);
            title = title.slice(0, num);
        }
        if (title2.length > 20) {
            if (this.data.status == 1) {
                title2 = title2.slice(0, num) + '...';
            } else {
                title2 = title2.slice(0, num - 3) + '...';
            }
        }
        if (this.data.status == 1) {
            ctx.drawImage(this.data.img1, 40, imgH + 114, 40, 20);
            ctx.fillText(title, 90, imgH + 130, txtWidth);
            ctx.fillText(title2, 40, imgH + 160, txtWidth);
        } else if (this.data.status == 3) {
            ctx.fillText(title, 40, imgH + 130, txtWidth);
            ctx.fillText(title2, 40, imgH + 160, txtWidth);
        } else {
            ctx.drawImage(this.data.img1, 40, imgH + 114, 40, 20);
            ctx.setFontSize(30);
            ctx.setFillStyle('#000');
            ctx.fillText('08/14', 90, imgH + 136, 80);
            ctx.setFontSize(14);
            ctx.setFillStyle('#ccc');
            ctx.fillText('|', 180, imgH + 132, 10);
            ctx.setFontSize(20);
            ctx.setFillStyle('#000');
            ctx.fillText('18:00-16:00', 200, imgH + 135, 170);
            ctx.setFontSize(18);
            ctx.setFillStyle('#333');
            ctx.fillText(title, 40, imgH + 180, txtWidth);
            ctx.fillText(title2, 40, imgH + 210, txtWidth);
        }

        //绘制头像;
        let titH = imgH + 120;
        // ctx.beginPath();
        // ctx.arc(60, titH + 50, 20, 0, Math.PI * 2, true);
        // ctx.clip();
        // ctx.drawImage(this.data.img2, 40, titH + 30, 40, 40);
        // ctx.closePath();
        // ctx.stroke()
        // 绘制用户名称'
        if (this.data.status != 2) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(60, titH + 80, 20, 0, Math.PI * 2, true);
            ctx.clip()
            ctx.drawImage(this.data.img2, 40, titH + 60, 40, 40);
            ctx.restore();
            ctx.setFontSize(14);
            ctx.setFillStyle('#666');
            ctx.fillText(this.data.goods.userName, 90, titH + 85, txtWidth - 60);
        }

        // 绘制二维码
        ctx.fillStyle = "#eee";
        ctx.fillRect(20, titH + 120, _width - 40, 90);
        ctx.setFontSize(14);
        ctx.setFillStyle('#666');
        ctx.fillText('长按小程序码 ', 40, titH + 160, txtWidth);
        ctx.fillText('进入云直播间小程序观看 ', 40, titH + 180, txtWidth);
        ctx.save();
        ctx.beginPath();
        let arcode = _width - 100;
        ctx.arc(arcode + 32, titH + 166, 32, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.drawImage(this.data.img3, _width - 100, titH + 134, 64, 64);
        ctx.restore();
        // 显示绘制

        ctx.draw(true, () => {
            //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
            wx.canvasToTempFilePath({
                canvasId: "mycanvas",
                success: function (res) {
                    var tempFilePath = res.tempFilePath;
                    that.setData({
                        loadImagePath: tempFilePath,
                        photoStatus: true
                    });
                },
                fail: function (res) {
                    console.log(res);
                }
            });
        });

    },
    //点击保存到相册
    saveImg: function (e) {
        wx.getSetting({
            success: res => {
                let authSetting = res.authSetting;
                if (!authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: "scope.writePhotosAlbum",
                        success: (res) => {
                            wx.saveImageToPhotosAlbum({
                                filePath: this.data.loadImagePath,
                                success(res) {
                                    console.log('res黑乎乎', res);
                                    wx.showToast({
                                        title: '已保存到相册',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                },
                                fail(err) {
                                    wx.showToast({
                                        title: '保存失败',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                }
                            })
                        },
                        fail: (err) => {
                            console.log(res, "333333333")
                        }
                    })
                } else {
                    wx.saveImageToPhotosAlbum({
                        filePath: this.data.loadImagePath,
                        success(res) {
                            console.log('res黑乎乎', res);
                            wx.showToast({
                                title: '已保存到相册',
                                icon: 'success',
                                duration: 2000
                            })
                        },
                        fail(err) {
                            wx.showToast({
                                title: '保存失败',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                }
            }
        });
    },
    mycards() {
        console.log("11111113232323232")
        this.setData({
            showModal: false,
            canvasType: true
        }, () => {
            this.getSysInfo()
        })
    },
    onLoad(options) {
        this.data.liveActivityId = options.id;
        if (options.scene) {
            // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
            const scene = decodeURIComponent(options.scene);
            this.data.liveActivityId = scene;
        }

        wx.getSystemInfo({
            success: (result) => {
                console.log(result, "opdkfa;ds", result.windowHeight - ((result.windowWidth - 80) / 3 * 2 + 300))
                this.setData({
                    _width: result.windowWidth,
                    _heigth: result.windowHeight,
                    canvasW: result.windowWidth,
                    bottomH: result.windowHeight - ((result.windowWidth - 80) / 3 * 2 + 295)
                })
            },
        });
    },
    goBack() {
        const _pageData = getCurrentPages()
        if (_pageData.length === 1) {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        } else {
            wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
            })
        }
    },
    onShow() {
        if (!LoginService.userInfo.userId) {
            return LoginService.checkLogin()
        }
        const _pageData = getCurrentPages()
        this.setData({
            liveActivityId: this.data.liveActivityId || _pageData[_pageData.length - 1].data.liveActivityId,
            commentData: [],
        }, () => {
            this.getSocketInfo()
            this.getDetail()
        })
    },
    // 获取列表
    async getGoodsList() {
        const result = await LiveDetailService.getGoodsList({
            liveActivityId: this.data.liveActivityId,
            entityType: 1
        })
        this.setData({
            goodsList: result.data.filter(item => !item.isRecommend),
            recommendList: result.data.filter(item => item.isRecommend).slice(0, 1)
        })
    },
    // 获取详情
    async getDetail() {
        let parmae = {
            "appid": app.appid,
            "secret": app.secret,
            "wxApplet": "CulturePlay",
            "id": this.data.liveActivityId,
            "page": "pages/liveDetail/liveDetail",
            "width": "280",
        };
        let codeUrl = "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/weCode.jpg";
        await send.wxAcode(parmae).then(res => {
            let data = res.data;
            if (data.imgUrl) {
                codeUrl = data.imgUrl;
            }
        })
        const that = this
        const result = await LiveDetailService.getLiveDetail({
            liveActivityId: this.data.liveActivityId
        })
        console.log(result, 44444444444444444)
        this.data.goods.codeUrl = codeUrl
        this.data.goods.title = result.data.liveTitle
        this.data.goods.userName = result.data.userName
        this.data.goods.userImg = result.data.userHeadImgUrl || 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/title.png'
        this.data.goods.imageUrl = result.data.liveCoverImg

        result.data.liveHot = result.data.liveHot > 10000 ? (result.data.liveHot / 10000).toFixed(2) + '万' : result.data.liveHot

        this.data.endLiveData.liveCoverImg = result.data.liveCoverImg
        this.data.endLiveData.liveTitle = result.data.liveTitle

        if (result.data.liveEndTime < moment(new Date()).valueOf()) {
            return this.endLive()
        } else {
            this.getGoodsList()
            this.getGiftList()
        }
        _idTime = setInterval(() => {
            if (result.data.liveEndTime < moment(new Date()).valueOf()) {
                clearInterval(_idTime)
                return this.endLive()
            }
        }, 1000);
        this.setData({
            goods: this.data.goods,
            clarityInfo: result.data.transcodeTemplateId ? result.data.transcodeTemplateList[0] : {
                rtmplinkUrl: result.data.liveLink.rtmp
            },
            userInfo: LoginService.userInfo,
            detailData: result.data,
        }, () => {
            wx.getSystemInfo({
                success(res) {
                    that.data.wxScrrenHeight = res.screenHeight
                }
            })
        })
        this.getPraiseInfo()
    },
    // 直播结束
    async endLive() {
        const result = await LiveDetailService.endLive({
            liveActivityId: this.data.liveActivityId
        })
        result.data.watchNumber = result.data.watchNumber > 10000 ? (result.data.watchNumber / 10000).toFixed(2) + '万' : result.data.watchNumber
        const _data = Object.assign({}, result.data, this.data.endLiveData)
        return this.setData({
            isEnd: true,
            endLiveData: _data,
        })
    },
    // 获取点赞信息
    async getPraiseInfo() {
        const result = await LiveDetailService.getPraiseInfo({
            liveActivityId: this.data.liveActivityId,
            userId: this.data.userInfo.userId
        })
        this.setData({
            praiseInfo: result.data
        })
    },
    // 点赞 、取消
    async onChangePraise() {
        const result = await LiveDetailService.getPraiseInfo({
            liveUserId: this.data.praiseInfo.liveUserId,
            liveActivityId: this.data.liveActivityId,
            userId: this.data.userInfo.userId,
            userIsLike: this.data.praiseInfo.userIsLike ? 0 : 1
        })
        this.setData({
            praiseInfo: result.data
        }, () => {
            if (result.data.userIsLike) {
                this.setData({
                    countStatus: true,
                    time: setInterval(() => {
                        this.setData({
                            count: this.data.count + 1,
                            time2: setTimeout(() => {
                                clearInterval(this.data.time);
                                clearTimeout(this.data.time2)
                                this.setData({
                                    time: null,
                                    time2: null,
                                    count: 0
                                })
                            }, 1200)
                        })
                    }, 200)
                })
            } else {
                this.setData({
                    countStatus: false,
                    count: 0
                }, () => {
                    console.log(this.data.count, "()****取消点赞**")
                    if (this.data.time || this.data.time2) {
                        clearInterval(this.data.time);
                        clearTimeout(this.data.time2);
                        this.setData({
                            time: null,
                            time2: null
                        })
                    }
                })
            }
        })
    },
    // wxSocket
    getSocketInfo() {
        const {
            userId,
            userName,
            userMobileNo,
            userHeadImgUrl
        } = LoginService.userInfo
        if (this.wxSocket) {
            return
        }
        this.wxSocket = wxappIo('https://chat.ctwenhuayun.cn', {
            transports: ['websocket'],
            query: {
                rid: this.data.liveActivityId,
                uid: userId,
                username: userName,
                mobile: userMobileNo,
                role: 0, //0普通用户 1管理员 2机器人
                avatar: userHeadImgUrl || 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/title.png',
            }
        })
        this.wxSocket.on('connect', function () {
            console.log('connect====链接成功');
        });
        this.wxSocket.on('msg', (msg) => {
            console.log(msg, 8888888888)
            this.data.commentData.push(msg)
            this.setData({
                commentData: this.data.commentData,
            }, () => {
                this.scrolltop()
            })
        })
        this.wxSocket.on('join', (msg) => {
            const _isEntry = this.data.commentData.some(item => item.uid === msg.uid)
            if (_isEntry) {
                return
            }
            this.data.commentData.push({
                role: 3,
                uid: msg.uid,
                username: msg.username,
                msg: '进入了直播间'
            })
            this.setData({
                commentData: this.data.commentData
            }, () => {
                this.scrolltop()
            })
        })

        this.wxSocket.on('gift', (res) => {
            console.log(res, '礼物-----')
            this.data.sendGiftData.push({
                giftImg: res.img,
                userName: res.username,
                userHeadImgUrl: res.userHeadImgUrl,
                giftName: res.msg,
                giftNum: res.num,
            })
            this.setData({
                sendGiftData: this.data.sendGiftData,
                isShowGift: false,
                currentGift: '',
                giftImg: '',
                giftFileName: '',
                giftName: '',
                giftValue: 1,
            }, () => {
                this.scrollleft()
            })
        })
    },
    onRedirectToDetail() {
        wx.navigateTo({
            url: '../detail/detail?id=' + this.data.liveActivityId,
        })
    },
    redirect() {
        wx.navigateTo({
            url: '../index/index',
        })
    },
    // 跳转到商品列表
    onRedirectGoods() {
        wx.navigateTo({
            url: '../goods/goods?id=' + this.data.liveActivityId,
        })
    },
    onCloseGoods() {
        this.setData({
            recommendList: []
        })
    },
    redirectToActivity(e) {
        return wx.navigateTo({
            url: '/pages/webView/webView?url=' + encodeURIComponent(LiveDetailService._meme + 'sh_sh/activity/detail.html?id=' + e.currentTarget.dataset.id)
        })
    },
    onShowClarity() {
        this.setData({
            isShowClarity: true,
            isShowGift: false,
            giftValue: 1,
            currentGift: '',
        })
    },
    onCloseClarity() {
        this.setData({
            isShowClarity: false
        })
    },
    onChangeClarity(e) {
        this.setData({
            clarityInfo: e.currentTarget.dataset.clarity,
            isShowClarity: false
        })
    },
    onShowGift() {
        this.setData({
            isShowGift: true
        })
    },
    onChangeGiftType(e) {
        const {
            giftId,
            giftUrl,
            giftName,
            giftFileName
        } = e.currentTarget.dataset.item
        this.setData({
            currentGift: giftId,
            giftImg: giftUrl,
            giftFileName: giftFileName,
            giftName: giftName,
            giftValue: 1,
        })
    },
    onChangeGiftNum(e) {
        this.setData({
            giftValue: e.detail,
        })
    },
    // 获取礼物列表
    async getGiftList() {
        const result = await LiveDetailService.getGiftList({})
        this.setData({
            giftData: result.data
        })
    },
    submitGift() {
        if (!this.data.currentGift) {
            return null
        }
        console.log({
            role: 0,
            _id: this.wxSocket.id,
            msg: this.data.giftName,
            num: this.data.giftValue,
            img: this.data.giftImg
        }, '发送-------')

        this.wxSocket.emit('gift', {
            role: 0,
            _id: this.wxSocket.id,
            msg: this.data.giftName,
            num: this.data.giftValue,
            img: this.data.giftImg
        })
        LiveDetailService.submitGift({
            giftId: this.data.currentGift,
            giftName: this.data.giftName,
            giftFileName: this.data.giftFileName,
            giftUrl: this.data.giftImg,
            liveActivityId: this.data.liveActivityId,
            userId: LoginService.userInfo.userId,
            count: this.data.giftValue
        })
    },
    onCloseGift(e) {
        const that = this
        if (this.data.isShowGift) {
            wx.createSelectorQuery().select('.gift-pop').boundingClientRect(res => {
                if (e.detail.y < that.data.wxScrrenHeight - res.height) {
                    that.setData({
                        isShowGift: false,
                        currentGift: '',
                        giftImg: '',
                        giftFileName: '',
                        giftName: '',
                        giftValue: 1,
                    })
                }
            }).exec()
        }
    },
    getFocus(e) {
        this.setData({
            isShowComment: true,
            keyboardHeight: e.detail.height,
        })
    },
    getInputInfo(e) {
        this.setData({
            commentValue: e.detail.value
        })
    },
    bindblur() {
        isShowComment: false,
            this.commentTime = setTimeout(() => {
                this.setData({
                    commentValue: ''
                })
                clearTimeout(this.commentTime)
            }, 0);
    },

    submitComment() {
        if (!this.data.commentValue) {
            return
        }
        if (patInfo.pat.test(this.data.commentValue)) {
            return wx.showModal({
                title: '提示',
                content: '评论存在不合法行为，请文明评论！',
            })
        }
        this.wxSocket.emit('msg', {
            role: 0,
            username: this.data.userInfo.userName,
            _id: this.wxSocket.id,
            msg: this.data.commentValue,
        })
    },
    scrolltop() {
        const that = this
        wx.createSelectorQuery().select('.message').boundingClientRect(res => {
            that.setData({
                scrolltop: res.height
            })
        }).exec()
    },
    scrollleft() {
        const that = this
        wx.createSelectorQuery().select('.gift-container').boundingClientRect(res => {
            that.setData({
                scrollleft: res.width * (that.data.sendGiftData.length - 1)
            })
        }).exec()
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.detailData.liveTitle,
            path: '/pages/liveDetail/liveDetail?id=' + this.data.liveActivityId,
            imageUrl: this.data.detailData.liveCoverImg
        }
    },
    bindVideoEnterPictureInPicture() {
        console.log('进入小窗模式')
        app.globalData.bool = true;
        this.setData({
            countStatus: false
        })
        if (this.data.time || this.data.time2) {
            clearInterval(this.data.time);
            clearTimeout(this.data.time2);
            this.setData({
                time: null,
                time2: null
            })
        }
    },

    bindVideoLeavePictureInPicture() {
        console.log('退出小窗模式')
        // if (this.data.time || this.data.time2) {
        //     clearInterval(this.data.time);
        //     clearTimeout(this.data.time2);
        //     this.setData({
        //         time: null,
        //         time2: null,
        //         count: 0,
        //     })
        // }
    }
})