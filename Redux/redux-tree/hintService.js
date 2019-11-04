var HintServices = {
	getHint(hint){
		if(hint.indexOf('@') == -1 && hint.indexOf('!') == -1){
			return hint;
		}
		if(hint.length == 1) return "";

		hint = hint.substring(1);
		var index = hint.indexOf(":");
		if(index == -1){
			return hint.toLowerCase();
		}
		return hint.substring(0, index).toLowerCase();
		
	},
	isListingChildren(hint){
		return hint.indexOf(":") != -1;
	},
	getSubQuery(hint){
		if(!this.isListingChildren(hint)){
			return '';
		}

		var index = hint.indexOf(":");
		return hint.substring(index + 1).toLowerCase();
	}
}

export default HintServices;