'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const QyEvent = app.model.define('qy_event', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING,
    status: INTEGER,
    created_at:DATE,
    updated_at:DATE,

  });

  return QyEvent;
};
