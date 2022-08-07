const util = require('./util');

class TikTokLoader {
  get_video(url) {
    return util.get_page_video_src(url);
  }
}

module.exports = TikTokLoader;
