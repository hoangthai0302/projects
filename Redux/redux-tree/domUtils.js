

var DomUtils = {
	exitEditingMode(target){
		$(target).removeClass('editing-mode');
	     target.contentEditable = false;
	     var originalName = $(target).data('original-name');
	     target.innerHTML = originalName;
	},
	inEditingMode(target){
		return $(target).hasClass('editing-mode');
	},
	toggleEditingMode(target){
		$(target).addClass('editing-mode');
        target.contentEditable = true;
        $(target).data('original-name',target.innerHTML);
	},
	selectingAllContent(target){
		var range = document.createRange();
        range.selectNodeContents(target);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
	},
	clickInsideElement( e, className ) {
	    var el = e.srcElement || e.target;
	    
	    if ( el.classList.contains(className) ) {
	      	return el;
	    }else {
	    	while ( el = el.parentNode ) {
		        if ( el.classList && el.classList.contains(className) ) {
		          return el;
		        }
		    }
	    }

	    return false;
	},
	getPosition(e) {
	    var posx = 0;
	    var posy = 0;

	    if (!e) var e = window.event;
	    
	    if (e.pageX || e.pageY) {
	      posx = e.pageX;
	      posy = e.pageY;
	    } else if (e.clientX || e.clientY) {
	      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	    }

	    return {
	      x: posx,
	      y: posy
	    }
  	},
  	center(div){
		var divWidth = div.offsetWidth + 4;

		var windowWidth = window.innerWidth;

		var doc = document.documentElement;
		var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
		    
		div.style.left = (windowWidth/2 + scrollLeft  - divWidth/2) + "px";
		div.style.top = '100px'
	},
	positioningProperly(e,dialog) {
		if(!e){
			this.center(dialog);
		}else{
			var clickCoords = this.getPosition(e);
		    var clickCoordsX = clickCoords.x;
		    var clickCoordsY = clickCoords.y;

		    /*positioning the dialog properly*/
		    var menuWidth = dialog.offsetWidth + 4;
		    var menuHeight = dialog.offsetHeight + 4;

		    var windowWidth = window.innerWidth;
		    var windowHeight = window.innerHeight;

		    if ( (windowWidth - clickCoordsX) < menuWidth ) {
		      dialog.style.left = windowWidth - menuWidth + "px";
		    } else {
		      dialog.style.left = clickCoordsX + "px";
		    }

		    if ( (windowHeight - clickCoordsY) < menuHeight ) {
		      dialog.style.top = windowHeight - menuHeight + "px";
		    } else {
		      dialog.style.top = clickCoordsY + "px";
		    }
		}
		
	}
}

export default DomUtils;