const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CV = sequelize.define('CV', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'full_name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  education: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  languages: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  templateId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default',
    field: 'template_id'
  }
}, {
  tableName: 'cvs',
  timestamps: true
});

module.exports = CV;
