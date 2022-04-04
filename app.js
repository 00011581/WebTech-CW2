let express = require('express');
let app = express();
let { body, validationResult } = require('express-validator');

let db = require('./database');
let Task = require('./models');
db.sync({force: false }).then(() => 'DB initted...');


PORT = 3000


app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'pug');
//uncomment when there are static files
//app.use('/static', express.static('public'))
//app.use("/tasks", tasks);


//get all tasks or get done or get undone tasks
app.get('/', async (req, res) => { //is for getting all tasks
    done = req.query.done;
    
    if (req.query.done){
        done = req.query.done;
        //because done is coming as a string
        var bool_done = (done == 'true')

        let done_tasks = Task.findAll({
            where: {
                done: bool_done
            }
        }).then(function (list) {
            //rendering
            res.render('index', { tasks: list })
        })
    }
    else {
        let tasks = null
        try{
            tasks = await Task.findAll()
            res.render('index', { tasks: tasks })
        }
        catch {
            tasks = []
            res.render('index', { tasks: tasks })
        }
    }
})


//retrieve task using id
app.get('/retrieve/:id', async (req, res) => { //for getting task with id
    task_id = req.params.id
    let task = null
    try {
        task = await Task.findByPk(task_id)
        res.render('retrieve', { task: task })

    } catch {
        task = []
        res.render('retrieve', { task: task })
    }
})


//form for creating a new task
app.get('/new', async (req, res) => {
    res.render('create')
})


//creating a new task
app.post('/create', [
    //form validation
    body('title').exists().isLength({ min: 3 })
        .withMessage("Title field should not be empty and less than 3 characters"),
    body('time').not().isEmpty()
        .withMessage("Time field should not be empty")
], async (req, res) => {

    let empty_title_error = null
    let empty_time_error = null
    let all_errors = validationResult(req)
    
    if (!all_errors.isEmpty()){
        const errors = all_errors.array()
        for (error of errors){
            if (error.param == 'title'){
                empty_time_error = error.msg
            }
            else {
                empty_time_error = error.msg
            }
        }
        res.render('create', { 
            empty_title_error : empty_title_error,
            empty_time_error : empty_time_error
        })
    }
    else {
        let task = await Task.create(req.body)
        res.redirect('/')
    }
})


//deleting the task
app.get('/delete/:id', async (req, res) => {
    let id = req.params.id
    let result = await Task.destroy({
        where: {
            id: id
        }
    })
    res.redirect('/')
})


//form for updating the task
app.get('/update-task/:id', async (req, res) => {
    let id = req.params.id
    let task = await Task.findByPk(id)
    res.render('update', { task:task })
})


//updating the task
app.post('/update/:id', [
    //form validation
    body('title')
        .exists()
        .isLength({ min: 3 })
        .withMessage("Title field should not be empty and less than 3 characters"),
    body('time').not().isEmpty()
        .withMessage("Time field should not be empty")
],  async (req, res) => {

    let all_errors = validationResult(req)
    if (!all_errors.isEmpty()){
        let empty_title_error = null
        let empty_time_error = null
        task = await Task.findByPk(req.params.id)
        
        const errors = all_errors.array()
        for (error of errors){
            if (error.param == 'title'){
                empty_time_error = error.msg
            }
            else {
                empty_time_error = error.msg
            }
        }
        res.render('update', {
            task: task,
            empty_title_error : empty_title_error,
            empty_time_error : empty_time_error
        })
    }
    else {
        //as checkbox returns 'on/off', resetting to true/false
        if (req.body.done == 'on') {
            req.body.done = true
        }
        else {
            req.body.done = false
        }

        try{
            let updated_task = await Task.update({
                title: req.body.title,
                comment: req.body.comment,
                time: req.body.time,
                done: req.body.done,
            }, {
                where: { 
                    id: req.params.id
                }
            })
            res.redirect(`/retrieve/${req.params.id}`)
        }
        catch (error){
            return res.status(400).jsonp(error)
        }
    }
})


app.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log('Server is running on port 3000 ...')
})
