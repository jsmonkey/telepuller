const TikTokLoader = require('./tiktok_loader');
const IGLoader = require('./ig_loader');
const YTLoader = require('./yt_loader');
const util = require('./util');

class Medialoader {
  constructor() {
    this.tiktok = new TikTokLoader();
    this.ig = new IGLoader();
    this.yt = new YTLoader();
  }

  async get_video(url) {
    const loader = this.loader_factory(url);
    return loader && loader.get_video(url);
  }

  loader_factory(url) {
    if (util.is_valid(url)) {
      if (url.includes('tiktok')) {
        return this.tiktok;
      }
      if (url.includes('instagram')) {
        return this.ig;
      }
      if (url.includes('youtube') || url.includes('youtu.be')) {
        return this.yt;
      }
    }
  }
}

module.exports = Medialoader;
