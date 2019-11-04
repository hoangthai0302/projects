var Q 		= require('q');
var path 	= require('path');
var fs 		= require('fs');

var IOUtils = {
	loadDirTree:function(dirPath) {
      
        var self 	= this;
        var stats 	= fs.lstatSync(dirPath),
        info = {
            name:path.basename(dirPath)
        }
        if(dirPath == '/Users/hoangthai') {
        	info.path = dirPath;
        }
            

        if (stats.isDirectory() && info.name.indexOf('node_modules') == -1 
                && info.name.indexOf('bower_components') == -1
                && info.name != 'bin'
                && info.name != 'build'
                && info.name != 'classes'
                && (
                    dirPath == '/Users/hoangthai'                      ||
                    dirPath.startsWith('/Users/hoangthai/Documents')  ||
                    dirPath.startsWith('/Users/hoangthai/Movies')     ||
                    dirPath.startsWith('/Users/hoangthai/Music')      ||
                    dirPath.startsWith('/Users/hoangthai/Pictures')
                    )  
                ) {
            info.type = "folder";
            info.children = fs.readdirSync(dirPath)
            .filter(item => !item.startsWith('.'))
            .map(function(child) {
                return self.loadDirTree(dirPath + '/' + child);
            });
        } else {
            // Assuming it's a file. In real life it could be a symlink or
            // something else!
            if(info.name.indexOf('node_modules') != -1){
                info.type == 'folder';
            }else{
                info.type = "file";
            }
        }

        return info;
    }
}

module.exports = IOUtils;

