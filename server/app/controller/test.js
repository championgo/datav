'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');

class TestController extends Controller {

  //处理上传
  async upload() {
    const ctx = this.ctx;
    let result = { error: 0, errmsg: 'OK', url: '' };
    const stream = await ctx.getFileStream();
    try {
        const dstname =stream.filename;
        const dirname = path.resolve('./tmp');
        const target = path.join(dirname,dstname);
        if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
        const writeStream = fs.createWriteStream(target);
        await awaitWriteStream(stream.pipe(writeStream));
        const data = await ctx.helper.importExcel(target);
        // console.log('excel')
        // console.log(data)
      //result = await ctx.oss.put(name, stream);
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      console.log(err.message);
      await sendToWormhole(stream);
      throw err;
    }
    ctx.body = result;
  }



  //由服务端模拟一次客户端发起一次上传excel事件
  async fakeUpload() {
    const { ctx } = this;
    const FormStream = require('formstream');
    // let file_name = path.join(this.config.baseDir, '/static/pcs.xlsx');
    const form = new FormStream();
    form.field('test', '1');
    const file_name = '/data/projects/course/icons/icon-512x512.png';
    form.file('file', path.resolve(file_name));
    if (!fs.existsSync(file_name)) {
      ctx.body = 'no file';
      return;
    }
    const result = await ctx.curl('http://test.demo.wearesinbad.com/api/test/upload', {
      method: 'POST',
      dataType: 'json',
      headers: form.headers(),
      stream: form,
    });


    ctx.body = result.data.files;

  }
}

module.exports = TestController;
