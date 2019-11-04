var FileNameUtils = {
	isTextFile(path){
	  	var arr = ['.css', '.html', '.java', '.xml', '.txt', '.sql', '.js', '.jsx', '.json', '.svg',
	              	'.log','.md', '.jsp', '.tpl', '.scss', '.less','.note'
	              ];
		for(var i = 0; i < arr.length; i++){
	    	if(path.endsWith(arr[i])){
	        	return true;
	        }
	    }
	  	return false;
	},
	isHtml(path){
		return path.endsWith('.html');
	},
	isJson(path){
		return path.endsWith('.json');
	},
	isJavascript(path){
		return path.endsWith('.js');
	},
	isNotes(path){
		return path.endsWith('.note');
	}
}
export default FileNameUtils;