import React from 'react';
import ReactDOM from 'react-dom';
import DomUtils from './domUtils.js'


//handle click outside
document.documentElement.addEventListener('click', function(e){
	var el = DomUtils.clickInsideElement(e, 'dialog');
	if(!el){
		$('.dialog').hide();
	}

}); 



var Dialog = {
	openMenu(e, nodeData){

	},
	openInput(e,data,callback){

		var close = function(){
			$(dialog).hide();
		}

        var onKeyDown = function(e){
			if(e.keyCode == '13'){
				var input = $('#dialog-input-box').val();
                callback(input);
                close();
			}
		}

		var content = <input id= "dialog-input-box" onKeyDown ={onKeyDown} type="text"/>;

		var dialog = document.getElementById('dialog-input-container');

		if(!dialog){
			dialog = document.createElement('div');
			document.body.append(dialog);
			dialog.id = 'dialog-input-container';
			dialog.className = 'dialog';
			dialog.style.zIndex = '999999';
			dialog.style.position = 'absolute';
			
			ReactDOM.render(content,dialog);
		
			DomUtils.positioningProperly(e,dialog);
		}else{

			$('#dialog-input-box').val('');
			$(dialog).show();

			DomUtils.positioningProperly(e,dialog);
		}
		
		$('#dialog-input-box').focus();
		
	}
	
	
}

export default Dialog;

