'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * File Schema
 */
var FileSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
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

mongoose.model('File', FileSchema);