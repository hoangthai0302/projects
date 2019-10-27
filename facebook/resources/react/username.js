'use strict';

var ToolTip = React.createClass({
    displayName: 'ToolTip',

    componentDidMount: function componentDidMount() {

        var top = this.props.bgtop;
        var imgBg = React.findDOMNode(this.refs.imgBg);
        imgBg.style.position = 'relative';
        imgBg.style.top = top * 4 / 9 + 'px';
    },
    openChatPanel: function openChatPanel() {
        var that = this;
        var data = null;
        var patner = this.props.userId;
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
                    data: { patner: patner },
                    success: function success(dt) {
                        data = dt;
                        conversations.push({ id: patner, data: dt });
                        var div = document.createElement('div');
                        $(div).attr('id', 'chat' + patner);
                        $(div).css('float', 'right');
                        $(div).css('margin-left', '10px');
                        React.render(React.createElement(ChatPanel, { data: data, patner: patner, avatar: that.props.avatar, link: that.props.link, name: that.props.username }), div);
                        $('#chatters').append(div);
                    }
                });
            } else {
                var div = document.createElement('div');
                $(div).attr('id', 'chat' + patner);
                $(div).css('float', 'right');
                $(div).css('margin-left', '10px');
                React.render(React.createElement(ChatPanel, { data: data, patner: patner, avatar: that.props.avatar, name: that.props.username, link: that.props.link }), div);
                $('#chatters').append(div);
            }
        }
    },
    render: function render() {
        var id = this.props.userId;
        var div = React.createElement('div', null);
        if (id > 1090346680) {
            div = React.createElement(
                'div',
                { className: 'btn-group' },
                React.createElement(AddfriendButton, { user_id: this.props.userId, user_name: this.props.username, friend_status: this.props.friendStatus }),
                React.createElement(
                    'button',
                    { className: 'btn btn-sm btn-default', onClick: this.openChatPanel },
                    React.createElement('i', { className: 'fa fa-comments' }),
                    ' Message'
                )
            );
        }
        var footer = React.createElement('div', null);
        if (id != you.id) {
            footer = React.createElement(
                'div',
                { className: 'author_footer bd-t rd-b p5 bg-color2 clearfix mytooltip' },
                React.createElement(
                    'div',
                    { className: 'pull-right' },
                    React.createElement(FollowButton, { user_id: this.props.userId, follow_status: this.props.followStatus }),
                    React.createElement(
                        'i',
                        null,
                        ' '
                    ),
                    div
                )
            );
        }

        return React.createElement(
            'div',
            { ref: 'tooltipContent', className: 'tooltipWrapper rd bg light-shadow ' },
            React.createElement(
                'div',
                { className: 'author_bg rd-t' },
                React.createElement('img', { ref: 'imgBg', src: '/facebook/resources/images/uploads/' + this.props.background, className: 'img-responsive' })
            ),
            React.createElement(
                'a',
                { href: this.props.link, className: 'author_avatar light-shadow ' },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + this.props.avatar, className: 'thumb-xl' })
            ),
            React.createElement(
                'div',
                { className: 'author_body clearfix pb20 relative' },
                React.createElement(
                    'a',
                    { href: this.props.link, className: 'tooltip_username ' },
                    this.props.username
                )
            ),
            React.createElement(
                'div',
                { className: 'about' },
                this.props.about
            ),
            footer
        );
    }
});

var UserName = React.createClass({
    displayName: 'UserName',

    showTooltip: function showTooltip(e) {

        var target = e.target;

        var that = this;
        var user_id = this.props.id;
        if (target.className.indexOf('text_name') != -1) {
            $(target).tooltipster({
                interactive: true,
                content: 'Loading...',
                position: 'top-left',
                arrow: false,
                contentAsHTML: true,
                contentCloning: false, //quan trọng, nếu ko sẽ mất hết event gán vào content
                updateAnimation: false,
                delay: 200,
                functionBefore: function functionBefore(origin, continueTooltip) {
                    // we'll make this function asynchronous and allow the tooltip to go ahead and show the loading
                    continueTooltip();
                    $.ajax({
                        url: '/facebook/services/user/shortinfo',
                        data: { id: user_id },
                        success: function success(data) {

                            var name = that.props.name;
                            var link = that.props.link;
                            var username = name.capitalize();
                            var avatar = data.avatar;
                            var about = data.about;
                            var background = data.background;
                            var bgtop = data.bgtop;
                            var friendStatus = data.friend_status;
                            var followStatus = data.follow_status;

                            var div = document.createElement('div');
                            $(div).css('width', '400px');
                            //render nội dung vào tooltip
                            React.render(React.createElement(ToolTip, { username: username,
                                avatar: avatar,
                                background: background,
                                bgtop: bgtop,
                                link: link,
                                about: about,
                                friendStatus: friendStatus,
                                followStatus: followStatus,
                                userId: user_id }), div);
                            origin.tooltipster('content', $(div));
                        }

                    });
                }
            });
        }
    },

    render: function render() {
        var smallText = this.props.smallText;
        var name = this.props.name.capitalize();
        var bold = this.props.bold;
        var textClass = "";
        if (bold == '0') {
            textClass = " normal_text";
        }
        return React.createElement(
            'a',
            { href: this.props.link, ref: 'username', className: "text_name" + textClass, onMouseOver: this.showTooltip },
            ' ',
            name
        );
    }
});