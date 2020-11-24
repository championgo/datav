'use strict';

exports.validate = {
  enable: true,
  package: 'egg-validate',
};
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.jwt = {
  enable: true,
  package: "egg-jwt"
};
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
exports.email = {
    enable: true,
    package: 'egg-email',
}
// {app_root}/config/plugin.js
exports.awsSdk = {
  enable: true,
  package: 'egg-aws-sdk',
};

// {app_root}/config/plugin.js
exports.io = {
  enable: true,
  package: 'egg-socket.io',
};

exports.redis = {
  enable: true,
  package: 'egg-redis'
}

