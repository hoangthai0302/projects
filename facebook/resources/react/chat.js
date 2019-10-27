"use strict";

var Chatters = React.createClass({
	displayName: "Chatters",

	render: function render() {
		var that = this;
		var data = this.props.data.map(function (user) {
			return React.createElement(Chatter, { avatar: user.avatar, name: user.name, link: user.link, id: user.id, key: user.id, online: user.is_online });
		});
		return React.createElement(
			"div",
			{ id: "chatbox", className: "hidden-md hidden-sm hidden-xs" },
			React.createElement("div", { className: "inner" }),
			React.createElement(
				"div",
				{ id: "chatlist" },
				data
			),
			React.createElement(
				"div",
				{ id: "chat_search" },
				React.createElement("input", { type: "text", placeholder: "search people" })
			)
		);
	}
});

//id có dạng 'chat1234' với 1234 là id của patner
var ChatPanel = React.createClass({
	displayName: "ChatPanel",

	componentDidMount: function componentDidMount() {

		var scroll = React.findDOMNode(this.refs.scroll);

		wait(100, function () {
			var height = scroll.scrollHeight;
			$(scroll).scrollTop(height);
		});
	},
	closePanel: function closePanel() {
		var panel = React.findDOMNode(this.refs.panel);
		$(panel).parent().remove();
	},
	sendMessage: function sendMessage(e) {
		var code = e.keyCode ? e.keyCode : e.which;
		if (code == 13) {
			//Enter keycode
			var msg = e.target.value;
			if (msg.length > 0) {
				var postData = {};
				var patner = this.props.patner;
				postData["patner"] = patner;
				postData['text'] = msg;
				var message = {
					to: '1',
					text: msg,
					time: parseInt(moment().format("X"))
				};
				var that = this;
				$.ajax({
					type: 'POST',
					url: BASE_URL + '/services/messages/new',
					data: postData,
					success: function success(data) {
						if (data.error == '') {
							for (var i in conversations) {
								if (conversations[i]['id'] == patner) {
									conversations[i]['data']['messages'].push(message);
									conversations[i]['data']['seen'] = 0;
									break;
								}
							}
							that.setState({});
							var scroll = React.findDOMNode(that.refs.scroll);

							var height = scroll.scrollHeight;
							$(scroll).scrollTop(height);
						}
					}
				});
				//clear text
				e.target.value = '';
				return false;
			}
		}
	},
	render: function render() {
		var lastTime;
		var that = this;

		var count = 0;
		var data = this.props.data;
		var length = data.messages.length;
		var messages = data.messages.map(function (message) {
			var to = message.to;
			var text = message.text;
			var time = message.time;
			var timer = React.createElement("span", null);

			if (lastTime == null) {
				lastTime = time;
				timer = React.createElement(
					"p",
					{ className: "datestamp" },
					moment.unix(time).format("MMM ddd, h:mm A")
				);
			} else {
				var deltaTime = time - lastTime;
				if (deltaTime > 60 * 15) {
					var day = moment.unix(time).dayOfYear();
					var currentDay = moment().dayOfYear();
					if (day == currentDay) {
						timer = React.createElement(
							"p",
							{ className: "datestamp" },
							moment.unix(time).format("h:mm A")
						);
					} else {
						var week = moment.unix(time).week();
						var currentWeek = moment().week();
						if (week == currentWeek) {
							timer = React.createElement(
								"p",
								{ className: "datestamp" },
								moment.unix(time).format(" ddd ,h:mm A")
							);
						} else {
							var month = moment.unix(time).month();
							var currentMonth = moment().month();
							if (month == currentMonth) {
								timer = React.createElement(
									"p",
									{ className: "datestamp" },
									moment.unix(time).format(" MMM DD ,h:mm A")
								);
							} else {
								timer = React.createElement(
									"p",
									{ className: "datestamp" },
									moment.unix(time).format("MMM DD YYYY,h:mm A")
								);
							}
						}
					}
				}
			}
			lastTime = time;
			var img = "";

			var className;
			var className2;
			if (to == '1') {
				className = "bubbledRight";
				className2 = "rightside";
			} else {
				className = "bubbledLeft";
				className2 = "leftside";

				if (count + 1 < length) {
					var nextTime = data['messages'][count + 1].time;
					var delta = nextTime - time;

					if (data['messages'][count]['to'] == '0' && (data['messages'][count + 1]['to'] == '1' || delta > 60 * 15)) {
						img = React.createElement("img", { src: '/facebook/resources/images/uploads/' + that.props.avatar });
					}
				} else {
					img = React.createElement("img", { src: '/facebook/resources/images/uploads/' + that.props.avatar });
				}
			}

			count++;

			return React.createElement(
				"div",
				{ className: 'chat-message ' + className2 },
				timer,
				React.createElement(
					"div",
					{ className: "clearfix bottom" },
					img,
					React.createElement(
						"div",
						{ className: className },
						React.createElement(Text, { text: text })
					),
					seen
				)
			);
		});
		var _seen = data.seen;
		var _time = moment.unix(data.time).format("DD, MMM YYYY h:mm a");
		var seen = React.createElement(
			"div",
			{ className: "text-center text-muted" },
			"seen ",
			_time
		);
		if (parseInt(_seen) == 0 || data['messages'][length - 1]['to'] == '0') {
			seen = React.createElement("i", null);
		}
		return React.createElement(
			"div",
			{ className: "chatpanel", ref: "panel" },
			React.createElement(
				"div",
				{ className: "header" },
				React.createElement(
					"a",
					{ href: "/facebook/" + this.props.link },
					this.props.name
				),
				React.createElement("i", { className: "fa fa-times pull-right", onClick: this.closePanel })
			),
			React.createElement(
				"div",
				{ className: "main", ref: "scroll" },
				messages,
				seen
			),
			React.createElement(
				"div",
				{ className: "footer" },
				React.createElement("input", { type: "text", placeholder: "Type a message", onKeyPress: this.sendMessage })
			)
		);
	}
});

