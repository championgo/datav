'use strict';

const Service = require('egg').Service;

class Event extends Service {


    async newEvent(name){
        const {ctx} = this
        await ctx.model.QyEvent.update({status:2},{where:{status:1}});
        await ctx.model.QyEvent.create({status:1,name:name})
        return
    }
 
async getMessages() {
    const {ctx} = this
    const  sequelize = this.app.model
    const eve = await ctx.model.QyEvent.findOne({where:{status:1}});
    if(!eve) return [];
    if(eve){
        const data = await sequelize.query(`SELECT a.content,b.name,b.avatar from qy_message as a inner join qy_users as b on b.id = a.qy_user_id where a.event_id = ${eve.id}`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT})
        return data
    }

}

async getCategoryList() {
    const options = {
      group: 'category',
      attributes: ['category'],
      where: {},
    };
    const result = await this.ctx.model.Course.findAll(options);
    return result;
  }


}

module.exports = Event;
