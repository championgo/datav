'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const RoleUsers = app.model.define('role_users', {
    role_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: INTEGER,
    user_name: STRING,
    image: STRING,
    title: STRING,
    alias: STRING,
    avatar: STRING,
    story: STRING,
  });

  return RoleUsers;
};
