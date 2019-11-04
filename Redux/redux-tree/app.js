import React from 'react'
import ReactDOM from 'react-dom'
import Utils from './utils'
import CONFIG from './config'
import ActionCreator from './actionCreator'
import StoreManager from './storeManager'
import Dialog from './dialog'
import ContextMenu from './contextmenu'
import MenuItem from './menuItem'
import EventHandler from './eventHandler'
import DomUtils from './domUtils'

import Split from './splitter'

import {STORE, LOCAL_STORAGE, TIME} from './constant'


import SideBarManager from './sidebar'



class TreeNode extends React.Component {
    
    onToggleClick(e) {
        e.stopPropagation();
        /*if(this.props.selectFolder){
            this.onSelect(e);
        }*/
        this.props.store.dispatch(ActionCreator.toggleOpenFolder(this.props.data.path));
    }

    onSelect(e){
        e.stopPropagation();
        if(this.props.data.type == 'file'){
            this.props.store.dispatch({
                type:'SELECT_NODE',
                node:this.props.data
            });    
        }else{
            if(this.props.selectFolder){
                this.props.store.dispatch({
                    type:'SELECT_NODE',
                    node:this.props.data
                });  
            }
        }
    } 

    onNodeNameDoubleClick(e){
        var that = this;
        localStorage.setItem('clickCount',2);
        EventHandler.ON_ITEM_DOUBLE_CLICK(this.props.data);
    }

    onNodeNameClick(e){
        var target = e.target;
        if(this.props.data.selected){
            setTimeout(function(){
                var clickCount = parseInt(localStorage.getItem('clickCount'));
                if(!clickCount ||clickCount == 0){
                    DomUtils.toggleEditingMode(target);
                        //save the current name
                        var oldName = target.innerHTML;
                        target.setAttribute('original-name', oldName);
                        DomUtils.selectingAllContent(target);
                }
                if(clickCount == 2){
                    localStorage.setItem('clickCount',1);
                }else 
                if(!clickCount || clickCount == 1){
                    localStorage.setItem('clickCount',0);
                    //if(!DomUtils.inEditingMode(target)){
                    //}
                }
            },300)
        }
      
    }
    onNodeNameBlur(){
        var target = this.refs.nodeName;
        //check the class to see if the target is in editing mode
        if(target.className.indexOf('editing-mode') != -1){
            var newName = target.innerHTML;
            var that = this;
            var parentFolder = Utils.getParentPath(this.props.data.path);

            var originalName = target.getAttribute('original-name');
            if(originalName){
                if(originalName != newName){
                    this.props.onRename(this.props.data, newName).then(function(data){
                        if(data.success){
                            that.props.store.dispatch({
                                type:'RENAME_NODE',
                                path:parentFolder + '/' + originalName,
                                newName:newName
                            })
                        }else{
                            //exit editing mode & rollback
                             DomUtils.exitEditingMode(target);
                        }
                    },function(){
                        //exit editing mode & rollback
                        DomUtils.exitEditingMode(target);
                            
                    });
                }else{
                    //exit editing mode & rollback
                    DomUtils.exitEditingMode(target);
                }
               
            }

            
        }
       
    }
   
    onContextMenu(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.store.dispatch(ActionCreator.targetNode(this.props.data.path));
        if(this.props.onContextMenu){
            this.props.onContextMenu(e, this.props.data);
        }
    }

    render(){
        var childLevel   = this.props.level + 1;
        var selectFolder = this.props.selectFolder;
        var oddStatus    = this.props.data.index % 2 == 0;
        var indexState = ' index-' + this.props.data.index;
        var openStatus   = this.props.data.open;
        var store        = this.props.store;

        var pathId       = Utils.generatePathId(this.props.data.path);

        //calculate odd class
        var odd = '';
        if(oddStatus){
            odd = ' odd ';
        }

        //calculate selected class
        var selectedState = false
        var selected = '';


        selectedState = this.props.data.selected; 

        if(selectedState){
            selected        = ' selected ';
        }

        //calculate targeted class
        var targetedState   = this.props.data.targeted || false;
        var targeted        = '';
        if(targetedState){
            targeted        = ' targeted ';
        }

        var that = this;

        var hasChildren = this.props.data.children && this.props.data.children.length > 0;

        if(this.props.data.type ==  'folder'){
            if(this.props.data.open){
                var children = this.props.data.children.map(
                                    (child, index) => 
                                        <TreeNode
                                                  key={child.path || index}
                                                  store = {store}
                                                  data={child}
                                                  onContextMenu = {that.props.onContextMenu}
                                                  level= {childLevel}
                                                  selectFolder = {selectFolder}
                                                  onRename = {that.props.onRename}

                                              />
                                )
                return (
                    <div key = {pathId}>
                        <div className = {"node-container open level-" + childLevel + selected + targeted + odd + indexState} 
                                onClick = {this.onSelect.bind(this)}
                                onContextMenu = {this.onContextMenu.bind(this)}
                                >
                            <span>
                                <i onClick = {this.onToggleClick.bind(this)} className="node-toggle-overlay"><i className="node-toggle open" ></i></i>  
                                <i className="mac-icon mac-icon-folder"></i>
                            </span>    
                            
                            <span className="node-name" 
                                ref = "nodeName"
                                onBlur = {this.onNodeNameBlur.bind(this)}
                                onClick={this.onNodeNameClick.bind(this)}
                                onDoubleClick = {this.onNodeNameDoubleClick.bind(this)}
                                >{this.props.data.name}</span>
                        </div>
                        <div className="children">
                          {children}
                        </div>  
                  </div> 
                )

            }else{
                return (
                    <div key = {pathId} 
                            className = {"node-container level-" + childLevel + selected + targeted + odd + indexState} 
                            onClick = {this.onSelect.bind(this)}
                            onContextMenu = {this.onContextMenu.bind(this)}    
                            >
                        <span>
                            <i onClick = {this.onToggleClick.bind(this)} className="node-toggle-overlay"><i className="node-toggle open" ></i></i> 
                            <i className="mac-icon mac-icon-folder"></i>
                        </span> 
                        <span className="node-name" 
                            ref = "nodeName"
                            onBlur = {this.onNodeNameBlur.bind(this)}
                            onClick={this.onNodeNameClick.bind(this)}
                            onDoubleClick = {this.onNodeNameDoubleClick.bind(this)}
                            >{this.props.data.name}</span>
                        
                    </div>
                )                
            }

        } else {
            return (
                <div    key = {pathId}
                        className = {"node-container file level-" + childLevel + selected + targeted + odd + indexState} 
                        onClick = {this.onSelect.bind(this)}
                        onContextMenu = {this.onContextMenu.bind(this)}
                        >
                    <i className="mac-icon mac-icon-file"></i>
                    <span className="node-name" 
                        ref = "nodeName"
                        onBlur = {this.onNodeNameBlur.bind(this)}
                        onClick={this.onNodeNameClick.bind(this)}
                        onDoubleClick = {this.onNodeNameDoubleClick.bind(this)}
                        >{this.props.data.name}</span>
                </div>
            )
        }
    }
}

