'use strict';

/**
 * Module dependencies.
 */
var  mongoose = require('mongoose'),
	 Tail = mongoose.model('Tail'),
     sys = require('sys'),
	 execCommand = require('child_process').exec,
	 spawn = require('child_process').spawn,
	 tailF = require('tail').Tail,
	 fs =require('fs'),
	 Iconv = require('iconv').Iconv,
	 spawn = require('child_process').spawn,
	 Connection = require('ssh2')
	 ;


/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Article already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};


var openConnections = [];

exports.execute = function(req, res) {
	console.log('exports.tail controller START');

	// console.log(req.query);

	req.socket.setTimeout(Infinity);


    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

	var connectionForm = {};
	connectionForm.res = res;
	connectionForm.req = req;

	// console.log(connectionForm);

    openConnections.push(connectionForm);

    req.on('close', function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j].res === res) {
                toRemove =j;
                break;
            } 
        }
        openConnections.splice(j,1);
        console.log(openConnections.length);
    });
};


var executeTail = function(conn, res, req, serverid, path) {
	console.log('executeTail function START');

	// console.log(req.query);

	req.socket.setTimeout(Infinity);


    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

	var connectionForm = {};
	connectionForm.res = res;
	connectionForm.req = req;
	connectionForm.conn = conn;
	connectionForm.serverid = serverid;
	connectionForm.path = path;

	// console.log(connectionForm);

    openConnections.push(connectionForm);

    req.on('close', function() {
        var toRemove;
        for (var j =0 ; j < openConnections.length ; j++) {
            if (openConnections[j].res === res) {
                toRemove =j;
                break;
            } 
        }
        openConnections.splice(j,1);
        console.log(openConnections.length);
    });
};

var readFile = function(connectionForm){

	console.log('readFile called!!');
	var tailObject = {};
	var res = connectionForm.res;
	var req = connectionForm.req;
	var conn = connectionForm.conn;

	var startPoint = 0;
	var lastPoint = 0;

	if(req.body.totalSize !== 0 && req.body.totalSize !== undefined){
		startPoint = req.body.totalSize;
	}

	console.log('req.bufferSize : ' + req.bufferSize);
	startPoint = req.bufferSize;

	console.log('req.count : ' + req.count);
	if(req.count === undefined){
		req.count = 0;
	}else{
		req.count += 1;
	}

	if(conn === undefined){
		return;
	}

	conn.sftp(function(err, sftp){
		if (err) {
			console.log(err);
			// throw err;
		}
		sftp.open(connectionForm.path+'/test.log', 'r', function(err, fd) {
		    sftp.fstat(fd, function(err, stats) {
		 	
		        var bufferSize=stats.size,
		            chunkSize=1024,
		            buffer=new Buffer(bufferSize),
		            bytesRead = 0,
		            position = bufferSize - 1024;

	            lastPoint = bufferSize;
	            console.log('bufferSize : ' + bufferSize);
	            console.log('connectionForm.path : ' + connectionForm.path);

	            if(req.count === 4){
					console.log('8번째 접속, conn 재요청');

					tailObject.position = lastPoint;
					tailObject.stats = 'RC';
					conn.end();
					connectionForm.res.write('data: '+JSON.stringify(tailObject)+'\n\n');
					connectionForm.res.flush();
				}

	            if(position < 0){
	            	position = 0;
	            }
	            console.log('position 2: ' + position);

		        if(startPoint !== 0 && startPoint !== undefined){
		        	position = startPoint ;
		        }         

		        tailObject.totalSize = bufferSize;
	            console.log('bufferSize : ' + bufferSize);
	            console.log('position : ' + position);

	            req.bufferSize = bufferSize;

	            console.log(position === bufferSize);
	            if(position === bufferSize){
	            	console.log('postion == bufferSize');
	            	tailObject.stats = 'NC';
	            	connectionForm.res.write('data: '+JSON.stringify(tailObject)+'\n\n');
					connectionForm.res.flush();
	            }

		        while (bytesRead + position < bufferSize) {
		            if ((bytesRead + chunkSize) > bufferSize) {
		                chunkSize = (bufferSize - bytesRead) ;
		            }

		            console.log('req.query.grepString : ' + req.query.grepString);
		            if(req.query.grepString === 'undefined' || req.query.grepString === ''){
		            	sftp.read(fd, buffer, bytesRead, chunkSize, position, readFileCallBack);
		            }
		            else
		            {
		            	sftp.read(fd, buffer, bytesRead, chunkSize, position, readFileGrepCallBack);
		            }
	            	
		            bytesRead += chunkSize;
		            position += chunkSize;

		        }
		    	sftp.close(fd);
		    });
		});
    });	



	var position = 0;

	var totalString = '';

	var readFileCallBack = function(err, bytesRead, buffer, position){
		if (err) console.log('err : ' +  err);

		console.log('readFileCallBack Called !! ');	
		console.log('buffer : ' + buffer);

		totalString += buffer.toString('utf8', position, bytesRead); 
		position += bytesRead;

		tailObject.totalString = totalString;

        var lines = totalString.split('\n');
        lines.pop();
        lines.forEach(function (line) {
			tailObject.stats = 'Succ';
			tailObject.totalString = line;
			connectionForm.res.write('data: '+JSON.stringify(tailObject)+'\n\n');
			connectionForm.res.flush();

			console.log('line : ' + line);	            
        });

  //   	if(req.count === 8){
		// 	console.log('8번째 접속, conn 재요청');

		// 	tailObject.position = lastPoint;
		// 	tailObject.stats = 'RC';
		// 	conn.end();
		// 	connectionForm.res.write('data: '+JSON.stringify(tailObject)+'\n\n');
		// 	connectionForm.res.flush();


		// }else{
		// 	tailObject.stats = 'Succ';
		// 	console.log('tailObject.totalSize : ' + tailObject.totalSize);
		// 	connectionForm.res.write('data: '+JSON.stringify(tailObject)+'\n\n');
		// 	connectionForm.res.flush();
		// }

	};

	var readFileGrepCallBack = function(err, bytesRead, buffer){
		console.log('readFileGrepCallBack Called !! ');

		if (err) console.log('err : ' +  err);

		totalString += buffer.toString('utf8', position, bytesRead); 
		position += bytesRead;

		console.log('totalString : ' + totalString);
		// console.log(totalString.match(req.query.grepString));
		// console.log(Object.valueOf(totalString.match(req.query.grepString)));
		if(totalString.indexOf(req.query.grepString) > -1){
			tailObject.totalString = totalString;
			tailObject.position = startPoint;
			connectionForm.res.write('data: '+JSON.stringify(tailObject)+'\n\n');
			connectionForm.res.flush();
		}
	};
};

