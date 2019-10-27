"use strict";

var Notification = React.createClass({
    displayName: "Notification",

    showDetail: function showDetail() {
        var object_id = this.props.object_id;
        var action = this.props.action;
        $.ajax({
            url: BASE_URL + '/services/updates/detail',
            data: { object_id: object_id, action: action },
            success: function success(data) {
                updates = data;
                reRender();
                window.onscroll = null;
                window.history.pushState({ "html": "abc", "pageTitle": "title" }, "", 'http://localhost:8081/facebook/update/' + object_id + '/' + action);
            }
        });
    },
    render: function render() {
        var action = this.props.action;
        var text = this.props.text;

        var dosomething = "";
        if (action == "1") {
            dosomething = "likes your status:'" + text + "'";
        } else if (action == "2") {
            dosomething = "likes your comment:'" + text + "'";
        } else if (action == "3") {
            dosomething = "likes your reply:'" + text + "'";
        } else if (action == "4") {
            dosomething = "reply your comment:'" + text + "'";
        } else if (action == "5") {
            dosomething = "comment your status:'" + text + "'";
        }

        var names = this.props.names;
        var total = this.props.total;
        var other_count = parseInt(total) - 3;
        if (other_count > 0) {
            names = names + ' and ' + other_count;
        }
        return React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { href: "#", onClick: this.showDetail, className: "media" },
                React.createElement(
                    "div",
                    { className: "media-left" },
                    React.createElement("img", { src: '/facebook/resources/images/uploads/' + this.props.avatar, className: "img-rounded thumb-md" })
                ),
                React.createElement(
                    "div",
                    { className: "media-body" },
                    React.createElement(
                        "small",
                        null,
                        React.createElement(
                            "b",
                            null,
                            names
                        ),
                        " ",
                        dosomething
                    ),
                    " ",
                    React.createElement(Timer, { time: this.props.time, className: "text-muted media-object timeago" })
                )
            )
        );
    }
});

var NotificationList = React.createClass({
    displayName: "NotificationList",

    componentDidMount: function componentDidMount() {
        var container = React.findDOMNode(this.refs.scrollContainer);
        $(container).slimScroll({ height: '200px' });
    },
    render: function render() {
        var data = this.props.data.map(function (dt) {
            return React.createElement(Notification, { key: dt.id,
                avatar: dt.avatar,
                object_id: dt.object_id,
                someone: dt.someone,
                text: dt.text,
                action: dt.action,
                names: dt.names,
                seen: dt.seen,
                total: dt.total,
                time: dt.time });
        });
        return React.createElement(
            "div",
            { ref: "scrollContainer", className: "test" },
            data
        );
    }
});

var NotiCount = React.createClass({
    displayName: "NotiCount",

    render: function render() {
        if (this.props.count > 0) {
            return React.createElement(
                "span",
                { className: "badge badge-sm up bg-purple count" },
                this.props.count
            );
        }
        return React.createElement("span", null);
    }
});

