'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * File Schema
 */
var DirectorySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	ip: {
		type: String,
		default: '',
		trim: true,
		required: 'server ip cannot be blank'
	},
	port: {
		type: String,
		default: '',
		trim: true,
		required: 'server port cannot be blank'
	},
	path: {
		type: String,
		default: '',
		trim: true,
		required: 'path cannot be blank'
	},
	minute: {
		type: String,
		default: '*',
		trim: true
	},
	hour: {
		type: String,
		default: '*',
		trim: true
	},
	day: {
		type: String,
		default: '*',
		trim: true
	},
	month: {
		type: String,
		default: '*',
		trim: true
	},
	week: {
		type: String,
		default: '*',
		trim: true
	},
	command: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Directory', DirectorySchema);