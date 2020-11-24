// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;

class TapdController extends Controller {
  async index() {
    const { ctx, app } = this;
    const message = ctx.args[0];
      if(message['action'] == 'init'){
        const data = await ctx.service.tapd.getNowTask(message['status'])
        await ctx.socket.emit('items',data);
      }
      // await ctx.socket.emit('point', message);
  }
}

module.exports = TapdController;
