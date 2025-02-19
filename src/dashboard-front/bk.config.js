
const mockServer = require('./mock-server');

module.exports = {
  host: process.env.BK_APP_HOST,
  port: process.env.BK_APP_PORT,
  publicPath: '/',
  cache: true,
  open: true,
  replaceStatic: true,

  // webpack config 配置
  configureWebpack() {
    return {
      devServer: {
        setupMiddlewares: mockServer,
        client: {
          overlay: false,
        },
        https: !process.env.BK_HTTPS,
      },
    };
  },
};
