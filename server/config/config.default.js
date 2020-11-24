/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1561659733554_3112';

  // add your middleware config here
  config.middleware = ['errorHandler', 'userToken'];
  config.userToken = {
    enable: true,
    ignore: [ '/api/file', '/api/tapd','/api/wechat','/api/lq/total' ,'/datalq'],
  };

  //production
  config.sequelize = {
    dialect: 'mysql',
    host: 'xxx',
    database: 'xxx',
    port: 3306,
    username: 'xxx',
    password: 'xxxx',

    define: {
      freezeTableName: true,
      timestamps: false,
    },
  };
  //email


  config.multipart = {
    fileSize: '50mb',
    mode: 'stream',
    fileExtensions: [
      '.xls',
      '.txt',
      '.rar',
      '.zip',
      '.doc',
      '.docx',
      '.pdf',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.msg',
      '.rtf',
    ], // 扩展几种上传的文件格式
  };

  // 配置指定的前端地址
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
    credentials: true,
  };

// 覆盖egg自带的配置 使支持接收xml参数
  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    formLimit: '100kb',
    jsonLimit: '100kb',
    strict: true,
    // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000,
    },
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
      text: ['text/xml', 'application/xml'],
    },
  };

  config.security = {
    // 关闭csrf验证
    csrf: {
      enable: false,
    },
    // 白名单
    domainWhiteList: ['*'],
  };
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
      },
  }

  exports.jwt = {
    secret: '123456',
  };
  exports.validate = {
    // convert: false,
    // validateRoot: false,
  };

exports.io = {
  init: { }, // passed to engine.io
  namespace: {
    '/': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
    '/poker': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
     '/tapd': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
       '/datav': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
    '/datalq': {
      connectionMiddleware: [],
      packetMiddleware: [],
    },
  },
};

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    errorHandler: {
      match: '/api',
    },
  };
};
