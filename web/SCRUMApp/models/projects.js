var mongoose = require('mongoose');
var schema = require("./scrumdb");
var Project  = mongoose.model('projects');
var UserProject = mongoose.model('user_project');
var User = mongoose.model('users');
var ObjectId = mongoose.Types.ObjectId;

//GET - Return all projects in the DB
module.exports.findAllProjects = function(req, res) {
    Project.find(function(err, projects) {
        if(err) res.send(500, err.message);
        console.log('GET /projects')
        res.status(200).jsonp(projects);
    });
};

//GET - Return a Project with specified ID
module.exports.findById = function(req, res) {
    Project.findById(req.params.id)
        .populate('member_list')
        .populate('product_owner')
        .exec(function(err, project) {
         if(err) return res.send(500, err.message);

    	console.log('GET /project/' + req.params.id);
	    res.status(200).jsonp(project);
    });
};

//POST - Insert a new Project in the DB
module.exports.addproject = function(req, res) {
    console.log('POST');
    var project = new Project(req.body.project);

    project.save(function(err, project) {
	if(err) return res.send(500, err.message);
        var user_project = new UserProject({_idUser : req.body.user,
                                            _idProject : project._id});
        user_project.save(function(err,user_project){
            return res.status(200).jsonp(project);
        });
    });

};

//PUT - Update a register already exists
module.exports.updateProject = function(req, res) {
    Project.findById(req.params.id, function(err, project) {

        project.name = req.body.name;
        project.specification = req.body.specification;
        project.github = req.body.github;
        project.status = req.body.status;
        project.date_start = req.body.date_start;
        project.description = req.body.description;
        project.sprint_duration = req.body.sprint_duration;
        project.date_updated = Date.now();
        project.save(function(err) {
        if(err) return res.send(500, err.message);
            res.status(200).jsonp(project);
        });
    });
};

//DELETE - Delete a Project with specified ID
module.exports.deleteProject = function(req, res) {
	Project.findById(req.params.id, function(err, project) {
	    project.remove(function(err) {
            UserProject.remove({'_idProject' : req.params.id},function(err,user_projects){
                if(err) return res.send(500, err.message);
                res.send(200);
            });
	    })
	});
};


// GET - Return all projects Publics in the DB
module.exports.findProjectsPublics = function(req, res) {
	Project.find({
		'status' : 'public'
		}, function (err, projects){
			if(err) return res.send(500, err.message);
			return res.status(200).jsonp(projects);
		}
)};

//PUT - Update product_owner
module.exports.updatePOproject = function(req, res) {
    Project.findById(req.params.id, function(err, project) {
	project.product_owner = req.body.product_owner;
	project.date_updated = Date.now();
    project.save(function(err) {

        if(err) return res.send(500, err.message);
            res.status(200).jsonp(project);
        });
    });
};

//PUT - Update member_list
module.exports.updateListMemberProject = function(req, res) {
    Project.findById(req.params.id, function(err, project) {
        project.member_list = req.body.member_list;
        project.date_updated = Date.now();
        project.save(function(err) {

            UserProject.find({'_idProject' : project.id},function(err, user_projects){
                var member_to_add = project.member_list.filter(function(member){
                    return !user_projects.some(function(user_project){
                        return String(member) == String(user_project._idUser);
                   });
                });
                for (new_member of member_to_add) {
                    var user_project = new UserProject({
                        '_idProject': project.id,
                        '_idUser': new_member
                    });
                    user_project.save(function (err, user_project) {
                    });
                }
                if(err) return res.send(500, err.message);
                res.status(200).jsonp(project);
            });

        });
    });
};