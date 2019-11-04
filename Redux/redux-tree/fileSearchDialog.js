import React from 'react';
import ReactDOM from 'react-dom';
import HintServices from './hintService.js';
import CONFIG from './config.js'
import SearchUtils from './searchUtils.js'
import Utils from './utils.js'
import DomUtils from './domUtils.js'
import StoreManager from './storeManager.js'
import CONSTANT from './constant.js'
import {STORE, COMMAND,LOCAL_STORAGE} from './constant.js'
import EventHandler from './eventHandler'



class Entry extends React.Component{
	constructor(props){
	    super(props);
	    this.onDoubleClick = this.onDoubleClick.bind(this);
	}

	onDoubleClick(e){
		//null cause the dialog appear at center of the screen
		if(this.props.data.type == 'file'){
			this.props.onItemDoubleClick(null,this.props.data);
		}
		if(this.props.data.type == 'folder'){
			this.props.onItemDoubleClick(null,this.props.data);
		}
	}

	render(){
		var parentFolderPath = CONFIG.ROOT_PATH;
		

		var length = parentFolderPath.length;
		var index = parentFolderPath.lastIndexOf('/');
		var parentFolderName = parentFolderPath.substring(index);
		var nameLength = this.props.data.name.length;
		var relativePath = this.props.data.path;
		relativePath = relativePath.substring(length - parentFolderName.length + 1);
		var length1 = relativePath.length;
		relativePath = relativePath.substring(0,length1 - nameLength - 1);
      	var selected = '';
      	if(this.props.selected){
        	selected = ' selected ';
        }

        var subItemClass = '';

        var level = this.props.data.level;
        if(level){
        	subItemClass = ' level-' + level;
        }
		
		return (
			<div onDoubleClick = {this.onDoubleClick}  className={'result-entry' + subItemClass + selected}>
				<i className={"mac-icon mac-icon-" + this.props.data.type}></i>
				<span >{this.props.data.name}</span>
				<span className='result-path'>({relativePath})</span>
			</div>
		)
		
	}
}

class DialogAutocomplete extends React.Component{
	constructor(props){
	    super(props);
        this.store = StoreManager.getStore(this.props.name);
        this.state = {children:[]};
	     this.handleChange = this.handleChange.bind(this);
	     this.handleKeyDown = this.handleKeyDown.bind(this);
	     this.ignoreKey = false;
	}
	handleKeyDown(e){
      
		if(e.keyCode == 38){  //up arrow
          	StoreManager.dispatch(STORE.DIALOG_SEARCH,{
	        	type:'SEARCH_UP_ARROW'
	        })
		}
		if(e.keyCode == 40){//down arrow
          	StoreManager.dispatch(STORE.DIALOG_SEARCH,{
	        	type:'SEARCH_DOWN_ARROW'
	        })
		} 


		if(e.keyCode == 13){ //enter
			//trigger double click on the current selected item
			var resultContainer = this.refs.resultContainer;
          	var target    = $('.result-entry.selected',resultContainer)[0];
            var clickEvent  = document.createEvent ('MouseEvents');
            clickEvent.initEvent ('dblclick', true, true);
            target.dispatchEvent (clickEvent);
            $('.input-dialog-search').focus();
		}

		//prevent cursor moving
      	if (e.keyCode == 38 || e.keyCode == 40) 
	    {
	    	if (this.ignoreKey )
		    {
		        e.preventDefault();
		        return;
		    }
	        var pos = this.selectionStart;
	        this.value = (e.keyCode == 38?1:-1)+parseInt(this.value,10);        
	        this.selectionStart = pos; this.selectionEnd = pos;

	        this.ignoreKey = true; setTimeout(function(){this.ignoreKey=false},1);
	        e.preventDefault();
	    }
	}

	handleChange(e){
        var hint =  e.target.value; 
        StoreManager.dispatch(STORE.DIALOG_SEARCH,{
        	type:'RENDER_SEARCH',
        	hint:hint
        })
	}

	componentWillMount(){
		var store = this.store;
        store.subscribe(() => {
            var state = store.getState();
            this.setState( state);
        });
	}

	componentDidMount(){
		var input = this.refs.input;
      	input.focus();

      	var lastHint = localStorage.getItem(LOCAL_STORAGE.LAST_HINT);
      	if(lastHint){
        	input.value = lastHint;
        	//input.setSelectionRange(0, input.value.length);
          	StoreManager.dispatch(STORE.DIALOG_SEARCH,{
	        	type:'RENDER_SEARCH',
	        	hint:lastHint
	        })
          	
        }
	}

	render(){
		if(this.state && this.state.children){
			var searchIcon = <i className="fa fa-search"></i>;
			var that = this;
			var children = this.state.children.map(
	                        function(child, index){
	                          var selected = child.selected || false;
	                          return (
	                              <Entry key = {index} selected={selected} onItemDoubleClick = {that.props.onItemDoubleClick} 
	                                  data = {child}/>
	                          )
	                        }
	                      )
			var hasChildren = children.length > 0;
			var _hasChildren = '';
			if(hasChildren) {
				_hasChildren = ' has-children';
			}
			
			return (
				<div className={"file-search-dialog" + _hasChildren }>
					{searchIcon}
					<input ref='input' className='input-dialog-search' type = 'text' onKeyDown = {this.handleKeyDown} onChange = {this.handleChange}/>	
					<div ref = 'resultContainer' className={'result' + _hasChildren}>{children}</div>		
				</div>
			)
        }else{
            return (
                <div></div>
            )
        }


	}
}

var FileSearchDialog = {
	init(option){
		this.onItemDoubleClick = function(e,node){
			$('#file-search-dialog-container').remove();
			option.onItemDoubleClick(e,node);
		}
	},
	open(){
		var onItemDoubleClick = function(e, node){
			var path = node.path;
			var command = node.command;
			if(command == COMMAND.OPEN){
				if(node.type=='folder'){
					StoreManager.dispatch(STORE.TREE_FOLDER,{
		                    type:'LOAD_TREE_DATA',
		                    path: path
		                })
					
				}else{
					EventHandler.ON_ITEM_DOUBLE_CLICK(node);
				}

			}else if(command == COMMAND.IMPORT){
				StoreManager.dispatch(STORE.TREE_WORKSPACE,{
	                    type:'LOAD_TREE_DATA',
	                    path: path
	                })
				window.openTab('#workspace')
				localStorage.setItem(LOCAL_STORAGE.WS_PATH,path);
			}

		}

		var dialog = document.getElementById('file-search-dialog-container');
		if(!dialog){
			dialog = document.createElement('div');
			document.body.append(dialog);
			dialog.id = 'file-search-dialog-container';
			dialog.style.position = 'absolute';
			dialog.style.zIndex = '999999';
			dialog.style.top = '120px';
			
			ReactDOM.render(<DialogAutocomplete name={STORE.DIALOG_SEARCH} onItemDoubleClick = {onItemDoubleClick}/>,dialog);
			$(".file-search-dialog .result").niceScroll({cursorcolor:"#ccc"});
			DomUtils.center(dialog);
		}else{
			$(dialog).show();
			var input = document.querySelector('.input-dialog-search');
			if(input){
				input.focus();
				//this is actually select all text in input
				//input.setSelectionRange(0, input.value.length);
			}
		}
		
		
	}
}

export default FileSearchDialog;