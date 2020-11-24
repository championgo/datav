'use strict';

const Service = require('egg').Service;
const moment = require('moment');


class Workplace extends Service {

    async getAll(){
        const {ctx} = this
        let data = {};
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        console.log(now);
        //data['workplaces'] = await sequelize.query(`select a.workspace_id,a.name as iteration_name,a.id,b.name as workplace_name,(select count(*) from pro_story where iteration_id=a.id) as total,(select count(*) from pro_story where iteration_id=a.id and status ='resolved') as finished from pro_iteration as a inner join pro_workspace as b on b.id = a.workspace_id where a.startdate <='${now}' and a.enddate >= '${now}'`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        data['workplaces'] = await sequelize.query(`select a.workspace_id,a.name as iteration_name,a.id,b.name as workplace_name,(select count(*) from pro_story where iteration_id=a.id) as total,(select count(*) from pro_story where iteration_id=a.id and status ='resolved') as finished from pro_iteration as a inner join pro_workspace as b on b.id = a.workspace_id where  a.enddate >= '${now}'`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        const iterations = []
        if(data['workplaces']){
            data['workplaces'].map(item=>{
                iterations.push(item.id)
            })
        }
        console.log(iterations)
        const options = {where:{iteration_id:{[Op.in]:iterations}}}
        data['project_count'] = await ctx.model.ProWorkspace.count();
        data['story_count'] = await ctx.model.ProStory.count(options);
        data['task_count'] = await ctx.model.ProTask.count(options);
        data['story_list'] = await ctx.model.ProStory.findAll(options);
        data['task_list'] = await ctx.model.ProTask.findAll(options);
        data['event_list'] = await ctx.model.ProEvent.findAll({limit:20,order:[['created_at','desc']]});

        return {error:0,errmsg:'OK',data};

    }

    async getWorkspace(){
         const { Op } = this.app.Sequelize;
         const sequelize = this.app.model;
         const now = moment(new Date()).format("YYYY-MM-DD");
         let data = {};
        const iterations = []
        if(data['workplaces']){
            data['workplaces'].map(item=>{
                iterations.push(item.id)
            })
        }

    }


}

module.exports = Workplace;
