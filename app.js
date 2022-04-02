let express = require('express');
let app = express();
let { body, validationResult } = require('express-validator');

let db = require('./database');
let Task = require('./models');
db.sync({force: false }).then(() => 'DB initted...');


app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'pug');
//uncomment when there are static files
//app.use('/static', express.static('public'))
//app.use("/tasks", tasks);


app.get('/', async (req, res) => { //is for getting all tasks
    let tasks = null
    try {
        tasks = await Task.findAll()
        
        //let id = req.query.id != undefined ? req.query.id : undefined 
        //let deleted = req.query.deleted == 'true' ? true : false
        //let updated = req.query.updated == 'true' ? true : false
        res.render('index', { tasks: tasks })
    } catch {
        tasks = []
        res.render('index', { tasks: tasks })
    }
})


app.get('/retrieve', async (req, res) => { //for getting task with query param
    task_id = req.query.id
    let task = null
    try {
        task = await Task.findByPk(task_id)
        res.render('retrieve', { task: task })

    } catch {
        task = []
        res.render('retrieve', { task: task })
    }
})

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


app.get('/new-task', async (req, res) => {
    res.render('create')
})


app.post('/create-task', async (req, res) => {
    let form = req.body
    
    //body('title').isLength({ min:1 })
    //body('complete_time').isAfter(Date.now())

    let task = await Task.create(form)
    res.redirect(`/retrieve/?id=${ task.id }`)
})


app.listen(3000, (err) => {
    if (err) console.log(err)
    console.log('Server is running on port 3000 ...')
})
