let { DataTypes } = require('sequelize')
let db = require('./database')

let Task = db.define('Task', {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING
    },
    comment: {
        type: DataTypes.STRING,
    },
    time: { //when should user complete the task
        type: DataTypes.TIME
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false //means default is not "done"
    },
    undone: {
        type: DataTypes.BOOLEAN, 
        defaultValue: true //means default is undone
    }
}, {
    tableName: 'tasks'
})


module.exports = Task