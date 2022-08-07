const Bot = require('./bot');

const bot = new Bot({
  token: '5543311473:AAGRcXxIPzj1BD-gL5YXe6w-wBEOL_iMO6c',
  api_host: 'https://api.telegram.org',
});

bot.run();
