module.exports = (sequelize, Sequelize) => {
    const Phone = sequelize.define("phone", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: Sequelize.ENUM('Mobile', 'Work', 'Home', 'Main', 'Work fax', 'Home fax', 'Pager', 'Other', 'MVPN', 'Custom'),
            allowNull: false,
        },
        number: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });
  
    return Phone;
};