'use strict';

var UpdateBox = React.createClass({
    displayName: 'UpdateBox',

    getInitialState: function getInitialState() {
        var users = []; //danh sách user nằm ở dropdown list
        var users_tag = []; //danh sách tagged user
        var uploads = [];
        return { users: users, users_tag: users_tag, uploads: uploads };
    },
    componentDidMount: function componentDidMount() {
        var div = React.findDOMNode(this.refs.auto_complete_tags);
        $(div).hide();
        var div1 = React.findDOMNode(this.refs.tag_users);
        $(div1).hide();
        var input = React.findDOMNode(this.refs.input_tag);
        $(input).val('');
        $(input).focus();
    },
    toggleTag: function toggleTag() {

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
    },
    unSelectUpload: function unSelectUpload(e) {
        var uploads = this.state.uploads;
        var id = $(e.target).attr('id');
        for (var i in uploads) {
            if (uploads[i].id == id) {
                uploads.splice(i, 1);
                break;
            }
        }
        this.setState({});
    },
    browseFile: function browseFile() {
        var file = React.findDOMNode(this.refs.file);
        $(file).trigger('click');
    },
    onFileSelected: function onFileSelected() {
        var file = React.findDOMNode(this.refs.file);
        var files = file.files;

        var formData = new FormData();
        for (var i in files) {
            formData.append("file", file.files[i]);
        }

        var that = this;
        $.ajax({
            url: '/facebook/services/upload',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function success(data) {
                if (data.length > 0) {
                    var uploads = that.state.uploads;
                    for (var i in data) {
                        var name = data[i].name;
                        uploads.push({ link: name, id: uploads.length + i });
                    }
                    that.setState({});
                }
            }
        });
    },
    sendUpdate: function sendUpdate(e) {
        var textarea = React.findDOMNode(this.refs.txtUpdate);
        var text = textarea.value;
        if (!text) {
            text = '';
        }
        var uploads = this.state.uploads;
        var str = "";
        var upload_count = uploads.length;
        if (upload_count > 0) {
            var prefix = "";
            for (var i in uploads) {
                str += prefix + uploads[i].link;
                prefix = ",";
            }
        }
        var tagStr = "";
        var list = this.state.users_tag;
        if (list.length > 0) {
            var prefix = "";
            for (var i in list) {
                tagStr += prefix + list[i].id;
                prefix = ",";
            }
        }
        var update = {
            "share_count": "0",
            "you_like": "0",
            "like_count": "0",
            "tag_count": list.length,
            "link": "",
            "time": parseInt(moment().format("X")),
            "text": text,
            "uploads": str,
            "user": you,
            "wall": current_wall,
            "comments": [],
            "tags": this.state.users_tag,
            "likes": []
        };

        var postData = {};
        postData['update'] = text;
        postData['wall_id'] = current_wall.id;
        postData['uploads'] = str;
        postData['tags'] = tagStr;
        var that = this;
        $.ajax({
            type: 'POST',
            url: BASE_URL + '/services/updates/new',
            data: postData
        }).success(function (data) {
            var updateID = data.update_id;
            if (updateID != null && updateID.length > 0) {

                update["id"] = updateID;
                updates.unshift(update);
                that.setState({ users: [], users_tag: [], uploads: [] });
                React.render(React.createElement(UpdateList, { data: updates }), document.getElementById('timeline'));

                if (upload_count > 0) {
                    var current = parseInt(current_wall.upload_count);
                    current_wall.upload_count = current + upload_count;
                    if (page == '1') {
                        React.render(React.createElement(WallHeader, { data: current_wall }), document.getElementById('wall_header'));
                    }
                }
            }
            textarea.value = '';
        }).fail(function () {
            alert();
        });
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
                React.createElement(
                    'b',
                    null,
                    user.name
                )
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
        var uploads = this.state.uploads.map(function (upload) {
            return React.createElement('img', { src: '/facebook/resources/images/uploads/' + upload.link, className: 'upload_thumb', folder: 'uploads', id: upload.id, onClick: that.unSelectUpload });
        });
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'p15 bd-b border-color1' },
                React.createElement(
                    'b',
                    { id: 'what' },
                    'What\'s up, ',
                    React.createElement(
                        'span',
                        { id: 'username' },
                        this.props.name
                    ),
                    '?'
                )
            ),
            React.createElement('textarea', { name: 'update', className: 'p10', id: 'ta_update', placeholder: 'Write something...', ref: 'txtUpdate', style: style }),
            React.createElement(
                'div',
                { id: 'updateIcon', className: 'clearfix ' },
                React.createElement(
                    'div',
                    { className: 'p5 thumb_box' },
                    uploads
                ),
                React.createElement(
                    'div',
                    { className: 'pl10 pb5', ref: 'tag_users' },
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
                    { className: 'bd-t border-color1 p10 clearfix' },
                    React.createElement('input', { type: 'button', onClick: this.sendUpdate, value: ' Update ', id: 'update_button', className: 'btn btn-sm btn-success pull-right' }),
                    React.createElement(
                        'a',
                        { href: 'javascript:void(0);', id: 'camera', title: 'Upload Image', onClick: this.browseFile },
                        React.createElement('input', { type: 'file', ref: 'file', name: 'file', className: 'hidden', multiple: true, onChange: this.onFileSelected })
                    ),
                    React.createElement(
                        'a',
                        { href: 'javascript:void(0);', onClick: this.toggleTag },
                        React.createElement('i', { className: 'icon-user-plus ml5' })
                    )
                )
            )
        );
    }
});