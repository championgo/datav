// {app_root}/app/io/middleware/connection.js
module.exports = app => {
  return async (ctx, next) => {
    ctx.socket.emit('res', 'connected!');
    await next();
    // execute when disconnect.
    console.log('disconnection!');
  };
};

