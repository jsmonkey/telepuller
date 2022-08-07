const puppeteer = require('puppeteer');

module.exports = {
  async get_page_video_src(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const src = await page.$eval('video', (el) => el.src);
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
