//setup split panel
	var Split = {};
	Split.splitPanel = function(option){
		var parent = document.getElementById(option.leftPanel).parentElement;
		var leftPanel = document.getElementById(option.leftPanel);
		var rightPanel = document.getElementById(option.rightPanel);
		var resizer = document.getElementById(option.resizer);

		/*style for parent and its children*/
		parent.style.flexWrap = "nowrap";
		parent.style.flexDirection = "row";
		parent.style.justifyContent = "flex-start";
		parent.style.alignItems = "stretch";
		//parent.style.display = 'flex';
		parent.style.width = '100%';
		parent.style.flex = '1 1 auto';

		leftPanel.style.flex = "0 0 auto";
		rightPanel.style.flex = "1 1 auto";
		resizer.style.cursor = 'col-resize';

		resizer.addEventListener('mousedown', function init(e) {
			initDrag(e);
		    resizer.removeEventListener('mousedown', init, false);
		    resizer.addEventListener('mousedown', initDrag, false);
		}, false);

		var startX, startY, leftPanelStartWidth, rightPanelStartWidth;

		function initDrag(e) {
		   startX = e.clientX;
		   startY = e.clientY;
		   leftPanelStartWidth = parseInt(document.defaultView.getComputedStyle(leftPanel).width, 10);
		   rightPanelStartWidth = parseInt(document.defaultView.getComputedStyle(rightPanel).width, 10);
		   /*startHeight = parseInt(document.defaultView.getComputedStyle(div).height, 10);*/
		   document.documentElement.addEventListener('mousemove', doDrag, false);
		   document.documentElement.addEventListener('mouseup', stopDrag, false);
		}

		function doDrag(e) {
			var widthLeft  = (leftPanelStartWidth + e.clientX - startX);
			if(widthLeft < 10){
				widthLeft = 10;
			}
			var widthRight = (rightPanelStartWidth - e.clientX + startX);
		   	leftPanel.style.width = widthLeft + 'px';
		   	rightPanel.style.width = widthRight + 'px';
		}

		function stopDrag(e) {
		    document.documentElement.removeEventListener('mousemove', doDrag, false);    document.documentElement.removeEventListener('mouseup', stopDrag, false);
		}
	}
	

	export default Split