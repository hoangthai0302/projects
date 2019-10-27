'use strict';

var ShareModal = React.createClass({
    displayName: 'ShareModal',

    getInitialState: function getInitialState() {
        var users = []; 
        var users_tag = []; 
        return { users: users, users_tag: users_tag, choice: 0, choiceText: 'On your own Timeline', groupName: '', searchResult: [],
            object_id: 0 
        }; 
    },
    componentDidMount: function componentDidMount() {
        var div = React.findDOMNode(this.refs.auto_complete_tags);
        $(div).hide();
        var div2 = React.findDOMNode(this.refs.auto_complete_search);
        $(div2).hide();
        var div1 = React.findDOMNode(this.refs.tag_users);
        $(div1).hide();
        var input = React.findDOMNode(this.refs.input_tag);
        $(input).val('');
        $(input).focus();
    },
    toggleTag: function toggleTag(e) {
        e.preventDefault();
        var div = React.findDOMNode(this.refs.tag_users);
        if ($(div).is(':hidden')) {
            $(div).show();
        } else {
            $(div).hide();
        }
        var input = React.findDOMNode(this.refs.input_tag);
        input.focus();
    },
    inputTagOnChange: function inputTagOnChange(e) {
        var q = e.target.value;
        var that = this;
        var div = React.findDOMNode(this.refs.auto_complete_tags);
        if (q.length > 0) {
            $.ajax({
                url: BASE_URL + '/services/search/tagged_friends',
                data: { search: q }
            }).success(function (data) {
                if (data.length > 0) {
                    $(div).show();
                } else {
                    $(div).hide();
                }
                that.setState({ users: data });
            });
        } else {
            that.setState({ users: [] });
            $(div).hide();
        }
    },
    selectUser: function selectUser(e) {
        var target = e.target;
        if (target.tagName != "DIV") {
            $(target).parent().trigger('click');
        }

        if (target.tagName == "DIV") {
            var id = $(target).attr('data-id');
            var name = $(target).attr('data-name');
            var link = $(target).attr('data-link');
            var list = this.state.users_tag;
            var flag = false;
            for (var i in list) {
                if (list[i].id == id) flag = true;
            }
            if (!flag) {
                list.push({ id: id, name: name });
                this.setState({ users: [] });
                var input = React.findDOMNode(this.refs.input_tag);
                var div = React.findDOMNode(this.refs.auto_complete_tags);
                $(div).hide();
                $(input).val('');
                $(input).focus();
            }
        }
    },
    unSelectTag: function unSelectTag(e) {
        var id = $(e.target).attr('data-id');
        var tags = this.state.users_tag;
        for (var i in tags) {
            if (tags[i].id == id) {
                tags.splice(i, 1);
                break;
            }
        }
        this.setState({});
    }, sendUpdate: function sendUpdate() {
        var tagStr = "";
        var list = this.state.users_tag;
        if (list.length > 0) {
            var prefix = "";
            for (var i in list) {
                tagStr += prefix + list[i].id;
                prefix = ",";
            }
        }

        var text = React.findDOMNode(this.refs.share_text).value;
        var choice = this.state.choice;

        var postData = {};
        postData['update'] = text;
        var wall_id = parseInt(this.props.wall_id); //wall_id của update gốc
        if (choice == 0) {
            //nếu lựa chọn trên timeline của mình
            if (wall_id > 1090346680) {
                postData['wall_id'] = you.id;
            } else {
                postData['wall_id'] = wall_id;
            }
        } else {
            postData['wall_id'] = this.state.object_id; //nếu lựa chọn 2 hoặc 3
        }

        postData['uploads'] = "";
        postData['tags'] = tagStr;
        postData['share_id'] = this.props.share_id; //là id của update gốc mà mình là ng share lại
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/services/updates/new',
            data: postData
        }).success(function (data) {
            // if(current_wall.id == you.id){
            //     var updateID = data.update_id;
            //     if(updateID != null && updateID.length > 0){
            //         if(viewMode == 0){
            //             update["id"] = updateID;
            //             updates.unshift(update);
            //             React.render(
            //                 React.createElement(UpdateList, {data: updates}),
            //                 document.getElementById('timeline')
            //             );
            //         }

            //     }
            // }

        });
    },
    inputAutoOnchange: function inputAutoOnchange(e) {
        var q = e.target.value;
        var that = this;
        var div = React.findDOMNode(this.refs.auto_complete_search);
        if (q.length > 0) {
            var url = '/services/search/tagged_friends';
            if (this.state.choice == 2) {
                url = '/services/search/group';
            }
            $.ajax({
                url: BASE_URL + url,
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
            that.setState({ searchResult: [] });
            $(div).hide();
        }
    },
    'switch': function _switch(e) {

        var target = e.target;
        if (target.tagName == 'I' || target.tagName == 'SPAN') {
            target = target.parentElement;
        }

        ReactDOM.findDOMNode(this.refs.input_tag2).value = '';

        var menu = ReactDOM.findDOMNode(this.refs.menu);
        $('a', menu).removeClass('bold');
        $(target).addClass('bold');
        $('i', menu).addClass('transparent');

        $('i', target).removeClass('transparent');

        var choice = ReactDOM.findDOMNode(this.refs.choice);

        var value = $(target).attr('data-value');
        var autocomplete = ReactDOM.findDOMNode(this.refs.autocomplete);
        if (value != 0) {
            $(autocomplete).removeClass('hidden');
            if (value == '1') {
                this.setState({ choiceText: "On a friend's timeline", choice: 1, groupName: "Friend's name" });
            } else {
                this.setState({ choice: 2, choiceText: "In a group", groupName: 'Group name' });
            }
        } else {

            $(autocomplete).addClass('hidden');
            this.setState({ choice: 0, choiceText: "On your own Timeline" });
        }
    },
    selectEntry: function selectEntry(e) {
        var target = e.target;
        while (target.tagName != 'DIV') {
            target = target.parentElement;
        }
        var avatar = '/facebook/resources/images/uploads/' + $(target).attr('data-avatar');
        var name = $(target).attr('data-name');
        var id = $(target).attr('data-id');
        this.setState({ object_id: id });
        var result_overlay = ReactDOM.findDOMNode(this.refs.result_overlay);
        $('img', result_overlay).attr('src', avatar);
        $('b', result_overlay).html(name);
        $(result_overlay).removeClass('hidden');
        $(result_overlay).show();
        var auto_complete_search = ReactDOM.findDOMNode(this.refs.auto_complete_search);
        $(auto_complete_search).hide();
    },
    closeResultOverLay: function closeResultOverLay() {
        var result_overlay = ReactDOM.findDOMNode(this.refs.result_overlay);
        $(result_overlay).hide();
        ReactDOM.findDOMNode(this.refs.input_tag2).value = '';
    },
    render: function render() {
        var style = { width: '100%', minHeight: '60px', border: 'none !important', outline: 'none !important', 'resize': 'none' };
        var that = this;
        var users = this.state.users.map(function (user) {
            return React.createElement(
                'div',
                { 'data-id': user.id, 'data-name': user.name, 'data-link': user.link, onClick: that.selectUser },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + user.avatar }),
                ' ',
                user.name
            );
        });
        var that = this;
        var users_tag = this.state.users_tag.map(function (user) {
            return React.createElement(
                'span',
                null,
                user.name,
                ' ',
                React.createElement('i', { className: 'fa fa-times', onClick: that.unSelectTag, 'data-id': user.id })
            );
        });
        var searchResult = this.state.searchResult.map(function (entry) {
            return React.createElement(
                'div',
                { className: 'cursor hoverBg pl10 pt5 pb5', 'data-id': entry.id, 'data-name': entry.name, 'data-avatar': entry.avatar, onClick: that.selectEntry },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + entry.avatar, className: 'thumb-sm' }),
                ' ',
                React.createElement(
                    'b',
                    null,
                    entry.name
                )
            );
        });
        var div = React.createElement('div', null);
        var wall_id = parseInt(this.props.wall_id); //wall_id của post gốc

        if (wall_id > 1090346680) {
            div = React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'dropdown' },
                    React.createElement(
                        'button',
                        { type: 'button', className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown', 'data-hover': 'dropdown' },
                        React.createElement(
                            'b',
                            null,
                            this.state.choiceText
                        ),
                        ' ',
                        React.createElement('span', { className: 'caret' })
                    ),
                    React.createElement(
                        'ul',
                        { className: 'dropdown-menu', ref: 'menu', role: 'menu' },
                        React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', 'data-value': '0', className: 'bold', onClick: this['switch'] },
                                React.createElement('i', { className: 'fa fa-check relative right5 bold' }),
                                'On your own Timeline'
                            )
                        ),
                        React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', 'data-value': '1', onClick: this['switch'] },
                                React.createElement('i', { className: 'fa fa-check relative right5 transparent' }),
                                'On a friend\'s Timeline'
                            )
                        ),
                        React.createElement(
                            'li',
                            null,
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', 'data-value': '2', onClick: this['switch'] },
                                React.createElement('i', { className: 'fa fa-check relative right5 transparent' }),
                                'In a group'
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { ref: 'autocomplete', className: 'relative borderStyle1 my10 hidden ' },
                    React.createElement(
                        'div',
                        { ref: 'result_overlay', className: 'result_overlay hidden' },
                        React.createElement('img', { src: '', className: 'thumb-xs' }),
                        ' ',
                        React.createElement('b', null),
                        ' ',
                        React.createElement('i', { className: 'closeBt', onClick: this.closeResultOverLay })
                    ),
                    React.createElement('input', { className: 'inputStyle1 block full-width', ref: 'input_tag2', type: 'text', onChange: this.inputAutoOnchange, placeholder: this.state.groupName }),
                    React.createElement(
                        'div',
                        { className: 'absolute autocomplete_wrapper', ref: 'auto_complete_search' },
                        searchResult
                    )
                )
            );
        }

        return React.createElement(
            'div',
            { className: 'share_body' },
            div,
            React.createElement(
                'div',
                { className: 'my20 ' },
                React.createElement('input', { className: 'input_no_border input_share', ref: 'share_text', type: 'text', placeholder: 'Say something about this' })
            ),
            React.createElement(
                'div',
                null,
                this.props.embed
            ),
            React.createElement(
                'div',
                { className: 'update-uploads' },
                React.createElement(Gallery, { data: this.props.uploads })
            ),
            React.createElement(
                'div',
                { className: 'shareContent' },
                React.createElement(
                    'div',
                    { className: 'author_info' },
                    React.createElement(UserName, { id: this.props.user_id, name: this.props.user_name, link: "/facebook/" + this.props.user_link }),
                    ' ',
                    this.props.tags,
                    this.props.wall
                ),
                React.createElement(
                    'div',
                    { className: 'update-text' },
                    React.createElement(Text, { text: this.props.text })
                ),
                React.createElement(Timer, { time: this.props.time, className: 'text-muted media-object timeago' })
            ),
            React.createElement(
                'div',
                { className: 'py10', ref: 'tag_users' },
                React.createElement(
                    'div',
                    { className: 'tag_users pr10' },
                    users_tag
                ),
                React.createElement(
                    'div',
                    { className: 'inputBox' },
                    React.createElement('input', { className: 'inputStyle1', ref: 'input_tag', type: 'text', onChange: this.inputTagOnChange, placeholder: 'Tag your friends here' }),
                    React.createElement(
                        'div',
                        { className: 'auto_complete_tags', ref: 'auto_complete_tags' },
                        users
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'clearfix share_footer' },
                React.createElement(
                    'a',
                    { href: '#', onClick: this.toggleTag },
                    React.createElement('i', { className: 'fa fa-user-plus' })
                ),
                React.createElement(
                    'a',
                    { href: '#', className: 'btn btn-xs btn-primary pull-right closeDialog', onClick: this.sendUpdate },
                    'POST'
                )
            )
        );
    }
});