'use strict';

var WallHeader = React.createClass({
    displayName: 'WallHeader',

    componentDidMount: function componentDidMount() {
        var data = this.props.data;
        var top = data.bgtop;
        var imgBg = React.findDOMNode(this.refs.imgBg);
        imgBg.style.top = top + 'px';
    },
    changeAvatar: function changeAvatar() {
        var inputFile = React.findDOMNode(this.refs.avatarFile);
        $(inputFile).trigger('click');
    },
    changeBackground: function changeBackground() {
        var inputFile = React.findDOMNode(this.refs.bgFile);
        $(inputFile).trigger('click');
    },
    onBgFileSelected: function onBgFileSelected() {
        var file = React.findDOMNode(this.refs.bgFile);
        var files = file.files;

        var formData = new FormData();
        for (var i in files) {
            formData.append("file", file.files[i]);
        }
        console.log('called');
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/upload',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function success(data) {
                console.log('called1');
                if (data.length > 0) {
                    var link = data[0].name;
                    console.log('called2');
                    var imgBg = React.findDOMNode(that.refs.imgBg);
                    imgBg.src = '/facebook/resources/images/uploads/' + link;
                    imgBg.style.top = 0;
                    imgBg.style.left = 0;
                    $(imgBg).tinyDraggable();
                    $(imgBg).css('cursor', 'n-resize');
                    var span = document.createElement('span');

                    span.innerHTML = 'save cover';
                    $(span).addClass('btn btn-default');
                    $(span).css('position', 'absolute');
                    $(span).css('zIndex', '9999');
                    $(span).css('bottom', '250px');
                    $(span).css('right', '50px');

                    var timelineBG = React.findDOMNode(that.refs.timelineBG);
                    $(timelineBG).prepend(span);

                    $(span).click(function () {
                        var top = imgBg.style.top;
                        var left = imgBg.style.left;
                        top = top.slice(0, top.length - 2);
                        left = left.slice(0, left.length - 2);
                        $.ajax({
                            url: BASE_URL + '/services/upload/changebackground',
                            data: { top: top, left: left, link: link, id: that.props.data.id },
                            type: 'POST',
                            success: function success(data) {
                                if (data.error == '') {
                                    $(span).remove();
                                }
                            }

                        });
                        $(imgBg).off();
                        $(imgBg).css('cursor', 'default');
                    });
                }
            }

        });
    },
    onAvatarFileSelected: function onAvatarFileSelected() {
        var file = React.findDOMNode(this.refs.avatarFile);
        var files = file.files;

        var formData = new FormData();
        for (var i in files) {
            formData.append("file", file.files[i]);
        }
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/upload',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function success(data) {
                if (data.length > 0) {
                    var link = data[0].name;
                    $.ajax({
                        url: '/facebook/services/upload/changeavatar',
                        data: { link: link, id: that.props.data.id },
                        type: 'POST',
                        success: function success(data) {
                            if (data.error == '') {
                                React.findDOMNode(that.refs.imgAvatar).src = '/facebook/resources/images/uploads/' + link;
                            }
                        }
                    });
                }
            }
        });
    },
    showUpdates: function showUpdates(e) {
        e.preventDefault();
        $("#main").css('display', 'block');
        $('#photos').addClass('hidden');
        $('#friendbook').addClass('hidden');
        window.onscroll = function () {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {

                var token = null;
                page = $('#page').html();
                var wall_id = $('#wall_id').html();
                var postData = {};
                postData['wall_id'] = wall_id;
                postData['page'] = page;

                var offset = updates.length;
                postData['offset'] = offset;
                $.ajax({
                    async: false,
                    url: BASE_URL + "/services/homeWall",
                    data: postData,
                    type: "post"
                }).success(function (msg) {
                    updates = updates.concat(msg.updates);
                    React.render(React.createElement(UpdateList, { data: updates }), document.getElementById('timeline'));
                }).fail(function () {
                    alert("failed");
                });
            }
        };

        var timelineNav = ReactDOM.findDOMNode(this.refs.timelineNav);
        $('#span1, #span3', timelineNav).removeClass('active');
        $('#span2', timelineNav).addClass('active');
    },
    showFriends: function showFriends(e) {
        e.preventDefault();
        $("#main").css('display', 'none');
        $('#photos').addClass('hidden');
        $('#friendbook').removeClass('hidden');
        window.onscroll = null;

        var timelineNav = ReactDOM.findDOMNode(this.refs.timelineNav);
        $('#span2, #span3', timelineNav).removeClass('active');
        $('#span1', timelineNav).addClass('active');

        $.ajax({
            url: BASE_URL + '/services/users/friends',
            data: { current_wall_id: current_wall.id },
            success: function success(data) {
                React.render(React.createElement(FriendBook, { data: data, title: 'Friends' }), document.getElementById('friendbook'));
            }
        });
    },
    showMembers: function showMembers(e) {
        e.preventDefault();
        $("#main").css('display', 'none');
        $('#photos').addClass('hidden');
        $('#friendbook').removeClass('hidden');
        window.onscroll = null;

        var timelineNav = ReactDOM.findDOMNode(this.refs.timelineNav);
        $('#span2, #span3', timelineNav).removeClass('active');
        $('#span1', timelineNav).addClass('active');

        $.ajax({
            url: BASE_URL + '/services/group/members',
            data: { group_id: current_wall.id },
            success: function success(data) {
                currentMembers = data;
                React.render(React.createElement(FriendBook, { data: data, title: 'Members' }), document.getElementById('friendbook'));
            }
        });
    },
    showPhotoAlbum: function showPhotoAlbum(e) {
        e.preventDefault();
        $("#main").css('display', 'none');
        $('#photos').removeClass('hidden');
        $('#friendbook').addClass('hidden');
        window.onscroll = null;

        var timelineNav = ReactDOM.findDOMNode(this.refs.timelineNav);
        $('#span1, #span2', timelineNav).removeClass('active');
        $('#span3', timelineNav).addClass('active');
        var currentWallId = current_wall.id;
        if (!currentWallId) {
            currentWallId = you.id;
        }
        $.ajax({
            url: BASE_URL + '/services/users/photos',
            data: { wall_id: currentWallId },
            success: function success(data) {
                currentPhotos = data;
                React.render(React.createElement(TimelineAlbum, { data: data }), document.getElementById('photos'));
            }
        });
    },
    joinGroup: function joinGroup(e) {
        var group_id = current_wall.id;
        var target = e.target;
        if (target.tagName == 'SPAN') {
            target = target.parentElement;
        }
        $.ajax({
            url: BASE_URL + '/services/group/join',
            data: { group_id: group_id },
            success: function success(data) {
                if (data.error == '') {
                    $(target).html('Joined');
                    target.className = 'buttonPro blue';
                    current_wall.member_count++;
                    React.render(React.createElement(WallHeader, { data: current_wall }), document.getElementById('wall_header'));
                }
            }
        });
    },
    render: function render() {
        var data = this.props.data;

        var style = { backgroundColor: '#d5d6d9', width: '100%' };
        var count = React.createElement('div', null);
        var button;
        var button2 = React.createElement('i', null);

        //user page
        if (parseInt(current_wall.id) > 1090346680) {
            count = React.createElement(
                'a',
                { href: 'javascript:void(0)', className: 'reset', onClick: this.showFriends },
                React.createElement('span', { id: 'span1', className: 'arrowUp' }),
                React.createElement(
                    'span',
                    { className: 'timelineNum' },
                    data.friend_count
                ),
                ' Friends'
            );
            if (current_wall.id != you.id) {
                button = React.createElement(AddfriendButton, { user_id: current_wall.id, friend_status: current_wall.is_friend, user_name: current_wall.name });
                button2 = React.createElement(FollowButton, { user_id: current_wall.id, follow_status: current_wall.is_follow });
            }
        } else {
            //group page
            count = React.createElement(
                'a',
                { href: 'javascript:void(0)', className: 'reset', onClick: this.showMembers },
                React.createElement('span', { id: 'span1', className: 'arrowUp' }),
                React.createElement(
                    'span',
                    { className: 'timelineNum' },
                    data.member_count
                ),
                ' Members'
            );
            if (data.owner_id == you.id) {
                button = React.createElement(
                    'button',
                    { className: 'buttonPro blue', onClick: this.manageGroup },
                    'Your group'
                );
            } else {
                if (parseInt(data.is_member) == 1) {
                    button = React.createElement(
                        'button',
                        { className: 'buttonPro blue' },
                        'Joined'
                    );
                } else {
                    button = React.createElement(
                        'button',
                        { className: 'buttonPro green', onClick: this.joinGroup },
                        'Join Group'
                    );
                }
            }
        }
        var cameraAvatar = React.createElement('span', null);
        var cameraBg = React.createElement('span', null);
        if (current_wall.id == you.id || current_wall.owner_id == you.id) {
            cameraAvatar = React.createElement('i', { className: 'camera', ref: 'camera-avatar', onClick: this.changeAvatar });
            cameraBg = React.createElement('i', { className: 'camera', ref: 'camera-bg', folder: 'icons', onClick: this.changeBackground });
        }

        var link;
        if (current_wall.id > 1090346681) {
            link = '/facebook/' + current_wall.link;
        } else {
            link = '/facebook/group/' + current_wall.link;
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { id: 'timelineBG', ref: 'timelineBG', style: style },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + data.background, className: 'relative full-width', ref: 'imgBg', folder: 'uploads' }),
                cameraBg,
                React.createElement(
                    'a',
                    { href: link, className: 'wall_name' },
                    current_wall.name
                )
            ),
            React.createElement(
                'div',
                { id: 'timelineProfilePic' },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + data.avatar, ref: 'imgAvatar', folder: 'uploads', id: 'userAvatar', className: 'img-thumbnail wall_avatar' }),
                cameraAvatar,
                React.createElement('input', { type: 'file', className: 'hidden', ref: 'bgFile', onChange: this.onBgFileSelected }),
                React.createElement('input', { type: 'file', className: 'hidden', ref: 'avatarFile', onChange: this.onAvatarFileSelected }),
                React.createElement('div', { className: 'space-sm' })
            ),
            React.createElement(
                'div',
                { id: 'timelineNav', ref: 'timelineNav' },
                React.createElement(
                    'div',
                    { id: 'timelineButtons' },
                    React.createElement(
                        'span',
                        { className: 'follow' },
                        ' ',
                        button2
                    ),
                    React.createElement(
                        'span',
                        { className: 'follow' },
                        ' ',
                        button
                    )
                ),
                React.createElement(
                    'ul',
                    null,
                    React.createElement(
                        'li',
                        null,
                        React.createElement('span', { id: 'span2', className: 'arrowUp active' }),
                        React.createElement(
                            'a',
                            { href: 'javascript:void(0)', className: 'reset', onClick: this.showUpdates },
                            React.createElement(
                                'span',
                                {
                                    id: 'update_count', className: 'timelineNum' },
                                data.update_count
                            ),
                            ' Updates'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        count
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement('span', { id: 'span3', className: 'arrowUp' }),
                        React.createElement(
                            'a',
                            { href: 'javascript:void(0)', className: 'reset', onClick: this.showPhotoAlbum },
                            React.createElement(
                                'span',
                                {
                                    id: 'update_count', className: 'timelineNum' },
                                data.upload_count
                            ),
                            ' Photos'
                        )
                    )
                )
            )
        );
    }
});