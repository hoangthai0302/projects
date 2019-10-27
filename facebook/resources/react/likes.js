"use strict";

var LikePostButton = React.createClass({
    displayName: "LikePostButton",

    getInitialState: function getInitialState() {
        var like = this.props.like;
        var st;
        if (like == 0) {
            st = "Like";
        } else {
            st = "Unlike";
        }
        return { status: st };
    },
    toggleLike: function toggleLike(e) {
        e.preventDefault();

        var target = e.target;
        if (target.tagName == 'A') {

            var that = this;
            var postData = {};
            postData["updateId"] = this.props.updateId;
            var object_type = 1;
            if (this.props.commentId != "") {
                object_type = 2;
            }
            if (this.props.replyId != "") {
                object_type = 3;
            }
            postData["commentId"] = this.props.commentId;
            postData["replyId"] = this.props.replyId;
            postData["object_type"] = object_type;
            postData["action"] = this.state.status;
            $.ajax({
                url: BASE_URL + '/services/likes',
                type: 'POST',
                data: postData
            }).success(function (data) {
                if (data.error == "") {
                    if (that.state.status == 'Like') {
                        that.setState({ status: 'Unlike' });
                    } else {
                        that.setState({ status: 'Like' });
                    }
                }
            });
        }
    },
    render: function render() {

        return React.createElement(
            "a",
            { href: "#", className: this.props.className, onClick: this.toggleLike, title: "Unlike" },
            this.state.status
        );
    }
});

var LikeList = React.createClass({
    displayName: "LikeList",

    render: function render() {
        var youlike = parseInt(this.props.you_like);
        var likeCount = parseInt(this.props.like_count);

        var like = 'likes';
        if (likeCount > 1) {
            like = 'like';
        }
        var friendsLike = this.props.likes;
        var count = friendsLike.length;
        var you = "";
        var others = "";
        if (youlike == "1") {
            you = React.createElement(
                "b",
                null,
                "You"
            );
        }
        var othersLike = likeCount - count - parseInt(youlike);
        if (othersLike > 0) {
            if (youlike == 1) {
                others = React.createElement(
                    "span",
                    null,
                    " and ",
                    React.createElement(
                        TooltipLikeUpdate,
                        { you_like: youlike, object_id: this.props.update_id, object_type: "1", likes: this.props.likes, like_count: likeCount },
                        othersLike,
                        " others"
                    )
                );
            } else {
                if (friendsLike.length > 0) {
                    others = React.createElement(
                        "span",
                        null,
                        " and  ",
                        React.createElement(
                            TooltipLikeUpdate,
                            { you_like: youlike, object_id: this.props.update_id, object_type: "1", likes: this.props.likes, like_count: likeCount },
                            othersLike,
                            " others"
                        )
                    );
                } else {
                    others = React.createElement(
                        TooltipLikeUpdate,
                        { key: this.props.update_id, object_id: this.props.update_id, object_type: "1", likes: this.props.likes, like_count: likeCount },
                        othersLike,
                        " people"
                    );
                }
            }
        }
        if (likeCount == 0) {
            return React.createElement("div", null);
        }
        var prefix = "";
        if (youlike == 1) {
            prefix = ",";
        }
        var count1 = 0;
        var friends = friendsLike.map(function (friend) {
            if (count1 > 0) {
                prefix = ",";
            }
            count1++;
            return React.createElement(
                "span",
                { key: friend.id },
                prefix,
                React.createElement(UserName, { key: friend.id, id: friend.id, name: friend.name, link: "/facebook/" + friend.link })
            );
        });

        return React.createElement(
            Box,
            { className: this.props.className },
            you,
            friends,
            others,
            " ",
            like,
            " this"
        );
    }
});