var NavBar = React.createClass({
    displayName: "NavBar",

    getInitialState: function getInitialState() {
        return { notifications: [], chatnoties: [], friend_request: [], friend_confirm: [], searchResult: [] };
    },
    componentDidMount: function componentDidMount() {
        var div = React.findDOMNode(this.refs.auto_complete_container);
        $(div).hide();
    },
    searchPeopleAndGroup: function searchPeopleAndGroup(e) {
        var q = e.target.value;
        var that = this;
        var div = React.findDOMNode(this.refs.auto_complete_container);
        if (q.length > 0) {
            $.ajax({
                url: BASE_URL + '/services/search/peopleandgroup',
                data: { search: q }
            }).success(function (data) {
                if (data.length > 0) {
                    $(div).show();
                } else {
                    $(div).hide();
                }
                that.setState({ searchResult: data });
            });
        } else {
            that.setState({ users: [] });
            $(div).hide();
        }
    },
    showFriendRequest: function showFriendRequest() {
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/users/showfriendrequest',
            success: function success(data) {
                var friend_request = data.friend_request;
                var friend_confirm = data.friend_confirm;
                you.new_friend_request = 0;
                you.new_friend_confirm = 0;
                that.setState({ friend_request: friend_request, friend_confirm: friend_confirm });
            }
        });
    },
    showChatNotification: function showChatNotification() {
        you.new_chat_noties = 0;
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/messages/notifications',
            success: function success(data) {
                that.setState({ chatnoties: data });
            }

        });
    },
    showNotification: function showNotification(e) {
        e.preventDefault();
        var that = this;
        you.new_noties = 0;
        $.ajax({
            url: BASE_URL + '/services/users/notifications',
            success: function success(data) {
                that.setState({ notifications: data });
            }
        });
    },
    render: function render() {
        var searchResult = this.state.searchResult.map(function (result) {
            if (result.id < 1090346681) {
                result.link = 'group/' + result.link;
            }
            return React.createElement(
                "a",
                { href: '/facebook/' + result.link, "data-id": result.id, "data-name": result.name, "data-link": result.link },
                React.createElement("img", { src: '/facebook/resources/images/uploads/' + result.avatar }),
                " ",
                result.name
            );
        });
        var name = you.name;
        var index = name.lastIndexOf(' ');
        name = name.substring(index + 1, name.length);
        return React.createElement(
            "ul",
            { className: "nav navbar-nav" },
            React.createElement(
                "li",
                null,
                React.createElement(
                    "div",
                    { role: "search", className: "app-search pull-left relative" },
                    React.createElement("input", { type: "text", onChange: this.searchPeopleAndGroup, placeholder: "Search for people and groups.", className: "form-control input-sm" }),
                    " ",
                    React.createElement(
                        "a",
                        { href: "#", className: "search" },
                        React.createElement("i", {
                            className: "fa fa-search" })
                    ),
                    React.createElement(
                        "div",
                        { className: "auto_complete_container clearfix", ref: "auto_complete_container" },
                        searchResult
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: BASE_URL },
                    "Home"
                )
            ),
            React.createElement(
                "li",
                { className: "you_box" },
                React.createElement(
                    "a",
                    { href: BASE_URL + "/" + you.link, className: "text-nowrap" },
                    React.createElement("img", { className: "img-responsive thumb-xs", src: '/facebook/resources/images/uploads/' + you.avatar }),
                    " ",
                    name,
                    " "
                )
            ),
            React.createElement(
                "li",
                { className: "dropdown" },
                React.createElement(
                    "a",
                    { "data-toggle": "dropdown", id: "dropdown1", className: "dropdown-toggle friend_image", onClick: this.showFriendRequest, href: "#", "aria-expanded": "false" },
                    React.createElement(NotiCount, { count: parseInt(you.new_friend_request) + parseInt(you.new_friend_confirm) })
                ),
                React.createElement(
                    "ul",
                    { className: "dropdown-menu extended nicescroll", tabindex: "5001" },
                    React.createElement(FriendRequestList, { friend_request: this.state.friend_request, friend_confirm: this.state.friend_confirm })
                )
            ),
            React.createElement(
                "li",
                { className: "dropdown" },
                React.createElement(
                    "a",
                    { "data-toggle": "dropdown", className: "dropdown-toggle msg_image", onClick: this.showChatNotification, href: "#", "aria-expanded": "false" },
                    React.createElement(NotiCount, { count: you.new_chat_noties })
                ),
                React.createElement(
                    "ul",
                    { className: "dropdown-menu extended nicescroll", tabindex: "5001" },
                    React.createElement(
                        "li",
                        { className: "dropdown-header" },
                        React.createElement(
                            "span",
                            null,
                            "Messages"
                        )
                    ),
                    React.createElement(ChatNoties, { data: this.state.chatnoties }),
                    React.createElement(
                        "li",
                        { className: "dropdown-footer" },
                        React.createElement(
                            "a",
                            { href: "inbox.html", className: "text-center" },
                            "See all"
                        )
                    )
                )
            ),
            React.createElement(
                "li",
                { className: "dropdown" },
                React.createElement(
                    "a",
                    { "data-toggle": "dropdown", onClick: this.showNotification, id: "noti_count", className: "dropdown-toggle noti_image", href: "#", "aria-expanded": "false" },
                    React.createElement(NotiCount, { count: you.new_noties })
                ),
                React.createElement(
                    "ul",
                    { className: "dropdown-menu extended nicescroll", tabindex: "5001" },
                    React.createElement(
                        "li",
                        { className: "dropdown-header" },
                        React.createElement(
                            "span",
                            null,
                            "Notifications"
                        )
                    ),
                    React.createElement(NotificationList, { data: this.state.notifications }),
                    React.createElement(
                        "li",
                        { className: "dropdown-footer" },
                        React.createElement(
                            "a",
                            { href: "inbox.html", className: "text-center" },
                            "See all"
                        )
                    )
                )
            ),
            React.createElement(
                "li",
                null,
                React.createElement("a", { className: "set_image", href: "#" })
            ),
            React.createElement(
                "li",
                null,
                React.createElement(
                    "a",
                    { href: "/facebook/logout" },
                    "Logout"
                )
            )
        );
    }
});
var ChatNote = React.createClass({
    displayName: "ChatNote",

    showChatPanel: function showChatPanel() {
        var that = this;
        var data = null;

        var patner = this.props.id;

        $.ajax({
            data: { patner: patner },
            url: BASE_URL + '/services/messages/seen'
        });

        //chưa có panel
        if ($('#chat' + patner).length == 0) {
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
                        React.render(React.createElement(ChatPanel, { data: data, patner: patner, avatar: that.props.avatar, link: that.props.link, name: that.props.name }), div);
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
        var avatar = this.props.avatar;
        var text = this.props.text;
        var someone = this.props.someone;
        var name = this.props.name;
        return React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { href: "#", className: "media", onClick: this.showChatPanel },
                React.createElement(
                    "div",
                    { className: "media-left" },
                    React.createElement("img", { src: '/facebook/resources/images/uploads/' + this.props.avatar, className: "img-rounded thumb-md" })
                ),
                React.createElement(
                    "div",
                    { className: "media-body" },
                    React.createElement(
                        "small",
                        null,
                        React.createElement(
                            "b",
                            null,
                            name
                        ),
                        " ",
                        React.createElement("br", null),
                        " ",
                        text
                    ),
                    " ",
                    React.createElement(Timer, { time: this.props.time, className: "text-muted media-object timeago" })
                )
            )
        );
    }
});