class Tree extends React.Component {

    constructor(props){
        super(props);
        this.store = StoreManager.getStore(this.props.name);
    }

    onContextMenu(e,data){
        if(this.props.onContextMenu){
            this.props.onContextMenu(e,data);
        }
    }


     onKeyDown(e){
        var target = e.target;
        if(e.keyCode == 38 || e.keyCode == 40){
            e.preventDefault();
        }
        if(target.className.indexOf("node-name") == -1){
            /*if(e.keyCode == 38){  //up arrow
                this.store.dispatch({
                    type:'SELECT_ITEM_UP'
                })
            }
            if(e.keyCode == 40){//down arrow
                this.store.dispatch({
                    type:'SELECT_ITEM_DOWN'
                })
            }*/
            if(e.keyCode == 46) {//del
                alert('del')
            }
        }
    }

    componentWillMount(){
        var store = this.store;
        store.subscribe(() => {
            var state = store.getState();
            this.setState( state);
        });
    }

    render(){
        if(this.state && this.state.name){
            return (
                <div tabIndex = "0" onKeyDown = {this.onKeyDown.bind(this)}>
                    <TreeNode 
                        store = {this.store} 
                        data = {this.state} 
                        showRoot = {this.props.showRoot}
                        onContextMenu = {this.onContextMenu.bind(this)}
                        onRename = {this.props.onRename}
                        level= {0} 
                        selectFolder = {this.props.selectFolder} />
                </div>    
            )
        }else{
            return (
                <div></div>
            )
        }
    }
}




var onContextMenu = function(e,data){
    if(data.type == 'folder'){
        ContextMenu.render(e,data,[MenuItem.NEW_FILE,MenuItem.NEW_FOLDER, MenuItem.ADD_TO_WORKSPACE]);
    }
   
}

var onContextMenu2 = function(e,data){
    if(data.type == 'folder'){
        ContextMenu.render(e,data,[MenuItem.NEW_FILE,MenuItem.NEW_FOLDER]);
    }
   
}
var onRename = EventHandler.RENAME_NODE;
ReactDOM.render(
    <Tree name = {STORE.TREE_FOLDER} selectFolder = {true}  onContextMenu = {onContextMenu}
            onRename = {onRename}
            showRoot = {false}
    />,
  document.getElementById('tree-folder')
);
ReactDOM.render(
    <Tree name = {STORE.TREE_WORKSPACE} selectFolder = {true}  onContextMenu = {onContextMenu2}
            onRename = {onRename}
            showRoot = {false}
    />,
  document.getElementById('tree-workspace')
);

ReactDOM.render(
    <Tree name = {STORE.TREE_NOTES} selectFolder = {true}  onContextMenu = {onContextMenu2}
            onRename = {onRename}
            showRoot = {false}
    />,
  document.getElementById('tree-notes')
);





$.get("/api/dirTree",{path:CONFIG.ROOT_PATH}, function(data, status){
            if(data.success){
                Utils.buildTreePath(data);
                Utils.setRootData(data);
                StoreManager.dispatch(STORE.TREE_FOLDER,{
                    type:'LOAD_TREE_DATA',
                    path: CONFIG.ROOT_PATH
                })

                var wsPath = localStorage.getItem(LOCAL_STORAGE.WS_PATH);
                if(wsPath){
                    StoreManager.dispatch(STORE.TREE_WORKSPACE,{
                        type:'LOAD_TREE_DATA',
                        path: wsPath
                    })
                }

                StoreManager.dispatch(STORE.TREE_NOTES,{
                    type:'LOAD_TREE_DATA',
                    path:CONFIG.NOTES_PATH
                })
                
            }
            
        });
SideBarManager.render();



import ChatClient from './chatClient.js'
import GlobalEvent from './globalEvent.js'

