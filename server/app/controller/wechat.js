'use strict';

const Controller = require('egg').Controller;
const WXBizMsgCrypt = require('wechat-crypto');
const xml2js = require('xml2js');


class WechatController extends Controller {
  async index() {
    const { ctx } = this;
    const {token,encodingAESKey,agentid} = this.app.config.qywx;
    const cryptor = new WXBizMsgCrypt(token, encodingAESKey, agentid);
    var signature = ctx.query.msg_signature;
    var timestamp = ctx.query.timestamp;
    var nonce = ctx.query.nonce;
    const echostr = ctx.query.echostr;
    if (signature !== cryptor.getSignature(timestamp, nonce, echostr)) {
        ctx.status = 401;
        ctx.body = 'Invalid signature';
    }else{

   ctx.status = 200;
    var result = cryptor.decrypt(echostr);
    ctx.body = result.message;
    }
  }


async postMessage(){
    const {ctx} = this;
    const buf = ctx.request.body;
    /*const xml = buf.toString('utf-8');
    console.log(buf)
    if (!xml) {
        ctx.body = '';
        return;
    }
    const result = await xml2js.parseString(xml, {trim: true});
    console.log('s')
    console.log(result)
    console.log(result)*/
    //console.log(ctx.request.body)
    //console.log(ctx.query)
    const result = await ctx.service.wechat.postMessage(buf,ctx.query);
    ctx.body = result;
}

/*!
 * 将xml2js解析出来的对象转换成直接可访问的对象
 */
async formatMessage(result) {
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

module.exports = WechatController;
