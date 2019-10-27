'use strict';

var Comment = React.createClass({
    displayName: 'Comment',

    sendReply: function sendReply(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
            //Enter keycode
            var reply = e.target.value;
            if (reply && reply.length > 0) {

                var postData = {};
                var commentID = this.props.id;
                var updateID = this.props.update_id;
                postData["reply"] = reply;
                postData['commentID'] = commentID;
                postData['updateID'] = updateID;

                $.ajax({
                    type: 'POST',
                    url: BASE_URL + '/services/new_reply',
                    data: postData,
                    success: function success() {}
                });
                //clear text
                e.target.value = '';
                return false;
            }
        }
    },
    componentDidMount: function componentDidMount() {
        var rep = $(React.findDOMNode(this.refs.reply_box));
        $(rep).hide();
    },
    toggleReply: function toggleReply() {
        var rep = $(React.findDOMNode(this.refs.reply_box));
        if ($(rep).is(':hidden')) {
            var txtReply = $(React.findDOMNode(this.refs.txtReply));
            $(rep).show();
            $(txtReply).focus();
        } else {
            $(rep).hide();
        }
    },
    loadMoreReplies: function loadMoreReplies(e) {
        e.preventDefault();
        var offset = this.props.replies.length;

        var that = this;
        var id = this.props.id;
        var update_id = this.props.update_id;
        $.ajax({
            url: BASE_URL + '/services/replies/loadmore',
            type: 'POST',
            data: { offset: offset, comment_id: id },
            success: function success(replies) {
                var newReplies = replies.concat(that.props.replies);
                var clone;
                if (viewMode == 0) {
                    clone = updates;
                } else {
                    clone = updateSingle;
                }
                for (var i in clone) {
                    if (clone[i]['id'] == update_id) {
                        for (var j in clone[i]['comments']) {
                            if (clone[i]['comments'][j]['id'] = id) {
                                clone[i]['comments'][j]['replies'] = newReplies;
                                break;
                            }
                        }
                        break;
                    }
                }
                reRender();
            }
        });
    },
    hideReplies: function hideReplies() {
        e.preventDefault();
        var id = this.props.id;
        var update_id = this.props.update_id;
        var currentReplies = this.props.replies.length;
        var clone;
        if (viewMode == 0) {
            clone = updates;
        } else {
            clone = updateSingle;
        }
        for (var i in clone) {
            if (clone[i]['id'] == update_id) {
                for (var j in clone[i]['comments']) {
                    if (clone[i]['comments'][j]['id'] == id) {
                        clone[i]['comments'][j]['replies'].splice(3, currentReplies - 3);
                        break;
                    }
                }

                break;
            }
        }
        reRender();
    },
    render: function render() {
        var youlike = this.props.you_like;
        var updateID = this.props.update_id;
        var commentID = this.props.id;
        var unixSeconds = parseInt(this.props.time);
        var timeStr = moment.unix(unixSeconds).from(now);

        var liketooltip = "";
        if (this.props.like_count != '0') {
            liketooltip = React.createElement(
                TooltipLike,
                { object_id: commentID, object_type: '2', likes: [], like_count: this.props.like_count },
                this.props.like_count
            );
        }

        //handle collapse replies
        var moreReplies = React.createElement('div', null);
        var totalReplies = this.props.reply_count;

        var currentReplies = this.props.replies.length;
        if (totalReplies - currentReplies > 20) {
            moreReplies = React.createElement(
                'div',
                { className: 'pl40 pt5' },
                React.createElement(
                    'a',
                    { href: '#', onClick: this.loadMoreReplies },
                    'View more 20 previous replies'
                )
            );
        } else if (totalReplies - currentReplies > 0) {
            moreReplies = React.createElement(
                'div',
                { className: 'pl40 pt5' },
                React.createElement(
                    'a',
                    { href: '#', onClick: this.loadMoreReplies },
                    'View all more ',
                    totalReplies - currentReplies,
                    ' replies'
                )
            );
        }
        var hideReplies = React.createElement('div', null);
        if (currentReplies > 20) {
            var delta = currentReplies - 3;
            hideReplies = React.createElement(
                'div',
                { className: 'pb10 pl40 pt5' },
                React.createElement(
                    'a',
                    { href: '#', onClick: this.hideReplies },
                    'Hide ',
                    delta,
                    ' replies'
                )
            );
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                Box,
                { className: 'bd-t border-color1 two-columns pt5 pb5' },
                React.createElement(
                    'a',
                    { ref: 'username', href: '/facebook/' + this.props.user_link },
                    React.createElement('img', { src: '/facebook/resources/images/uploads/' + this.props.user_avatar, className: 'img-rounded thumb-sm2' })
                ),
                React.createElement(
                    Box,
                    null,
                    React.createElement(
                        Line,
                        null,
                        React.createElement(UserName, { id: this.props.user_id, name: this.props.user_name, link: this.props.user_link }),
                        ' ',
                        React.createElement(Text, { text: this.props.comment }),
                        ' '
                    ),
                    React.createElement(
                        Line,
                        null,
                        React.createElement(Timer, { time: this.props.time, className: 'stcommenttime' }),
                        React.createElement(LikePostButton, { like: youlike, updateId: updateID, commentId: commentID, replyId: '' }),
                        ' ',
                        liketooltip,
                        ' - ',
                        React.createElement(
                            'a',
                            { href: 'javascript:void(0)', onClick: this.toggleReply },
                            'Reply'
                        )
                    )
                ),
                moreReplies,
                React.createElement(Replies, { data: this.props.replies, comment_id: commentID, update_id: updateID }),
                hideReplies,
                React.createElement(
                    'div',
                    { className: 'two-columns replies pt5', ref: 'reply_box' },
                    React.createElement(
                        'a',
                        { href: you.link },
                        ' ',
                        React.createElement('img', { src: '/facebook/resources/images/uploads/' + you.avatar, className: 'img-rounded thumb-xs' }),
                        ' '
                    ),
                    React.createElement('input', { type: 'text', className: 'form-control txtReply', ref: 'txtReply', placeholder: 'Send a reply', onKeyPress: this.sendReply })
                )
            )
        );
    }
});
var CommentList = React.createClass({
    displayName: 'CommentList',

    render: function render() {
        var updateID = this.props.updateID;
        var comments = this.props.data.map(function (comment) {

            return React.createElement(Comment, { key: comment.id,
                id: comment.id,
                update_id: updateID,
                user_id: comment.user_id,
                user_name: comment.user_name,
                user_avatar: comment.user_avatar,
                user_background: comment.user_background,
                user_link: comment.user_link,
                like_count: comment.like_count,
                reply_count: comment.reply_count,
                you_like: comment.you_like,
                time: comment.time,
                comment: comment.comment,

                replies: comment.replies });
        });
        return React.createElement(
            Box,
            { className: 'text-shadow1' },
            ' ',
            comments,
            ' '
        );
    }
});

