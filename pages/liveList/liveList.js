const {
    concat
} = require("../../lib/util")
const app = getApp();
import {
    LoginService
} from '../../service/login/login.service';
import {
    send
  } from '../../service/api/sendmessage.service';
import {
    WhyService
} from '../../service/api/why.service';
import {
    ApiService
} from '../../service/api/api.service';
Page({
    data: {
        indexTo: false,
        countStatus: false,
        boolStart: false,
        boolEnd: false,
        errCont: "",
        src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607343842617&di=ac9be61ab2863276b69792fc260893dc&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fimages%2F20170821%2Fec505122cde04f2090190e7456a717ea.gif',
        curLiveIdx: 0, // 当前视频索引
        curLiveItem: {}, // 当前视频内容

        top: app.globalData.statusBarHeight + 29,
        definitionTxt: "清晰度",
        fullScreen: false, //显示全屏
        showClarity: false, //显示清晰度
        statusBarHeight: app.globalData.statusBarHeight,
        shareStatus: false, //显示海报
        showPopModal: false, //显示清晰度
        showModal: false, //显示分享弹出框
        shape: false,
        showTab: false,
        canvasType: false, //canvas是否显示
        canvasH: 724,
        canvasW: 570,
        _width: 0, //手机屏宽
        _heigth: 0, //手机屏高
        swiperHeight: 0, //主图图片高度
        loadImagePath: '', //下载的图片
        loadType: false, //保存图片，分享好友 Btn
        img0: "", //绘制的商品图片本地路径
        img1: "", //绘制的二维码图片本地路径
        img2: "", //绘制的状态图片本地路径
        img3: "", //绘制的用户图片本地路径
        photoStatus: false,

        status: 3,
        time: null,
        time2: null,
        count: 0,
        likeBot: 104,

        // 轮播配置
        swiperData: {
            indicatorDots: false,
            vertical: true,
            autoplay: false,
            current: 0
        },
        liveStatus: '3', // 回放
        page: {
            end: false, //数据结束
            isLoading: false, //加载中
            total: 0, // 记录总条数
            size: 9, // 每页显示条数
            current: 1 // 当前的页数
        },
        liveList: [],
        danmuList: [{
            text: '第 1s 出现的弹幕',
            color: '#ff0000',
            time: 1
        }, {
            text: '第 3s 出现的弹幕',
            color: '#ff00ff',
            time: 3
        }],
        queryList: [{
            title: "流畅",
            active: true
        }, {
            title: "1080p",
            active: false
        }, {
            title: "4K 5G",
            active: false
        }],
    },
    // 生命周期函数--监听页面加载
    onLoad(options) {
        this.setData({
            id: options.id,
        });
    },
    //分享
    showShare() {
        this.setData({
            showModal: true,
        })
    },
    // 关闭海报
    closePos() {
        this.setData({
            canvasType: false,
        })
    },
    // 隐藏底部弹框
    closeHid() {
        this.setData({
            showModal: false
        })
    },
    /*按生成图片按钮时*/
    getSysInfo: function () {
        console.log(this.data.curLiveItem, "*(((((()))))))))))))")
        /*获取手机宽高*/
        let that = this
        let imgUrl = this.data.curLiveItem.imageUrl
        let qrcodeUrl = this.data.curLiveItem.codeUrl;
        let img = this.data.curLiveItem.img;
        let userImg = this.data.curLiveItem.userImg;
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
        let title = this.data.curLiveItem.title; //商品名称
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
            ctx.fillText(this.data.curLiveItem.userName, 90, titH + 85, txtWidth - 60);
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
        let arcode =  _width - 100;
        ctx.arc(arcode+32, titH + 166, 32, 0, Math.PI * 2, true);
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
                        scope: "scope.writePhotosAlbum"
                    })
                    // wx.showModal({
                    //     title: '提示',
                    //     content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
                    //     success(res) {
                    //         if (res.confirm) {

                    //         }
                    //     }
                    // })
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
    // 生成海报按钮
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
        this.data.liveActivityId = options.id
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
        if (getCurrentPages().length == 1) {
            this.setData({
                indexTo: true
            })
        }
        let len = getCurrentPages().length - 1;
        let id = "";
        if (len.is == "pages/liveList/liveList") {
            id = len.id;
            this.setData({
                id: len.id
            })
        }

        wx.getSystemInfo({
            success: (result) => {
                this.setData({
                    _width: result.windowWidth,
                    _heigth: result.windowHeight,
                    canvasW: result.windowWidth,
                    bottomH: result.windowHeight - ((result.windowWidth - 80) / 3 * 2 + 295)
                })
            },
        });
        // 回放列表
        this.getLiveList();
    },
    onBack() {
        if (this.data.indexTo) {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        } else {
            wx.navigateBack()
        }

    },
    //获取点赞数
    async wangInfo() {
        if (!this.data.userId) {
            await LoginService.getUser().then(res => {
                if (res && res.userId) {
                    this.setData({
                        userId: res.userId
                    })
                }
            })
        }
        let query = {
            userId: this.data.userId,
            liveActivityId: this.data.curLiveItem.liveActivityId || "c750f16a17694150b11101cfd1d993f2",
        }
        await ApiService.why('/apiLive/saveLiveUserInfo.do', query).then(res => {
            let data = res.data;
            console.log(data, "-======0000000")
            this.data.liveList[this.data.curLiveIdx].wangObj = data;
            this.setData({
                liveList: this.data.liveList
            })
        });

    },
    // 获取直播列表数据
    async getLiveList() {
        if (this.data.page.end) return;
    
        this.setData({
          'page.isLoading': true
        });
    

        let parmae = {
            "appid": app.appid,
            "secret": app.secret,
            "wxApplet": "CulturePlay",
            "id": "playbackVideo",
            "page": "playbackVideo",
            "width": "280",
        };
        let codeUrl = "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/weCode.jpg";
        await send.wxAcode(parmae).then(res => {
          let data = res.data;
          if(data.imgUrl){
            codeUrl = data.imgUrl;
          }
        })

        //列表
        let query = {
          liveSearchName: '',
          resultIndex: this.data.page.current,
          resultSize: this.data.page.size,
          liveActivityTimeStatus: this.data.liveStatus,
          liveType: 2,
          liveCheck: 2,
          sortType: 'multiple',
          from: 'wxApplet'
        }
        WhyService.getLiveActivityList(query).then(res => {
            console.log('列表', res);
            this.setData({
                'page.isLoading': false
            });
            
            if (res.status != 200) return;
            let list = res.data.list;
            
            if (list.length > 0) {
                this.push(list);
            } else {
                this.setData({
                    'page.end': true
                })
            }
            // 点赞数据
            
            list = list.map(item => {
                // item.countStatus = false;
                // item.time = null;
                // item.time2 = null;
                // item.count = 0;
                item.wangObj = {};
                item.codeUrl = codeUrl;
                item.img = "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/foreshow.png";
                item.title = item.liveTitle;
                item.userImg = item.userHeadImgUrl || 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/title.png';
                // 观看人数
                if (item.liveHot >= 10000) {
                    item.liveHot = (parseInt(item.liveHot) / 10000).toFixed(2) + 'w';
                }

                let videoUrl = "";
                if (item.liveActivityTimeStatus == 3) {
                    if (!item.liveIsTranscoding) {
                        videoUrl = item.liveVideoUrl ? item.liveVideoUrl : item.streamEvent.recordUrl;
                        if (!videoUrl) {
                            item.boolStart = true;
                        }
                        
                    } else {
                        videoUrl = item.liveVideoUrl ? item.liveVideoUrl : '';
                        if (!videoUrl) {
                            if (item.transcodeTemplateList.length) {
                                videoUrl = item.transcodeTemplateList[0].linkUrl;
                            } else {
                                if (item.streamEvent.recordUrl) {
                                    videoUrl = item.streamEvent.recordUrl;
                                } else {
                                    item.boolEnd = true;
                                    item.errCont = "直播已结束<br>敬请期待精彩回放";
                                }
                            }
                        }
                    }
                }
                item.src = videoUrl;
                return item;
            })

            this.wangInfo();
            console.log('list :>> ', list);
            list.forEach((item,index) => {
                if(item.liveActivityId == this.data.id) {
                    this.data.swiperData.current = index;
                }
            })
            this.setData({
                goods: info,
                liveList: list,
                curLiveItem: list[this.data.curLiveIdx],
                swiperData: this.data.swiperData
            }, () => {
                this.getSysInfo()
            })
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
    
        }).catch(err => {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        });
    
    },
    push: function (arr) {
        if (!arr || arr.length == 0) this.data.page.current--;
        if (this.data.page.current < 1) this.data.page.current = 1;
        this.data.liveList.push.apply(this.data.liveList, arr);
        this.setData({
            liveList: this.data.liveList
        });
    },
    //点赞
    async addWangGo(e) {
        let item = e.currentTarget.dataset.item;
        let index = e.currentTarget.dataset.index;
        if (!this.data.userId) {
            await LoginService.getUser().then(res => {
                if (res && res.userId) {
                    this.setData({
                        userId: res.userId
                    }, () => {

                    })
                } else {
                    LoginService.checkLogin()
                }
            })
        } else {
            let query = {
                userId: this.data.userId,
                liveUserId: item.wangObj.liveUserId,
                liveActivityId: item.liveActivityId || "16b9ba781f0340bfa254633accbc1025",
                userIsLike: item.wangObj.userIsLike ? 0 : 1
            }
            await ApiService.why('/apiLive/saveLiveUserInfo.do', query).then(res => {
                let body = res;
                if (res.err) return;
                if (body.status == 200) {
                    item.wangObj = body.data;
                    if (body.data.userIsLike){
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
                }
                this.data.liveList[index] = item;
                this.setData({
                    liveList: this.data.liveList
                })
            });
        }
    },
    // 轮播改变
    swiperChanged(e) {
        this.data.curLiveIdx = e.detail.current;
        this.data.curLiveItem = this.data.liveList[this.data.curLiveIdx];
        this.wangInfo();
        if (this.data.time || this.data.time2) {
            clearInterval(this.data.time);
            clearTimeout(this.data.time2);
            this.setData({
                time: null,
                time2: null
            })
        }
    },
    //详情
    changeDetail(e) { 
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + item.liveActivityId,
        })
    },
    //分享
    shareTit(e) { 
        console.log(e, "p-pppppp")
        this.onShareAppMessage();
    },
    createPoster(e) { //显示画布
        this.setData({
            shareStatus: e.detail.paramBtoA
        })
        this.setData({
            showPopModal: true
        })
    },
    showShare() {
        this.setData({
            showModal: true
        })
    },
    onMyEvent: function (e) {
        this.setData({
            shareStatus: e.detail.paramBtoA
        })
    },
    bindfullscreenchange(event) {
        let bool = event.detail.fullScreen;
        this.setData({
            fullScreen: bool
        })
        if (bool) {
            console.log("11111111111")
        } else {
            this.setData({
                showClarity: false
            })
            console.log("22222222222")
        }
    },
    bindVideoEnterPictureInPicture(e) {
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
    videoErrorCallback(e) {
        console.log('视频错误信息:')
        console.log(e.detail.errMsg)
    },
    //分享
    closePos() {
        this.setData({
            canvasType: false,
        })
    },
    // 关闭底部弹框
    closeHid() {
        this.setData({
            showModal: false
        })
    },
    /*按生成图片按钮时*/
    getSysInfo: function () {
        /*获取手机宽高*/
        let that = this;
        let imgUrl = this.data.curLiveItem.liveCoverImg
        let qrcodeUrl = this.data.curLiveItem.codeUrl;
        let img = this.data.curLiveItem.img;
        let userImg = this.data.curLiveItem.userHeadImgUrl;
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    _width: res.windowWidth,
                    _heigth: res.windowHeight
                })
                // 获取图片信息生成canvas
                that.getImginfo([imgUrl, img, userImg, qrcodeUrl]);
            }
        })
    },
    // 获取图片信息
    getImginfo: function (urlArr) {
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
        let title = this.data.curLiveItem.title; //商品名称
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
            ctx.fillText(this.data.curLiveItem.userName, 90, titH + 85, txtWidth - 60);
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
        let arcode =  _width - 100;
        ctx.arc(arcode+32, titH + 166, 32, 0, Math.PI * 2, true);
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
        this.setData({
            showModal: false,
            canvasType: true
        }, () => {
            this.getSysInfo()
        })
    },
})