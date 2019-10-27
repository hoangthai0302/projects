//tags: danh sach friend tag, tag_count, id : la update_id
'use strict';

var TooltipTag = React.createClass({
    displayName: 'TooltipTag',

    componentDidMount: function componentDidMount() {
        var a = React.findDOMNode(this.refs.a);
        a.title = '';
    },
    showListTag: function showListTag(e) {
        var update_id = this.props.id;
        var tags = this.props.tags;
        $.ajax({
            url: BASE_URL + '/services/tag/list',
            data: { update_id: update_id },
            success: function success(data) {
                //loại bỏ những người trong list tags ra khỏi kq
                for (var i in data) {
                    for (var j in tags) {
                        if (tags[j]['id'] == data[i]['id']) {
                            data.splice(i, 1);
                        }
                    }
                }

                var div = document.createElement('div');
                React.render(React.createElement(PeopleBook, { data: data }), div);

                var dialog = new BootstrapDialog({
                    title: '<b>People</b>',
                    message: function message(dialog) {
                        return $(div);
                    },
                    onshown: function onshown(dialogRef) {}
                });
                dialog.realize();
                dialog.open();
            }
        });
    },
    showTooltip: function showTooltip(e) {
        var tag_count = this.props.tag_count;
        var friendtags = this.props.tags.length;
        var target = e.target;
        if (target.tagName == 'SPAN') {
            target = target.parentElement;
        }

        if (target.tagName == 'A' && target.title == '') {

            var update_id = this.props.id;
            var friends = "";
            var prefix = "";
            var tags = this.props.tags;
            if (tags.length > 0) {
                for (var i in tags) {
                    friends += prefix + tags[i]['id'];
                    prefix = ',';
                }
            }
            $.ajax({
                url: BASE_URL + '/services/tag/getshortlist',
                data: { update_id: update_id, friends: friends },
                success: function success(list) {

                    var str = '';
                    for (var i in list) {
                        var name = list[i]['name'];
                        str += '<div>' + name + "</div>";
                    }
                    if (tag_count - friendtags > list.length) {
                        str += 'and ' + (tag_count - friendtags - list.length) + ' others';
                    }
                    $(target).attr('title', str);
                    $(target).tooltip({ title: str, html: true }).tooltip('show');
                }
            });
        }
    },
    render: function render() {
        return React.createElement(
            'a',
            { href: 'javascript:void(0)', ref: 'a', onMouseOver: this.showTooltip, onClick: this.showListTag },
            this.props.children
        );
    }
});

//props:friend_id, mutual_count
var TooltipMutual = React.createClass({
    displayName: 'TooltipMutual',

    showListMutual: function showListMutual(e) {
        var patner_id = this.props.friend_id;
        $.ajax({
            url: BASE_URL + '/services/mutual/list',
            data: { patner_id: patner_id },
            success: function success(data) {

                var div = document.createElement('div');
                React.render(React.createElement(PeopleBook, { data: data }), div);

                var dialog = new BootstrapDialog({
                    title: '<b>People</b>',
                    message: function message(dialog) {
                        return $(div);
                    },
                    onshown: function onshown(dialogRef) {}
                });
                dialog.realize();
                dialog.open();
            }
        });
    },
    showTooltip: function showTooltip(e) {

        var target = e.target;
        if (target.tagName == 'SPAN') {
            target = target.parentElement;
        }
        if (target.tagName == 'A' && target.title == '') {
            var friend_id = this.props.friend_id;
            var that = this;
            $.ajax({
                url: BASE_URL + '/services/users/getMutualList',
                data: { friend_id: friend_id },
                success: function success(data) {
                    var mutual_count = that.props.mutual_count;
                    var list = data;
                    var str = '';
                    for (var i in list) {
                        var name = list[i]['name'];
                        str += '<span class=abc>' + name + "</span>";
                    }
                    if (mutual_count > list.length) {
                        str += 'and ' + (mutual_count - list.length) + ' others';
                    }
                    $(target).attr('title', str);
                    $(target).tooltip({ title: str, html: true }).tooltip('show');
                }
            });
        }
    },
    render: function render() {

        if (this.props.mutual_count > 0) {
            return React.createElement(
                'a',
                { ref: 'a', href: 'javascript:void(0)', title: '', onClick: this.showListMutual, onMouseOver: this.showTooltip },
                this.props.mutual_count,
                ' mutual friends'
            );
        } else {
            return React.createElement('i', null);
        }
    }
});

