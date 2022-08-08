const puppeteer = require('puppeteer');

module.exports = {
  async get_page_video_src(url) {
    let src;
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);
    const videoEl = await page.$('video');
    if (videoEl) {
      const propHandler = await videoEl.getProperty('src');
      if (propHandler) {
        src = await propHandler.jsonValue();
      }
    }
    await browser.close();
    return src;
  },
  is_valid(url) {
    try {
      return Boolean(new URL(url));
    } catch (e) {
      return false;
    }
  },
};
