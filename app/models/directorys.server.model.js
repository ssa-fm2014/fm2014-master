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
	serverId: {
		type: String,
		trim: true,
		required: 'server id cannot be blank'
	},
	path: {
		type: String,
		trim: true,
		required: 'path cannot be blank'
	},
	cuser: {
		type: String,
		trim: true
	},
	cdate: {
		type: String
	},
	comments: {
		type: String,
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Directory', DirectorySchema);