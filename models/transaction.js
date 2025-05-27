// models/transaction.js

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        payToken: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subscriberMsisdn: {
            type: DataTypes.STRING,
            allowNull: true
        },
        txnid: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createTime: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'transactions',
        timestamps: true
    });

    return Transaction;
};