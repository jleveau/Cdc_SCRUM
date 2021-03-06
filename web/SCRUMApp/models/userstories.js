var mongoose = require('mongoose');
var schema = require("./scrumdb");
var Userstory = mongoose.model('userstories');
var UserstoriesTasks = mongoose.model('userstories_tasks');
var Tasks = mongoose.model('tasks');
var Sprints = mongoose.model('sprints');
var Notification = mongoose.model('notifications');
var ObjectId = mongoose.Types.ObjectId;

//GET - Return all userstories in the DB
module.exports.findAllUserstories = function (req, res) {
    Userstory.find(function (err, userstories) {
        if (err) res.send(500, err.message);
        console.log('GET');
        res.status(200).jsonp(userstories);
    });
};

/**
 * return user story by his ID
 * @param req
 * @param res
 */
module.exports.findUsById = function (req, res) {
    Userstory.findById(req.params.id)
		.populate('sprint')
        .exec (function (err, usersotory) {
        if (err) res.status(500).send(err.message);
        res.status(200).jsonp(usersotory);
    });
};

//GET - Return all tasks for a userstory
module.exports.findUserstoryTasks = function (req, res) {
    var userstory_id = req.params.id;
    Userstory.findById(req.params.id, function (err, userstory) {
        if (err) res.send(500, err.message);
        if (!userstory) res.send(400, "no userstory for id " + userstory_id);
        UserstoriesTasks.find({'_idUserstory': userstory_id}, function (err, userstory_tasks) {
            var tasks = [];
            if (userstory_tasks.length == 0)
                res.send(200, []);
            for (userstory_task of userstory_tasks) {
                Tasks.findById(userstory_task._idTasks, function (err, task) {
                    if (err) res.send(500, err.message);
                    if (err) console.log(err.errors);
                    tasks.push(task);
                    if (userstory_tasks.length == tasks.length) {
                        res.send(200, tasks);
                    }
                });
            }
        });
    });
};


//GET - Return a userstory with specified project_ID
module.exports.findByIdProject = function (req, res) {
    console.log('Ctrl GET/' + req.params.id);
    Userstory.find({'id_project': req.params.id})
        .populate('sprint')
        .exec(function (err, userstories) {
            if (err) return res.send(500, err.message);
            return res.status(200).jsonp(userstories);
        });
};


//POST - Insert a new userstory in the DB
module.exports.addUserstory = function (req, res) {
    Userstory.find({
            'id_project': req.body.idProject
        }, function (err, userstories) {
            if (err) return res.send(500, err.message);

            var USnumber = 1;
            if (!userstories.length == 0) {
                for (us of userstories) {
                    if (us.number_us && us.number_us > USnumber)
                        USnumber = us.number_us;
                }
                USnumber = USnumber + 1;
            }
            var userstory = new Userstory({
                number_us: USnumber,
                id_project: req.body.idProject,
                description: req.body.userstory.description,
                cost: req.body.userstory.cost,
                priority: req.body.userstory.priority,
                sprint: req.body.userstory.sprint,
                testValidation: req.body.userstory.testValidation
            });

            userstory.save(function (err, userstory) {
                if (err) return res.status(500).send(err.message);

                var generateTasksTitle = ['Code Tests', 'Execute Tests'];
                var generateTasksDesc = ['This task is auto-genated for coding Tests', 'This task is auto-genated for execute Tests'];

                if (userstory.testValidation) {
                    for (var i = 0; i < 2; i++) {
                        var task = new Tasks({
                            id_project: req.body.idProject,
                            title: generateTasksTitle[i],
                            description: generateTasksDesc[i],
                            sprint: req.body.userstory.sprint,
                            list_us: [userstory._id],
                            number_task: i + 1
                        });
                        task.save(function (err, task) {
                            if (err) return res.status(500).send(err.message);
                        });
                    }
                }
                return res.status(200).jsonp(userstory);
            });
        }
    );
};

//PUT - Update a register already exists
module.exports.updateUserstory = function (req, res) {
    Userstory.findById(req.body.idUS, function (err, userstory) {
        if (err) return res.status(500).send(err.message);
        userstory.description = req.body.userstory.description;
        userstory.cost = req.body.userstory.cost;
        userstory.priority = req.body.userstory.priority;
        userstory.sprint = req.body.userstory.sprint;
        userstory.date_updated = new Date();
        userstory.save(function (err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(userstory);
        });
    });
};

//PUT - Update the Cost of US
module.exports.updateCostUS = function (req, res) {
    console.log('updateCostUS: ' + req.params.cost);
    Userstory.findById(req.params.id, function (err, userstory) {
        if (err) return res.status(500).send(err.message);
        userstory.cost = req.params.cost;
        userstory.date_updated = new Date();
        userstory.save(function (err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(userstory);
        });
    });
};

//PUT - Update the Priority of US
module.exports.updatePriorityUS = function (req, res) {
    console.log('-updatePriorityUS ' + req.params.priority);
    Userstory.findById(req.params.id, function (err, userstory) {
        if (err) return res.status(500).send(err.message);
        userstory.priority = req.params.priority;
        userstory.date_updated = new Date();
        userstory.save(function (err) {
            if (err) return res.send(500, err.message);
            res.status(200).jsonp(userstory);
        });
    });
};

//PUT - Update the commit validation of US
module.exports.updateValidationUS = function (req, res) {
    Userstory.findById(req.params.id, function (err, userstory) {
        if (err) return res.status(500).send(err.message);
        userstory.commit_validation = req.params.commit;
        userstory.state = 'Valid';
        userstory.date_updated = new Date();
        userstory.date_validation = new Date();
        userstory.save(function (err) {
            if (err) return res.send(500, err.message);
            
            Userstory.find({
                'sprint': userstory.sprint,
                'state' : 'Not Valid'
            }, function (err, userstory_nv) {
                if (err) return res.send(500, err.message);
                if(userstory_nv.length < 1 ){
                    //Sprint Validation
                    Sprints.findById(userstory.sprint, function(err, sprint){
                        if (err) return res.status(500).send(err.message);
                        sprint.date_validation = new Date();
                        sprint.date_updated = new Date();
                        sprint.save(function (err, sprint) {
                            //Create notification for sprint Validation
                            if (err) return res.send(500, err.message);
                        });
                    });         
                }
            });
            res.status(200).jsonp(userstory);
        });
    });
};


//DELETE - Delete a userstory with specified ID
module.exports.deleteUserstory = function (req, res) {
    console.log('DELETE US ');
    Userstory.findById(req.params.id_us, function (err, userstory) {
        userstory.remove(function (err) {
            if (err) return res.send(500, err.message);
            res.sendStatus(200);
        })
    });
};