'use strict';

// eslint-disable-next-line prefer-destructuring
const Controller = require('egg').Controller;

class ExamLogCourseController extends Controller {
  async update() {
    const { ctx } = this;
    const query = {
      exam_log_id: ctx.request.body.exam_log_id,
      course_id: ctx.request.body.course_id,
      result: ctx.request.body.result,
      isRight: ctx.request.body.is_right,
    };
    const result = await ctx.service.examLogCourse.update(query);
    ctx.status = 200;
    ctx.body = result;
  }

  async submit() {
    const { ctx } = this;
    const query = {
      exam_log_id: ctx.request.body.exam_log_id,
    };
    const result = await ctx.service.examLogCourse.submit(query);
    ctx.status = 200;
    ctx.body = result;
  }
}

module.exports = ExamLogCourseController;
