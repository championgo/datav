'use strict';

const Controller = require('egg').Controller;

const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');

class CourseController extends Controller {
  async index() {
    const { ctx } = this;
    const query = {
      search: ctx.query.search,
      offset: (parseInt(ctx.query.current) - 1) * parseInt(ctx.query.pageSize),
      limit: parseInt(ctx.query.pageSize),
      category: ctx.query.category,
      type: ctx.query.current_type,
    };
    const result = await ctx.service.course.list(query);

    const data = {
      list: result.rows,
      pagination: {
        total: result.count,
        pageSize: query.limit,
        current: parseInt(ctx.query.current),
      },
    };

    ctx.body = data;
  }

  async getDetail() {
    const { ctx } = this;
    const { id } = ctx.query;
    let json_data = {};
    const result = await ctx.service.course.getDetail({ id });
    // eslint-disable-next-line @typescript-eslint/camelcase
    const trainning_times = await ctx.service.trainning.TrainningTimes({ course_id: id });
    // const trainning = await ctx.service.trainning.createdTrainning({ course_id: id });
    json_data.name = result.name;
    json_data.version = result.version;
    json_data.category = result.category;
    json_data.type = result.type;
    json_data.body = result.body;
    json_data.first = result.first;
    json_data.source = JSON.parse(result.source);
    json_data.blanks = JSON.parse(result.blanks);
    json_data.variables = JSON.parse(result.variables);
    json_data.ios = JSON.parse(result.ios);
    // json_data.trainning_log_id = trainning.trainning_log_id;
    // eslint-disable-next-line prefer-destructuring
    json_data.trainning_times = trainning_times[0];

    ctx.body = json_data;
  }

  async update() {
    const ctx = this.ctx;
    const result = await ctx.service.course.updateItem();
    ctx.status = 200;
    ctx.body = result;
  }

  async insert() {
    const ctx = this.ctx;
    const result = await ctx.service.course.insertItem();
    ctx.status = 200;
    ctx.body = result;
  }

  async user() {
    const ctx = this.ctx;
    ctx.body = {
      name: '悟空开智',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        {
          key: '0',
          label: '很有想法的',
        },
        {
          key: '1',
          label: '专注设计',
        },
        {
          key: '2',
          label: '辣~',
        },
        {
          key: '3',
          label: '大长腿',
        },
        {
          key: '4',
          label: '川妹子',
        },
        {
          key: '5',
          label: '海纳百川',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      geographic: {
        province: {
          label: '浙江省',
          key: '330000',
        },
        city: {
          label: '杭州市',
          key: '330100',
        },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    };
  }

  async getExamList() {
    const ctx = this.ctx;
    const result = await ctx.service.course.getExamList();
    ctx.status = 200;
    ctx.body = result;
  }

  /**
   * 开始考试生成试卷
   */
  async newExam() {
    const { ctx } = this;
    const result = await ctx.service.course.newExam();
    ctx.status = 200;
    ctx.body = result;
  }

  async getCategoryList() {
    const ctx = this.ctx;
    const result = await ctx.service.course.getCategoryList();
    ctx.status = 200;
    ctx.body = result;
  }

  async download() {
    const ctx = this.ctx;
    let headers = [
      [
        { t: 'id', f: 'id', m1: 'A1', m2: 'A1' },
        { t: 'name', f: 'name', m1: 'B1', m2: 'B1' },
        { t: 'version', f: 'version', m1: 'C1', m2: 'C1' },
        { t: 'category', f: 'category', m1: 'D1', m2: 'D1' },
        { t: 'type', f: 'type', m1: 'E1', m2: 'E1' },
        { t: 'body', f: 'body', m1: 'F1', m2: 'F1' },
        { t: 'source', f: 'source', m1: 'G1', m2: 'G1' },
        { t: 'first', f: 'first', m1: 'H1', m2: 'H1' },
        { t: 'blanks', f: 'blanks', m1: 'I1', m2: 'I1' },
        { t: 'variables', f: 'variables', m1: 'J1', m2: 'J1' },
        { t: 'ios', f: 'ios', m1: 'K1', m2: 'K1' },
        { t: 'created_at', f: 'created_at', m1: 'L1', m2: 'L1' },
        { t: 'updated_at', f: 'updated_at', m1: 'M1', m2: 'M1' },
        { t: 'is_update', f: 'is_update', m1: 'N1', m2: 'N1' },
      ],
    ];
    let data = await this.ctx.service.course.download();
    await ctx.helper.exportExcel(data, headers, '课程记录');
  }

  async uploadExcel() {
    const ctx = this.ctx;
    let result = { error: 0, errmsg: 'OK', url: '' };
    const stream = await ctx.getFileStream();
    try {
      const dstname = stream.filename;
      const dirname = path.resolve('./tmp');
      const target = path.join(dirname, dstname);
      if (!fs.existsSync(dirname)) fs.mkdirSync(dirname);
      const writeStream = fs.createWriteStream(target);
      await awaitWriteStream(stream.pipe(writeStream));
      const data = await ctx.helper.importExcel(target);
      result = await ctx.service.course.uploadExcel(data);
      fs.unlinkSync(target);
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      console.log(err.message);
      await sendToWormhole(stream);
      throw err;
    }
    ctx.body = result;
  }
}

module.exports = CourseController;
