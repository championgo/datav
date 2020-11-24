'use strict';

const Controller = require('egg').Controller;
const await = require('await-stream-ready/lib/await');
const moment = require('moment');

class DataController extends Controller {
  async init() {
    const { ctx } = this;
    let example_donation = []
    //const a = await JSON.parse(this.app.redis.get("example_donation"))
    const donation = await ctx.service.datalq.getDonationData()
    donation.donation.map((item)=>{
      example_donation.push([item.name,item.project,item.total,item.time])
    })
    const a = example_donation[0]
    //await this.app.redis.set("example_donation",JSON.stringify(example_donation))
    
    ctx.body = a;
  }

  async total(){
    const { ctx } = this;
    var project_donate = {}
  }

}

module.exports = DataController;
