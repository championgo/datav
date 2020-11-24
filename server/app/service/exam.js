'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class Exam extends Service {
  async list({ offset = 0, limit = 10, search, major, college, className }) {
    const Op = this.app.Sequelize.Op;
    const sequelize = this.app.model
    const options = {
      offset,
      limit,
      order: [['user_id', 'desc']],
      attributes: [['exam_log_id', 'id'], 'updated_at', 'created_at', [sequelize.literal('(SELECT sum(points) FROM exam_log_course where exam_log_id = exam_log.exam_log_id)'), "points"]],
      include: [
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: ['name', 'college', 'major', ['uuid', 'id'], 'class'],
          where: {}
        },
      ],
    };
    options.include[0].where = { [Op.and]: [] }
    if (search) {
      options.include[0].where[Op.and].push({
        [Op.or]: [
          { name: { [Op.like]: '%' + search + '%' } },
          { uuid: { [Op.like]: '%' + search + '%' } },
        ],
      })
    }
    if (major) {
      options.include[0].where[Op.and].push({ major: { [Op.like]: '%' + major + '%' } })

    }
    if (college) {
      options.include[0].where[Op.and].push({ college: { [Op.like]: '%' + college + '%' } })
    }
    if (className) {
      options.include[0].where[Op.and].push({ class: { [Op.like]: '%' + className + '%' } })
    }
    const result = this.ctx.model.ExamLog.findAndCountAll(options);
    return result;
  }

  async exportXlsx() {
    return { id: 1 }
  }

  async download() {
    const Op = this.app.Sequelize.Op;
    const sequelize = this.app.model
    const options = {
      order: [['user_id']],
      attributes: [['exam_log_id', 'id'], 'updated_at', 'created_at', [sequelize.literal('(SELECT sum(points) FROM exam_log_course where exam_log_id = exam_log.exam_log_id)'), "points"]],
      include: [
        {
          model: this.ctx.model.User,
          as: 'user',
          attributes: ['name', 'college', 'major', 'uuid', 'class'],
          where: {}
        },
      ],
    };
    const result = await this.ctx.model.ExamLog.findAll(options);
    let arr = [];
    result.map((item) => {
      arr.push({
        id: item.user.uuid,
        name: item.user.name,
        major: item.user.major,
        college: item.user.college,
        class: item.user.class,
        points: item.points ? item.points : 0,
        time: moment(item.updated_at, 'YYYY/MM/DD HH:mm:ss').diff(moment(item.created_at, 'YYYY/MM/DD HH:mm:ss'), 'minute'),
        created_at: item.created_at,
        updated_at: item.updated_at
      });
    })
    return arr;
  }
}

module.exports = Exam;
