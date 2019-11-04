
var currentIndex = 0;


var ActionCreator = {
	
	addFolder(message){
	    return {
	        type:'ADD_FOLDER',
	        data:''
	    }
	},

	toggleOpenFolder(path){
	    return {
	        type:'TOGGLE_OPEN_FOLDER',
	        path:path
	    }
	},

	selectNode(path){
	    return {
	        type: 'SELECT_NODE',
	        path:path
	    }
	},

	targetNode(path){
	    return {
	        type: 'TARGET_NODE',
	        path:path
	    }
	},

	clearTargetNode(){
	    return {
	        type:'CLEAR_TARGET'
	    }
	}
	
}
export default ActionCreator;