var ChatNoties = React.createClass({
    displayName: "ChatNoties",

    componentDidMount: function componentDidMount() {
        var container = React.findDOMNode(this.refs.scrollContainer);
        $(container).slimScroll({ height: '200px' });
    },
    render: function render() {
        var data = this.props.data.map(function (dt) {
            return React.createElement(ChatNote, { id: dt.someone,
                key: dt.someone,
                someone: dt.someone,
                avatar: dt.avatar,
                name: dt.name,
                text: dt.text,
                time: dt.time });
        });
        return React.createElement(
            "div",
            { ref: "scrollContainer", className: "test" },
            data
        );
    }
});
var FriendRequest = React.createClass({
    displayName: "FriendRequest",

    confirmRequest: function confirmRequest(e) {
        e.stopPropagation();
        var id = this.props.id;
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/users/confirmrequest',
            type: 'POST',
            data: { friend_id: id },
            success: function success(data) {
                var bt1 = React.findDOMNode(that.refs.bt1);
                $(bt1).remove();
                var bt2 = React.findDOMNode(that.refs.bt2);
                $(bt2).remove();
                var bt3 = React.findDOMNode(that.refs.bt3);
                $(bt3).removeClass('hidden');
                if (data.status == '1') {
                    $(bt3).removeClass();
                    $(bt3).addClass('btn btn-sm btn-warning');
                    $('.span', bt3).html('Request cancelled before');
                    $('i', bt3).removeClass();
                    $('i', bt3).addClass('fa fa-exclamation-triangle');
                }
            }
        });
    },
    deleteRequest: function deleteRequest(e) {
        e.stopPropagation();
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/users/rejectfriendrequest',
            data: { patner_id: this.props.id },
            type: 'POST',
            success: function success() {
                var bt1 = React.findDOMNode(that.refs.bt1);
                $(bt1).remove();
                $(e.target).remove();
                var bt3 = React.findDOMNode(that.refs.bt3);
                $(bt3).removeClass('hidden');
                $('.span', bt3).html('Request removed');
            }
        });
    },
    handleMouseOver: function handleMouseOver(e) {
        $('#dropdown1').removeAttr('data-toggle');
    },
    handleMouseOut: function handleMouseOut(e) {
        $('#dropdown1').attr('data-toggle', 'dropdown');
    },
    render: function render() {
        return React.createElement(
            "li",
            null,
            React.createElement(
                "div",
                { href: "#", className: "media" },
                React.createElement(
                    "div",
                    { className: "media-left" },
                    React.createElement("img", { src: '/facebook/resources/images/uploads/' + this.props.avatar, className: "img-rounded thumb-md" })
                ),
                React.createElement(
                    "div",
                    { className: "media-body" },
                    React.createElement(UserName, { id: this.props.id, name: this.props.name, link: "/facebook/" + this.props.link })
                ),
                React.createElement(
                    "div",
                    { ref: "div", className: "media-right text-nowrap pt20 pr10", onMouseOut: this.handleMouseOut, onMouseOver: this.handleMouseOver },
                    React.createElement(
                        "button",
                        { ref: "bt1", className: "btn btn-sm btn-success mr10", onClick: this.confirmRequest },
                        "Confirm"
                    ),
                    React.createElement(
                        "button",
                        { ref: "bt2", className: "btn btn-sm btn-default", onClick: this.deleteRequest },
                        "Delete Request"
                    ),
                    React.createElement(
                        "button",
                        { ref: "bt3", className: "btn btn-sm btn-success hidden" },
                        React.createElement("i", { className: "fa fa-check" }),
                        " ",
                        React.createElement(
                            "span",
                            { className: "span" },
                            "Friend"
                        )
                    )
                )
            )
        );
    }
});

