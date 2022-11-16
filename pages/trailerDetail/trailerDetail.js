// pages/trailerDetail/trailerDetail.js
import {
  ApiService
} from '../../service/api/api.service';
import {
  LoginService
} from '../../service/login/login.service';
import {
  CreateService
} from '../../service/create/create.service';
import {
  send
} from '../../service/api/sendmessage.service';
let countDownTimer = null;
let countDown = 0;
const app = getApp();
const co = app.co;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareStatus: false, //显示海报
    goods: {
      // imageUrl: "http://imgo2o.shikee.com/goods/2019/10/17/201910171144361688.jpg",
      // codeUrl: "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/weCode.jpg",
      // title: "欧洲之窗 | 绚丽多彩的西班牙文化西班西绚丽多彩的西班牙文化西班西绚丽多彩的西班牙文化西班西",
      // userName: "用户名称",
      // img: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2070522536,3783982860&fm=15&gp=0.jpg",
      // userImg: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=29577033,167552331&fm=15&gp=0.jpg"
    },
    showModal: false, //显示分享弹出框
    isActive: false, //已提醒
    canelActive: false,
    warnImg: "../../images/user/success.png",
    title: "设置开播提醒成功",
    hideModal: false,
    shape: false,
    detail: {},
    wangObj: {},
    id: "",
    userId: "",
    userMobileNo: "",
    remindStatus: false,
    phoneStatus: false,
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
    status: 2,
    countDownData: [],
    count: 0,
    time: null,
    time2: null,
    bool: false,
    weChatInfo: {}, // 微信授权的用户信息
    iv: '',
    encryptedData: '',
    openId: '',
  },
  startCountDown(mss) {
    if (mss <= 0) {
      clearInterval(countDownTimer);
      countDownTimer = null;
      wx.redirectTo({
        url: '/pages/liveDetail/liveDetail?id=' + this.data.id
      })
    } else {
      var days = parseInt(mss / (1000 * 60 * 60 * 24));
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = parseInt((mss % (1000 * 60)) / 1000);
      // var text = days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
      // this.data.countDownData
      this.setData({
        countDownData: [days, hours, minutes, seconds]
      })
      this.countDownData = [days, hours, minutes, seconds];
      if (this.data.countDownData[0] == 0 && this.data.countDownData[1] == 0 && this.data.countDownData[2] == 0 && this.data.countDownData[3] == 0) {
        wx.redirectTo({
          url: '/pages/liveDetail/liveDetail?id=' + this.data.id
        })
      }
    }
  },
  goBack() {
    this.setData({
      remindStatus: false
    })
    // this.remindStatus = false;
    // this.isActive = true;
  },
  addHiden() {
    this.setData({
      phoneStatus: false
    })
  },
  showHiden() {
    this.setData({
      phoneStatus: true
    })
  },
  bindKeyInput(e) {
    this.setData({
      userMobileNo: e.detail.value
    })
  },
  async addRemind() {
    if (!this.data.userMobileNo) return this.setData({
      warnImg: '../../components/likeFx/images/fail.png',
      title: "手机号不可为空",
      hideModal: true,
      isActive: false,
      remindStatus: false
    }, () => {
      setTimeout(() => {
        this.setData({
          hideModal: false
        })
      }, 2000)
    });
    let reg = /^1[3456789]\d{9}$/;
    if (!reg.test(this.data.userMobileNo)) {
      this.userMobileNo = "";
      return this.setData({
        warnImg: '../../components/likeFx/images/fail.png',
        title: "手机号输入不正确",
        hideModal: true,
        isActive: false,
        remindStatus: false
      }, () => {
        setTimeout(() => {
          this.setData({
            hideModal: false
          })
        }, 2000)
      })
    }
    // return wx.showToast({
    //   title: '手机号不正确',
    //   image: '../../components/likeFx/images/fail.png',
    //   duration: 2000
    // });

    let query = {
      moduleType: 1,
      moduleId: this.data.id || "c750f16a17694150b11101cfd1d993f2",
      userId: this.data.userId,
      userMobileNo: this.data.userMobileNo,
    }
    await ApiService.why('/apiUser/remind.do', query).then(res => {
      let body = res;
      if (body.err) return;
      if (body.status == 200) {
        this.setData({
          isActive: !this.data.isActive,
          remindStatus: true,
          phoneStatus: false
        })
      }
    });
  },
  // 获取openId和unionId
  getDecode() {
    co.checkSession().then(sid => {
      let query = {
        sid: sid,
        iv: this.data.iv,
        encryptedData: this.data.encryptedData
      }
      co.http.api('/minicom/user/decode', query).then(res => {
        console.log('111', res);
        this.setData({
          openId: res.data.openId,
          unionId: res.data.unionId
        });
        LoginService.openId = res.data.openId; //存储登录的用户信息

        // this.weChatLogin();
      }).catch(err => {
        console.log(111, '授权失败！');
        CreateService.alertDialog('授权失败！');
      });
    });
  },
  sendMesg() {
    let pearm = {
      "thing1": {
        "value": "主播昵称"
      },
      "thing2": {
        "value": "直播标题"
      },
      "thing6": {
        "value": "直播间名称"
      },
      "thing5": {
        "value": "分区"
      }
    };
    let data = {
      "appid": app.appid,
      "secret": app.secret,
      "openId": LoginService.openId,
      "templateId": app.teplIds,
      "page": "liveDetail",
      "miniprogramState": app.miniprogramState,
      "lang": "zh_CN",
      "params": pearm
    };
    send.sendMessage(data).then(res => {
      let data = JSON.parse(res.data)
      if (!res.data.errcode) {
        this.setData({
          isActive: true
        })
      }
      console.log(res, "-=============087000", data)
    })

  },
  getUserInfo(res) {
    if (res.detail.userInfo) {
      if (!this.data.userId) {
        LoginService.getUser().then(res => {
          if (res && res.userId) {
            this.setData({
              userId: res.userId
            })
          } else {
            LoginService.checkLogin()
          }
        })
      } else {
        this.setData({
          iv: res.detail.iv,
          encryptedData: res.detail.encryptedData,
          weChatInfo: res.detail.userInfo || {}
        });
        LoginService.weChatInfo = this.data.weChatInfo; //存储微信授权的用户信息
        if (!LoginService.openId) {
          console.log("111111111111111333")
          this.getDecode();
        }
      }
    } else {
      CreateService.alertDialog('拒绝授权！');
    }
  },
  haveRemind() { //设置提醒/取消
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    // if (this.data.isActive) return;
    // wx.getSetting({
    //   withSubscriptions: true,
    //   success: (res) => {
    //     if (res.subscriptionsSetting && res.subscriptionsSetting[app.teplIds] == "accept") {
    //       console.log("111111111111111111")
    //       this.sendMesg()
    //     } else {
    //       wx.requestSubscribeMessage({
    //         tmplIds: [app.teplIds],
    //         success: (res) => {
    //           if (res.errMsg.indexOf("ok") > -1) {
    //             console.log("322222222222")
    //             this.sendMesg()

    //           }
    //           console.log(res)
    //         },
    //         fail(err) {
    //           console.log(err)
    //         }
    //       })
    //     }
    //   }
    // })

    if (this.data.isActive) {
      let query2 = {
        moduleId: this.data.id || "c750f16a17694150b11101cfd1d993f2",
        userId: this.data.userId
      }
      ApiService.why("/apiUser/cancelRemind.do", query2).then(res => {
        let body = res;
        if (body.err) return;
        if (body.status == 200) {
          this.setData({
            warnImg: '../../components/likeFx/images/fail.png',
            title: "已取消提醒",
            hideModal: true,
            isActive: false
          }, () => {
            setTimeout(() => {
              this.setData({
                hideModal: false
              })
            }, 2000)
          })
        }
      });
    } else {
      if (!this.data.userId) {
        LoginService.getUser().then(res => {
          if (res && res.userId) {
            this.setData({
              userId: res.userId,
              phoneStatus: true
            })
          } else {
            LoginService.checkLogin()
          }
        })
      } else {
        if (!this.data.isActive)
          this.setData({
            phoneStatus: true
          })
      }
    }

  },
  shareTit(e) { //分享
    console.log(e, "p-pppppp")
    this.onShareAppMessage();
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
    ctx.fillRect(20, 20, _width - 40, imgH + 250);
    //绘制图片
    ctx.drawImage(this.data.img0, 40, 50, _width - 80, imgH);

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
      ctx.drawImage(this.data.img1, 40, imgH + 64, 40, 20);
      ctx.fillText(title, 90, imgH + 80, txtWidth);
      ctx.fillText(title2, 40, imgH + 110, txtWidth);
    } else if (this.data.status == 3) {
      ctx.fillText(title, 40, imgH + 80, txtWidth);
      ctx.fillText(title2, 40, imgH + 110, txtWidth);
    } else {
      ctx.drawImage(this.data.img1, 40, imgH + 64, 40, 20);
      ctx.setFontSize(30);
      ctx.setFillStyle('#000');
      ctx.fillText('08/14', 90, imgH + 86, 80);
      ctx.setFontSize(14);
      ctx.setFillStyle('#ccc');
      ctx.fillText('|', 180, imgH + 82, 10);
      ctx.setFontSize(20);
      ctx.setFillStyle('#000');
      ctx.fillText('18:00-16:00', 200, imgH + 85, 170);
      ctx.setFontSize(18);
      ctx.setFillStyle('#333');
      ctx.fillText(title, 40, imgH + 130, txtWidth);
      ctx.fillText(title2, 40, imgH + 160, txtWidth);
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
      ctx.arc(60, titH + 60, 20, 0, Math.PI * 2, true);
      ctx.clip()
      ctx.drawImage(this.data.img2, 40, titH + 10, 40, 40);
      ctx.restore();
      ctx.setFontSize(14);
      ctx.setFillStyle('#666');
      ctx.fillText(this.data.goods.userName, 90, titH + 35, txtWidth - 60);
    }

    // 绘制二维码
    ctx.fillStyle = "#eee";
    ctx.fillRect(20, titH + 70, _width - 40, 90);
    ctx.setFontSize(14);
    ctx.setFillStyle('#666');
    ctx.fillText('长按小程序码 ', 40, titH + 110, txtWidth);
    ctx.fillText('进入云直播间小程序观看 ', 40, titH + 130, txtWidth);
    ctx.save();
    ctx.beginPath();
    let arcode =  _width - 100;
    ctx.arc(arcode+32, titH + 116, 32, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.drawImage(this.data.img3, _width - 100, titH + 84, 64, 64);
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
        console.log(res, "11111111111")
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
     if(options.scene){
       // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
       const scene = decodeURIComponent(options.scene);
       this.setData({
        id: scene
      })
     }
   
  },
  //点赞
  async addWangGo() {
    if (!this.data.userId) {
      await LoginService.getUser().then(res => {
        if (res && res.userId) {
          this.setData({
            userId: res.userId,
            userMobileNo: res.userMobileNo
          })
        } else {
          LoginService.checkLogin()
        }
      })
    }
    let query = {
      userId: this.data.userId,
      liveUserId: this.data.wangObj.liveUserId,
      liveActivityId: this.data.id || "c750f16a17694150b11101cfd1d993f2",
      userIsLike: this.data.wangObj.userIsLike ? 0 : 1
    }
    await ApiService.why('/apiLive/saveLiveUserInfo.do', query).then(res => {
      let body = res;
      if (res.err) return;
      if (body.status == 200) {
        this.setData({
          wangObj: body.data
        })
        if (body.data.userIsLike) {
          if (this.data.time || this.data.time2) {
            clearInterval(this.data.time);
            clearTimeout(this.data.time2);
            this.setData({
                time: null,
                time2: null
            })
        }
          this.setData({
            bool: true,
            time: setInterval(() => {
              this.setData({
                count: this.data.count + 1,
                time2: setTimeout(() => {
                  clearInterval(this.data.time);
                  clearTimeout(this.data.time2)
                  this.setData({
                    time: null,
                    time2: null,
                    bool: false,
                    count: 0,
                  })
                }, 1200)
              })
            }, 200)
          })
        } else {
          if (this.data.time || this.data.time2) {
            clearInterval(this.data.time);
            clearTimeout(this.data.time2);
            this.setData({
              bool: false,
              time: null,
              time2: null,
              count: 0,
            })
          }
        }
      }
    });
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
      this.getRemind();
    });
  },
  getRemind() {
    let query = {
      moduleId: this.data.id || "c750f16a17694150b11101cfd1d993f2",
      userId: this.data.userId
    }
    ApiService.why("/apiUser/queryUserRemind.do", query).then(res => {
      let body = res;
      if (body.err) return;
      if (body.status == 200) {
        if (body.data && body.data.remindMethod) {
          this.setData({
            isActive: true
          })
        }
      }
    });
  },
  //时间转换
  formation(time, bool) {
    let Y = new Date(time).getFullYear();
    let M = new Date(time).getMonth() + 1;
    let D = new Date(time).getDate();
    let h = new Date(time).getHours();
    let m = new Date(time).getMinutes();
    let s = new Date(time).getSeconds();
    let timeFormat = "";
    let str = this.autoAddZero(h) + ":" + this.autoAddZero(m);
    timeFormat = this.autoAddZero(M) + "/" + this.autoAddZero(D);
    if (bool) {
      return str;
    } else {
      return [timeFormat, str];
    }

  },
  /*
   * autoAddZero(): 不足两位，自动补0;
   *
   */
  autoAddZero(num) {
    return num >= 10 ? num : "0" + num;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (countDownTimer) {
      clearInterval(countDownTimer);
      countDown = 0;
    }
    // wx.getSetting({
    //   withSubscriptions: true,
    //   success: (res) => {
    //     if (res.subscriptionsSetting && res.subscriptionsSetting[app.teplIds] == "accept") {
    //       this.setData({
    //         isActive: true
    //       })
    //     }
    //   }
    // });
    wx.getSystemInfo({
      success: (result) => {
        console.log(result, "opdkfa;ds", result.windowHeight - ((result.windowWidth - 80) / 3 * 2 + 300))
        this.setData({
          openId: LoginService.openId,
          _width: result.windowWidth,
          _heigth: result.windowHeight,
          canvasW: result.windowWidth,
          bottomH: result.windowHeight - ((result.windowWidth - 80) / 3 * 2 + 295)
        })
      },
    });
    if (!this.data.userId) {
      LoginService.getUser().then(res => {
        if (res && res.userId) {
          this.setData({
            userId: res.userId
          })
        }
      })
    }
    this.wangInfo();
    this.loadData()
  },
 async loadData(){
  let parmae = {
    "appid": app.appid,
    "secret":app.secret,
    "wxApplet": "CulturePlay",
    "id": this.data.id,
    "page": "pages/trailerDetail/trailerDetail",
    "width": "280",
  };
  let codeUrl = "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/weCode.jpg";
  await send.wxAcode(parmae).then(res => {
    let data = res.data;
    if(data.imgUrl){
      codeUrl = data.imgUrl;
    }
  })
    let query = {
      liveActivityId: this.data.id || "c750f16a17694150b11101cfd1d993f2",
    }
    await ApiService.why("/apiLive/simpleDetail.do", query).then(res => {
      let data = res.data;
      wx.setNavigationBarTitle({
        title: data.liveTitle
      })
      data.traiTime = this.formation(data.liveStartTime);
      data.traiEndTime = this.formation(data.liveEndTime, true);
      data.liveIntroduction = data.liveIntroduction.replace(/\<img/gi, '<img class="rich-img" ')
      let info = {
        imageUrl: data.liveCoverImg,
        codeUrl: codeUrl,
        title: data.liveTitle,
        userName: data.userName,
        img: "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/liveMinI/foreshow.png",
        userImg: data.userHeadImgUrl
      }
      let obj = {};
      if (data.liveActivityTimeStatus == 1) {
        wx.redirectTo({
          url: '/pages/liveDetail/liveDetail?id=' + this.data.id
        })
      } else if (data.liveActivityTimeStatus == 3) {
        wx.redirectTo({
          url: '/pages/playbackVideo/playbackVideo?id=' + this.data.id
        })
      }
      obj.isLikeSum = data.likeSum;
      countDown = data.countDown;
      if (data.countDown) {
        // this.startCountDown(countDown);
        countDownTimer = setInterval(() => {
          this.startCountDown(countDown);
          countDown -= 1000;
        }, 1000);
      }
      this.setData({
        detail: data,
        goods: info,
        wangObj: Object.assign({}, obj, this.data.wangObj)
      }, () => {
        this.getSysInfo()
      })
    })
   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '【直播预告】' + this.data.detail.liveTitle,
      path: '/pages/trailerDetail/trailerDetail?id=' + this.data.id,
      imageUrl: this.data.detail.liveCoverImg
    }
  }
})