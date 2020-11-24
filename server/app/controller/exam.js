'use strict';

const Controller = require('egg').Controller;

class ExamController extends Controller {

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
    
    const result = await ctx.service.exam.list(query);

    const data = { list: result.rows, "pagination": { "total": result.count, "pageSize": query.limit, "current": parseInt(ctx.query.current) } }

    ctx.body = data;
  }


  async download() {
    const ctx = this.ctx;
    let headers = [[
      { t: '学号', f: 'id', m1: 'A1', m2: 'A1' },
      { t: '姓名', f: 'name', m1: 'B1', m2: 'B1' },
      { t: '学院', f: 'major', m1: 'C1', m2: 'C1' },
      { t: '专业', f: 'college', m1: 'D1', m2: 'D1' },
      { t: '班级', f: 'class', m1: 'E1', m2: 'E1' },
      { t: '得分', f: 'points', m1: 'F1', m2: 'F1' },
      { t: '做题时长', f: 'time', m1: 'G1', m2: 'G1' },
      { t: '开始时间', f: 'created_at', m1: 'H1', m2: 'H1' },
      { t: '结束时间', f: 'updated_at', m1: 'I1', m2: 'I1' },
    ]]
    let data = await this.ctx.service.exam.download()
    await ctx.helper.exportExcel(data, headers, '考试记录')
  }
}

module.exports = ExamController;
