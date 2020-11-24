'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const ProTask = app.model.define('pro_task', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING,
    priority: STRING,
    status: STRING,
    iteration_id: INTEGER,
    owner_id: INTEGER,
    owner: STRING,
    cc: STRING,
    creator: STRING,
    begin:DATE,
    due:DATE,
    created:DATE,
    modified:DATE,
    completed:DATE,
    effort: STRING,
    effort_completed: STRING,
    remain:DECIMAL,
    exceed:DECIMAL,
    progress: INTEGER,
    story_id: INTEGER,
    workspace_id: INTEGER,
    description: STRING,
    created_at: DATE,
    updated_at: DATE

  });

  return ProTask;
};
