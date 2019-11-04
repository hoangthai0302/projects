import React from 'react'
import ReactDOM from 'react-dom';
import DomUtils from './domUtils.js'

var ContextMenu = {
	render: function(e, data,items){
		var menu = document.getElementById('context-menu');
	    if(!menu){
		    menu = document.createElement('div');
		    $(menu).attr('id','context-menu');
		    $(menu).addClass('context-menu');
	    }
	    $('body').append(menu);
	    $('.node-container').removeClass('targeted');

	    //highlight targeted item
	    var target = e.target;
	    if($(target).hasClass('node-container')){
	    	$(target).addClass('targeted');
	    }else{
	    	var nodeContainer = $(target).closest('.node-container');
	    	$(nodeContainer).addClass('targeted');
	    }

	    var arr = [];
	    //render content to menu
	    for(var i = 0; i < items.length; i++){
	    	arr.push(
	    		<div className="menu-item" key={i} onClick={items[i].onclick.bind(null,data)}>{items[i].label}</div>
	    	)
	    	if(items[i].seperator){
	    		arr.push(
	    			<div key={i + 100} className="menu-item-separator"></div>
	    		)
	    	}
	    }

	    var content = <div>{arr}</div>

	    ReactDOM.render(content,menu);
	    menu.style.display = 'block';
	    DomUtils.positioningProperly(e,menu);
	    this.handleClickOutside(e, menu);
	},
	handleClickOutside(e, menu){
		var self = this;
		var target = e.target;

		$(document).bind('click.contextmenu',function(e){
			//check if click inside the menu
		      var clickeElIsLink = DomUtils.clickInsideElement( e, 'context-menu' );
				
		      if ( clickeElIsLink ) {
		        e.preventDefault();
		        self.hideMenu(menu,e);
		      } else {
		        var button = e.which || e.button;
		        if ( button === 1 ) {
		          self.hideMenu(menu,e);
		        }
		      }
		});
	},
	hideMenu(menu,e){
		$(document).unbind('click.contextmenu');
      	var target = e.target;
      	//if user click on context menu, or inside dialog, dont hide the highlight
      	
      	if(target.className != 'menu-item'){
          	var clickedEl = DomUtils.clickInsideElement(e,'window');
            if(!clickedEl){
              $('.node-container').removeClass('targeted');  
            }
        }
		menu.style.display = "none";
	}
}

export default ContextMenu;
