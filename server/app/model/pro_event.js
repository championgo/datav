'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const ProEvent = app.model.define('pro_event', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    o_id: INTEGER,
    status: INTEGER,
    workspace_id: INTEGER,
    event: STRING,
    event_from: STRING,
    event_name: STRING,
    event_action: STRING,
    secret: STRING,
    created:DATE,
    created_at:DATE,
    updated_at:DATE,

  });

  return ProEvent;
};
