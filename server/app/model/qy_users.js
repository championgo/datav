'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const QyUsers = app.model.define('qy_users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userid: STRING,
    name: STRING,
    mobile: STRING,
    department: INTEGER,
    order: INTEGER,
    position: STRING,
    gender: INTEGER,
    email: STRING,
    is_leader_in_dept: INTEGER,
    avatar: STRING,
    thumb_avatar: STRING,
    telephone: STRING,
    alias: STRING,
    address: STRING,
    open_userid: STRING,
    main_department: INTEGER,
    status: INTEGER,
    qr_code: STRING,
    external_position: STRING,
    created_at:DATE,
    updated_at:DATE,

  });

  return QyUsers;
};
