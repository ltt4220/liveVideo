// components/canvas.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: {
      type: Boolean,
      value: true
    },
    status: { //视频状态
      type: Number,
      value: 3
    },
    paramAtoB: { //显示画布
      type: Boolean,
      value: true
    },
    imageUrl: { //主图网络路径
      type: String,
      value: ""
      // value:"http://imgo2o.shikee.com/goods/2019/10/17/201910171144361688.jpg"
    },
    codeUrl: { //二维码网络路径
      type: String,
      value: ""
      // value:"http://imgo2o.shikee.com/couponqrcode/2019/10/18/86_215.jpg"
    },
    goods: { //详情信息
      type: Object,
      value: {}
      // value:{
      // imageUrl:"http://imgo2o.shikee.com/goods/2019/10/17/201910171144361688.jpg",
      // codeUrl:"http://imgo2o.shikee.com/couponqrcode/2019/10/18/86_215.jpg",
      //   title: "欧洲之窗 | 绚丽多彩的西班牙文化西班西绚丽多彩的西班牙文化西班西绚丽多彩的西班牙文化西班西",
      //   userName: "用户名称",
      //   img: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2070522536,3783982860&fm=15&gp=0.jpg",
      //   userImg: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=29577033,167552331&fm=15&gp=0.jpg"
      // }
    }
  },

  /*页面data定义所需参数*/
  data: {
    // canvas 
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
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      wx.getSystemInfo({
        success: (result) => {
          console.log(result, "opdkfa;ds", result.windowHeight - ((result.windowWidth - 80) / 3 * 2 + 300))
          this.setData({
            _width: result.windowWidth,
            _heigth: result.windowHeight,
            canvasW: result.windowWidth,
            bottomH: result.windowHeight - ((result.windowWidth - 80) / 3 * 2 + 400)
          })
        },
      })
    },
    ready: function () {
      console.log(this.data.goods, "*(((((()))))))))))))")
      // this.getSysInfo()
    },
    moved: function () {},
    detached: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closePos() {
      this.setData({
        canvasType: false,
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
            canvasType: that.data.paramAtoB,
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
      console.log(this.data, "*())))))))")
      let _width = this.data._width;
      let that = this;
      let imgH = (_width - 80) / 3 * 2; //绘制时图片显示高度  
      let ctx = wx.createCanvasContext('mycanvas', this);
      // 绘制背景
      ctx.setFillStyle("#fff");
      ctx.fillRect(20, 50, _width - 40, imgH + 250);
      //绘制图片
      ctx.drawImage(this.data.img0, 40, 70, _width - 80, imgH);

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
        ctx.drawImage(this.data.img1, 40, imgH + 84, 40, 20);
        ctx.fillText(title, 90, imgH + 100, txtWidth);
        ctx.fillText(title2, 40, imgH + 130, txtWidth);
      } else if (this.data.status == 3) {
        ctx.fillText(title, 40, imgH + 100, txtWidth);
        ctx.fillText(title2, 40, imgH + 130, txtWidth);
      } else {
        ctx.drawImage(this.data.img1, 40, imgH + 84, 40, 20);
        ctx.setFontSize(30);
        ctx.setFillStyle('#000');
        ctx.fillText('08/14', 90, imgH + 106, 80);
        ctx.setFontSize(14);
        ctx.setFillStyle('#ccc');
        ctx.fillText('|', 180, imgH + 102, 10);
        ctx.setFontSize(20);
        ctx.setFillStyle('#000');
        ctx.fillText('18:00-16:00', 200, imgH + 105, 170);
        ctx.setFontSize(18);
        ctx.setFillStyle('#333');
        ctx.fillText(title, 40, imgH + 150, txtWidth);
        ctx.fillText(title2, 40, imgH + 180, txtWidth);
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
        ctx.drawImage(this.data.img2, 40, titH + 30, 40, 40);
        ctx.setFontSize(14);
        ctx.setFillStyle('#666');
        ctx.fillText(this.data.goods.userName, 90, titH + 55, txtWidth - 60);
      }

      // 绘制二维码
      ctx.fillStyle = "#eee";
      ctx.fillRect(20, titH + 90, _width - 40, 90);
      ctx.setFontSize(14);
      ctx.setFillStyle('#666');
      ctx.fillText('长按小程序码 ', 40, titH + 130, txtWidth);
      ctx.fillText('进入云直播间小程序观看 ', 40, titH + 150, txtWidth);
      ctx.drawImage(this.data.img3, _width - 150, titH + 100, 64, 64);
      // 显示绘制

      ctx.draw(true, () => {
        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: "mycanvas",
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              console.log(res, "图片---------------")
              that.setData({
                loadImagePath: tempFilePath,
              });
            },
            complete: (res) => {
              console.log(res, "-============9999999",ctx)
            },
            fail: function (res) {
              console.log(res, "pppppppppppppppp");
            }
          });
        }, 5000);
      });

    },
    //点击保存到相册
    saveImg: function () {
      let _this = this;
      console.log(this.data.loadImagePath, "-=========0-")
      wx.getSetting({
        success: res => {
          let authSetting = res.authSetting
          if (!authSetting['scope.writePhotosAlbum']) {
            wx.showModal({
              title: '提示',
              content: '您未开启保存图片到相册的权限，请点击确定去开启权限！',
              success(res) {
                if (res.confirm) {
                  wx.openSetting()
                } else {
                  _this.triggerEvent('myevent', {
                    paramBtoA: false
                  });
                }

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
                  duration: 3000
                })
                _this.setData({
                  canvasType: false
                })
                _this.triggerEvent('myevent', {
                  paramBtoA: false
                });
              },
              fail(err) {
                console.log(err)
              }
            })
          }
        }
      })

    },
  }
})