var Chatter = React.createClass({
	displayName: "Chatter",

	showChatPanel: function showChatPanel() {

		var that = this;
		var data = null;
		var seen = 0;
		var patner = this.props.id;

		$.ajax({
			data: { patner: patner },
			url: BASE_URL + '/services/messages/seen'
		});

		//chưa có panel
		if ($('#chat' + patner).length == 0) {
			//đóng bớt chat panel nếu nhiều hơn 3
			if ($('#chatters').children().length == 3) {
				$('#chatters>div:first-child').remove();
			}

			//lấy dữ liệu từ conversations nếu có
			for (var i in conversations) {
				if (conversations[i]['id'] == patner) {
					data = conversations[i]['data'];
					break;
				}
			}
			//chưa có dữ liệu, lấy dữ liệu đổ vào data và thêm vào conversations
			if (data == null) {
				$.ajax({
					url: BASE_URL + '/services/messages/get',
					data: { patner: this.props.id },
					success: function success(data) {

						conversations.push({ id: patner, data: data, avatar: that.props.avatar, link: that.props.link, name: that.props.name });
						var div = document.createElement('div');
						$(div).attr('id', 'chat' + patner);
						$(div).css('float', 'right');
						$(div).css('margin-left', '10px');
						React.render(React.createElement(ChatPanel, { data: data, patner: patner, avatar: that.props.avatar, name: that.props.name, link: that.props.link }), div);
						$('#chatters').append(div);
					}
				});
			} else {
				var div = document.createElement('div');
				$(div).attr('id', 'chat' + patner);
				$(div).css('float', 'right');
				$(div).css('margin-left', '10px');
				React.render(React.createElement(ChatPanel, { data: data, patner: patner, avatar: that.props.avatar, name: that.props.name, link: that.props.link }), div);
				$('#chatters').append(div);
			}
		}
	},
	render: function render() {
		var isOnline = this.props.online;
		var i = React.createElement("i", { className: "online pull-right" });
		if (isOnline == '0') {
			i = React.createElement("i", { className: "offline pull-right" });
		}
		return React.createElement(
			"div",
			{ className: "clearfix", onClick: this.showChatPanel },
			React.createElement("img", { src: '/facebook/resources/images/uploads/' + this.props.avatar, className: "img-rounded thumb-sm" }),
			" ",
			this.props.name,
			i
		);
	}
});