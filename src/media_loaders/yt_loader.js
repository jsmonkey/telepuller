const ytdl = require('ytdl-core');

class YTLoader {
  get_video(url) {
    return ytdl(url);
  }
}

module.exports = YTLoader;
