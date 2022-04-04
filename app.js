let express = require('express');
let app = express();
let { body, validationResult } = require('express-validator');
let db = require('./database');
let Task = require('./models');
let tasks = require('./routes/tasks');

PORT = 3000

db.sync({force: false }).then(() => 'DB initted...');

//middlewares 
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'pug');

//route tasks/
app.use("/tasks", tasks);


//getting all/done/undone tasks
app.get('/', async (req, res) => {
    done = req.query.done;
    
    if (req.query.done){ 
        //if there's a query parameter
        done = req.query.done; //done comes as a string
        var bool_done = (done == 'true') //making it boolean 

        Task.findAll({where: {done: bool_done}}).then(function (list) {
            res.render('index', { tasks: list }) //returning results of findAll()
        })
    }
    else {
        let tasks = null
        //using try/catch to handle possible erors
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


//creating a new task
app.post('/create', [
    //form validation
    body('title').exists().isLength({ min: 3 })
        .withMessage("Title field should not be empty and less than 3 characters"),
    body('time').not().isEmpty()
        .withMessage("Time field should not be empty")
], async (req, res) => {

    let all_errors = validationResult(req)
    if (!all_errors.isEmpty()){ //if there will be an error
        //possible errors
        let empty_title_error = null
        let empty_time_error = null
        const errors = all_errors.array()
    
        for (error of errors){
            if (error.param == 'title'){
                empty_time_error = error.msg
            }
            else {
                empty_time_error = error.msg
            }
        }
        //render the same form with error message
        res.render('create', { 
            empty_title_error : empty_title_error,
            empty_time_error : empty_time_error
        })
    }
    else {
        //if no errors, create a new task
        let task = await Task.create(req.body)
        res.redirect('/')
    }
})


//updating the task
app.post('/update/:id', [
    //form validation
    body('title')
        .isLength({ min: 3 })
        .withMessage("Title field should not be empty and less than 3 characters"),
    body('time').not().isEmpty()
        .withMessage("Time field should not be empty")
],  async (req, res) => {

    let all_errors = validationResult(req)
    if (!all_errors.isEmpty()){ //if there's error
        //possible errors
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
        //rendering update page with error
        res.render('update', {
            task: task,
            empty_title_error : empty_title_error,
            empty_time_error : empty_time_error
        })
    }
    else {
        //as checkbox returns 'on/off', resetting to true/false
        //because done is boolean field
        if (req.body.done == 'on') {
            req.body.done = true
        }
        else {
            req.body.done = false
        }
        //using try/catch to handle the erors
        try{
            await Task.update({
                title: req.body.title,
                comment: req.body.comment,
                time: req.body.time,
                done: req.body.done,
            }, {
                where: { 
                    id: req.params.id
                }
            })
            res.redirect(`/tasks/retrieve/${req.params.id}`)
        }
        catch (error){
            return res.status(400).jsonp(error)
        }
    }
})


app.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log(`Server is running on port ${PORT} ...`)
})
