'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;

  const ProBug = app.model.define('pro_bug', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    workspace_id: INTEGER,
    title: STRING,
    priority: STRING,
    severity: STRING,
    status: STRING,
    iteration_id: INTEGER,
    module: STRING,
    version_report: STRING,
    version_test: STRING,
    version_fix: STRING,
    version_close: STRING,
    cc: STRING,
    current_owner: STRING,
     owner_id: INTEGER,
    reporter: STRING,
    participator: STRING,
    effort: STRING,
    description: STRING,
    begin:DATE,
    due:DATE,
    created:DATE,
    deadline:DATE,
    in_progress_time:DATE,
    resolved:DATE,
    baseline_find: STRING,
    baseline_join: STRING,
    baseline_test: STRING,
    baseline_close: STRING,
    te: STRING,
    de: STRING,
    auditer: STRING,
    confirmer: STRING,
    fixer: STRING,
    closer: STRING,
    lastmodify: STRING,
    resolution: STRING,
    os: STRING,
    platform: STRING,
    testmode: STRING,
    testphase: STRING,
    testtype: STRING,
    source: STRING,
    bugtype: STRING,
    frequency: STRING,
    originphase: STRING,
    sourcephase: STRING,
    verify_time: DATE,
    closed: DATE,
    reject_time: DATE,
    modified: DATE,
    created_at: DATE,
    updated_at: DATE

  });

  return ProBug;
};
