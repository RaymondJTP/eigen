'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookBorroweds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idMember: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'members'
          },
          key: 'id' 
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      idBook: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'books'
          },
          key: 'id' 
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      borrowDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BookBorroweds');
  }
};