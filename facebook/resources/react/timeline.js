'use strict';

var updates = [];
var updateSingle = [];
var you = {};
var page = "";
var chatters = []; //id, avatar, link,name
var groups = [];
var current_wall = {};
var conversations = []; //to,text,time
var currentPhotos = [];
var currentMembers = [];
var viewMode = 0; //viewMode =0  la dang xem timeline, viewMode =1 tuc dang xem anh trong album

String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};

function playSound() {
    document.getElementById('alert').play();
}

function reRender() {
    if (viewMode == 0) {
        React.render(React.createElement(UpdateList, { data: updates }), document.getElementById('timeline'));
    } else {
        React.render(React.createElement(UpdateList, { data: updateSingle, showType: '1' }), //showType =1 la dang xem anh
        document.getElementById('template'));
    }
}

var now = moment();
var SetIntervalMixin = {
    componentWillMount: function componentWillMount() {
        this.intervals = [];
    },
    setInterval: (function (_setInterval) {
        function setInterval() {
            return _setInterval.apply(this, arguments);
        }

        setInterval.toString = function () {
            return _setInterval.toString();
        };

        return setInterval;
    })(function () {
        this.intervals.push(setInterval.apply(null, arguments));
    }),
    componentWillUnmount: function componentWillUnmount() {
        this.intervals.map(clearInterval);
    } };

var UpdateFooter = React.createClass({
    displayName: 'UpdateFooter',

    render: function render() {
        return React.createElement(
            Box,
            { className: this.props.className },
            this.props.children
        );
    }
});

