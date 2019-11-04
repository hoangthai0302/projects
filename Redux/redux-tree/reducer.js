import Utils from './utils.js';
import SearchUtils from './searchUtils.js'



// Reducer

var reducer = function (state, action) {
  	switch (action.type) {
  		case 'RENDER_SEARCH':
  			var hint = action.hint;
  			var data = SearchUtils.search(hint);
  			var newState = Object.assign({},data);
  			return newState;
  		case 'SEARCH_UP_ARROW':
  			var newState = Object.assign({},state);
  			var index;
  			if(newState.children){
	  			for(var i = 0; i < newState.children.length; i++){
	  				let item = newState.children[i];
	  				if(item.selected){
	  					item.selected = false;
	  					index = i;
	  					break;
	  				}
	  			}
	  			if(index ==0){
	  				newState.children[0].selected = true;
	  			}		
	  			if(index != null && index > 0){
	  				newState.children[index - 1].selected = true;
	  			}
  			}
  			return newState;
  		case 'SEARCH_DOWN_ARROW':
  			var newState = Object.assign({},state);
  			var index;
  			if(newState.children){
	  			for(var i = 0; i < newState.children.length; i++){
	  				let item = newState.children[i];
	  				if(item.selected){
	  					item.selected = false;
	  					index = i;
	  					break;
	  				}
	  			}		
	  			if(index != null && index < newState.children.length - 1){
	  				newState.children[index + 1].selected = true;
	  			}
	  			if(index == newState.children.length - 1){
	  				newState.children[index].selected = true;
	  			}
  			}
  			return newState;	
        case 'LOAD_TREE_DATA':
	        var path = action.path;
	        var data = Utils.getFolder(path);
	        data = Object.assign({},data);
	        //set default open 
	        data.open = true;
	        //indexing
	        Utils.indexingVisibleNode(data);
	        return data;
	    
        case 'REMOVE_ITEM':
            var newState = Object.assign({},state);
            Utils.removeNode(newState,action.path);
            return newState;

        case 'ADD_ITEM':
            var newState = Object.assign({},state);
            Utils.addNode(newState, action.name, action.nodeType, action.parentPath);
            return newState;
            
        case 'MOVE_ITEM':
            var newState = Object.assign({},state);

            Utils.moveNode(newState, action.path, action.newPath);
            return newState;    
            
	    case 'TOGGLE_OPEN_FOLDER':
	        var newState   = Object.assign({}, state);
	        //find the node with path, set it open

	        Utils.toggleOpenFolder(newState, action.path);

	        return newState;

	    case 'SELECT_NODE':  //highlight the node when click
	        var newState = Object.assign({}, state);
	        //find the node with path, set it open

	        Utils.selectNode(newState, action.node);

	        return newState;    

        case 'SELECT_ITEM':
            var newState = Object.assign({}, state);
            Utils.selectItem(newState,action.index, true);
            
            return newState;    

        case 'SELECT_ITEM_UP':
        	var newState = Object.assign({}, state);
            Utils.selectItemUp(newState);
            return newState; 

        case 'SELECT_ITEM_DOWN':
            var newState = Object.assign({}, state);
            Utils.selectItemDown(newState);
            
            return newState;           

	    case 'TARGET_NODE': //highlight the node when right click
	        var newState = Object.assign({}, state);
            
	        //find the node with path, set it open
	        Utils.targetNode(newState, action.path);
	        return newState;    
	    case 'RENAME_NODE':
	    	var newState = Object.assign({}, state);

	    	Utils.renameNode(newState,action.path, action.newName);
	    	return newState;

	    case 'CLEAR_TARGET':
	        var newState = Object.assign({}, state);

	        Utils.clearTarget(newState);
	        return newState;      

	    default:
	      	return state;
  	}
}

export default reducer;

