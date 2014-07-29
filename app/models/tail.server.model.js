'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tail Schema
 */
var TailSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	command: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tail', TailSchema);