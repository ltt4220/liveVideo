export class CreateService {
  constructor() {

  }

  /**
   * 轻提示（无确定，无取消）
   * @param title 提示文字
   * @param duration 提示的延迟时间
   */
  static lightNotification(title = '', duration = 1500) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: duration,
      mask: true
    })
  }

  /**
   * 显示“加载中”弹窗
   */
  static showLoading(title = '加载中') {
    wx.showLoading({
      title: title,
      mask: true
    })
  }
  /**
   * 隐藏“加载中”弹窗
   */
  static hideLoading() {
    wx.hideLoading();
  }

  /**
   * 模态对话框（有确定，无取消）
   * @param content 提示文字
   * 
   */
  static alertDialog(content = '') {
    return new Promise((resolve, reject) => {
      wx.showModal({
        content: content,
        confirmText: '确定',
        confirmColor: '#647eff',
        showCancel: false,
        success (res) {
          if (res.confirm) {
            resolve();
          }
        }
      });
    })
  }

  /**
   * 模态对话框（有确定，有取消）
   * @param content 提示文字
   * 
   */
  static confirmDialog(content = '') {
    return new Promise((resolve, reject) => {
      wx.showModal({
        content: content,
        confirmText: '确定',
        confirmColor: '#647eff',
        showCancel: true,
        cancelText: '取消',
        success (res) {
          if (res.confirm) {
            resolve();
          } else if (res.cancel) {
            reject();
          }
        }
      });
    })
  }

}