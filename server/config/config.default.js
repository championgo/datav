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
    host: 'rm-bp1z1m53dml27zbh9.mysql.rds.aliyuncs.com',
    database: 'weiailianquan',
    port: 3306,
    username: 'jeff',
    password: '@yufi1133571307@',

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
      api_user:'TIk=ad=9',
      api_password:'B0BCAB4E-F5FE-175C-18C7-37DB7812F575',
      tapd_corpid:'21152891',
      qywx:{
        token: 'Vp3GUbwoHW',
        encodingAESKey: 'rYz0tZI5jRgCEc42stuz43zTMCu6rsXeMniOJ9QUazl',
        agentid: '1000005',
        secret:'DMOtOr_ma4emMNC76ugJojo18wDM0Ngu-AGOtL276IQ',
        corpid: 'ww7ca3270e7ae04496'
      }
  };

  return {
    ...config,
    ...userConfig,
    errorHandler: {
      match: '/api',
    },
  };
};