var Update = React.createClass({
    displayName: 'Update',

    getInitialState: function getInitialState() {
        var users = []; //danh sách user nằm ở dropdown list
        var users_tag = []; //danh sách tagged user
        var uploads = [];
        return { users: users, users_tag: users_tag, uploads: uploads, commentBoxClass: 'hide' };
    },
    componentDidMount: function componentDidMount() {
        $(React.findDOMNode(this.refs.commentBox)).hide();
        var wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
        $('[data-toggle="tooltip"]', wrapper).tooltip();
    },
    toggleCommentBox: function toggleCommentBox(e) {
        e.preventDefault();
        var commentBox = $(React.findDOMNode(this.refs.commentBox));
        if ($(commentBox).is(':hidden')) {
            $(commentBox).show();
            var taComment = $(React.findDOMNode(this.refs.taComment));
            $(taComment).focus();
        } else {
            $(commentBox).hide();
        }
    },
    showDeleteMenu: function showDeleteMenu(e) {
        e.stopPropagation();
        var id = this.props.id;
        var owner_id = this.props.user.id;

        BootstrapDialog.confirm({
            title: 'Choose action',
            message: function message(dialogRef) {
                var $message = document.createElement('div');
                var div = React.createElement('div', null);
                if (owner_id == you.id) {
                    div = React.createElement(
                        'div',
                        { className: 'radio' },
                        React.createElement(
                            'label',
                            null,
                            React.createElement('input', { type: 'radio', name: 'radio_delete', value: '2' }),
                            ' Remove completely'
                        )
                    );
                }
                if (current_wall.id == you.id) {
                    React.render(React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'div',
                            { className: 'radio' },
                            React.createElement(
                                'label',
                                null,
                                React.createElement('input', { type: 'radio', name: 'radio_delete', value: '1' }),
                                ' Hide this from my timeline'
                            )
                        ),
                        div
                    ), $message);
                } else {
                    React.render(React.createElement(
                        'div',
                        { className: 'radio' },
                        React.createElement(
                            'label',
                            null,
                            React.createElement('input', { type: 'radio', name: 'radio_delete', value: '2' }),
                            ' Remove completely'
                        )
                    ), $message);
                }

                return $message;
            },
            type: BootstrapDialog.TYPE_DEFAULT,
            closable: true,
            draggable: true,
            btnCancelLabel: 'Cancel',
            btnOKLabel: 'Ok',
            btnOKClass: 'btn-danger',
            callback: function callback(result) {
                if (result) {
                    var choice = $('input[name=radio_delete]:checked').val();

                    var postData = {};
                    postData['id'] = id;
                    postData['choice'] = choice;
                    $.ajax({
                        url: BASE_URL + '/services/updates/delete',
                        type: 'POST',
                        data: postData,
                        success: function success(msg) {
                            if (msg.error == '') {
                                for (var i in updates) {
                                    if (updates[i]['id'] == id) {
                                        updates.splice(i, 1);
                                        break;
                                    }
                                }
                                React.render(React.createElement(UpdateList, { data: updates }), document.getElementById('timeline'));
                            }
                        }
                    });
                }
            }

        });
    },

    toggleShare_tag: function toggleShare_tag() {
        var div = $('.share_tag_box');
        if ($(div).is(':hidden')) {
            $(div).show();
        } else {
            $(div).hide();
        }
    },
    loadMoreComments: function loadMoreComments(e) {
        e.preventDefault();
        var offset = this.props.comments.length;

        var that = this;
        var id = this.props.id;
        $.ajax({
            url: BASE_URL + '/services/comments/loadmore',
            type: 'POST',
            data: { offset: offset, update_id: id },
            success: function success(comments) {
                var newComments = comments.concat(that.props.comments);
                var clone;
                if (viewMode == 0) {
                    clone = updates;
                } else {
                    clone = updateSingle;
                }
                for (var i in clone) {
                    if (clone[i]['id'] == id) {
                        clone[i]['comments'] = newComments;
                        break;
                    }
                }
                reRender();
            }
        });
    },
    hideComments: function hideComments(e) {
        e.preventDefault();
        var id = this.props.id;
        var currentComments = this.props.comments.length;
        var clone;
        if (viewMode == 0) {
            clone = updates;
        } else {
            clone = updateSingle;
        }
        for (var i in clone) {
            if (clone[i]['id'] == id) {
                clone[i]['comments'].splice(3, currentComments - 3);
                break;
            }
        }
        reRender();
    },
    sendComment: function sendComment(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
            //Enter keycode
            var comment = e.target.value;
            var postData = {};
            var updateID = this.props.id;
            postData["comment"] = comment;
            postData['updateId'] = updateID;
            if (comment && comment.trim() != '') {
                $.ajax({
                    url: BASE_URL + '/services/comments/new',
                    type: 'POST',
                    data: postData
                }).success(function (data) {
                    console.log("comment sent successfully");
                }).fail(function () {
                    alert("failed");
                });
                //clear text
                e.target.value = '';
            }

            return false;
        }
    },
    share: function share(e) {
        e.preventDefault();
        var share = this.props.share;

        if (share != null) {
            //share tiếp từ một share
            var share_id = share.id;
            //reset upper embed
            embed = React.createElement('span', null);

            var share_text = share.text;
            var share_user_name = share.owner.name;
            var share_user_link = share.owner.link;
            var share_user_id = share.owner.id;
            var share_tags = share.tags;
            var share_time = share.time;
            var share_uploads = share.uploads;

            var share_wall = React.createElement('span', null);
            var share_wall_id = share.wall.id;
            var share_id = share.id; //
            if (share_wall_id != null) {
                share_wall_id = parseInt(share_wall_id);
                if (share_wall_id != share_user_id) {
                    share_wall = React.createElement(
                        'span',
                        null,
                        ' ',
                        React.createElement('span', { className: 'arrow-right' }),
                        '  ',
                        React.createElement(UserName, { id: share_wall_id, bold: '0', name: share.wall.name, link: "/facebook/" + share.wall.link })
                    );
                }
            }

            var s_index = share_text.indexOf("https://www.youtube.com");
            var embed_s = React.createElement('span', null);
            if (s_index >= 0) {
                var s_text2 = share_text.substring(s_index, share_text.length);
                var index2_s = s_text2.indexOf(" ");

                if (index2_s != -1) {
                    s_text2 = s_text2.substring(0, index2_s);
                }

                s_text2 = "http://www.youtube.com/embed/" + s_text2.substring(s_text2.indexOf("v=") + 2);
                embed_s = React.createElement(FluidVid, { src: s_text2 });
            } else {
                s_index = share_text.indexOf("https://vimeo.com/");
                if (s_index >= 0) {
                    var s_text2 = share_text.substring(s_index, share_text.length);
                    var index2_s = s_text2.indexOf(" ");

                    if (index2_s != -1) {
                        s_text2 = s_text2.substring(0, index2_s);
                    }
                    s_text2 = "http://player.vimeo.com/video" + s_text2.substring(s_text2.lastIndexOf("/"));
                    embed_s = React.createElement(FluidVid, { src: s_text2 });
                }
            }
            var uploads_s = [];
            if (share.uploads.length > 0) {
                uploads_s = share_uploads.split(",");
                embed_s = React.createElement('span', null);
            }

            //handle tags
            var share_tag_count = share.tag_count;
            var share_tags = React.createElement('span', null);
            var share_taglist = React.createElement('span', null);

            if (share_tag_count > 0) {
                var prefix = "";
                var count = 0;
                share_taglist = share.tags.map(function (tag) {
                    if (count > 0) {
                        prefix = ",";
                    }
                    count++;
                    return React.createElement(
                        'span',
                        { key: tag.id },
                        prefix,
                        React.createElement(UserName, { name: tag.name, bold: '0', id: tag.id, link: "/facebook/" + tag.link })
                    );
                });
                var otherCount = share_tag_count - share_taglist.length;

                if (share_taglist.length > 0) {
                    if (otherCount > 0) {
                        share_tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with '
                            ),
                            share_taglist,
                            ' and ',
                            React.createElement(
                                TooltipTag,
                                { tags: share.tags, tag_count: share.tag_count, id: share.id },
                                otherCount,
                                ' others'
                            )
                        );
                    } else {
                        share_tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with '
                            ),
                            share_taglist
                        );
                    }
                } else {
                    if (otherCount > 0) {
                        share_tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with'
                            ),
                            ' ',
                            React.createElement(
                                'a',
                                { href: '#' },
                                otherCount,
                                ' others'
                            )
                        );
                    }
                }

                share_wall = React.createElement('span', null);
            }

            //open share modal
            var div = document.createElement('div');
            var that = this;
            var content = React.render(React.createElement(ShareModal, { uploads: uploads_s,
                embed: embed_s,
                tags: share_tags,
                wall: share_wall,
                wall_id: share_wall_id, //là wall_id của update gốc
                text: share_text,
                share_id: share_id, //là id của update gốc mà mình là ng share lại
                user_id: share_user_id,
                user_name: share_user_name,
                user_link: share_user_link,
                time: share_time

            }), div);

            var dialog = new BootstrapDialog({
                title: '<b>Share</b>',
                message: function message(dialog) {
                    return $(div);
                },
                onshown: function onshown(dialogRef) {
                    $('.input_share').val('');
                    $('.input_share').focus();
                    $('.closeDialog').click(function () {
                        dialog.close();
                    });
                }
            });
            dialog.realize();
            dialog.open();
        } else {
            //share lần đầu

            var wall = React.createElement('span', null);
            var wall_id = this.props.wall.id;
            var user_id = this.props.user.id;
            if (wall_id != null) {
                wall_id = parseInt(wall_id);
                user_id = parseInt(user_id);
                //nếu id của
                if (wall_id != user_id) {
                    wall = React.createElement(
                        'span',
                        null,
                        ' ',
                        React.createElement('span', { className: 'arrow-right' }),
                        '  ',
                        React.createElement(UserName, { id: wall_id, name: this.props.wall.name, link: "/facebook/" + this.props.wall.link })
                    );
                }
            }
            if (!wall_id || wall_id == '0') {
                wall_id = you.id;
            }

            var text = this.props.text.trim();

            var index = text.indexOf("https://www.youtube.com");
            var embed = React.createElement('span', null);
            if (index >= 0) {
                var text2 = text.substring(index, text.length);
                var index2 = text2.indexOf(" ");

                if (index2 != -1) {
                    text2 = text2.substring(0, index2);
                }

                text2 = "http://www.youtube.com/embed/" + text2.substring(text2.indexOf("v=") + 2);
                embed = React.createElement(FluidVid, { src: text2 });
            } else {
                index = text.indexOf("https://vimeo.com/");
                if (index >= 0) {
                    var text2 = text.substring(index, text.length);
                    var index2 = text2.indexOf(" ");

                    if (index2 != -1) {
                        text2 = text2.substring(0, index2);
                    }
                    text2 = "http://player.vimeo.com/video" + text2.substring(text2.lastIndexOf("/"));
                    embed = React.createElement(FluidVid, { src: text2 });
                }
            }
            var uploads = [];
            if (this.props.uploads.length > 0) {
                uploads = this.props.uploads.split(",");
                embed = React.createElement('span', null);
            }
            var tag_count = this.props.tag_count;
            var tags = React.createElement('span', null);
            var taglist = React.createElement('span', null);

            if (tag_count > 0) {
                var prefix = "";
                var count = 0;
                taglist = this.props.tags.map(function (tag) {
                    if (count > 0) {
                        prefix = ",";
                    }
                    count++;
                    return React.createElement(
                        'span',
                        { key: tag.id },
                        prefix,
                        React.createElement(UserName, { name: tag.name, id: tag.id, link: "/facebook/" + tag.link })
                    );
                });
                var otherCount = tag_count - taglist.length;

                if (taglist.length > 0) {
                    if (otherCount > 0) {
                        tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with '
                            ),
                            taglist,
                            ' and ',
                            React.createElement(
                                TooltipTag,
                                { tags: this.props.tags, tag_count: this.props.tag_count, id: this.props.id },
                                otherCount,
                                ' others'
                            ),
                            ' ',
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' others'
                            )
                        );
                    } else {
                        tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with '
                            ),
                            taglist
                        );
                    }
                } else {
                    if (otherCount > 0) {
                        tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with'
                            ),
                            ' ',
                            React.createElement(
                                'a',
                                { href: '#' },
                                otherCount
                            ),
                            ' ',
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' others'
                            )
                        );
                    }
                }

                wall = React.createElement('span', null);
            }
            var div = document.createElement('div');
            var that = this;
            var content = React.render(React.createElement(ShareModal, { uploads: uploads,
                embed: embed,
                tags: tags,
                wall: wall,
                wall_id: wall_id, //wall_id của post gốc
                text: that.props.text,
                share_id: that.props.id, //là id của update gốc mà mình là ng share lại
                user_id: that.props.user.id,
                user_name: that.props.user.name,
                user_link: that.props.user.link,
                time: that.props.time

            }), div);

            var dialog = new BootstrapDialog({
                title: '<b>Share</b>',
                message: function message(dialog) {
                    return $(div);
                },
                onshown: function onshown(dialogRef) {
                    $('.input_share').val('');
                    $('.input_share').focus();
                    $('.closeDialog').click(function () {
                        dialog.close();
                    });
                }
            });
            dialog.realize();
            dialog.open();
        }
    },
    render: function render() {
        var wall = React.createElement('span', null);
        var action = React.createElement('span', null);
        var wall_id = this.props.wall.id; //wall mà update đó nằm trên
        var id = parseInt(this.props.id);
        if (id == 72) {
            console.log('update 72 rendered, like-count:' + this.props.like_count + '-youlike:' + this.props.you_like);
        }
        var update_owner_id = parseInt(this.props.user.id);
        //nếu đang trong group, ko hiển thị tên wall, trường hợp này là ko nằm trong group
        if (current_wall.id > 1090346680 && wall_id != null) {
            wall_id = parseInt(wall_id);
            //nếu nằm trong wall của chính tác giả thì ko hiển thị tên wall, trường hợp này ko nằm trong
            if (wall_id != update_owner_id) {
                wall = React.createElement(
                    'span',
                    null,
                    ' ',
                    React.createElement('span', { className: 'arrow-right' }),
                    '  ',
                    React.createElement(UserName, { id: wall_id, name: this.props.wall.name, link: "/facebook/" + this.props.wall.link })
                );
            }
        }

        var text = this.props.text.trim();

        var index = text.indexOf("https://www.youtube.com");
        var embed = React.createElement('span', null);
        if (index >= 0) {
            var text2 = text.substring(index, text.length);
            var index2 = text2.indexOf(" ");

            if (index2 != -1) {
                text2 = text2.substring(0, index2);
            }

            text2 = "http://www.youtube.com/embed/" + text2.substring(text2.indexOf("v=") + 2);
            embed = React.createElement(FluidVid, { src: text2 });
        } else {
            index = text.indexOf("https://vimeo.com/");
            if (index >= 0) {
                var text2 = text.substring(index, text.length);
                var index2 = text2.indexOf(" ");

                if (index2 != -1) {
                    text2 = text2.substring(0, index2);
                }
                text2 = "http://player.vimeo.com/video" + text2.substring(text2.lastIndexOf("/"));
                embed = React.createElement(FluidVid, { src: text2 });
            }
        }
        var uploads = [];
        if (this.props.uploads.length > 0) {

            uploads = this.props.uploads.split(",");
            embed = React.createElement('span', null);
        }
        var shareButton = React.createElement(
            'a',
            { href: '#', className: 'share share_button icontext', id: 'shares27329', title: 'share', onClick: this.share },
            ' Share '
        );

        //handle collapse comment
        var moreComment = React.createElement('div', null);
        var totalComments = this.props.comment_count;

        var currentComments = this.props.comments.length;
        if (totalComments - currentComments > 20) {
            moreComment = React.createElement(
                'div',
                null,
                React.createElement(
                    'a',
                    { href: '#', onClick: this.loadMoreComments },
                    'View more 20 previous comments'
                )
            );
        } else if (totalComments - currentComments > 0) {
            moreComment = React.createElement(
                'div',
                null,
                React.createElement(
                    'a',
                    { href: '#', onClick: this.loadMoreComments },
                    'View all more ',
                    totalComments - currentComments,
                    ' comments'
                )
            );
        }
        var hideComments = React.createElement('div', null);
        if (currentComments > 20) {
            var delta = currentComments - 3;
            hideComments = React.createElement(
                'div',
                { className: 'pb10' },
                React.createElement(
                    'a',
                    { href: '#', onClick: this.hideComments },
                    'Hide ',
                    delta,
                    ' comments'
                )
            );
        }

        //handle tags
        var tag_count = this.props.tag_count;
        var tags = React.createElement('span', null);
        var taglist = React.createElement('span', null);

        if (tag_count > 0) {
            var prefix = "";
            var count = 0;
            taglist = this.props.tags.map(function (tag) {
                if (count > 0) {
                    prefix = ",";
                }
                count++;
                return React.createElement(
                    'span',
                    { key: tag.id },
                    prefix,
                    React.createElement(UserName, { name: tag.name, bold: '0', id: tag.id, link: "/facebook/" + tag.link })
                );
            });
            var otherCount = tag_count - taglist.length;

            if (taglist.length > 0) {
                if (otherCount > 0) {
                    tags = React.createElement(
                        'span',
                        null,
                        React.createElement(
                            'span',
                            { className: 'text-gray' },
                            ' with '
                        ),
                        taglist,
                        ' and ',
                        React.createElement(
                            TooltipTag,
                            { tags: this.props.tags, tag_count: this.props.tag_count, id: this.props.id },
                            otherCount,
                            ' others'
                        )
                    );
                } else {
                    tags = React.createElement(
                        'span',
                        null,
                        React.createElement(
                            'span',
                            { className: 'text-gray' },
                            ' with '
                        ),
                        taglist
                    );
                }
            } else {
                if (otherCount > 0) {
                    tags = React.createElement(
                        'span',
                        null,
                        React.createElement(
                            'span',
                            { className: 'text-gray' },
                            ' with'
                        ),
                        ' ',
                        React.createElement(
                            TooltipTag,
                            { tags: this.props.tags, tag_count: this.props.tag_count, id: this.props.id },
                            otherCount,
                            ' others'
                        )
                    );
                }
            }
            wall = React.createElement('span', null);
        }
        var share = this.props.share;

        var shareContent = React.createElement('div', null);
        if (share != null) {
            var share_id = share.id;
            //reset upper embed
            embed = React.createElement('span', null);

            var share_text = share.text;
            var share_user_name = share.owner.name;
            var share_user_link = share.owner.link;
            var share_user_id = share.owner.id;
            var share_time = share.time;
            var share_uploads = share.uploads;

            var share_wall = React.createElement('span', null);
            var share_wall_id = share.wall.id;
            if (share_wall_id != null) {
                share_wall_id = parseInt(share_wall_id);
                share_wall_id = parseInt(id);
                if (share_wall_id != share_wall_id) {
                    share_wall = React.createElement(
                        'span',
                        null,
                        ' ',
                        React.createElement('span', { className: 'arrow-right' }),
                        '  ',
                        React.createElement(UserName, { id: share_wall_id, bold: '0', name: share.wall.name, link: "/facebook/" + share.wall.link })
                    );
                }
            }

            var s_index = share_text.indexOf("https://www.youtube.com");
            var embed_s = React.createElement('span', null);
            if (s_index >= 0) {
                var s_text2 = share_text.substring(s_index, share_text.length);
                var index2_s = s_text2.indexOf(" ");

                if (index2_s != -1) {
                    s_text2 = s_text2.substring(0, index2_s);
                }

                s_text2 = "http://www.youtube.com/embed/" + s_text2.substring(s_text2.indexOf("v=") + 2);
                embed_s = React.createElement(FluidVid, { src: s_text2 });
            } else {
                s_index = share_text.indexOf("https://vimeo.com/");
                if (s_index >= 0) {
                    var s_text2 = share_text.substring(s_index, share_text.length);
                    var index2_s = s_text2.indexOf(" ");

                    if (index2_s != -1) {
                        s_text2 = s_text2.substring(0, index2_s);
                    }
                    s_text2 = "http://player.vimeo.com/video" + s_text2.substring(s_text2.lastIndexOf("/"));
                    embed_s = React.createElement(FluidVid, { src: s_text2 });
                }
            }
            var uploads_s = [];
            if (share.uploads.length > 0) {
                uploads_s = share_uploads.split(",");
                embed_s = React.createElement('span', null);
            }

            //handle tags
            var share_tag_count = share.tag_count;
            var share_tags = React.createElement('span', null);
            var share_taglist = React.createElement('span', null);

            if (share_tag_count > 0) {
                var prefix = "";
                var count = 0;
                share_taglist = share.tags.map(function (tag) {
                    if (count > 0) {
                        prefix = ",";
                    }
                    count++;
                    return React.createElement(
                        'span',
                        { key: tag.id },
                        prefix,
                        React.createElement(UserName, { name: tag.name, bold: '0', id: tag.id, link: "/facebook/" + tag.link })
                    );
                });
                var otherCount = share_tag_count - share_taglist.length;

                if (share_taglist.length > 0) {
                    if (otherCount > 0) {
                        share_tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with '
                            ),
                            share_taglist,
                            ' and ',
                            React.createElement(
                                TooltipTag,
                                { tags: share.tags, tag_count: share.tag_count, id: share.id },
                                otherCount,
                                ' others'
                            )
                        );
                    } else {
                        share_tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with '
                            ),
                            share_taglist
                        );
                    }
                } else {
                    if (otherCount > 0) {
                        share_tags = React.createElement(
                            'span',
                            null,
                            React.createElement(
                                'span',
                                { className: 'text-gray' },
                                ' with'
                            ),
                            ' ',
                            React.createElement(
                                'a',
                                { href: '#' },
                                otherCount,
                                ' others'
                            )
                        );
                    }
                }

                share_wall = React.createElement('span', null);
            }
            shareContent = React.createElement(
                'div',
                { className: 'mb10 ' },
                React.createElement(
                    'div',
                    null,
                    embed_s
                ),
                React.createElement(
                    'div',
                    { className: 'update-uploads mb10' },
                    React.createElement(Gallery, { data: uploads_s, id: share_id })
                ),
                React.createElement(
                    'div',
                    { className: 'shareContent' },
                    React.createElement(
                        'div',
                        { className: 'author_info' },
                        React.createElement(UserName, { id: share_user_id, name: share_user_name, link: "/facebook/" + share_user_link }),
                        ' ',
                        share_tags,
                        share_wall
                    ),
                    React.createElement(
                        'div',
                        { className: 'update-text' },
                        React.createElement(Text, { text: share_text })
                    ),
                    React.createElement(Timer, { time: share_time, className: 'text-muted media-object timeago' })
                )
            );
            action = React.createElement(
                'span',
                { className: 'text-gray' },
                ' share ',
                React.createElement(UserName, { id: share_user_id, bold: '0', name: share_user_name, link: "/facebook/" + share_user_link }),
                '\'s status '
            );
        }
        var showType = this.props.showType;
        if (showType == '1') {
            return React.createElement(
                Box,
                { className: 'update-item', ref: 'wrapper' },
                React.createElement(
                    Box,
                    { className: 'no-float' },
                    React.createElement(
                        Box,
                        { className: 'bd-b border-color1 rd-t p15 white_bg' },
                        React.createElement(
                            'div',
                            { className: 'author_info' },
                            React.createElement(
                                'div',
                                { className: 'pull-left' },
                                React.createElement(
                                    'a',
                                    { href: '/facebook/' + this.props.user.link, 'data-toggle': 'tooltip', title: this.props.user.name, className: 'update-avatar inline-block' },
                                    ' ',
                                    React.createElement('img', { src: '/facebook/resources/images/uploads/' + this.props.user.avatar, className: 'img-rounded thumb-sm' })
                                )
                            ),
                            React.createElement(UserName, { id: this.props.user.id, name: this.props.user.name, link: "/facebook/" + this.props.user.link }),
                            ' ',
                            action,
                            tags,
                            wall,
                            ' ',
                            React.createElement('span', { className: 'closeBt closeSingleUpdateDialog' })
                        ),
                        React.createElement(
                            'div',
                            { className: 'update-text clear pt10' },
                            React.createElement(Text, { text: this.props.text })
                        ),
                        React.createElement(Timer, { time: this.props.time, className: 'text-muted media-object timeago' })
                    ),
                    React.createElement(
                        UpdateFooter,
                        { className: 'bg1 p15 pt0 pb0 rd-b' },
                        React.createElement(
                            Line,
                            { className: 'line-height40' },
                            React.createElement(LikePostButton, { like: this.props.you_like, className: 'like_post_button like_button icontext', updateId: this.props.id,
                                commentId: '', replyId: '' }),
                            React.createElement(
                                ImageButton,
                                { onClick: this.toggleCommentBox, className: 'comment_triggle_bt icontext', title: 'Comment' },
                                ' Comment '
                            ),
                            shareButton
                        ),
                        React.createElement(LikeList, { key: this.props.id, className: 'border-color1 bd-t line-height40', update_id: this.props.id, you_like: this.props.you_like, like_count: this.props.like_count, likes: this.props.likes }),
                        React.createElement(
                            'div',
                            { className: "comment_box pb20 ", ref: 'commentBox' },
                            React.createElement(
                                'a',
                                { href: '#' },
                                ' ',
                                React.createElement('img', { src: '/facebook/resources/images/' + you.avatar, className: 'img-rounded thumb-sm2' }),
                                ' '
                            ),
                            React.createElement(
                                'div',
                                null,
                                React.createElement('input', { type: 'text', ref: 'taComment', className: 'form-control', onKeyPress: this.sendComment, placeholder: 'write some thing ... ' })
                            )
                        ),
                        moreComment,
                        React.createElement(CommentList, { data: this.props.comments, updateID: this.props.id }),
                        hideComments
                    )
                )
            );
        }
        var actionButton = React.createElement('i', null);
        var owner_id = this.props.user.id;
        if (owner_id == you.id || current_wall.id == you.id) {
            actionButton = React.createElement('span', { onClick: this.showDeleteMenu, ref: 'deleteButton', className: 'stdelete fa fa-angle-down' });
        }

        return React.createElement(
            Box,
            { className: 'update-item', ref: 'wrapper' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'a',
                    { href: '/facebook/' + this.props.user.link, 'data-toggle': 'tooltip', title: this.props.user.name, className: 'update-avatar inline-block' },
                    ' ',
                    React.createElement('img', { src: '/facebook/resources/images/uploads/' + this.props.user.avatar, className: 'img-rounded thumb-md' })
                )
            ),
            React.createElement(
                Box,
                { className: 'update-col-right bd no-float rd' },
                React.createElement(
                    Box,
                    { className: 'bd-b border-color1 rd-t p15 white_bg' },
                    React.createElement(
                        'div',
                        { className: 'author_info' },
                        React.createElement(UserName, { id: this.props.user.id, name: this.props.user.name, link: "/facebook/" + this.props.user.link }),
                        ' ',
                        action,
                        tags,
                        wall,
                        ' ',
                        actionButton
                    ),
                    React.createElement(
                        'div',
                        { className: 'update-text' },
                        React.createElement(Text, { text: this.props.text })
                    ),
                    React.createElement(
                        'div',
                        null,
                        embed
                    ),
                    React.createElement('div', { className: 'mb10' }),
                    React.createElement(
                        'div',
                        { className: 'update-uploads mb10' },
                        React.createElement(Gallery, { data: uploads, id: this.props.id })
                    ),
                    shareContent,
                    React.createElement(Timer, { time: this.props.time, className: 'text-muted media-object timeago' })
                ),
                React.createElement(
                    UpdateFooter,
                    { className: 'bg1 p15 pt0 pb0 rd-b' },
                    React.createElement(
                        Line,
                        { className: 'line-height40' },
                        React.createElement(LikePostButton, { like: this.props.you_like, className: 'like_post_button like_button icontext', updateId: this.props.id,
                            commentId: '', replyId: '' }),
                        React.createElement(
                            ImageButton,
                            { onClick: this.toggleCommentBox, className: 'comment_triggle_bt icontext', title: 'Comment' },
                            ' Comment '
                        ),
                        shareButton
                    ),
                    React.createElement(LikeList, { key: this.props.id, className: 'border-color1 bd-t line-height40', update_id: this.props.id, you_like: this.props.you_like, like_count: this.props.like_count, likes: this.props.likes }),
                    React.createElement(
                        'div',
                        { className: "comment_box pb20 ", ref: 'commentBox' },
                        React.createElement(
                            'a',
                            { href: '#' },
                            ' ',
                            React.createElement('img', { src: '/facebook/resources/images/uploads/' + you.avatar, className: 'img-rounded thumb-sm2' }),
                            ' '
                        ),
                        React.createElement(
                            'div',
                            null,
                            React.createElement('input', { type: 'text', ref: 'taComment', className: 'form-control', onKeyPress: this.sendComment, placeholder: 'write some thing ... ' })
                        )
                    ),
                    moreComment,
                    React.createElement(CommentList, { data: this.props.comments, updateID: this.props.id }),
                    hideComments
                )
            )
        );
    }
});

