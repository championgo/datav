// {app_root}/app/io/controller/default.js
'use strict';

const Controller = require('egg').Controller;

class DataLqController extends Controller {
  async index() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    var data = {
      // "total":{
      //   "total": "",
      //   "now": null,
      //   "count":"",
      //   "total_count": ""
      // },
      // "project_donate":[],
      // "sex":[],
      // "group":[],
      // "district":[],
      // "group_count":{
      //   "group_count":0,
      //   "district_count":0
      // },
      // "project":[],
      // "project_asynic":[]
    } 
    await ctx.socket.emit('init',data);
  }
  async data1() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const result = await ctx.service.datalq.getTotalData()
    const now = await ctx.service.datalq.getnowData();
    const count = await ctx.service.datalq.getcountData();
    const total_count = await ctx.service.datalq.getTotalCount();
    var data = {
      "total":{
        "total": result.total[0].total,
        "now": now.now[0].total,
        "count": count.count[0].count.toString(),
        "total_count": total_count.total_count[0].count.toString()
      }
    } 
    await ctx.socket.emit('data1',data);
  }
  async data2() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    let project = [];
    let quart = [];
    let time = [];
    let total = [];
    const project_donate = await ctx.service.datalq.getProjectDonateData();
    project_donate.project_donate.map((item)=>{
      project.push(item.name)
      quart.push(item.value)
    })
    const day = await ctx.service.datalq.getDayData()
    day.day.map((item)=>{
      time.push(item.time)
      total.push(Number(item.total))
    })
    var data = {
      "project_donate":{
        "name":project,
        "value":quart
      },
      "project_asynic":{
        "time":time,
        "total":total
      }   
    } 
    await ctx.socket.emit('data2',data);
  }
  async data3() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const sex = await ctx.service.datalq.getSexData();
    var data = {
      "sex":sex.sex,
    } 
    await ctx.socket.emit('data3',data);
  }
  async data4() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    let groups = [];
    const group = await ctx.service.datalq.getGroupData();
    group.group_activity.map((item)=>{
      groups.push([item.name,"已加入"])
    })
    var data = {
      "group":groups,
    } 
    await ctx.socket.emit('data4',data);
  }

  async data5() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const district = await ctx.service.datalq.getCityData();
    await ctx.socket.emit('data5',district.city);
  }
  async data6() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    const group = await ctx.service.datalq.getGroupData();
    var data = {
      "group_count":{
        "group_count":group.group_count[0].count,
        "district_count":32
      }
    } 
    await ctx.socket.emit('data6',data);
  }
  async data7() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    console.log(message)
    const donation = await ctx.service.datalq.getDonationData()
    let example_donation = []
    let project = []
    donation.donation.map((item)=>{
      example_donation.push([item.name,item.project,item.total,item.time])
    })
    if (JSON.stringify(example_donation[0]) == JSON.stringify(message.msg)){
      project = []
    }else{
      project = example_donation
    }
    var data = {
      "project":project,  
    } 
    await ctx.socket.emit('data7',data);
  }

}

module.exports = DataLqController;
