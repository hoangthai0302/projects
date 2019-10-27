//user_id , friend_status
'use strict';

var AddfriendButton = React.createClass({
	displayName: 'AddfriendButton',

	getInitialState: function getInitialState() {
		return { buttonClass: 'btn btn-sm btn-default', iClass: 'fa fa-user-plus', status: 'Add Friend', previousStatus: 'Add Friend' };
	},
	componentDidMount: function componentDidMount() {
		var isFriend = this.props.friend_status;

		if (isFriend == '1') {
			//1 la friend, 2 la da gui friend request 0 la ko phai friend va chua gui
			this.setState({ buttonClass: 'btn btn-sm btn-success', iClass: 'fa fa-check', status: 'Friend', previousStatus: 'Friend' });
		} else if (isFriend == '2') {
			this.setState({ buttonClass: 'btn btn-sm btn-primary', iClass: '', status: 'Friend Request Sent', previousStatus: 'Friend Request Sent' });
		} else if (isFriend == '0') {
			this.setState({ buttonClass: 'btn btn-sm btn-default', iClass: 'fa fa-user-plus', status: 'Add Friend', previousStatus: 'Add Friend' });
		} else if (isFriend == '3') {
			this.setState({ buttonClass: 'btn btn-sm btn-primary', iClass: '', status: 'Confirm Friend', previousStatus: 'Confirm Friend' });
		}
	},

	toggle: function toggle(e) {
		e.preventDefault();
		var status = this.state.status;
		var id = this.props.user_id;
		if (status == 'Add Friend') {
			var that = this;
			$.ajax({
				url: BASE_URL + '/services/users/sendfriendrequest',
				data: { user_id: id },
				success: function success() {
					that.setState({ buttonClass: 'btn btn-sm btn-primary', iClass: '', status: 'Friend Request Sent', previousStatus: 'Friend Request Sent' });
				}
			});
		} else if (status == 'Cancel Request') {
			var that = this;

			$.ajax({
				url: BASE_URL + '/services/users/cancelfriendrequest',
				data: { user_id: id },
				success: function success() {
					that.setState({ buttonClass: 'btn btn-sm btn-default', iClass: 'fa fa-user-plus', status: 'Add Friend', previousStatus: 'Add Friend' });
				}
			});
		} else if (status == 'Unfriend') {
			var that = this;
			var id = this.props.user_id;
			var patnerName = this.props.user_name;
			BootstrapDialog.confirm({
				title: 'WARNING',
				message: 'Unfriend with <b>' + patnerName + '</b>?',
				type: BootstrapDialog.TYPE_DANGER,
				size: 'size-small',
				closable: true,
				draggable: true,
				btnCancelLabel: 'Cancel',
				btnOKLabel: 'Ok',
				btnOKClass: 'btn-danger',
				callback: function callback(result) {
					if (result) {
						$.ajax({
							url: BASE_URL + '/services/users/unfriend',
							data: { user_id: id },
							success: function success() {
								that.setState({ buttonClass: 'btn btn-sm btn-default', iClass: 'fa fa-user-plus', status: 'Add Friend', previousStatus: 'Add Friend' });
							}
						});
					}
				}
			});
		} else if (status == 'Confirm Friend') {
			var that = this;
			$.ajax({
				url: BASE_URL + '/services/users/confirmrequest',
				data: { friend_id: id },
				type: 'POST',
				success: function success() {
					that.setState({ buttonClass: 'btn btn-sm btn-success', iClass: 'fa fa-check', status: 'Friend', previousStatus: 'Friend' });
				}
			});
		}
	},
	mouseOver: function mouseOver() {
		var status = this.state.status;
		if (status == 'Friend') {
			this.setState({ buttonClass: 'btn btn-sm btn-danger', iClass: 'fa fa-waring', status: 'Unfriend' });
		} else if (status == 'Friend Request Sent') {
			this.setState({ buttonClass: 'btn btn-sm btn-danger', iClass: '', status: 'Cancel Request' });
		}
	},
	onMouseLeave: function onMouseLeave() {
		var previousStatus = this.state.previousStatus;
		if (previousStatus == 'Add Friend') {
			this.setState({ buttonClass: 'btn btn-sm btn-default', iClass: 'fa fa-user-plus', status: previousStatus });
		} else if (previousStatus == 'Friend') {
			this.setState({ buttonClass: 'btn btn-sm btn-success', iClass: 'fa fa-check', status: previousStatus });
		} else if (previousStatus == 'Friend Request Sent') {
			this.setState({ buttonClass: 'btn btn-sm btn-primary', iClass: '', status: previousStatus });
		}
	},
	render: function render() {
		return React.createElement(
			'button',
			{ className: this.state.buttonClass, onMouseOver: this.mouseOver, onMouseLeave: this.onMouseLeave, onClick: this.toggle },
			React.createElement('i', { className: this.state.iClass }),
			' ',
			this.state.status
		);
	}
});

//user_id, follow_status
var FollowButton = React.createClass({
	displayName: 'FollowButton',

	getInitialState: function getInitialState() {
		return { buttonClass: '', iClass: '', status: '' };
	},
	componentDidMount: function componentDidMount() {
		var follow = this.props.follow_status;

		if (follow == '1') {
			//1 la friend, 2 la da gui friend request 0 la ko phai friend va chua gui
			this.setState({ buttonClass: 'btn btn-sm btn-primary', iClass: 'fa fa-check', status: 'Following' });
		} else {
			this.setState({ buttonClass: 'btn btn-sm btn-default', iClass: 'fa fa-rss', status: 'Follow' });
		}
	},
	toggleFollow: function toggleFollow(e) {
		e.preventDefault();
		var status = this.state.status;
		var id = this.props.user_id;
		var that = this;
		$.ajax({
			url: BASE_URL + '/services/users/follow',
			data: { patner_id: id },
			success: function success() {
				var status = that.state.status;
				if (status == 'Unfollow') {
					that.setState({ buttonClass: 'btn btn-sm btn-default', iClass: 'fa fa-rss', status: 'Follow' });
				} else if (status == 'Follow') {
					that.setState({ buttonClass: 'btn btn-sm btn-primary', iClass: 'fa fa-check', status: 'Following' });
				}
			}
		});
	},
	mouseOver: function mouseOver() {
		var status = this.state.status;
		if (status == 'Following') {
			this.setState({ buttonClass: 'btn btn-sm btn-warning', iClass: '', status: 'Unfollow' });
		}
	},
	onMouseLeave: function onMouseLeave() {
		var status = this.state.status;
		if (status == 'Unfollow') {
			this.setState({ buttonClass: 'btn btn-sm btn-primary', iClass: 'fa fa-check', status: 'Following' });
		}
	},
	render: function render() {
		return React.createElement(
			'button',
			{ ref: 'bt', className: this.state.buttonClass + ' followButton', onMouseOver: this.mouseOver, onMouseLeave: this.onMouseLeave, onClick: this.toggleFollow },
			React.createElement('i', { className: this.state.iClass }),
			' ',
			this.state.status
		);
	}
});