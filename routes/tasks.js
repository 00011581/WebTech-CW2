const express = require('express');
let db = require('../database');
let Task = require('../models');
let router = express.Router();

db.sync({force: false }).then(() => 'DB initted...');


//getting certain task based on task id
router
    .route("/retrieve/:id")
    .get( async (req, res) => {
    task_id = req.params.id
    let task = null
    //using try/catch to prevent unfriendly errors
    try {
        task = await Task.findByPk(task_id)
        res.render('retrieve', { task: task })
    } catch {
        task = []
        res.render('retrieve', { task: task })
    }
})


router
    //form for creating new task
    .route("/new")
    .get( async (req, res) => {
        res.render('create')
})


router
    //deleting the task based on 'id' in url
    .route("/delete/:id")
    .get(async (req, res) => {
        let id = req.params.id
        let result = await Task.destroy({
            where: {
                id: id
            }
        })
        res.redirect('/')
    })


router
    //form for updating the task    
    .route("/update-task/:id")
    .get(async (req, res) => {
        let id = req.params.id
        let task = await Task.findByPk(id)
        res.render('update', { task:task })
})


module.exports = router;