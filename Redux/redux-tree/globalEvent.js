import FileSearchDialog from './fileSearchDialog'
import Split from './splitter'
import StoreManager from './storeManager'
import ActionCreator from './actionCreator'
import Utils from './utils'
import Editors from './editors'
import MyEditor from './draft/src/example.js';
import React from	'react'
import ReactDOM from 'react-dom'
import DomUtils from'./domUtils'
import MenuItem from './menuItem'

$(document).click(function(e){
    if(e.target )
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 

    if(!isRightMB){
        StoreManager.dispatchGlobal(ActionCreator.clearTargetNode());
    }

    var el = DomUtils.clickInsideElement(e,'file-search-dialog');
    if(!el){
    	$('#file-search-dialog-container').hide();
    }
})

document.addEventListener("keydown", function(e) {
	e.keyCode;
	//handle control+space
    if (e.keyCode == 32 &&  e.ctrlKey)      {
		e.preventDefault();
		FileSearchDialog.open();
    }
    //handle escape
    if(e.keyCode == 27){
    	$('#file-search-dialog-container').hide();
      	$('#dialog-input-box').parent().remove();
    }

    //handle alt + left/right
    if (e.keyCode == 39 &&  e.altKey)      {
		e.preventDefault();
		window.openNextTab();
    }
    if (e.keyCode == 37 &&  e.altKey)      {
		e.preventDefault();
		window.openPreviousTab();
    }
});

Split.splitPanel({
	leftPanel: 'sidebar-explorer',
	rightPanel:'tree-folder',
	resizer: 'sidebar-resizer'
});
Split.splitPanel({
	leftPanel: 'tree-workspace',
	rightPanel:'editorWrap',
	resizer: 'workspace-resizer'
});
Split.splitPanel({
	leftPanel: 'tree-notes',
	rightPanel:'draftEditor',
	resizer: 'note-resizer'
});

window.openTab = function(id){
	$('.tabcontent').addClass('inactive');
	$(id).removeClass('inactive');
	$('.tablinks').removeClass('active');
	var id2 = id.substring(1, id.length);
	$("a[data-tabname='"+id2 + "']").addClass('active');
	window.currentPage = id.substring(1);
}

window.openNextTab = function(){
	var tabLink = $('.tablinks.active').next();
	if(tabLink){
		tabLink.trigger('click');
		window.currentPage =	tabLink.attr('data-tabname');
	}
	
}

window.openPreviousTab = function(){
	$('.tablinks.active').prev().trigger('click');
	var tabLink = $('.tablinks.active').prev();
	if(tabLink){
		tabLink.trigger('click');
		window.currentPage =	tabLink.attr('data-tabname');
	}
}


//add new tab content to #editor and register Ctr+s event
window.addNewEditorAndRegisterEventCtrS = function addNewEditorAndRegisterEventCtrS(filePath){
	var pathId = Utils.generatePathId(filePath);
	var editorDiv = document.getElementById(pathId);
	if(!editorDiv){
		editorDiv = document.createElement('div');
		editorDiv.id = pathId;
		document.getElementById('editor').appendChild(editorDiv);
		
      	var mode = 'jsx';
      	if(filePath.endsWith('.css')){
        	mode= 'css';
        }
		Editors[pathId] = CodeMirror(editorDiv,{
		    mode: mode,
		    lineNumbers: true,
		    extraKeys:{
		    	"Shift-Space":"autocomplete",
		    	"Alt-F": "findPersistent"
		    },
		    gutter: true,
		    autoCloseBrackets:true,
		    scrollbarStyle: "simple",
		    keyMap: "sublime",
		    lineWrapping: true,
		    readOnly: false,
		    matchBrackets: true,
		    lineWrapping: false,
		    theme:"testtheme",
		    highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
		});
		editorDiv.addEventListener("keydown", function(e) {
	      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))      {
	        e.preventDefault();
	        if(filePath.length > 0){
	          var postData = {path:filePath, content:Editors[pathId].getValue()};
	          $.ajax({
	                url: '/api/saveFile',
	                type: 'post',
	                dataType:'json',
	                contentType:'application/json',
	                data: JSON.stringify(postData),
	                success: function (data) {
	                	console.log("save file successfully");
	                }
	              
	          });
	        }
	        
	      }
	    }, false);
	}
	
}
//handle right-click on some folders
function registerRightClickOnParentTreeFolders(){
	var arr = [ 
		{
			id:'#tree-workspace',
			data:Utils.getWorkspaceFolder() 
		}/*,{
			id:'#tree-folder',
			data:LocalDataService.getTryItFoder() 
		},{
			id:'#tree-notes',
			data:LocalDataService.getNodeConsoleFolder() 
		}*/
		
	]

	for(var i = 0; i< arr.length; i++){
		let item = arr[i];
		$(item.id).contextmenu(function(e){
		  	e.preventDefault();

			var data = item.data;
		  	if(data){
        		ContextMenu.render(e,data,[MenuItem.NEW_FILE,MenuItem.NEW_FOLDER]);
		    }else{
		      console.log('can not get folder:' + item.id + ' data');
		    }
		});
	}

}
//setup chrome tabs
var $chromeTabsExampleShell = $('.chrome-tabs-shell');
chromeTabs.init({
    $shell: $chromeTabsExampleShell,
    minWidth: 45,
    maxWidth: 160,
    onTabActive:function(data){
        var filePath = data.node.path;
        var pathId = Utils.generatePathId(filePath);
        $('#editor >div').hide();
        $('#' + pathId).show();
        //TreeManager.toggleOpenFile(filePath);
    },
    onTabbarDbClick:function($tab){
        alert('onTabbarDbClick');
    },
    onCloseCurrentTab:function(data){
        var filePath = data.node.path;
        filePath = Utils.generatePathId(filePath);
        $('#' + filePath).remove();
    },
    onCloseHiddenTab:function(data){
        var filePath = data.node.path;

        filePath = Utils.generatePathId(filePath);
        $('#' + filePath).remove();
    }
});

window.renderNotes = function(){
	setTimeout(function(){
			ReactDOM.render(
				  <MyEditor />,
				  document.getElementById('draftEditor')
				);
		},10)
}
renderNotes();

var GlobalEvent = {}
export default GlobalEvent;