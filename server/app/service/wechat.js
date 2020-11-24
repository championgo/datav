'use strict';

const Service = require('egg').Service;
const xml2js = require('xml2js');
const WXBizMsgCrypt = require('wechat-crypto');



class Wechat extends Service {

   async getAccessToken() {
    const {ctx} = this;
    const app_config = await ctx.model.QyApplication.findOne();

    if(!this.app.config.qywx){
      //this.app.coreLogger.error(new Error(`[egg-qywx][getAccessToken] No configuration found`));
      return;
    }

    const {corpid, secret} = this.app.config.qywx;

    if(!corpid || !secret){
      //this.app.coreLogger.error(new Error(`[egg-qywx][getAccessToken] corpid or secret cannot be empty`));
      return;
    }
       
    console.log(app_config.access_token)
    if(app_config.access_token == null || (app_config.access_token != null && (Date.now() - app_config.get_time) > app_config.expires_in * 1000)){
      
        console.log(app_config.access_token);

      //this.app.coreLogger.info(`[egg-qywx][getAccessToken] start`);

      const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${secret}`, {
        dataType: 'json',
      });

      if(result.data.errcode){
        //this.app.coreLogger.error(new Error(`[egg-qywx][getAccessToken] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
        return;
      }


      app_config.update({access_token:result.data.access_token,get_time:Date.now(),expires_in:result.data.expires_in})
        
    }

    return app_config.access_token;

  }

    async getUserId(code) {
    if(!code){
      //this.app.coreLogger.info(new Error(`[egg-qywx][getUserId] code cannot be empty`));
      return;
    }
    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      //this.app.coreLogger.error(new Error(`[egg-qywx][getUserId] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }
    if(result.data.UserId){
        return result.data.UserId;
    }else{
        return result.data.OpenId;
    }

  }

 async getUserInfo(userId) {
    if(!userId){
      //this.app.coreLogger.info(new Error(`[egg-qywx][getUserInfo] userId cannot be empty`));
      return;
    }
    let userInfo = await this.ctx.model.QyUsers.findOne({where:{userid:userId}});
    if(userInfo){
        return userInfo;
    }
    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&userid=${userId}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      //this.app.coreLogger.error(new Error(`[egg-qywx][getUserInfo] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }
     console.log(result.data)
    userInfo = await this.ctx.model.QyUsers.create(result.data);

    return userInfo;

  }

async getDepartmentList(id) {
    if(!id){
      //this.app.coreLogger.info(new Error(`[egg-qywx][getDepartmentList] id cannot be empty`));
      return;
    }
    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${accessToken}&id=${id}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      //this.app.coreLogger.error(new Error(`[egg-qywx][getDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }

    return result.data;

  }


async getAllDepartmentList() {

    const accessToken = await this.getAccessToken();
    if(!accessToken){
      return;
    }
    const result = await this.ctx.curl(`https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${accessToken}`, {
      dataType: 'json',
    });

    if(result.data.errcode){
      //this.app.coreLogger.error(new Error(`[egg-qywx][getAllDepartmentList] errcode: ${result.data.errcode}, errmsg: ${result.data.errmsg}`));
      return;
    }

    return result.data;

  }


async postMessage(xml,{msg_signature,nonce, timestamp}){
    const {token,encodingAESKey,agentid} = this.app.config.qywx;
    const cryptor = new WXBizMsgCrypt(token, encodingAESKey, agentid);
    xml = xml.toString('utf-8');
    if (!xml) {
        return '';
    }
    let res
    xml2js.parseString(xml, {trim: true},(err,result)=>{
        if(err){
            res = '';
            return;
        }else{
            console.log(result)
            xml = this.formatMessage(result.xml);
            const encryptMessage = xml.Encrypt;
        if (msg_signature !== cryptor.getSignature(timestamp, nonce, encryptMessage)) {
             res = '';
            return;
          }
        var decrypted = cryptor.decrypt(encryptMessage);
        var messageWrapXml = decrypted.message;
        if (messageWrapXml === '') {
              res = '';
            return;
        }
         xml2js.parseString(messageWrapXml, {trim: true}, (err_s, result_s)=> {
             if(err_s){
                   res = '';
                  return;
             }
             res = this.formatMessage(result_s.xml);
             this.handleMessage(res);
             return;
             
         })
        }
    });
    return '';

}

//处理消息
 async handleMessage(message){
     const {ctx} = this;
     let data = {}
     Object.keys(message).map(item=>{
         data[item.toLowerCase()] = message[item];
     })
     console.log(data)
     data['event_name']= 'message';
     const res = await ctx.model.QyEvent.findOne({where:{status:1}})
     const user = await this.getUserInfo(data.fromusername)
     if(user){
         data['qy_user_id'] = user.id
     }
     if(res){
         data['event_name'] = res.name;
         data['event_id'] = res.id;
         await ctx.socket.emit('point',{content:data['content'],name:user.name,avatar:user.avatar})
     }
     //ctx.model.QyEvent.create({name:'ss'})
     ctx.model.QyMessage.create(data);
     return;
 }


/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
formatMessage(result) {
  let message = {};
  if (typeof result === 'object') {
    for (var key in result) {
      if (!Array.isArray(result[key]) || result[key].length === 0) {
        continue;
      }
      if (result[key].length === 1) {
        var val = result[key][0];
        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];
        result[key].forEach(function (item) {
          message[key].push(formatMessage(item));
        });
      }
    }
  }
  return message;
}






}

module.exports = Wechat;
