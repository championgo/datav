/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
'use strict';

const Service = require('egg').Service;

class Trainning extends Service {
  async list({ offset = 0, limit = 10, search, major, college, className }) {
    const Op = this.app.Sequelize.Op;
    const sequelize = this.app.model;
    const options = {
      offset,
      limit,
      order: [['trainning_log_id', 'desc']],
      attributes: [['trainning_log_id', 'id'], 'updated_at', 'created_at', 'times', 'is_right'],
      include: [
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: ['name', 'college', 'major', ['uuid', 'id'], 'class'],
          where: {},
        },
        {
          model: this.ctx.model.Course,
          as: 'course',
          attributes: ['name'],
          where: {},
        },
      ],
    };
    options.include[0].where = { [Op.and]: [] };
    if (search) {
      options.include[0].where[Op.and].push({
        [Op.or]: [
          { name: { [Op.like]: '%' + search + '%' } },
          { uuid: { [Op.like]: '%' + search + '%' } },
        ],
      });
    }
    if (major) {
      options.include[0].where[Op.and].push({ major: { [Op.like]: '%' + major + '%' } });
    }
    if (college) {
      options.include[0].where[Op.and].push({ college: { [Op.like]: '%' + college + '%' } });
    }
    if (className) {
      options.include[0].where[Op.and].push({ class: { [Op.like]: '%' + className + '%' } });
    }
    const result = this.ctx.model.TrainningLog.findAndCountAll(options);
    return result;
  }

  async download() {
    const Op = this.app.Sequelize.Op;
    const sequelize = this.app.model;
    const options = {
      order: [['trainning_log_id']],
      attributes: [['trainning_log_id', 'id'], 'updated_at', 'created_at', 'times', 'is_right'],
      include: [
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: ['name', 'college', 'major', 'uuid', 'class'],
          where: {},
        },
      ],
    };
    const result = await this.ctx.model.TrainningLog.findAll(options);
    let arr = [];
    console.log('askjdhaksdhkashdkasj');
    result.map(item => {
      arr.push({
        id: item.user.uuid,
        name: item.user.name,
        major: item.user.major,
        college: item.user.college,
        class: item.user.class,
        times: item.times,
        is_right: item.is_right == 0 ? '错误' : '正确',
        created_at: item.created_at,
      });
    });
    return arr;
  }

  /**
   * 开始训练生成训练记录
   */
  async createdTrainning({ course_id }) {
    const { ctx } = this;
    const { user_id } = ctx.locals;
    const result = await ctx.model.TrainningLog.create({ course_id, user_id });
    return result;
  }

  /**
   * 生成训练记录(错题集等)
   */
  async createdTrainning_v2({ course_id, result, isRight }) {
    const { ctx } = this;
    const { user_id } = ctx.locals;

    if (!course_id) {
      return { error: 1, errmsg: 'course_id is required' };
    }

    const course = await ctx.model.Course.findOne({
      where: {
        id: course_id,
      },
    });

    let is_right = 0;
    if (course) {
      // eslint-disable-next-line no-unused-vars
      if (course.type === 0) {
        is_right = isRight;
      } else if (course.type === 1) {
        const ios = JSON.parse(course.ios);
        if (JSON.stringify(ios[0].outputs) === JSON.stringify(result)) {
          is_right = 1;
        }
      } else {
        is_right = isRight;
      }
    } else {
      return { error: 1, errmsg: 'does not exist' };
    }

    // eslint-disable-next-line no-redeclare
    const trainningLog = await ctx.model.TrainningLog.create({
      course_id,
      user_id,
      result: JSON.stringify(result),
      is_right,
    });
    if (!trainningLog) {
      return { error: 1, errmsg: 'Training failure' };
    }

    return { error: 0, errmsg: 'ok' };
  }

  /**
   * 统计用户每题训练次数
   */
  async TrainningTimes({ course_id }) {
    const { ctx } = this;
    const sequelize = this.app.model;
    const { user_id } = ctx.locals;
    const options = {
      attributes: [[sequelize.fn('COUNT', '*'), 'times']],
      where: {
        user_id,
        course_id,
      },
    };
    const result = await ctx.model.TrainningLog.findAll(options);
    return result;
  }

  /**
   * 训练结果更新
   */
  async update({ trainning_log_id, course_id, result, isRight }) {
    const { ctx } = this;
    const { user_id } = ctx.locals;

    if (!!!trainning_log_id) {
      return { error: 1, errmsg: 'trainning_log_id is required' };
    }

    if (!!!course_id) {
      return { error: 1, errmsg: 'course_id is required' };
    }

    const options = {
      where: {
        user_id,
        trainning_log_id,
        course_id,
      },
    };

    const trainningLog = await ctx.model.TrainningLog.findOne(options);

    if (trainningLog) {
      const course = await ctx.model.Course.findOne({
        where: {
          id: course_id,
        },
      });
      let is_right = 0;
      if (course.type === 0) {
        is_right = isRight;
      } else if (course.type === 1) {
        const ios = JSON.parse(course.ios);
        if (JSON.stringify(ios[0].outputs) === JSON.stringify(result)) {
          is_right = 1;
        }
      } else {
        is_right = isRight;
      }

      trainningLog.update({ result: JSON.stringify(result), is_right });
    } else {
      return { error: 1, errmsg: 'does not exist' };
    }

    return { error: 0, errmsg: 'ok' };
  }
}

module.exports = Trainning;