var UpdateList = React.createClass({
    displayName: 'UpdateList',

    mixins: [SetIntervalMixin],
    componentDidMount: function componentDidMount() {
        this.setInterval(this.tick, 60000); // Call a method on the mixin
    },
    tick: function tick() {
        now.add(1, 'm');
        this.setState({ seconds: 1 });
    },
    render: function render() {
        var showType = this.props.showType;
        var data = this.props.data.map(function (update) {
            return React.createElement(Update, { key: update.id,
                id: update.id,
                share_count: update.share_count,
                you_like: update.you_like,
                like_count: update.like_count,
                tag_count: update.tag_count,
                comment_count: update.comment_count,
                link: update.link,
                time: update.time,
                text: update.text,
                uploads: update.uploads,
                showType: showType,
                share: update.share,

                user: update.user,
                wall: update.wall,
                likes: update.likes,
                tags: update.tags,
                comments: update.comments });
        });
        return React.createElement(
            'div',
            null,
            ' ',
            data,
            ' '
        );
    }
});

var HomeAvatar = React.createClass({
    displayName: 'HomeAvatar',

    render: function render() {
        return React.createElement(
            'div',
            { id: 'home_avatar', className: 'leftBlock rd bd' },
            React.createElement(
                'a',
                { href: '/facebook/' + this.props.link },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + this.props.avatar })
            ),
            React.createElement(
                'div',
                { className: 'clearfix' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'small',
                        null,
                        this.props.update_count
                    ),
                    React.createElement(
                        'b',
                        null,
                        'UPDATES'
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'small',
                        null,
                        this.props.friend_count
                    ),
                    React.createElement(
                        'b',
                        null,
                        'FRIENDS'
                    )
                )
            )
        );
    }
});

var Connections = React.createClass({
    displayName: 'Connections',

    componentDidMount: function componentDidMount() {
        var div = ReactDOM.findDOMNode(this.refs.div);
        $('a', div).tooltip();
    },
    render: function render() {
        var data = this.props.data.map(function (user) {
            return React.createElement(
                'a',
                { key: user.id, href: "/facebook/" + user.link, 'data-toggle': 'tooltip', title: user.name },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + user.avatar, className: 'img-rounded thumb-md' })
            );
        });
        var title = "Connections";
        var count = this.props.data.length;
        if (current_wall.id < 1090346681) {
            title = "Members";
        }
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h4',
                { className: 'small_title' },
                title,
                ' ',
                React.createElement(
                    'span',
                    { className: 'text-muted' },
                    '(',
                    count,
                    ')'
                )
            ),
            React.createElement(
                'div',
                { className: 'connection', ref: 'div' },
                data
            )
        );
    }
});
var AboutMe = React.createClass({
    displayName: 'AboutMe',

    render: function render() {
        return React.createElement(
            'div',
            null,
            this.props.about
        );
    }
});