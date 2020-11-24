'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const ProIteration = app.model.define('pro_iteration', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    workspace_id: INTEGER,
    name: STRING,
    description: STRING,
    status: STRING,
    startdate:DATE,
    enddate:DATE,
    creator: STRING,
    created:DATE,
    modified:DATE,
    completed:DATE,

  });

  return ProIteration;
};
