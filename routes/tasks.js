//const express = require('express');
//const { getTasks } = require('../businessFunctions');
// let router = express.Router();

// const database = '../data.json'

// router
//   .route("/create")
//   .post((req, res) => {
//       let form = req.body
//       if (form.issue.trim().length <= 0) {
//         res.redirect('/?received=no')
//       } else {
//         let data = getTasks(database)
        
//         let task = {
//             id: uid(),
//             name: form.name,
//             status: "undone",
//             comment: form.comment,
//             created_date: form.date
//         }
        
//         data.push(task)
        
//         fs.writeFileSync('data.json', JSON.stringify(data))
//         res.redirect(`/?received=yes&ticket=${task.id}`)
//     }
// })


// router
//   .route("/:taskid")
//   .get((req, res) =>{
//     let id = req.params.id;
//     //let task = 
//     //TODO: implement further by getting data based on
//     //id from data.json file
// })


// router
//   .route("/:taskid/update")
//   .put((req, res) =>{
//     //update task
//   })

// module.exports = router;


// router
//   .route("/:taskid/delete")
//   .delete((req, res) => {
//       //delete task
//   })

