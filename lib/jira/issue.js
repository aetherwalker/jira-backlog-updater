

var format = require("dateformat");
var Release = require("./release");

var pointField = "customfield_10006";
var roadmapField = "customfield_12700";
var oldRoadmapField = "customfield_10101";
var repoField = "customfield_10305";

/**
 * 
 * @class Issue
 * @constructor
 * @property {Object} details
 */
module.exports = function(details) {
	var issue =  this;

	/**
	 * Original 
	 * @property _detail
	 * @private
	 * @type Object
	 */
	var _detail = details;
	//	this._detail = details;

	/**
	 * 
	 * @property id
	 * @type String
	 */
	this.id = details.id;

	/**
	 * 
	 * @property points
	 * @type String
	 */
	this.points = details.fields[pointField];

	/**
	 * 
	 * @property isselinks
	 * @type Array | > | LinkDescriptions
	 */
	this.issuelinks = details.issuelinks;

	/**
	 * 
	 * @property self
	 * @type String
	 */
	this.self = details.self;
	
	this.repository = {};
	if(details.fields[repoField]) {
		try {
			/**
			 * 
			 * @property repository.uri
			 * @type String
			 */
			this.repository.uri = details.fields[repoField];
			this.repository.uri = this.repository.uri.split("|");
			
			/**
			 * 
			 * @property repository.branch
			 * @type String
			 */
			this.repository.branch = this.repository.uri[1].trim();
			this.repository.uri = this.repository.uri[0].trim();
		} catch(exception) {
			console.warn("Malformed Repository field[" + details.key + "]: " + details.fields[repoField]);
		}
	}

	/**
	 * 
	 * @property self
	 * @type String
	 */
	this.self = details.self;

	/**
	 * 
	 * @property key
	 * @type String
	 */
	this.key = details.key;

	/**
	 * 
	 * @property issue
	 * @type String
	 */
	this.issue = details.fields.issue;

	/**
	 * 
	 * @property timespent
	 * @type String
	 */
	this.timespent = details.fields.timespent;

	/**
	 * 
	 * @property project
	 * @type String
	 */
	this.project = details.fields.project;

	/**
	 * 
	 * @property fixVersions
	 * @type String
	 */
	this.fixVersions = details.fields.fixVersions;
	if(this.fixVersions && this.fixVersions.length) {
		for(var x=0;x<this.fixVersions.length;x++) {
			issue.fixVersions[x] = new Release(issue.fixVersions[x]);
			issue.fixVersions[x].issues.push(issue);
		}
	}
	this.fixVersions = this.fixVersions || [];
	this.releases = this.fixVersions;

	/**
	 * 
	 * @property labels
	 * @type String
	 */
	this.labels = details.fields.labels;

	/**
	 * 
	 * @property issuelinks
	 * @type String
	 */
	this.issuelinks = details.fields.issuelinks;

	/**
	 * 
	 * @property assignee
	 * @type String
	 */
	this.assignee = details.fields.assignee;

	/**
	 * 
	 * @property summary
	 * @type String
	 */
	this.summary = details.fields.summary;

	/**
	 * 
	 * @property description
	 * @type String
	 */
	this.description = details.fields.description;

	/**
	 * 
	 * @property timeestimate
	 * @type String
	 */
	this.timeestimate = details.fields.timeestimate;

	/**
	 * 
	 * @property priority
	 * @type String
	 */
	this.priority = details.fields.priority;

	/**
	 * 
	 * @property duedate
	 * @type Number
	 */
	this.duedate = details.fields.duedate;
	if(this.duedate) {
		this.duedate = new Date(this.duedate).getTime();
	}

	/**
	 * 
	 * @property roadmapdate
	 * @type Number
	 */
	this.roadmapdate = details.fields[roadmapField];
	if(this.roadmapdate) {
		this.roadmapdate = new Date(this.roadmapdate).getTime();
	}

	/**
	 * Descriptions of exceptions found such as dependency order violations.
	 * @property exceptions
	 * @type Array | > | String
	 */
	this.exceptions = [];

	/**
	 * Get the original JSON returned by JIRA describing this issue.
	 * @method getOriginal
	 * @return {Object}
	 */
	this.getOriginal = function() {
		return details;
	};
	
	/**
	 * 
	 * @method toSave
	 * @return {Object}
	 */
	this.toSave = function() {
		var tmp, saving = {
			"key": issue.key,
			"id": issue.id,
			"fields": {}
		};

		saving["fields"][roadmapField] = issue.roadmapdate;
		if(saving["fields"][roadmapField]) {
			var d = new Date(saving["fields"][roadmapField]);
			saving["fields"][roadmapField] = format(d, "yyyy-mm-dd") + "T07:00:00.000-0500";// + format(d, "hh:MM:ss.lo");
			//saving["fields"][oldRoadmapField] = saving["fields"][roadmapField];
			//saving.fields.duedate = format(d, "yyyy-mm-dd") + "T" + format(d, "hh:MM:ss.lo");
			console.log("Save Roadmap[" + saving.key + "]: " + saving["fields"][roadmapField]);
		}
//		saving.fields.duedate = issue.roadmapdate;
//		saving["fields"][roadmapField] = null;

		return saving;
	};
	
	
	this.getOriginal = function() {
		return _detail;
	};
};
