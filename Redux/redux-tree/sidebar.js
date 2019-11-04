import React from 'react';
import ReactDOM from 'react-dom';
import StoreManager from './storeManager.js'
import Utils from './utils.js'
import DomUtils from './domUtils.js'
import {STORE} from './constant'

class SideBarEntry extends React.Component{
	constructor(props){
	    super(props);
	    this.onClick = this.onClick.bind(this);
	}

	onClick(e){
		var path = this.props.data.path;
		StoreManager.dispatch(STORE.TREE_FOLDER,{
                    type:'LOAD_TREE_DATA',
                    path:path
                })

		$('.sidebar-entry').removeClass('active');

		var entry = DomUtils.clickInsideElement(e,'sidebar-entry');
		if(entry){
			$(entry).addClass('active');
		}
      	

	}

	render(){
		return (
			<div className='sidebar-entry' onClick={this.onClick}>
                <i className={"mac-icon " + this.props.data.iconClass}></i>
                <span className='node-name'>{this.props.data.name}</span>
              </div>
		)
	}
}

class SideBar extends React.Component {
	constructor(props){
	    super(props);
	}

	render(){
		var entries = this.props.data.map(
                  (entry, index) => 
                   		<SideBarEntry key={index} data = {entry}/>
                      );
		return <div>{entries}</div>
	}
}

var favorites = [
	{"name":"Documents","path":"/Users/hoangthai/Documents","iconClass":"mac-sidebar-document"},
	{"name":"Movies","path":"/Users/hoangthai/Movies","iconClass":"mac-sidebar-movies"},
	{"name":"Musics","path":"/Users/hoangthai/Music","iconClass":"mac-sidebar-music"},
	{"name":"demo","path":"/Users/hoangthai/Documents/demo","iconClass":"mac-sidebar-folder"}
]


var SideBarManager = {

	build(){
		var that = this;
        $.ajax({
            url: '/api/favorites',
            type: 'get',
            dataType:'json',
            contentType:'application/json',
            success: function (data) {
			  	localStorage.setItem('favorites',JSON.stringify(data));
			  	that.render();
            }
          
      	});
		
	},

	render(){

		ReactDOM.render(<SideBar data = {favorites}/>, document.getElementById('sidebar-explorer'));
	},
	addFolder(folder){
		//load data from localStorage, and update localStorage
		var favorites = JSON.parse(localStorage.getItem('favorites'));
		
		favorites.push(folder);
		localStorage.setItem('favorites',JSON.stringify(favorites));
		//re-render sidebar
		SideBarManager.render();
		//update backend data
	      $.ajax({
	            url: '/api/favorites',
	            type: 'post',
	            dataType:'json',
	            contentType:'application/json',
	            data: JSON.stringify(favorites),
	            success: function (data) {
	            }
	          
	      });
	}
}

export default SideBarManager;

