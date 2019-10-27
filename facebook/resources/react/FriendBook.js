'use strict';

var FriendBook = React.createClass({
    displayName: 'FriendBook',

    render: function render() {
        var friends = this.props.data.map(function (f) {
            return React.createElement(FriendInfo, { id: f.id,
                avatar: '/facebook/resources/images/uploads/' + f.avatar,
                name: f.name,
                link: f.link,
                mutual_count: f.mutual_count,
                follow_status: f.follow_status
            });
        });

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'header' },
                React.createElement(
                    'h3',
                    null,
                    React.createElement('img', { src: '/facebook/resources/images/icons/friends_24.png', className: 'mr10' }),
                    this.props.title
                )
            ),
            React.createElement(
                'div',
                { className: 'body' },
                friends
            )
        );
    }
});

var FriendInfo = React.createClass({
    displayName: 'FriendInfo',

    unGroup: function unGroup() {
        var member_id = this.props.id;
        $.ajax({
            url: BASE_URL + '/services/group/rejectMember',
            data: { member_id: member_id, group_id: current_wall.id },
            success: function success(data) {
                if (data.error == '') {
                    for (var i in currentMembers) {
                        if (currentMembers[i]['id'] == member_id) {
                            currentMembers.splice(i, 1);
                            break;
                        }
                    }
                    React.render(React.createElement(FriendBook, { data: currentMembers, title: 'Members' }), document.getElementById('friendbook'));
                    current_wall.member_count--;
                    React.render(React.createElement(WallHeader, { data: current_wall }), document.getElementById('wall_header'));
                }
            }
        });
    },
    render: function render() {
        var rejectBt = React.createElement('span', null);
        if (current_wall.owner_id == you.id) {
            rejectBt = React.createElement(
                'button',
                { className: 'btn btn-sm btn-danger pull-right', onClick: this.unGroup },
                'Ungroup'
            );
        }
        var div = React.createElement(
            'div',
            { className: 'absolute top30 right0 mr20' },
            React.createElement(
                'div',
                { className: 'mb5 relative clearfix' },
                rejectBt
            ),
            React.createElement(
                'div',
                null,
                React.createElement(AddfriendButton, { user_id: this.props.id, friend_status: '1', user_name: this.props.name }),
                React.createElement('span', { className: 'gap10' }),
                React.createElement(FollowButton, { user_id: this.props.id, follow_status: this.props.follow_status })
            )
        );
        var div2 = React.createElement('div', null);
        if (this.props.mutual_count > 0) {
            div2 = React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: 'text-muted' },
                    React.createElement(TooltipMutual, { friend_id: this.props.id, mutual_count: this.props.mutual_count })
                )
            );
        }
        if (you.id == this.props.id) {
            div = React.createElement('div', null);
            div2 = React.createElement('div', null);
        }
        return React.createElement(
            'div',
            { className: 'friend_box relative' },
            React.createElement(
                'a',
                { href: 'javascript:void(0)' },
                React.createElement('img', { src: this.props.avatar, className: 'img-responsive' })
            ),
            React.createElement(
                'div',
                { className: 'pl15' },
                React.createElement('div', { className: 'space30' }),
                React.createElement(UserName, { id: this.props.id, name: this.props.name, link: "/facebook/" + this.props.link }),
                div2,
                div
            )
        );
    }
});

var PeopleBook = React.createClass({
    displayName: 'PeopleBook',

    render: function render() {
        var people = this.props.data.map(function (f) {
            return React.createElement(PersonInfo, { key: f.id,
                id: f.id,
                avatar: '/facebook/resources/images/uploads/' + f.avatar,
                name: f.name,
                link: f.link,
                mutual_count: f.mutual_count,
                follow_status: f.follow_status,
                friend_status: f.friend_status
            });
        });

        return React.createElement(
            'div',
            null,
            people
        );
    }
});

var PersonInfo = React.createClass({
    displayName: 'PersonInfo',

    render: function render() {

        var div = React.createElement(
            'div',
            { className: 'absolute top20 right0 mr20' },
            React.createElement(AddfriendButton, { user_id: this.props.id, friend_status: this.props.friend_status, user_name: this.props.name }),
            React.createElement('span', { className: 'gap10' }),
            React.createElement(FollowButton, { user_id: this.props.id, follow_status: this.props.follow_status })
        );
        var div2 = React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                { className: 'text-muted' },
                React.createElement(TooltipMutual, { friend_id: this.props.id, mutual_count: this.props.mutual_count })
            )
        );
        if (you.id == this.props.id) {
            div = React.createElement('div', null);
            div2 = React.createElement('div', null);
        }
        return React.createElement(
            'div',
            { className: 'person_box relative clearfix' },
            React.createElement(
                'a',
                { href: 'javascript:void(0)', className: 'pull-left' },
                React.createElement('img', { src: this.props.avatar, className: 'img-responsive' })
            ),
            React.createElement(
                'div',
                { className: 'pl15 pt5 pull-left' },
                React.createElement(UserName, { id: this.props.id, name: this.props.name, link: "/facebook/" + this.props.link }),
                div2,
                div
            )
        );
    }
});