/* eslint-disable @typescript-eslint/camelcase */
'use strict';

const Controller = require('egg').Controller;

class TrainningController extends Controller {
  async list() {
    const ctx = this.ctx;
    const query = {
      search: ctx.query.search,
      major: ctx.query.major,
      college: ctx.query.college,
      className: ctx.query.class,
      offset: (parseInt(ctx.query.current) - 1) * parseInt(ctx.query.pageSize),
      limit: parseInt(ctx.query.pageSize),
    };
    const result = await ctx.service.trainning.list(query);

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

  async download() {
    const ctx = this.ctx;
    let headers = [
      [
        { t: '学号', f: 'id', m1: 'A1', m2: 'A1' },
        { t: '姓名', f: 'name', m1: 'B1', m2: 'B1' },
        { t: '学院', f: 'major', m1: 'C1', m2: 'C1' },
        { t: '专业', f: 'college', m1: 'D1', m2: 'D1' },
        { t: '班级', f: 'class', m1: 'E1', m2: 'E1' },
        { t: '已做次数', f: 'times', m1: 'F1', m2: 'F1' },
        { t: '状态', f: 'is_right', m1: 'G1', m2: 'G1' },
        { t: '做题时间', f: 'created_at', m1: 'H1', m2: 'H1' },
      ],
    ];
    let data = await this.ctx.service.trainning.download();
    await ctx.helper.exportExcel(data, headers, '训练记录');
  }

  /**
   * 训练结果更新
   */
  async update() {
    const { ctx } = this;
    const query = {
      trainning_log_id: ctx.request.body.trainning_log_id,
      course_id: ctx.request.body.course_id,
      result: ctx.request.body.result,
      isRight: ctx.request.body.is_right,
    };

    const result = await ctx.service.trainning.update(query);
    ctx.status = 200;
    ctx.body = result;
  }

  /**
   * 生成训练记录(错题集等)
   */
  async createdTrainning_v2() {
    const { ctx } = this;
    const query = {
      course_id: ctx.request.body.course_id,
      result: ctx.request.body.result,
      isRight: ctx.request.body.is_right,
    };

    const result = await ctx.service.trainning.createdTrainning_v2(query);
    console.log(result);
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = TrainningController;
