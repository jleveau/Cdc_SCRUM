var mongoose = require('mongoose');

var users = new mongoose.Schema({
	username: String,
	mail: String,
	password: String,
	image: Buffer,
	first_name: String,
	last_name: String,
	followed_projects: [{ type : Number, ref: 'projects' }],
	date_created: Date, 
	date_updated: Date
});

var projects = new mongoose.Schema({
	member_list: [{ type : Number, ref: 'users' }],
	name_project: String,
	specification: Buffer,
	product_owner: { type : Number, ref: 'users' },
	github: String,
	status: String, 
	date_start: Date,
	description: String,
	sprint_duration: Number,
	date_created: Date, 
	date_updated: Date
});

var sprints = new mongoose.Schema({
	date_start: Date,
	date_end: Date,
	number_sprint: Number,
	project: { type : Number, ref: 'projects' },
	date_created: Date, 
	date_updated: Date	
});

var userstories = new mongoose.Schema({
	number_us: Number,
	id_project: { type : Number, ref: 'projects' },
	description: String,
	state: String,
	commit_validation: String,
	date_validation: Date, 
	priority: Number,
	estimated_cost: Number,
	sprint: { type : Number, ref: 'sprint' },
	date_created: Date, 
	date_updated: Date
});

var tasks = new mongoose.Schema({
	description: String,
	date_start: Date,
	date_end: Date,
	estimated_cost: Number,
	estimated_duration: Number,
	responsable: { type : Number, ref: 'users' },
	state: String,
	list_us: [{ type : Number, ref: 'userstories' }],
	list_tasks_depend : [{ type : Number, ref: 'tasks' }],
	date_created: Date, 
	date_updated: Date
});

module.exports = mongoose.model('users', users);
module.exports = mongoose.model('projects', projects);
module.exports = mongoose.model('userstories', userstories);
module.exports = mongoose.model('sprints', sprints);
module.exports = mongoose.model('tasks', tasks);