//likes, you_like, like_count,object_id, object_type
var TooltipLikeUpdate = React.createClass({
    displayName: 'TooltipLikeUpdate',

    componentDidMount: function componentDidMount() {
        var a = React.findDOMNode(this.refs.a);
        a.title = '';
    },
    showLikeList: function showLikeList(e) {
        var that = this;
        var likes = this.props.likes;
        $.ajax({
            url: BASE_URL + '/services/like/list', //json tra ve: id, name, link, avatar, mutual_count
            data: { likes: "", object_id: that.props.object_id, object_type: 1 },
            success: function success(data) {
                //loại bỏ you
                for (var i in data) {
                    if (data[i]['id'] == you.id) {
                        data.splice(i, 1);
                        break;
                    }
                }
                //loại bỏ friends like
                for (var i in data) {
                    for (var j in likes) {
                        if (likes[j]['id'] == data[i]['id']) {
                            data.splice(i, 1);
                        }
                    }
                }

                var div = document.createElement('div');
                React.render(React.createElement(PeopleBook, { data: data }), div);

                var dialog = new BootstrapDialog({
                    title: '<b>People Who Like</b>',
                    message: function message(dialog) {
                        return $(div);
                    },
                    onshown: function onshown(dialogRef) {}
                });
                dialog.realize();
                dialog.open();
            }
        });
    },
    showTooltip: function showTooltip(e) {
        e.stopPropagation();
        var target = e.target;
        if (target.tagName == 'SPAN') {
            target = target.parentElement;
        }
        if (target.tagName == 'A') {
            var like_count = this.props.like_count;
            var likes = this.props.likes;
            var object_id = this.props.object_id;
            var object_type = this.props.object_type;
            var friends = "";
            var prefix = "";
            if (likes.length > 0) {
                for (var i in likes) {
                    friends += prefix + likes[i]['id'];
                    prefix = ',';
                }
            }
            var that = this;
            var you_like = this.props.you_like;
            $.ajax({
                url: BASE_URL + '/services/likes/getshortlist',
                data: { object_id: object_id, object_type: object_type },
                success: function success(data) {
                    var list = data.likelist;
                    //xóa you khỏi danh sách
                    if (you_like == '1') {
                        for (var i in list) {
                            if (list[i]['id'] == you.id) {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }

                    for (var i in list) {
                        //loại bỏ những người trong ds likes
                        for (var j in likes) {
                            if (likes[j]['id'] == list[i]['id']) {
                                list.splice(i, 1);
                                break;
                            }
                        }
                    }

                    var str = '';
                    for (var i in list) {
                        var name = list[i]['name'];
                        str += '<span class=block>' + name + "</span>";
                    }

                    var otherlike = like_count - you_like - likes.length - list.length;
                    if (otherlike > 0) {
                        str += 'and ' + otherlike + ' others';
                    }
                    $(target).attr('data-original-title', str);
                    $(target).tooltip({ title: str, html: true }).tooltip('show');
                }
            });
        }
    },
    render: function render() {
        return React.createElement(
            'a',
            { href: 'javascript:void(0)', ref: 'a', onClick: this.showLikeList, onMouseOver: this.showTooltip },
            this.props.children
        );
    }
});

//props likes, like_count, object_id, object_type
var TooltipLike = React.createClass({
    displayName: 'TooltipLike',

    showLikeList: function showLikeList(e) {
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/like/list',
            data: { likes: "", object_id: that.props.object_id, object_type: that.props.object_type },
            success: function success(data) {

                var div = document.createElement('div');
                React.render(React.createElement(PeopleBook, { data: data }), div);

                var dialog = new BootstrapDialog({
                    title: '<b>People</b>',
                    message: function message(dialog) {
                        return $(div);
                    },
                    onshown: function onshown(dialogRef) {}
                });
                dialog.realize();
                dialog.open();
            }
        });
    },
    showTooltip: function showTooltip(e) {
        e.stopPropagation();
        var target = e.target;
        if (target.tagName == 'SPAN') {
            target = target.parentElement;
        }
        if (target.tagName == 'A') {
            var like_count = this.props.like_count;

            var object_id = this.props.object_id;
            var object_type = this.props.object_type;
            var friends = "";
            var prefix = "";

            var that = this;
            $.ajax({
                url: BASE_URL + '/services/likes/getshortlist',
                data: { object_id: object_id, object_type: object_type, friends: friends }, //friends trong la vi ko co danh sach likes di kem
                success: function success(data) {
                    var list = data.likelist;
                    var you_like = data.you_like;

                    var str = '';
                    var prefix = "";
                    for (var i in list) {

                        var name = list[i]['name'];
                        str += prefix + '<span class=transparent> ' + name + "</span>";
                        prefix = ',';
                    }
                    if (like_count > list.length) {
                        str += '<span class=transparent> and ' + (like_count - list.length) + ' others</span>';
                    }
                    str += ' <span class=transparent>like this</span>';
                    $(target).attr('data-original-title', str);
                    $(target).tooltip({ title: str, html: true }).tooltip('show');
                }
            });
        }
    },
    render: function render() {
        return React.createElement(
            'a',
            { href: 'javascript:void(0)', title: '', ref: 'a', onClick: this.showLikeList, onMouseOver: this.showTooltip },
            this.props.children
        );
    }
});