var Reply = React.createClass({
    displayName: 'Reply',

    render: function render() {
        var youlike = this.props.you_like;
        var updateId = this.props.update_id;
        var commentId = this.props.comment_id;
        var replyId = this.props.id;

        var unixSeconds = parseInt(this.props.time);
        var timeStr = moment.unix(unixSeconds).from(now);

        var liketooltip = "";
        if (this.props.like_count != '0') {
            liketooltip = React.createElement(
                TooltipLike,
                { object_id: replyId, object_type: '3', likes: [], like_count: this.props.like_count },
                this.props.like_count
            );
        }

        return React.createElement(
            'div',
            { className: '  pb5 two-columns clearfix ' },
            React.createElement(
                'a',
                { href: '/facebook/' + this.props.user_link },
                ' ',
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + this.props.user_avatar, className: 'img-rounded thumb-xs' }),
                ' '
            ),
            React.createElement(
                Box,
                null,
                React.createElement(
                    Line,
                    null,
                    React.createElement(UserName, { id: this.props.user_id, name: this.props.user_name, link: this.props.user_link }),
                    ' ',
                    React.createElement(Text, { text: this.props.reply })
                ),
                React.createElement(
                    Line,
                    null,
                    React.createElement(Timer, { time: this.props.time, className: 'stcommenttime' }),
                    React.createElement(LikePostButton, { like: youlike, updateId: updateId, commentId: commentId, replyId: replyId }),
                    ' ',
                    liketooltip
                )
            )
        );
    }
});
var Replies = React.createClass({
    displayName: 'Replies',

    render: function render() {
        var comment_id = this.props.comment_id;
        var update_id = this.props.update_id;
        var replies = this.props.data.map(function (reply) {
            return React.createElement(Reply, { key: reply.id,
                id: reply.id,
                user_id: reply.user_id,
                update_id: update_id,
                comment_id: comment_id,
                user_name: reply.user_name,
                user_avatar: reply.user_avatar,
                user_background: reply.user_background,
                user_link: reply.user_link,
                like_count: reply.like_count,
                you_like: reply.you_like,
                time: reply.time,
                reply: reply.reply });
        });
        return React.createElement(
            'div',
            { className: 'replies no-float pt5' },
            ' ',
            replies,
            ' '
        );
    }
});