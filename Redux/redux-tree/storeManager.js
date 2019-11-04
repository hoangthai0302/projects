import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reducer from './reducer.js'

//store
var stores = {};

const StoreManager = {
	getStore(name){
		if(!stores[name]){
			var store = createStore(reducer);
			stores[name] = store;
		}
		return stores[name];
	},
	dispatch(storename, action){
		var store = this.getStore(storename);
		store.dispatch(action);
	},
	dispatchGlobal(action){
		for(var prop in stores){
			if (stores.hasOwnProperty(prop)) {
				var store = this.getStore(prop);
				store.dispatch(action);
		    }
		}
	}
}

export default StoreManager;







