/* eslint-disable @typescript-eslint/camelcase */

'use strict';

// eslint-disable-next-line prefer-destructuring
const Service = require('egg').Service;

class ExamLogCourse extends Service {
  /**
   * 更新试卷结果
   * @param {*} param0
   */
  async update({ exam_log_id, course_id, result, isRight }) {
    const { ctx } = this;
    const { user_id } = ctx.locals;
    if (!!!exam_log_id) {
      return { error: 1, errmsg: 'exam_log_id is required' };
    }

    if (!!!course_id) {
      return { error: 1, errmsg: 'course_id is required' };
    }

    const options = {
      where: {
        user_id,
        exam_log_id,
        course_id,
      },
    };

    const examLogCourse = await ctx.model.ExamLogCourse.findOne(options);

    if (examLogCourse) {
      const course = await ctx.model.Course.findOne({
        where: {
          id: course_id,
        },
      });
      let is_right = 0;
      let points = 0;
      if (course.type === 0) {
        is_right = isRight;
        if (is_right === 1) {
          points = 8;
        }
      } else if (course.type === 1) {
        const ios = JSON.parse(course.ios);
        if (JSON.stringify(ios[0].outputs) === JSON.stringify(result)) {
          is_right = 1;
          points = 3;
        }
      } else {
        is_right = isRight;
        if (is_right === 1) {
          points = 10;
        }
      }

      examLogCourse.update({ result: JSON.stringify(result), is_right, points });
    } else {
      return { error: 1, errmsg: 'does not exist' };
    }

    return { error: 0, errmsg: 'ok' };
  }

  /**
   * 提交试卷
   */
  async submit({ exam_log_id }) {
    const { ctx } = this;
    const sequelize = this.app.model;

    if (!!!exam_log_id) {
      return { error: 1, errmsg: 'exam_log_id is required' };
    }

    const options = {
      attributes: [[sequelize.fn('SUM', sequelize.col('points')), 'total_score']],
      where: {
        exam_log_id,
      },
    };

    const result = await ctx.model.ExamLogCourse.findAll(options);

    return { error: 0, errmsg: 'ok', data: result[0] };
  }
}

module.exports = ExamLogCourse;
