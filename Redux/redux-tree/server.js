var express 	= require('express');
var	http 		= require('http');
const fs 		= require('fs');
var path 		= require('path');
var bodyParser 	= require('body-parser');

var IOUtils 	= require('./backend/services/ioUtils.js');
var Utils 		= require('./utils.js')
var FileManager = require('./backend/services/fileManager')

var app 		= express();
app.set('port',process.env.PORT || 3000);
app.use('/dist',express.static(__dirname+ '/dist'));
app.use(express.static(__dirname +'/public'));

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

app.use(bodyParser.json());

app.post('/api/saveFile',function(req,res){
	var data = req.body;
	var newContent = data.content;
	var path = data.path;
	FileManager.saveFile(path, newContent).then(function(){
		res.json({success:true});
	});
	
});

app.post('/api/file/rename',function(req,res){
	var data = req.body;
	var oldPath = data.path;
	var newName = data.newName;
	var parentFolder = Utils.getParentPath(oldPath);
	var newPath = parentFolder + '/' + newName;

	fs.rename(oldPath, newPath, function(err) {
	    if ( err ) {
	    	console.log("rename failed")
	    	res.json({success:false})
	    }else{
	    	console.log("rename success. New name:" + newName)
	    	res.json({
	    		success:true
	    	})
	    }
	});
});


app.get('/api/dirTree',function(req,res){
	var folderPath = req.query.path || '';
	var json = IOUtils.loadDirTree(folderPath);
	json.success = true;
	res.json(json);
});

//get single file content base on its path, if path is empty, load the tryit.html
app.get('/api/file',function(req,res){
	var filePath = req.query.path;
  	
	FileManager.loadFile(filePath).then(function(data){
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    res.write(data);
	    res.end();
	},function(err){
	    console.log(err);
	});
   
	
});

var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
  	var path = req.body.path;
    callback(null, path);
  },
  filename: function (req, file, callback) {
  	var path = req.body.path + "/" +file.originalname;
  	req.body.listFiles = [];
  	fs.stat(path, function(err, stat) {
	    if(err == null) {
	        var fileName = file.originalname;
	        console.log("fileName:" + fileName);
	        var index = fileName.lastIndexOf('.');
	        if(index == -1){
	        	fileName = fileName + '-' + Date.now();
	        }else{
	        	var name = fileName.substring(0,index) + '-' + Date.now();
	        	var tagName = fileName.substring(index);
	        	fileName = name + tagName;
	        }
	        req.body.listFiles.push(fileName);
	        callback(null, fileName);
	    } else if(err.code == 'ENOENT') {
	        // file does not exist
	        req.body.listFiles.push(file.originalname);
	        callback(null, file.originalname);
	    } else {
	        console.log('Some other error: ', err.code);
	    }
	});
    
  }
});
var upload = multer({ storage : storage }).array('photos',12);

app.post('/api/upload_files',function(req,res){
    upload(req,res,function(err) {
        //console.log(req.body);
        //console.log(req.files);
        if(err) {
        	console.log("upload failed");
        	console.log(err);
            return res.json({success:false})
        }
        //read list of file in uploaded folder and return the list
        var result = {success:true, files:req.body.listFiles};
		res.json(result);

        
    });
});



var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/api/upload', multipartMiddleware, function(req, res, next) {
    var file = req.files.file;
    // Tên file
    var originalFilename = file.name;
    // File type
    var fileType         = file.type.split('/')[1];
    // File size
    var fileSize         = file.size;
     // Đường dẫn lưu ảnh
    var pathUpload       = '/Users/hoangthai/Documents/upload/' + originalFilename;

    // Đọc nội dung file tmp
    // nếu không có lỗi thì ghi file vào ổ cứng
    fs.readFile(file.path, function(err, data) {
        if(!err) {
            fs.writeFile(pathUpload, data, function() {

                // Return anh vua upload
                res.json({success:true}      );          
                return;
            });

        }
    });

});

app.get('/img/:name',function(req,res){
	var path       = '/Users/hoangthai/Documents/upload/' + req.params.name;
	res.sendFile(path);
});



var server = http.createServer(app).listen(app.get('port'),function(){
	console.log('start successfully');
});

//websocket

var WebSocketServer = require('websocket').server;


// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
	console.log("A client connected");
    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});

