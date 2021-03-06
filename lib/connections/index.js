var Bunyan = require("bunyan");
var Mongoose = require("mongoose");

var AuthorizationBasic = require("../security/authentication-basic");
var AuthorizationToken = require("../security/authentication-token");

var JIRAConnection = require("../jira/connection.js");
var ServiceNowConnection = require("../serviceNow/connection.js");
var GITLabConnection = require("../gitlab/connection.js");


var DEFAULT_RequestSettings = {
	"maxRetries": 3
};

var DEFAULT_EndpointSettings = {
	"listen": 7000
};

/**
 * 
 * @module Connections
 * @main
 */

/**
 * 
 * @class Connect
 * @constructor
 * @static
 * @param {Object} settings Object providing references to needed settings to initialize the various connections and listeners.
 */
module.exports.Connect = function(settings) {
	var configuration = this;
	var loading;

	var buildAuthentication = function(details) {
		switch(details.type) {
			case "basic":
				return new AuthorizationBasic(details.username, details.password);
			case "token":
				return new AuthorizationToken(details.field, details.token, details.path);
			default:
				throw new Error("Unknown authentication type");
		}
	};

	/**
	 * The package.json information
	 * @property package
	 * @type Object
	 */
	configuration.package = require("../../package.json");

	/**
	 * Configuration settings for manage requests out to systems.
	 * @property request
	 * @type Object
	 */
	configuration.requests = DEFAULT_RequestSettings;
	if(settings.requests) {
		Object.assign(configuration.requests, settings.request);
	}

	/**
	 * Configuration settings for the REST endpoint. Only configured if endpoint is defined in settings.
	 * @property endpoint
	 * @type Object
	 */
	if(settings.endpoint) {
		configuration.endpoint = DEFAULT_EndpointSettings;
		if(settings.requests) {
			Object.assign(configuration.endpoint, settings.endpoint);
		}
	}

	/**
	 * 
	 * @property log
	 * @type Bunyan
	 */
	if(settings.log) {
		configuration.log = settings.log;
		configuration.log.name = configuration.log.name || configuration.package.name;
		configuration.log.version = configuration.log.version || configuration.package.version;
		configuration.log = Bunyan.createLogger(configuration.log);
	}

	/**
	 * 
	 * @property log
	 * @type Bunyan
	 */
	if(settings.mongo && settings.mongo.path) {
	    mongoose.Promise = global.Promise;
		configuration.mongo = mongoose.createConnection(settings.mongo.path, settings.mongo);
	}

	/**
	 * If a valid JIRA property is present on the settings object, this
	 * property is initialized as the default JIRA handler.
	 * @property jira
	 * @type JIRAConnection
	 */
	if(settings.jira && settings.jira.name && settings.jira.uri && settings.jira.authentication) {
		settings.jira.requests = configuration.requests;
		loading = buildAuthentication(settings.jira.authentication);
		configuration.jira = new JIRAConnection(settings.jira.name, settings.jira.uri, loading, configuration.log, settings.jira);
	}

	/**
	 * If a valid Service-Now property is present on the settings object, this
	 * property is initialized as the default Service-Now handler.
	 * @property servicenow
	 * @type ServiceNowConnection
	 */
	if(settings.servicenow && settings.servicenow.name && settings.servicenow.uri && settings.servicenow.authentication) {
		settings.servicenow.requests = configuration.requests;
		loading = buildAuthentication(settings.servicenow.authentication);
		configuration.servicenow = new ServiceNowConnection(settings.servicenow.name, settings.servicenow.uri, loading, configuration.log, settings.servicenow);
	}

	/**
	 * If a valid GitLab property is present on the settings object, this
	 * property is initialized as the default GitLab handler.
	 * @property gitlab
	 * @type GITLabConnection
	 */
	if(settings.gitlab && settings.gitlab.name && settings.gitlab.uri && settings.gitlab.authentication) {
		settings.gitlab.requests = configuration.requests;
		loading = buildAuthentication(settings.gitlab.authentication);
		configuration.gitlab = new GITLabConnection(settings.gitlab.name, settings.gitlab.uri, loading, configuration.log, settings.gitlab);
	}
};

/**
 * 
 * @class AuthorizationBasic
 */
module.exports.AuthorizationBasic = AuthorizationBasic;
/**
 * 
 * @class AuthorizationToken
 */
module.exports.AuthorizationToken = AuthorizationToken;

/**
 * JIRA Connection constructor
 * @class JIRAConnection
 */
module.exports.JIRA = JIRAConnection;
/**
 * Service-Now Connection constructor
 * @class ServiceNowConnection
 */
module.exports.ServiceNow = ServiceNowConnection;
/**
 * GITLab Connection constructor
 * @class GITLabConnection
 */
module.exports.GITLab = GITLabConnection;
