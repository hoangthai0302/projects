import Dialog from './dialog.js'
import StoreManager from './storeManager.js'
import {STORE} from './constant'
var MenuItem = {
	NEW_FILE:{
		label:"New File",
		onclick:function(nodeData){
			Dialog.openInput(null, nodeData, function(value){
		        StoreManager.dispatch(STORE.TREE_WORKSPACE,{
	                type:'ADD_ITEM',
	                nodeType: 'file',
	                parentPath: nodeData.path,
	                name:value
	            })
		    });
		},
		seperator:true
	},
	NEW_FOLDER:{
		label:"New Folder",
		onclick:function(){
			Dialog.openInput(null, nodeData, function(value){
		        StoreManager.dispatch(STORE.TREE_WORKSPACE,{
	                type:'ADD_ITEM',
	                nodeType: 'folder',
	                parentPath: nodeData.path,
	                name:value
	            })
		    });
		}
	},
	ADD_TO_WORKSPACE:{
		label:"Add to Workspace",
		onclick:function(nodeData){
			localStorage.setItem(LOCAL_STORAGE.WS_PATH, nodeData.path);
			StoreManager.dispatch(STORE.TREE_WORKSPACE,{
                type:'LOAD_TREE_DATA',
                path: nodeData.path
            })
		}
	}
}

export default MenuItem