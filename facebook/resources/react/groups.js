'use strict';

var Groups = React.createClass({
	displayName: 'Groups',

	showModal: function showModal() {
		var div = document.createElement('div');
		var component = React.render(React.createElement(CreateGroupModal, null), div);
		BootstrapDialog.confirm({
			title: 'Create New Group',
			message: function message(dialogRef) {
				return div;
			},
			callback: function callback(result) {
				if (result) {
					var name = React.findDOMNode(component.refs.groupname).value;
					if (name.trim() != '') {
						var div2 = document.createElement('div');
						React.render(React.createElement(CreateGroupModal2, null), div2);
						BootstrapDialog.confirm({
							title: name,
							message: function message(dialogRef2) {
								return div2;
							},
							callback: function callback(result2) {
								if (result2) {
									var img = $('.group-icons-holder img.active').attr('src');
									img = img.substring(img.lastIndexOf('/') + 1);
									var postData = {};
									postData['name'] = name;
									postData['img'] = img;
									$.ajax({
										url: BASE_URL + '/services/group/new',
										data: postData,
										type: 'post',
										success: function success(data) {
											var group_id = data.group_id;
											var group_link = data.group_link;
											if (group_id != "") {
												var group = {};
												group['id'] = group_id;
												group['name'] = name;
												group['icon'] = img;
												group['link'] = group_link;
												groups.push(group);
												React.render(React.createElement(Groups, { data: groups }), document.getElementById('groups'));
											}
										}
									});
								} else {}
							}
						});
					}
				} else {}
			}
		});
	},
	render: function render() {
		var data = this.props.data.map(function (group) {
			return React.createElement(Group, { key: group.id,
				link: group.link,
				name: group.name,
				id: group.id,
				icon: group.icon
			});
		});
		var div = React.createElement('div', null);
		if (current_wall.id == you.id) {
			div = React.createElement(
				'div',
				null,
				React.createElement(
					'a',
					{ href: '#', className: '_create_group_icon no-style', onClick: this.showModal },
					'Create group'
				)
			);
		}
		return React.createElement(
			'div',
			null,
			div,
			data
		);
	}
});

var Group = React.createClass({
	displayName: 'Group',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'a',
				{ href: '/facebook/group/' + this.props.link, className: 'no-style group_name' },
				React.createElement('img', { src: '/facebook/resources/images/groups/' + this.props.icon }),
				this.props.name
			)
		);
	}
});

var CreateGroupModal = React.createClass({
	displayName: 'CreateGroupModal',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'label',
				{ 'for': 'groupName' },
				'Group name:'
			),
			React.createElement('input', { type: 'text', className: 'form-control', id: 'groupName', ref: 'groupname' })
		);
	}
});
var CreateGroupModal2 = React.createClass({
	displayName: 'CreateGroupModal2',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'h4',
				null,
				'Choose an icon'
			),
			React.createElement(
				'div',
				{ className: 'group-icons-holder' },
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/1.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/2.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/3.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/4.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/5.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/6.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/7.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/8.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/9.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/10.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/11.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/12.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/13.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/14.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/15.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/16.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/17.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/18.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/19.png' }),
				React.createElement(ImageToggle, { src: 'http://localhost:8081/facebook/resources/images/groups/20.png' })
			)
		);
	}
});
var ImageToggle = React.createClass({
	displayName: 'ImageToggle',

	toggle: function toggle(e) {
		var target = React.findDOMNode(this.refs.img);
		var className = target.className;
		if (className == 'active') {
			target.className = '';
		} else {
			target.className = 'active';
		}
	},
	render: function render() {
		return React.createElement('img', { src: this.props.src, onClick: this.toggle, ref: 'img' });
	}
});