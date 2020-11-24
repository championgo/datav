// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;

class DataVController extends Controller {
  async index() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const data = await ctx.service.datav.init()
    await ctx.socket.emit('init',data);
  }
}

module.exports = DataVController;
