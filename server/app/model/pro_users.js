'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const ProUsers = app.model.define('pro_users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    role_id: INTEGER,
    user: STRING,
    email: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return ProUsers;
};
