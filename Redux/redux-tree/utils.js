


var Utils = {
	setRootData(data){
		this.rootData = data;
	},
	getRootData(){
		return this.rootData;
	},
	clearSelection(rootNode){
		var runner = function(node){
		    node.selected = false;
		    if(node.type == 'folder'){
		        for(var i = 0; i < node.children.length; i++){
		            var child = node.children[i];
		            runner(child);
		        }
		    }
		}
		runner(rootNode);
	},

	clearTarget(node){
	    node.targeted = false;
	    if(node.type == 'folder'){
	        for(var i = 0; i < node.children.length; i++){
	            var child = node.children[i];
	            this.clearTarget(child);
	        }
	    }
	},
	indexingVisibleNode(rootNode){
		var currentIndex = 0;
		var runner = function(node){
		    node.index = currentIndex;
		    if(node.type == 'folder' && node.open){
		        for(var i = 0; i < node.children.length; i++){
		            var child = node.children[i];
		            currentIndex++;
		            runner(child);
		        }
		    }
		}
		runner(rootNode);
	},
	getNodeName(path){
		var index = path.lastIndexOf("/");
		return path.substring(index + 1);
	},
	getParentPath(path){
	  var lastIndex = path.lastIndexOf('/');
	  return path.substring(0,lastIndex);
	},
	getParentNode(rootNode,path){
		var parentPath = this.getParentPath(path);
		if(parentPath){
			return this.getNode(rootNode,parentPath);
		}
	},

	getChildNode(node,childName){
	  for(var i = 0; i < node.children.length; i++){
	    var child = node.children[i];
	    if(child.name == childName){
	      return child;
	    }
	  }
	  return null;
	},
	removeChild(parentNode, childPath){
	  for(var i = 0; i < parentNode.children.length; i ++){
	    var child = parentNode.children[i];
	    if(child.path == childPath){
	      parentNode.children.splice(i,1);
	      return true;
	    }
	  }
	  return false;
	},

	getNode(rootNode,path){

	    var rootPath = rootNode.path;
	    if(rootPath == path){
	    	return rootNode;
	    }

	    var str = path.substring(rootPath.length, path.length);
	    var arr = str.split('/');

	    var currentChild = rootNode;
	  
	    for(var i = 1; i < arr.length; i++){
	    	if(currentChild){
	    		var childName = arr[i];
	        	currentChild = this.getChildNode(currentChild,childName);
	    	}else{
	    		return null;
	    	}
	    } 
	    return currentChild;
	},
	getFolder:function(folderPath){
        return this.getNode(this.rootData,folderPath);
    },
    getWorkspaceFolder(){
    	var wsPath = localStorage.getItem(LOCAL_STORAGE.WS_PATH);
    	if(!wsPath)
    		return null;
    	return this.getFolder(wsPath);
    },
    getTreeFolder(){

    },
	applyPath(node, path){
	  var name = node.name;
	  node.path = path + '/' + name;
	  if(node.children){
	    for(var i = 0; i < node.children.length; i++){
	      this.applyPath(node.children[i], node.path);
	    }
	  }
	  
	},
	renameNode(rootNode,oldPath, newName){
		var node = this.getNode(rootNode,oldPath);
		node.name = newName;
		var parentPath = this.getParentPath(oldPath);
		this.applyPath(node, parentPath)

		//applied changed to rootData
		var _node = this.getNode(this.rootData, oldPath);
		this.applyPath(_node, parentPath);
	},
	moveNode(rootNode,currentPath, destPath){
		//new location path could not be inside the old path
      	if(currentPath.indexOf(destPath) == -1){
        	var newDest = this.getNode(rootNode,destPath);
        	if(newDest){
        		var node = this.getNode(rootNode, currentPath);
	        	this.removeNode(rootNode,currentPath);
	        	//apply new path for node
	        	this.applyPath(node, destPath);
	        	newDest.children.push(node);

	        	//applied changed to rootData
	        	var _newDest = this.getNode(this.rootData, destPath);
	        	if(_newDest){
	        		var _node = this.getNode(this.rootData, currentPath);
	        		this.removeNode(this.rootData, currentPath);
	        		this.applyPath(_node, destPath);
	        		_newDest.children.push(_node);
	        	}
        	}
        	
      	}
    },
	addNode(rootNode,nodeName, nodeType, parentPath){
		var parentFolder = this.getNode(rootNode,parentPath);
        if(parentFolder){
            if(nodeType == 'file'){
              parentFolder.children.push({
                  "path": parentPath + '/' + nodeName,
                  "name": nodeName,
                  "type": nodeType
              });
            }
            else if(nodeType == 'folder'){
              parentFolder.children.push({
                  "path": parentPath + '/' + nodeName,
                  "name": nodeName,
                  "type": nodeType,
                  children:[]
              });
            }

            //applied to rootData
            var _parentFolder = this.getNode(this.rootData, parentPath);
            if(nodeType == 'file'){
            	_parentFolder.children.push({
            		"path": parentPath + '/' + nodeName,
	                "name": nodeName,
	                "type": nodeType
            	})
            }else if(nodeType == 'folder'){
            	_parentFolder.children.push({
                  	"path": parentPath + '/' + nodeName,
                  	"name": nodeName,
                  	"type": nodeType,
                  	children:[]
              	});
            }
        }

	},
	removeNode(rootNode, path){
		var parentPath = this.getParentPath(rootNode,path);
        var parent = this.getNode(rootNode,parentPath);
        if(parent){
        	var result = this.removeChild(parent,path);

        	//applied to rootData
        	var _parent = this.getNode(this.rootData, parentPath);
        	if(_parent){
        		this.removeChild(_parent, path);
        	}

        	return result;
        }
        return false;
	},
	selectNode(rootNode, node){
		this.clearSelection(rootNode);
        node.selected = true;
	},
	findSelectedNode(rootNode){
		function runner(node){
			if(node.selected){
				return node;
			}
			if(node.children){
				for(var i = 0; i < node.children.length; i++){
					var result = runner(node.children[i]);
					if(result){
						return result;
					}
				}

			}
			return false;
		}
		return runner(rootNode);
	},
	findNodeByIndex(rootNode, index){
		function runner(node,index){
			if(node.index == index){
				return node;
			}
			if(node.children){
				for(var i = 0; i < node.children.length; i++){
					var result = runner(node.children[i],index);
					if(result){
						return result;
					}
				}

			}
			return false;
		}
		return runner(rootNode, index);
	},
	selectItemUp(rootNode){
		var selectedNode = this.findSelectedNode(rootNode);
		if(selectedNode){
			selectedNode.selected = false;
			var index = selectedNode.index;
			if(index){
				index = index - 1;
				if(index < 0){
					index = 0;
				}
				var node = this.findNodeByIndex(rootNode,index);
				this.clearSelection(rootNode);
				node.selected = true;
			}
		}
	},
	selectItemDown(rootNode){
		var selectedNode = this.findSelectedNode(rootNode);
		if(selectedNode){
			selectedNode.selected = false;
			var index = selectedNode.index;
			if(index){
				index = index + 1;
				var node = this.findNodeByIndex(rootNode,index);
				this.clearSelection(rootNode);
				node.selected = true;
			}
		}
	},
	targetNode(rootNode,path){
		this.clearTarget(rootNode);
		var node = this.getNode(rootNode,path);
        node.targeted = true;
	}, 
	toggleOpenFolder(rootNode,path){
		var node = this.getNode(rootNode,path);
        if(node.open){
            node.open = false;
        }else{
            node.open = true;
        }
        this.indexingVisibleNode(rootNode);
	},
	buildTreePath(node){
    	if(node.children){
            for(var i = 0; i < node.children.length; i++){
                var child = node.children[i];
                child.path = node.path + '/' + child.name;
                this.buildTreePath(child);
            }
        }
    },
    generatePathId(filePath){
		return filePath.replace(/\//g , "_").replace(/\./g , "_").replace(/ /g,"_");
	}
}

module.exports =  Utils;