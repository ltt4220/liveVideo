// const app = getApp();
const util = require('./util');
const CryptoJS = require('./aes');
const config = require('./config');

class Http {
    constructor() {
    }

    post(url, data, headers) {
        if (!/^http[s]*:\/\/(.*?)/i.test(url)) {
            if (!url.startsWith('/')) url = '/' + url;
            url = config.api + url;
        }
        headers = headers || {}
        const h = {
            'Content-Type': 'application/json',
            'sysPlatform': 'wxMiniProgram'
        }
        util.extend(headers, h);
        return new Promise((resove, reject) => {
            wx.request({
                url: url,
                data: data || {},
                header: headers,
                method: 'POST',
                success(res) {
                    if (!res || res.statusCode != 200) {
                        wx.showLoading({ title: "http请求失败:" + '\n' + url + "\n" + JSON.stringify(data) })
                        return resove({ status: 404, message: 'http请求出错' });
                    }
                    resove(res.data)
                },
                fail(err) {
                    reject(err)
                },
                complete(cpl) {
                    //my.hideToast();
                }
            })
        })
    }

    api(url, data) {
        if (!/^http[s]*:\/\/(.*?)/i.test(url)) {
            if (!url.startsWith('/')) url = '/' + url;
            url = config.api + url;
        }
        let headers = {}
        const h = {
            'Content-Type': 'application/json',
            'sysPlatform': 'wxMiniProgram'
        }
        util.extend(headers, h);
        return new Promise((resove, reject) => {
            wx.request({
                url: url,
                data: data || {},
                header: headers,
                method: 'POST',
                success(res) {
                    console.log('res', res)
                    if (!res || res.statusCode != 200) {
                        //wx.showLoading({title: "http请求失败:" + '\n' + url + "\n" + JSON.stringify(data)})
                        return resove({ status: 404, message: 'http请求出错' });
                    }
                    resove(res.data)
                },
                fail(err) {
                    reject(err)
                },
                complete(cpl) {
                    //my.hideToast();
                }
            })
        })
    }

}

class Co {
    constructor() {
        this.http = new Http();
    }

    //
    // dialogWarn(content) {
    //     wx.showToast({content: content, image: '/image/warning.png', duration: 1500});//字数有限制
    // }

    dialog(content, cb) {
        wx.showModal({
            title: content,
            showCancel: false,
            success(res) {
                if (cb) cb();
            }
        })
    }

    dialogConfirm(content, cb) {
        wx.showModal({
            title: content,
            success(res) {
                if (res.confirm) {
                    if (cb) cb();
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }

    getSessionId() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    co.http.api('/minicom/user/resetSessionKey', {name: 'live', code: res.code }).then(sk => {
                        console.log('resetSessionKey', sk);
                        if (sk.err) {
                            config.sid = '';
                            wx.setStorage({
                                key: "sid",
                                data: ''
                            })
                            this.dialog(sk.msg);
                            return resolve('');
                        }
                        // this.setData({id: sk.data.id});
                        // if (sk.err) return resolve(sk)
                        config.sid = sk.data.sid;
                        wx.setStorage({
                            key: "sid",
                            data: sk.data.sid
                        })
                        return resolve(sk.data.sid)
                    })

                }
            })
        })
    }

    checkSession() {
        return new Promise((resolve, reject) => {
            wx.checkSession({
                success: (res) => {
                    // console.log('session有效1', res, this.data.id)
                    let sid = this.getSid();
                    if (!sid) {
                        this.getSessionId().then(res_sid => {
                            resolve(res_sid);
                        })
                    } else {
                        resolve(sid)
                    }
                },
                fail: () => {
                    this.getSessionId().then(sid => {
                        resolve(sid);
                    })
                }
            })
        })
    }

    getUserInfo() {
        //获取服务器
        let user = this.getUser();
        if (!user.userId) return Promise.resolve({});
        return this.http.api('/minicom/user/getUserInfo', { userId: user.userId }).then(res => {
            // console.log('getUserInfo', res);
            if (res.err) return {};
            user = res.data || {};
            wx.setStorage({
                key: "user",
                data: user
            })
            config.user = user;
            return user;
        })

    }

    getSid() {
        if (config.sid) return config.sid;
        let sid = wx.getStorageSync('sid') || '';
        if (!sid) return '';
        config.sid = sid;
        return sid;
    }

    getUser() {
        //获取本地
        if (config.user) return config.user;
        let user = wx.getStorageSync('user') || {};
        if (!user.userId) return {}
        config.user = user;
        return user;
    }




}

let co = new Co();
module.exports = co;
