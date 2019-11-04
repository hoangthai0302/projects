var Q = require('q');
var fs = require('fs');
const trash = require('trash');

module.exports = {
  loadFile:function(filePath){
  	var defer = Q.defer();

	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
	    if (!err){
		    defer.resolve(data);
	    }else{
	    	defer.reject(err);
	        console.log(err);
	    }
	});
	return defer.promise;
  },
  createFolder:function(path){
  	var defer = Q.defer();
	
  	if (!fs.existsSync(path)){
	    fs.mkdir(path,function(err){
	    	if(err){
	    		defer.reject(err);
	    	}else{
	    		console.log("create Folder success:"+path);
	    		defer.resolve();
	    	}

	    });
	}
	return defer.promise;
  },

  createNewEmptyFile:function(path){
  	var defer = Q.defer();
	var content = '';
	
	fs.writeFile(path, content, function (err,data) {
	  if (err) {
	    defer.reject(err);
	  }else{
	  	console.log("createFile success:"+path);
	  	defer.resolve();
	  }
	});

	return defer.promise;
  },

  saveFile:function(path, newContent){
  	var defer = Q.defer();

  	fs.truncate(path, 0, function() {
	    fs.writeFile(path, newContent, function (err) {
	        if (err) {
	            console.log("Error writing file: " + err);
	            defer.reject(err);
	        }else{
	        	console.log(" writing file success");
	        	defer.resolve();
	        }
	        
	    });
	});

	return defer.promise;
  },
  removeFile:function(path){
  	return trash([path]);

	/*var defer = Q.defer();

	path = path;
  	
  	fs.unlink(path, (err) => {
	  if (err) {
	  	defer.reject(err);
	  }else{
	  	console.log('successfully deleted ' + path);
	  	defer.resolve();
	  }
	  
	});
	return defer.promise;	
	*/
	
  }
};

