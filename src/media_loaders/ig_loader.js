const util = require('./util');

class IGLoader {
  async get_video(url) {
    return util.get_page_video_src(url);
  }
}

module.exports = IGLoader;
