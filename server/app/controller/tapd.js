'use strict';

const Controller = require('egg').Controller;


class TapdController extends Controller {
  async init() {
    const { ctx } = this;
    
    //const result = await ctx.service.tapd.initData(['stories','Story']);
    const result = await ctx.service.tapd.initData(['iterations','Iteration']);
    //const result = ctx.service.tapd.initData(['tasks','Task']);
    //const result = ctx.service.tapd.initData(['bugs','Bug']);
      
   // await ctx.service.tapd.initTask();

   //const result = await ctx.service.tapd.initTask();
      //
    //const data = await ctx.helper.getData('stories',53082730);
   //const result = await ctx.service.tapd.getUser();


    ctx.body = result;
  }

async index() {
    const { ctx } = this;
    
    //const result = await ctx.service.tapd.initStory();

   //const result = await ctx.service.tapd.initTask();
      //
    //const data = await ctx.helper.getData('stories',53082730);
    const data = ctx.request.body;
    //console.log(data)
    await ctx.service.tapd.eventStore(data);
    console.log(data.event);


    ctx.body = 'test';
  }




  





}

module.exports = TapdController;
