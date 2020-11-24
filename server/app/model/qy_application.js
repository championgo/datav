'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const QyApplication  = app.model.define('qy_application', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    agentid: STRING,
    corpid: STRING,
    token: STRING,
    secret: STRING,
    encodingAESKey: STRING,
    access_token: STRING,
    expires_in: INTEGER,
    get_time: INTEGER,
    created_at:DATE,
    updated_at:DATE,
  });

  return QyApplication;
};
