'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const ProStory = app.model.define('pro_story', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING,
    priority: STRING,
    business_value: INTEGER,
    status: STRING,
    version: STRING,
    module: STRING,
    test_focus: STRING,
    size: INTEGER,
    owner: STRING,
    cc: STRING,
    creator: STRING,
    developer: STRING,
    begin:DATE,
    due:DATE,
    created:DATE,
    modified:DATE,
    completed:DATE,
    effort: STRING,
    effort_completed: STRING,
    remain:DECIMAL,
    exceed:DECIMAL,
    iteration_id: INTEGER,
    category_id: INTEGER,
    children_id: INTEGER,
    workspace_id: INTEGER,
    description: STRING,
    created_at: DATE,
    updated_at: DATE

  });

  return ProStory;
};
