FROM --platform=arm64 node:18-alpine

COPY main.js package.json ./

RUN npm install

# Command can be overwritten by providing a different command in the template directly.
CMD ["main.handler"]