'use strict';

const Service = require('egg').Service;
const fs = require('mz/fs');

class Course extends Service {
  async list({ offset = 0, limit = 10, search, category, type }) {
    const { Op } = this.app.Sequelize;
    const { user_id } = this.ctx.locals;
    const sequelize = this.app.model;
    const options = {
      offset,
      limit,
      order: [['id', 'desc']],
      attributes: [
        'id',
        'name',
        'version',
        'body',
        'category',
        'created_at',
        [
          sequelize.literal(
            `(SELECT count(*) FROM trainning_log WHERE course_id = list_course.id and user_id = ${user_id})`,
          ),
          'times',
        ],
      ],
      where: {},
    };
    if (search) {
      options.where.name = { [Op.like]: '%' + search + '%' };
    }
    if (category && category != '0') {
      options.where.category = { [Op.like]: '%' + category + '%' };
    }
    if (type) {
      if (type == '填空题') {
        options.where.type = 0;
      } else if (type == '选择题') {
        options.where.type = 1;
      } else if (type == '程序设计题') {
        options.where.type = 2;
      }
    }
    const result = await this.ctx.model.Course.findAndCountAll(options);
    return result;
  }

  async getDetail({ id }) {
    const result = await this.ctx.model.Course.findOne({ where: { id: id } });
    return result;
  }

  async updateItem() {
    let items;
    fs.readFile('/data/projects/course/server/json/2.json', (err, data) => {
      if (err) throw err;
      let insertData = [];
      let ios_json, source_json, blanks_json, variables_json;
      items = JSON.parse(data.toString());
      items.map((item, idx) => {
        //insertData.push({name:item.name,version:item.version,category:item.category,type:item.type,body:item.body,first:item.first,ios:JSON.stringify(item.ios)})
        //ios_json = JSON.stringify(item.ios);
        // source_json = JSON.stringify(item.source)
        //blanks_json = JSON.stringify(item.blanks)
        //variables_json = JSON.stringify(item.variables)
        //insertData.push({name:item.name,version:item.version,category:item.category,type:item.type,body:item.body,first:item.first,ios:ios_json,source:source_json,blanks:blanks_json,variables:variables_json})
        //console.log(item.ios)
        this.ctx.model.Course.update({ first: item.first }, { where: { name: item.name } });
        console.log(item.first);
      });
      //this.ctx.model.Course.bulkCreate(insertData)
    });
    return { error: 1, errmsg: 'ss' };
  }

  async insertItem() {
    let items;
    fs.readFile('/data/projects/course/server/119-2.json', (err, data) => {
      if (err) throw err;
      let insertData = [];
      let ios_json, source_json, blanks_json, variables_json;
      items = JSON.parse(data.toString());
      /*  items.map((item,idx)=>{
                //insertData.push({name:item.name,version:item.version,category:item.category,type:item.type,body:item.body,first:item.first,ios:JSON.stringify(item.ios)})
                ios_json = JSON.stringify(item.ios);
                source_json = JSON.stringify(item.source)
                blanks_json = JSON.stringify(item.blanks)
                variables_json = JSON.stringify(item.variables)
                insertData.push({name:item.name,version:item.version,category:item.category,type:item.type,body:item.body,first:item.first,ios:ios_json,source:source_json,blanks:blanks_json,variables:variables_json})
               console.log(item.ios)
                //this.ctx.model.Course.update({first:item.first},{where:{name:item.name}})
                console.log(item.first)
            })*/
      this.ctx.model.Course.bulkCreate(insertData);
    });
    return { error: 1, errmsg: 'ss' };
  }

  async getExamList() {
    const Op = this.app.Sequelize.Op;
    const sequelize = this.app.model;
    const options = {
      limit: 20,
      order: sequelize.random(),
      //attributes: ['id','name','version','body','type','ios','],
      where: {},
    };
    const result = await this.ctx.model.Course.findAll(options);
    return result;
  }

  /**
   * 开始考试生成试卷
   */
  async newExam() {
    const { ctx } = this;
    const user_id = ctx.locals.user_id;
    const { Op } = this.app.Sequelize;
    const sequelize = this.app.model;
    /**
     * 随机10道选择题
     */
    const choices_options = {
      limit: 10,
      order: sequelize.random(),
      where: {
        type: 1,
      },
    };

    const choices = await ctx.model.Course.findAll(choices_options);

    /**
     * 随机5道填空题
     */
    const blanks_options = {
      limit: 5,
      order: sequelize.random(),
      where: {
        type: 0,
      },
    };

    const blanks = await ctx.model.Course.findAll(blanks_options);

    /**
     * 随机3道编程题
     */
    const codes_options = {
      limit: 5,
      order: sequelize.random(),
      where: {
        type: 2,
      },
    };

    const codes = await ctx.model.Course.findAll(codes_options);

    const result = [...choices, ...blanks, ...codes];

    const exam_log = await ctx.model.ExamLog.create({
      user_id,
    });

    const exam_log_id = exam_log.exam_log_id;
    let exam_log_course = [];

    result.map(item => {
      item.setDataValue('exam_log_id', exam_log.exam_log_id);
      exam_log_course.push({
        user_id,
        exam_log_id,
        course_id: item.id,
      });
    });

    await ctx.model.ExamLogCourse.bulkCreate(exam_log_course);

    return result;
  }

  async getCategoryList() {
    const options = {
      group: 'category',
      attributes: ['category'],
      where: {},
    };
    const result = await this.ctx.model.Course.findAll(options);
    return result;
  }

  async download() {
    const options = {
      order: [['id']],
      attributes: [
        'id',
        'name',
        'version',
        'category',
        'type',
        'body',
        'source',
        'first',
        'blanks',
        'variables',
        'ios',
        'created_at',
        'updated_at',
      ],
      where: {
        status: 0
      },
    };
    const result = await this.ctx.model.Course.findAll(options);
    let arr = [];
    result.map(item => {
      arr.push({
        id: item.id,
        name: item.name,
        version: item.version,
        category: item.category,
        type: item.type,
        body: item.body,
        source: item.source,
        first: item.first,
        blanks: item.blanks,
        variables: item.variables,
        ios: item.ios,
        created_at: item.created_at,
        updated_at: item.updated_at,
        is_update: 0,
      });
    });
    return arr;
  }

  async uploadExcel(data) {
    try {
      data.map(item => {
        if (item.is_update == 1) {
          this.ctx.model.Course.findOne({ where: { id: item.id } }).then(res => {
            delete item.id;
            res.update(item);
          });
        } else if (item.is_update == 2) {
          delete item.id;
          item.status = 0;
          this.ctx.model.Course.create(item);
        } else if (item.is_update == 3) {
          this.ctx.model.Course.findOne({ where: { id: item.id } }).then(res => {
            delete item.id;
            item.status = -1;
            res.update(item);
          });
        }
      });
      return { error: 0, errmsg: '操作成功' };
    } catch (err) {
      this.logger.error(err);
      return { error: 1, errmsg: 'System is too busy,  please try later.' };
    }
  }

// 同步count
     async updateCount() {
          let items = await sequelize.query('select count(id) as data_count,phone from data_shipping group by phone',{ raw: true , type: this.app.Sequelize.QueryTypes.SELECT});
         await this.ctx.model.CountShipping.bulkCreate(items)
          return { error: 0, errmsg: '操作成功' };

     }
}

module.exports = Course;
