'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class Tapd extends Service {
    async init(){
        const {ctx} = this;
        //await this.initData(['stories','Story'])
        //await this.initData(['iterations','Iteration'])
        await this.getUser();

        return {error:0}
    }

    async initData(type){
        const {ctx} = this;
        const items = await ctx.model.ProWorkspace.findAll();
         for (var i = 0;i<items.length;i++){
          let item = items[i];
          let res = await ctx.helper.getCount(type[0],item.id);
          let c = res.data.data.count;
         const data_type = {'stories':'ProStory','iterations':'ProIteration','tasks':'ProTask','bugs':'ProBug'}
        let page_count = await ctx.model[data_type[type[0]]].count();

           //console.log(res.data.data.count)
          let pages = Math.floor(c/30)+1;
          let page_i = Math.floor(page_count/30);
          for (var page=page_i;page<= pages;page++){
              await this.syncData(type,item,page)
          }
             //this.saveData(item_data,type)
         }
         //console.log(story_data.length)
         return {error:0}
     }
     
    async syncData(type,item,page){
         const {ctx} = this;
         console.log('rs')
         let items = await ctx.helper.getData(type[0],item.id,page,30);
         let item_data = [];
          if(items.data.status ==1 &&items.data.data.length >0){
              for(var k= 0;k<items.data.data.length;k++){
                  item_data.push(items.data.data[k][type[1]])
              }
             }
        this.saveData(item_data,type)
        return
     }

     saveData(data,type){
        const {ctx} = this;
        const data_type = {'stories':'ProStory','iterations':'ProIteration','tasks':'ProTask','bugs':'ProBug'}
        ctx.model[data_type[type[0]]].bulkCreate(data,{updateOnDuplicate:['id']})
        return;
    }
    initFlowFields(workspace_id){
        const {ctx} = this;

    }


    //更新用户
    async getUser(){
        const {ctx} = this;
        let items = await ctx.helper.getUsers(this.app.config.tapd_corpid);
        let item_data = [];
        //console.log(items)
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
  async getUserId(owner){
      await this.getUser();
      let owner_name = owner.split(';');
      console.log(owner_name);
      const pro_user = await this.ctx.model.ProUsers.findOne({where:{user:owner_name}})
      if(pro_user) return pro_user.id 
      return;

  }

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
        const data_type = {'story':'ProStory','iteration':'ProIteration','task':'ProTask','bug':'ProBug'}
        if(data['event_action'] == 'delete'){
            await ctx.model[data_type[data['event_name']]].destroy({where:{id:data['o_id']}})
            return

        }
        const res = await ctx.helper.getSingleData(type[data['event_name']],data['workspace_id'],data['o_id']);
        //console.log(res.data)
        if(res.data.status == 1){
        const pro_type = data['event_name'].slice(0,1).toUpperCase() +data['event_name'].slice(1).toLowerCase();
        let  data_item = res.data.data[pro_type];
        if(data['event_name'] == 'task'){
            data_item['owner_id'] = await this.getUserId(data_item['owner'])
        }
        if(data['event_name'] == 'bug' && data_item['current_owner']!= undefined){
            data_item['owner_id'] = await this.getUserId(data_item['current_owner'])
        }
            data_item['updated_at'] = new Date();
        const item = await ctx.model[data_type[data['event_name']]].findByPk(data_item['id'])
            if(item){
                //delete data_item['id'];
                console.log(data['event_name'])
                await item.update(data_item)
            }else{
        await ctx.model[data_type[data['event_name']]].create(data_item)
            }
            await this.checkIteration(data_item);
            if(data['event_name'] == 'task'){
            }

        }
        return;
    }

async checkIteration(data){
     const {ctx} = this;
     console.log('work')
     if(data['iteration_id'] == 0) return;
     const res = await ctx.helper.getSingleData('iterations',data['workspace_id'],data['iteration_id']);
     const data_item = res.data.data['Iteration']
     console.log(JSON.stringify(data_item))
    if(typeof data_item['workspace_id'] == undefined){
        console.log('have no workspace')
        return
    }
      if(res.data.status == 1){
           const item = await ctx.model.ProIteration.findByPk(data['iteration_id'])
            if(item){
                delete data_item['id'];
                await item.update(data_item)
            }else{
        await ctx.model.ProIteration.create(data_item)
            }

      }
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
        if(data['workplaces']){
            data['workplaces'].map(item=>{
                iterations.push(item.id)
            })
        }
     console.log(iterations)
     const options = {where:{iteration_id:{[Op.in]:iterations},'status':status}}
     const res = await ctx.model.ProTask.findAll(options);
     return res;

 }
    


}

module.exports = Tapd;
