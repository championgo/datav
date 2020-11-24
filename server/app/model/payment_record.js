/* jshint indent: 2 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV4, DECIMAL } = app.Sequelize;
  const Pay = app.model.define('payment_record', {
  
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    
  
    payment_id: {
      type: STRING,
      allowNull: false
    },
    transaction_id: {
      type: STRING,
      allowNull: false
    },
    total: {
      type: DECIMAL,
      allowNull: false
    },
    times: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    item_id: {
      type: INTEGER,
      allowNull: false
    },
    regist_id: {
      type: INTEGER,
      allowNull: false
    },
    item_type: {
      type: INTEGER,
      allowNull: false
    },
    user_id: {
      type: INTEGER,
      allowNull: false
    },
    trader_id: {
      type: INTEGER,
      allowNull: false
    },
    donate_together_id: {
      type: INTEGER,
      allowNull: false
    },
    status: {
      type: INTEGER,
      allowNull: false
    },
    created_at: {
      type: DATE,
      allowNull: true
    },
    updated_at: {
      type: DATE,
      allowNull: true
    },
    deleted_at: {
      type: DATE,
      allowNull: true
    },
    city: {
      type: STRING,
      allowNull: true,
      defaultValue: ''
    },
    ip: {
      type: STRING,
      allowNull: true,
      defaultValue: ''
    },
    donate_money: {
      type: DECIMAL,
      allowNull: false
    },
    donate_ratio: {
      type: STRING,
      allowNull: true
    },
    qr_id: {
      type: INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    pay_type: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    cryptonym: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    source: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'payment_record'
  });
  return Pay
};
