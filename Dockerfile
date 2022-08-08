FROM node:18-alpine

WORKDIR /usr/src/bot


RUN apt update -qq \
    && apt install -qq -y --no-install-recommends \
       chromium \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node", "src/index.js" ]