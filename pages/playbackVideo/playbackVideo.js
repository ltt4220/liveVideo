const {
    concat
} = require("../../lib/util")

function getRandomColor() {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length === 1 ? '0' + color : color
        rgb.push(color)
    }
    return '#' + rgb.join('')
}
const app = getApp();
import {
    ApiService
} from '../../service/api/api.service';
import {
    LoginService
} from '../../service/login/login.service';
import {
    send
} from '../../service/api/sendmessage.service';
Page({
    onShareAppMessage() {
        return {
            title: '【直播回放】' + this.data.detail.liveTitle,
            path: '/pages/playbackVideo/playbackVideo?id=' + this.data.id,
            imageUrl: this.data.detail.liveCoverImg
        }
    },
    // 生命周期函数--监听页面加载
    onLoad(options) {
        this.setData({
            id: options.id
        });
        if (options.scene) {
            // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
            const scene = decodeURIComponent(options.scene);
            this.setData({
                id: scene
            })
        }

    },
    onReady() {
        this.videoContext = wx.createVideoContext('myVideo')
    },
    onShow() {
        if (getCurrentPages().length == 1) {
            this.setData({
                indexTo: true
            })
        }
        let len = getCurrentPages().length - 1;
        let id = "";
        if (len.is == "pages/playbackVideo/playbackVideo") {
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
        this.wangInfo();
        this.loadData();
    },
    onHide() {

        // if (this.data.time || this.data.time2) {
        //     clearInterval(this.data.time);
        //     clearTimeout(this.data.time2);
        //     this.setData({
        //         time: null,
        //         time2: null,
        //         count: 0,
        //     })
        // }
    },

    inputValue: '',
    data: {
        countStatus: false,
        indexTo: false,
        boolStart: false,
        boolEnd: false,
        errCont: "",
        top: app.globalData.statusBarHeight + 29,
        statusBarHeight: app.globalData.statusBarHeight,
        src: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607343842617&di=ac9be61ab2863276b69792fc260893dc&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_mini%2Cc_zoom%2Cw_640%2Fimages%2F20170821%2Fec505122cde04f2090190e7456a717ea.gif',
        danmuList: [{
            text: '第 1s 出现的弹幕',
            color: '#ff0000',
            time: 1
        }, {
            text: '第 3s 出现的弹幕',
            color: '#ff00ff',
            time: 3
        }],
        fullScreen: false, //显示全屏
        showClarity: false, //显示清晰度
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
        shareStatus: false, //显示海报
        goods: {},
        showPopModal: false, //显示清晰度
        showModal: false, //显示分享弹出框
        shape: false,
        showTab: false,
        definitionTxt: "清晰度",
        wangObj: {},
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
        status: 3,
        time: null,
        time2: null,
        count: 0,
        likeBot: 104,
    },
    transformation(time, form, bool) {
        let Y = new Date(time).getFullYear();
        let M = new Date(time).getMonth() + 1;
        let D = new Date(time).getDate();
        let h = new Date(time).getHours();
        let m = new Date(time).getMinutes();
        let s = new Date(time).getSeconds();
        let timeFormat = "";
        timeFormat = this.autoAddZero(M) + "/" + this.autoAddZero(D) + " " + this.autoAddZero(h) + ":" + this.autoAddZero(m);
        if (form) {
            timeFormat = this.autoAddZero(M) + "月" + this.autoAddZero(D) + "日 " + this.autoAddZero(h) + ":" + this.autoAddZero(m);

            if (bool) {
                timeFormat = Y + '年' + this.autoAddZero(M) + "月" + this.autoAddZero(D) + "日";
            }
        }
        return timeFormat;
    },
    /*
     * autoAddZero(): 不足两位，自动补0;
     *
     */
    autoAddZero(num) {
        return num >= 10 ? num : "0" + num;
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
            liveActivityId: this.data.id || "c750f16a17694150b11101cfd1d993f2",
        }
        await ApiService.why('/apiLive/saveLiveUserInfo.do', query).then(res => {
            let data = res.data;
            console.log(data, "-======0000000")
            this.setData({
                wangObj: data
            })
        });

    },
    async loadData() {
        let parmae = {
            "appid": app.appid,
            "secret": app.secret,
            "wxApplet": "CulturePlay",
            "id": this.data.id,
            "page": "pages/playbackVideo/playbackVideo",
            "width": "280",
        };
        let codeUrl = "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/weCode.jpg";
        await send.wxAcode(parmae).then(res => {
            let data = res.data;
            if (data.imgUrl) {
                codeUrl = data.imgUrl;
            }
        })
        let query = {
            liveActivityId: this.data.id || id
        };
        await ApiService.why('/apiLive/liveActivityDetail.do', query).then(res => {
            let body = res;
            if (body.err) return;
            if (body.status == 200) {
                let data = body.data;
                let h = new Date(data.liveEndTime).getHours();
                let m = new Date(data.liveEndTime).getMinutes();
                let timeFormat = this.autoAddZero(h) + ":" + this.autoAddZero(m);
                data.endTime = timeFormat;
                data.startTime = this.transformation(data.liveStartTime);
                let info = {
                    imageUrl: data.liveCoverImg,
                    codeUrl: codeUrl,
                    title: data.liveTitle,
                    userName: data.userName,
                    img: "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/foreshow.png",
                    userImg: data.userHeadImgUrl || 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/title.png'
                }
                if (data.liveHot >= 10000) {
                    data.liveHot = (parseInt(data.liveHot) / 10000).toFixed(2) + 'w';
                }
                if (data.liveActivityTimeStatus == 3) {
                    let videoUrl = "";
                    if (!data.liveIsTranscoding) {
                        videoUrl = data.liveVideoUrl ? data.liveVideoUrl : data.streamEvent.recordUrl;
                        if (!videoUrl) return this.setData({
                            boolStart: true,
                            src: videoUrl,
                            detail: data,
                            goods: info
                        });
                    } else {
                        videoUrl = data.liveVideoUrl ? data.liveVideoUrl : '';
                        if (!videoUrl) {
                            if (data.transcodeTemplateList.length) {
                                videoUrl = data.transcodeTemplateList[0].linkUrl;
                            } else {
                                if (data.streamEvent.recordUrl) {
                                    videoUrl = data.streamEvent.recordUrl;
                                } else {
                                    return this.setData({
                                        src: videoUrl,
                                        detail: data,
                                        boolEnd: true,
                                        errCont: "直播已结束<br>敬请期待精彩回放",
                                        goods: info
                                    })
                                }
                            }
                        }
                    }
                    let obj = {};
                    obj.isLikeSum = data.likeSum;
                    this.setData({
                        src: videoUrl,
                        detail: data,
                        wangObj: Object.assign({}, obj, this.data.wangObj),
                        goods: info
                    }, () => {
                        this.getSysInfo()
                    })
                }
            }
        });
    },
    //点赞
    async addWangGo() {
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
                liveUserId: this.data.wangObj.liveUserId,
                liveActivityId: this.data.id || "16b9ba781f0340bfa254633accbc1025",
                userIsLike: this.data.wangObj.userIsLike ? 0 : 1
            }
            await ApiService.why('/apiLive/saveLiveUserInfo.do', query).then(res => {
                let body = res;
                if (res.err) return;
                if (body.status == 200) {
                    this.setData({
                        wangObj: body.data,
                    }, () => {
                        if (body.data.userIsLike) {
                            if (this.data.time || this.data.time2) {
                                clearInterval(this.data.time);
                                clearTimeout(this.data.time2);
                                this.setData({
                                    time: null,
                                    time2: null,
                                    countStatus:false
                                })
                            }
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

                }
            });

        }
    },
    changeDetail() { //详情
        wx.navigateTo({
            url: '/pages/detail/detail?id=' + this.data.id,
        })
    },
    shareTit(e) { //分享
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
    changeQuery(e) {
        console.log(e.target.dataset.index, e);
        let idx = e.target.dataset.index;
        let List = this.data.queryList.map((item, i) => {
            item.active = false;
            if (i == idx) {
                item.active = true;
            }
            return item;
        })
        this.setData({
            showClarity: false,
            queryList: List,
            definitionTxt: this.data.queryList[idx].title
        })
    },
    hidden() {
        this.setData({
            showClarity: false
        })
    },
    definition(e) {
        this.setData({
            definitionTxt: e.detail.definition.title
        })
    },
    change(e) {
        let idx = e.target.dataset.index;
        if (idx) {
            this.setData({
                showClarity: !this.data.showClarity
            })
        } else {
            this.setData({
                showPopModal: !this.data.showPopModal,
                showTab: !this.data.showTab
            })
        }
    },
    bindInputBlur(e) {
        this.inputValue = e.detail.value
    },

    bindButtonTap() {
        const that = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: ['front', 'back'],
            success(res) {
                that.setData({
                    src: res.tempFilePath
                })
            }
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
    bindVideoEnterPictureInPicture() {
        console.log('进入小窗模式', this.data.time, this.data.time2)
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
        // if (this.data.time || this.data.time2 ) {
        //     clearInterval(this.data.time);
        //     clearTimeout(this.data.time2);
        //     this.setData({
        //         time: null,
        //         time2: null,
        //         count: 0,
        //     })
        // }
    },

    bindPlayVideo() {
        console.log('1')
        this.videoContext.play()
    },
    bindSendDanmu() {
        this.videoContext.sendDanmu({
            text: this.inputValue,
            color: getRandomColor()
        })
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
    closeHid() {
        this.setData({
            showModal: false
        })
    },
    /*按生成图片按钮时*/
    getSysInfo: function () {
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
        this.setData({
            showModal: false,
            canvasType: true
        }, () => {
            this.getSysInfo()
        })
    },

})