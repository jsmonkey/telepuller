const axios = require('axios');
const Loader = require('./media_loaders');
const FormData = require('form-data');
const stream = require('stream');

class Bot {
  constructor({ token, api_host }) {
    this.token = token;
    this.api_host = api_host;
    this.loader = new Loader();
    this.launched = false;
  }

  build_url(method) {
    return `${this.api_host}/bot${this.token}/${method}`;
  }

  async run() {
    this.launched = true;
    let offset;
    while (this.launched) {
      const {
        data: { result },
      } = await this.get_updates(offset);
      const messages = result.map((el) => el.message).filter((msg) => msg);
      this.process_messages(messages);
      const last_update_id = Math.max(...result.map((o) => o.update_id), 0);
      if (last_update_id) {
        offset = last_update_id + 1;
      }
    }
  }

  get_updates(offset) {
    const url = this.build_url('getUpdates');
    const params = {
      allowed_updates: ['messages'],
    };
    if (offset) {
      params.offset = offset;
    }
    return axios.get(url, {
      params: params,
    });
  }

  process_messages(messages) {
    messages.forEach((message) => {
      this.loader.get_video(message.text).then((video) => {
        const username =
          message.from.username ||
          message.from.first_name ||
          message.from.last_name;
        const req = this.send_video(
          video,
          message.chat.id,
          username,
          message.text
        );
        if (req) {
          req
            .then(() =>
              this.removeLinkMessage(message.chat.id, message.message_id)
            )
            .catch((e) => console.error(e));
        }
      });
    });
  }

  send_video(video, chat_id, username, original_url) {
    let req;
    if (video) {
      if (typeof video === 'string' || video instanceof String) {
        req = this.send_video_by_url(video, chat_id, username, original_url);
      } else if (video instanceof stream.PassThrough) {
        req = this.send_video_by_stream(video, chat_id, username, original_url);
      }
    }
    return req;
  }

  send_video_by_url(video_url, chat_id, username, original_url) {
    const url = this.build_url('sendVideo');
    return axios.post(url, {
      chat_id,
      video: video_url,
      caption: `@${username} ${original_url}`,
    });
  }

  send_video_by_stream(stream, chat_id, username, original_url) {
    const url = this.build_url('sendVideo');
    const form = new FormData();
    form.append('video', stream, {
      filename: 'video.mp4',
      contentType: 'video/mp4',
    });
    return axios
      .post(url, form, {
        headers: form.getHeaders(),
        params: {
          chat_id,
          caption: `@${username} ${original_url}`,
        },
      })
      .then((e) => console.log(e));
  }

  removeLinkMessage(chat_id, message_id) {
    const url = this.build_url('deleteMessage');
    return axios.post(url, {
      chat_id,
      message_id,
    });
  }
}

module.exports = Bot;