setInterval(function() {
    // we walk through each connection
    openConnections.forEach(function(connectionForm) {
    	readFile(connectionForm);
    	// readFileGrep(connectionForm);
    });
 
}, 1000);


exports.executePost = function(req, res) {
	console.log('exports.executePost controller START');
 
};


var getConnectInfo = function(sid) {
	switch(sid) {
	case 'server1':
		return {host: 'kiup.dlinkddns.com',port: '7011',username: 'kiup',password: 'kiup1234'};
	case 'server2':
		return {host: 'kiup.dlinkddns.com',port: '7013',username: 'kanghyuk',password: 'abcd1234'};
	case 'server3':
		return {host: 'kiup.dlinkddns.com',port: '7015',username: 'kihoon',password: 'kihoon1234'};
	default :
		return {host: 'kiup.dlinkddns.com',port: '7011',username: 'kiup',password: 'kiup1234'};
	}
};


var parseResult = function(serverid, path, data) {
	var datasplits = [];
	var str='';
	for(var i=0; i<data.length; i++) {
		if(data[i] === '\n'){
			datasplits.push(str);
			str = '';
		}
		else{
			str += data[i];
		}
	}
	
	var result = [];
	if(path !== '/') {
		result.push({'name' : '..', 'path' : path+'..', 'server' : serverid});
		path += '/';
	}
	
	for(var k=0; k<datasplits.length; k++) {
		if(datasplits[k].charAt(0) !== 'd' && datasplits[k].charAt(7) === 'r') {
			var dirinfo = datasplits[k].split(' ');
			var dirName = dirinfo[dirinfo.length -1];
			result.push({'name' : dirName, 'path' : path+dirName, 'server' : serverid});
		}
	}


	return result;
};


var getFileList = function(conn, res, req, serverid, path) {
	console.log('getFileList : path : '  + path);
	var command = 'ls -l '+path;
	conn.exec(command, function(err, stream) {
		if (err) throw err;
		stream.on('data', function(data) {
			console.log('tailController');
			res.jsonp(parseResult(serverid, path, data.toString()));
		}).stderr.on('data', function(data) {
			console.log('STDERR: ' + data);
		});
	});
};

var tailingFile = function(conn, res, req, serverid, path) {
	executeTail(conn, res, req, serverid, path);
};

var tailController = function(conn, res, req, serverid, path) {

	console.log('tailController function');
	var fileName = req.param('fileName');
	console.log('fileName : ' + fileName);

	if(fileName === 'undefined' || fileName === '' || fileName === undefined){
		console.log('fileName is undefined');
		console.log('get file list');
		getFileList(conn, res, req, serverid, path);
	}else{
		console.log('fileName is exist');
		console.log('get Tail');
		tailingFile(conn, res, req, serverid, path);
	}
};


var connect = function(res, req, serverid, path) {
	var connection = new Connection();
	connection.on('connect', function() {
		console.log('Connection :: connect');
	});
	connection.on('ready', function() {
		console.log('Connection :: ready');
		
		tailController(connection, res, req, serverid, path);
	});
	connection.on('error', function(err) {
		console.log('Connection :: error :: ' + err);
	});
	connection.connect(getConnectInfo(serverid));
	return connection;
};

var connectionMap = {};
var connectionFactory = function(res, req, serverid, path) {
	var con = connectionMap[serverid];
	
	if(con === null || con === undefined) {
		console.log('new connect..');
		var connection = connect(res, req, serverid, path);
		connectionMap[serverid] = connection;
	}
	else {
		console.log('old connect..');
		tailController(con, res, req, serverid, path);
	}
};
/**
 * List of Directorys
 */
exports.list = function(req, res) {
	console.log('this is list exports');
	var serverid = req.param('sid');
	var path = req.param('path');
	
	if(path === null || path === undefined) {
		path = '/';
	}
	if(path.indexOf('..') > 0) {
		var paths = path.split('/');
		paths.pop();
		path = '/' + paths.join('/');
	}
	
	connectionFactory(res, serverid, path);
};

var getConnect = function(req, res) {
	console.log('this is list function');
	var serverid = req.param('sid');
	var path = req.param('path');
	
	if(path === null || path === undefined) {
		path = '/';
	}
	if(path.indexOf('..') > 0) {
		var paths = path.split('/');
		paths.pop();
		path = '/' + paths.join('/');
	}
	
	connectionFactory(res, req, serverid, path);
};


exports.controll = function(req, res) {
	getConnect(req, res);
};

exports.tailByID = function(req, res, next, id) {
	Tail.findById(id).populate('user', 'displayName').exec(function(err, tail){
		if(err){ return next(err);}
		if(!tail){ return next(new Error('Failed to load tail ' + id));}
		req.tail = tail;
		next();
	});
};
