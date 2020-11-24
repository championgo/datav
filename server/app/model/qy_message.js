'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const QyMessage = app.model.define('qy_message', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    event_name: STRING,
    order: INTEGER,
    event_id: INTEGER,
    qy_user_id: INTEGER,
    tousername: STRING,
    fromusername: STRING,
    createtime: INTEGER,
    msgtype: STRING,
    content: STRING,
    msgid: STRING,
    agentid: STRING,
    status: INTEGER,
    created_at:DATE,
    updated_at:DATE,
  });

  return QyMessage;
};
