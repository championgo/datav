'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class Datav extends Service {
    async init(){
        const {ctx} = this
       //await this.ctx.service.tapd.initData(['iterations','Iteration'])
        //await this.initData(['stories','Story'])
        const { Op } = this.app.Sequelize;
         const sequelize = this.app.model;
         const now = moment(new Date()).format("YYYY-MM-DD");
         let data = {};
         data['workplaces'] = await sequelize.query(`select a.workspace_id,a.name as iteration_name,a.id,b.name as workplace_name,(select count(*) from pro_story where iteration_id=a.id) as story_total,(select count(*) from pro_bug where workspace_id = a.workspace_id and status in ('new','in_progress','unconfirmed','reopened','QA_audited')) as bug_total,(select count(*) from pro_task where iteration_id=a.id and status !='done') as not_done_total,(select count(*) from pro_task where iteration_id=a.id) as task_total from pro_iteration as a inner join pro_workspace as b on b.id = a.workspace_id where a.enddate >= '${now}' and a.startdate <='${now}' limit 0,20`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});

        const iterations = []
        if(data['workplaces']){
            data['workplaces'].map(item=>{
                iterations.push(item.id)
            })
        }
        data['effort'] = {total:0,finished:0}
        let total
        if(iterations.length > 0){
        let iteration_ids = iterations.join(',')
        data['users'] = await sequelize.query(`SELECT a.id,a.qy_user_id,a.user,b.name,b.avatar,(select count(*) from pro_bug where status in ('new','in_progress','unconfirmed','reopened','QA_audited') and owner_id = a.id) as bug_total,(select count(*) from pro_task where iteration_id in (${iteration_ids}) and status !='done' and owner_id = a.id) as not_done_total,(select count(*) from pro_task where iteration_id in (${iteration_ids}) and owner_id = a.id) as task_total  from pro_users as a inner join qy_users as b on b.id = a.qy_user_id`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        total = await sequelize.query(`SELECT IFNULL(SUM(effort),0) as total from pro_task WHERE iteration_id in (${iteration_ids})`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT,plain:true})
        data['effort']['total'] = total['total']
         total = await sequelize.query(`SELECT IFNULL(SUM(effort),0) as total from pro_task WHERE iteration_id in (${iteration_ids}) and status='done'`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT,plain:true})
         data['effort']['finished'] = total['total']
        }else{
            data['users'] = await sequelize.query(`SELECT a.id,a.qy_user_id,a.user,b.name,b.avatar,0 as bug_total,0 as not_done_total,0 as task_total  from pro_users as a inner join qy_users as b on b.id = a.qy_user_id`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});;
        }
        if(data['workplaces'].length <5){
            for(var k= data['workplaces'].length;k<5;k++){
                data['workplaces'].push({bug_total: 0,id:'idx'+k,iteration_name: "",not_done_total: 0,story_total: 0,task_total:0,workplace_name: "无项目"+k,workspace_id: 0})
                }
        }
     data['counts'] = []
     let count
     console.log(iterations)
     const options = {iteration_id:{[Op.in]:iterations}}
     count = await ctx.model.ProStory.count({where:{...options}});
     data['counts'].push({'label':'总需求数','value':count,'unit':'个'})
     //count = await ctx.model.ProStory.count({where:{...options,status:'planing'}});
     //data['counts'].push({'label':'规划中需求数','value':count,'unit':'个'})
    count = await ctx.model.ProStory.count({where:{...options,status:'developing'}});
     data['counts'].push({'label':'开发中需求数','value':count,'unit':'个'})
    count = await ctx.model.ProStory.count({where:{...options,status:'for_test'}});
     data['counts'].push({'label':'测试中需求数','value':count,'unit':'个'})
     count = await ctx.model.ProStory.count({where:{...options,status:'resolved'}});
     data['counts'].push({'label':'已完成需求数','value':count,'unit':'个'})
     count = await ctx.model.ProTask.count({where:{...options}});
     data['counts'].push({'label':'总任务数','value':count,'unit':'个'})
     count = await ctx.model.ProTask.count({where:{...options,status:'open'}});
     data['counts'].push({'label':'未开始任务数','value':count,'unit':'个'})
     count = await ctx.model.ProTask.count({where:{...options,status:'progressing'}});
     data['counts'].push({'label':'进行中任务数','value':count,'unit':'个'})
     count = await ctx.model.ProTask.count({where:{...options,status:'done'}});
     data['counts'].push({'label':'已完成任务数','value':count,'unit':'个'})
     count = await ctx.model.ProBug.count({where:{status:{[Op.in]:['new','in_progress','unconfirmed','reopened','QA_audited']}}});
     data['counts'].push({'label':'未解决的BUG','value':count,'unit':'个'})


    
     //const res = await ctx.model.ProTask.findAll(options);
     return data;    
    }

     

    //更新用户
    async getUser(){
        const {ctx} = this;
        let items = await ctx.helper.getUsers(this.app.config.tapd_corpid);
        let item_data = [];
        console.log(items)
          if(items.data.status ==1 &&items.data.data.length >0){
              for(var k= 0;k<items.data.data.length;k++){
                  let o_data = items.data.data[k]['UserWorkspace']
                  //应应该加上邮箱的参数
                  ctx.model.ProUsers.findOne({where:{user:o_data['user']}}).then((res)=>{
                      if(res){
                          res.update(o_data);
                      }else{
                          ctx.model.ProUsers.create(o_data)
                      }
                  })
                  //item_data.push(items.data.data[k]['UserWorkspace'])
              }
        //await ctx.model.ProUsers.bulkCreate(item_data)
             }
        return;
    }

  //更新单个目标的内容

  //保存事件
  async eventStore(data){
        const {ctx} = this;
        const event_info = data['event'].split('::');
        data['event_name'] = event_info[0];
        data['event_action'] = event_info[1];
        data['o_id'] = data['id']
        delete data['id']
        await ctx.model.ProEvent.create(data);
        const type = {'story':'stories','task':'tasks','bug':'bugs'}
        const res = await ctx.helper.getSingleData(type[data['event_name']],data['workspace_id'],data['o_id']);
        //console.log(res.data)
        if(res.data.status == 1){
        const data_type = {'story':'ProStory','iteration':'ProIteration','task':'ProTask','bug':'ProBug'}
        const pro_type = data['event_name'].slice(0,1).toUpperCase() +data['event_name'].slice(1).toLowerCase();
        let  data_item = res.data.data[pro_type];
        const item = await ctx.model[data_type[data['event_name']]].findByPk(data_item['id'])
            if(item){
                //delete data_item['id'];
                await item.update(data_item)
            }else{
        await ctx.model[data_type[data['event_name']]].create(data_item)
            }

        }
        console.log(res);
        return;
    }

 async getNowTask(status){
     const {ctx} = this
       //await this.initData(['iterations','Iteration'])
        //await this.initData(['stories','Story'])
        const { Op } = this.app.Sequelize;
         const sequelize = this.app.model;
         const now = moment(new Date()).format("YYYY-MM-DD");
         let data = {};
         data['workplaces'] = await sequelize.query(`select a.workspace_id,a.name as iteration_name,a.id,b.name as workplace_name,(select count(*) from pro_story where iteration_id=a.id) as total,(select count(*) from pro_story where iteration_id=a.id and status ='resolved') as finished from pro_iteration as a inner join pro_workspace as b on b.id = a.workspace_id where a.enddate >= '${now}'`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});

        const iterations = []
        const workspaces = []
        if(data['workplaces']){
            data['workplaces'].map((item,idx)=>{
                iterations.push(item.id)
            })
        }
     console.log(iterations)
     const options = {where:{iteration_id:{[Op.in]:iterations},'status':status}}
     const res = await ctx.model.ProTask.findAll(options);
     return res;

 }
    


}

module.exports = Datav;
