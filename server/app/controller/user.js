'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async wechat() {
    const { ctx } = this;
    let CryptoJS = require('crypto-js');
    const {code} = ctx.request.body;
    const user_id = await ctx.service.wechat.getUserId(code);
    if(user_id){
      const user_info = await ctx.service.wechat.getUserInfo(user_id);
       const token = this.app.jwt.sign({userid:user_id}, this.app.config.jwt.secret,{
                    expiresIn: "12h"
                });

        ctx.body = {errcode:0,errmsg:'OK',token:token};

    }else{
        ctx.body = {errcode:1,errmsg:'Failed'};
    }

    //const result = await ctx.service.user.login({ username, password: md5_password });
  }

  async getUserInfo() {
    const ctx = this.ctx;
    const result = await ctx.service.user.getUserInfo();
    ctx.status = 201;
    ctx.body = result;
  }

async notice() {
    const ctx = this.ctx;
    ctx.status = 201;
    ctx.body = [];
  }

  async destroy() {
    const ctx = this.ctx;
    const result = await ctx.service.user.del(ctx.request.body);
    ctx.status = 200;
    ctx.body = result;
  }

}

module.exports = UserController;
