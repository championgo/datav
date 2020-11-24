'use strict';

module.exports = (option, app) => {
  return async function userToken(ctx, next) {
    let authToken = ctx.header.authorization;
    authToken = authToken.substring(7);
    if (authToken) {
      app.jwt.verify(authToken, app.config.jwt.secret, function(err, decoded) {
        let result = {};
        if (err) {
          ctx.status = 401;
          result.error = 3002;
          result.errmsg = 'Verify token failed';
          ctx.body = result;
        } else {
          result.error = 0;
          ctx.locals.userid = decoded.userid
          ctx.body = result;
        }
      });
      if (ctx.locals.userid != undefined) {
        await next();
      }
    } else {
      ctx.status = 401;
      //this.ctx.throw(result.status, 'You dont have access right');

      ctx.body = { error: 3001, errmsg: 'You dont have access right' };
    }
  };
};