var FriendConfirm = React.createClass({
    displayName: "FriendConfirm",

    render: function render() {
        return React.createElement(
            "li",
            null,
            React.createElement(
                "div",
                { className: "media" },
                React.createElement(
                    "div",
                    { className: "media-left" },
                    React.createElement("img", { src: '/facebook/resources/images/uploads/' + this.props.avatar, className: "img-rounded thumb-md" })
                ),
                React.createElement(
                    "div",
                    { className: "media-body" },
                    React.createElement(UserName, { id: this.props.id, name: this.props.name, link: "/facebook/" + this.props.link })
                ),
                React.createElement(
                    "div",
                    { ref: "div", className: "media-right text-nowrap pt20 pr10" },
                    React.createElement(
                        "button",
                        { ref: "bt1", className: "btn btn-sm btn-success mr10" },
                        React.createElement("i", { className: "fa fa-check" }),
                        "Friend"
                    )
                )
            )
        );
    }
});

var FriendRequestList = React.createClass({
    displayName: "FriendRequestList",

    render: function render() {
        var friend_request = this.props.friend_request.map(function (dt) {
            return React.createElement(FriendRequest, { key: dt.id,
                id: dt.id,
                name: dt.name,
                link: dt.link,
                avatar: dt.avatar,
                mutual_count: dt.mutual_count });
        });
        var friend_confirm = this.props.friend_confirm.map(function (dt) {
            return React.createElement(FriendConfirm, { key: dt.id,
                id: dt.id,
                name: dt.name,
                link: dt.link,
                avatar: dt.avatar,
                mutual_count: dt.mutual_count });
        });

        if (friend_request.length == 0 && friend_confirm.length == 0) {
            return React.createElement(
                "div",
                { ref: "scrollContainer" },
                React.createElement(
                    "li",
                    { className: "dropdown-header" },
                    React.createElement(
                        "span",
                        null,
                        "No friend request"
                    )
                )
            );
        } else if (friend_request.length > 0 && friend_confirm.length == 0) {
            return React.createElement(
                "div",
                { ref: "scrollContainer" },
                React.createElement(
                    "li",
                    { className: "dropdown-header" },
                    React.createElement(
                        "span",
                        null,
                        "Friend Request"
                    )
                ),
                friend_request,
                React.createElement(
                    "li",
                    { className: "dropdown-footer" },
                    React.createElement(
                        "a",
                        { href: "inbox.html", className: "text-center" },
                        "See all"
                    )
                )
            );
        } else if (friend_request.length == 0 && friend_confirm.length > 0) {
            return React.createElement(
                "div",
                { ref: "scrollContainer" },
                React.createElement(
                    "li",
                    { className: "dropdown-header" },
                    React.createElement(
                        "span",
                        null,
                        "Friend Confirm"
                    )
                ),
                friend_confirm,
                React.createElement(
                    "li",
                    { className: "dropdown-footer" },
                    React.createElement(
                        "a",
                        { href: "inbox.html", className: "text-center" },
                        "See all"
                    )
                )
            );
        }
        return React.createElement(
            "div",
            { ref: "scrollContainer" },
            React.createElement(
                "li",
                { className: "dropdown-header" },
                React.createElement(
                    "span",
                    null,
                    "Friend Confirm"
                )
            ),
            friend_confirm,
            React.createElement(
                "li",
                { className: "dropdown-header" },
                React.createElement(
                    "span",
                    null,
                    "Friend Request"
                )
            ),
            friend_request,
            React.createElement(
                "li",
                { className: "dropdown-footer" },
                React.createElement(
                    "a",
                    { href: "inbox.html", className: "text-center" },
                    "See all"
                )
            )
        );
    }
});