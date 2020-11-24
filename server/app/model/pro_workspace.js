'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const ProWorkspace = app.model.define('pro_workspace', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING,
    status: INTEGER,
    count: INTEGER,
    created_at: DATE,
  });

  return ProWorkspace;
};
