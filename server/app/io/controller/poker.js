// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;

class PokerController extends Controller {
  async index() {
    const { ctx, app } = this;
    const message = ctx.args[0];
      if(message['action'] == 'new'){
        await ctx.service.event.newEvent(message['msg'])
        await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
      }else{
          const data = await ctx.service.event.getMessages()
          await ctx.socket.emit('points',data)
          console.log('get')
      }
      // await ctx.socket.emit('point', message);

  }
}

module.exports = PokerController;
