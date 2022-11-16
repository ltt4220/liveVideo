/**
 * 使用测试环境时，把dev里面的内容复制到url里面
 * 使用正式环境时，把prod里面的内容复制到url里面
 */
module.exports = {
  url: {
    // why: 'https://eme.wenhuayun.cn/',
    // china: 'https://emechina.wenhuayun.cn/',
    // store: 'https://storeeme.wenhuayun.cn/',
    // gateway: 'https://emegateway.wenhuayun.cn/',
    // meme: 'https://meme.wenhuayun.cn/'
    why: 'https://www.wenhuayun.cn/',
    china: 'https://china.wenhuayun.cn/',
    store: 'https://store.wenhuayun.cn/',
    gateway: 'https://gateway.wenhuayun.cn/',
    meme: 'https://whym.wenhuayun.cn/'
  },
  // 测试
  dev: {
    why: 'https://eme.wenhuayun.cn/',
    china: 'https://emechina.wenhuayun.cn/',
    store: 'https://storeeme.wenhuayun.cn/',
    gateway: 'https://emegateway.wenhuayun.cn/',
    meme: 'https://meme.wenhuayun.cn/'
  },
  // 生产
  prod: {
    why: 'https://www.wenhuayun.cn/',
    china: 'https://china.wenhuayun.cn/',
    store: 'https://store.wenhuayun.cn/',
    gateway: 'https://gateway.wenhuayun.cn/',
    meme: 'https://whym.wenhuayun.cn/'
  }
  
}