'use strict';

const Service = require('egg').Service;
const lodash = require('lodash');
const CryptoJS = require('crypto-js');

class User extends Service {


  async getUserInfo() {
    const Op = this.app.Sequelize.Op;
    const sequelize = this.app.model;
    const {userid} = this.ctx.locals;
    const result = await this.ctx.model.QyUsers.findOne({where:{userid:userid}});
    return result;
  }

  async login(data) {
    const Op = this.app.Sequelize.Op;
    let result = { error: 0, errmsg: '登陆成功!' };
    const sequelize = this.app.model;
    let user = await this.ctx.model.User.findOne({
      attributes: [
        'user_id',
        'uuid',
        'name',
        'username',
        'phone',
        'email',
        'image',
        'birthday',
        'gender',
        'major',
        'class',
        'college',
      ],
      where: { username: data.username, password: data.password },
    });
    if (!user) {
      return { error: 1, errmsg: '无效的用户名和密码.', data: {} };
    } else {
      const groups = await this.ctx.model.UserUsergroup.findOne({
        attributes: ['user_usergroup_id', 'group_id'],
        where: { group_id: { [Op.in]: [1, 2] }, user_id: user.user_id },
      });
      if (!groups) {
        return { error: 1, errmsg: '你没有权限，请联系管理员.', data: {} };
      }
      user.groups = groups;
      if (user.groups['group_id'] == 1) {
        result.role = 'admin';
      } else {
        result.role = 'user';
      }
      result.token = this.app.jwt.sign(
        { role: result.role, uuid: user.uuid, user_id: user.user_id },
        this.app.config.jwt.secret,
        {
          expiresIn: '12d',
        },
      );

      delete user.user_id;
      let user_json = JSON.stringify(user);
      let real_user = JSON.parse(user_json);
      result.userInfo = real_user;
      result.userInfo.nickname = result.userInfo.username;
      //result.data = user
      return result;
    }
  }
}

module.exports = User;
