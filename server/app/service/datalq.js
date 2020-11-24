'use strict';

const Service = require('egg').Service;
const await = require('await-stream-ready/lib/await');
const { suppressDeprecationWarnings } = require('moment');
const moment = require('moment');
const sd = require('silly-datetime')

class Datalq extends Service {
    async init(){
        const {ctx} = this;
        //await this.initData(['stories','Story'])
        //await this.initData(['iterations','Iteration'])
        // await this.getUser();

        return {error:0}
    }

    async getTotalData(){
        const {ctx} = this
        //await this.initData(['iterations','Iteration'])
            //await this.initData(['stories','Story'])
            const { Op } = this.app.Sequelize;
            const sequelize = this.app.model;
            const year = moment(new Date()).format("YYYY");
            let data = {};
            data['total'] = await sequelize.query(`select sum(total) as total from payment_record where status = 1 and created_at >= '${year}' and item_type <> 4`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
            return data
    }
    //获取今天的金额
    async getnowData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        let data = {};
        const now = moment(new Date()).format("YYYY-MM-DD");
        data['now'] = await sequelize.query(`select sum(total) as total from payment_record where status = 1 and  to_days(created_at) = to_days('${now}') and item_type <> 4`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        return data
    }
    //获取订单数量
    async getcountData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        data['count'] = await sequelize.query(`select count(id) as count from  payment_record where status = 1 and  to_days(created_at) = to_days('${now}') and item_type <> 4`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        return data
    }
    //获取今年订单数量
    async getTotalCount(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const year = moment(new Date()).format("YYYY");
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        data['total_count'] = await sequelize.query(`select count(id) as count  from payment_record where status = 1 and created_at >= '${year}' and item_type <> 4`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        return data
    }
    // 获取项目数据
    async getProjectDonateData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        data['project_donate'] = await sequelize.query(`select project_type.name,count(project.id) as value from project_type left join project  on project.project_type = project_type.id and (project.group_id = 1 or project.group_id = null) where (project.status = 1 or project.status = null) and project_type.type = 1 group by project_type.id`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT})
        return data
    }
    //获取性别数据
    async getSexData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        data['sex'] = await sequelize.query(`select count(*) as total,count(case when sex=1 then sex else null end) as man,count(case when sex=2 then sex else null end) as woman from users`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        return data
    }
    //获取城市数据
    async getCityData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        data['city'] = await sequelize.query(`select count(payment_record.id) as value,(payment_record.city) as name from payment_record where payment_record.status = 1 and payment_record.item_type=1 and payment_record.city <> ''  group by payment_record.city order by value desc limit 6`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        return data
    }
    //获取加入机构数据
    async getGroupData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        data['group_count'] =  await sequelize.query(`select count(id) as count from groups where state = 1`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        data['group_activity'] = await sequelize.query(`select name,state from groups where state = 1 order by created_at desc limit 10`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        return data
    }
    // 获取近7天数据
    async getDayData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        let day = {};
        let arr = [];
        day = await sequelize.query(`select SUM(payment_record.total) as total,DATE_FORMAT(payment_record.created_at,'%Y-%m-%d') as time  from payment_record where status = 1 group by time order by time desc limit 7`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        day.map((item)=>{
            arr.push({total:item.total,time:sd.format(item.time,'MM-DD')})
         })
         data['day'] = arr
        return  data
    }
    //获取用户捐赠数据
    async getDonationData(){
        const {ctx} = this
        const { Op } = this.app.Sequelize;
        const sequelize = this.app.model;
        const now = moment(new Date()).format("YYYY-MM-DD");
        let data = {};
        data['donation']  = await sequelize.query(`select user_id,item_type,item_id,total,payment_record.created_at as time,IFNULL(users.name,"爱心人士") as name ,(
            case
                when item_type = 1 then (select title from project where id = item_id)
                when item_type = 3 then (SELECT title from ailin_foundation where id = item_id)
                when item_type = 2 then "活动"
                when item_type = 4 then "灵青学生公益"
            end
        )as project from payment_record left join users on users.id = payment_record.user_id 
                    where status = 1  order by payment_record.created_at desc limit 15`,{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
        return data
      
    }



}

module.exports = Datalq;
