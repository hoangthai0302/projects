'use strict';

var TimelineAlbum = React.createClass({
    displayName: 'TimelineAlbum',

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'header' },
                React.createElement(
                    'h3',
                    null,
                    React.createElement('img', { src: '/facebook/resources/images/icons/photos_24.png', className: 'mr10' }),
                    'Photos'
                )
            ),
            React.createElement(
                'div',
                { className: 'body' },
                React.createElement(Album, { data: this.props.data })
            )
        );
    }
});

var Album = React.createClass({
    displayName: 'Album',

    componentDidMount: function componentDidMount() {
        if (this.props.data.length > 0) {
            var gallery = React.findDOMNode(this.refs.gallery);
            $(gallery).justifiedGallery({
                rowHeight: 150,
                lastRow: 'justify',
                rel: '1',
                margins: 3
            });
        }
    },

    render: function render() {

        var images = this.props.data.map(function (img) {
            return React.createElement(TimelinePhoto, { key: img.id, id: img.id, update_id: img.update_id, src: '/facebook/resources/images/uploads/' + img.src });
        });

        return React.createElement(
            'div',
            { ref: 'gallery' },
            images
        );
    }
});

var Template = React.createClass({
    displayName: 'Template',

    componentDidMount: function componentDidMount() {
        var div = ReactDOM.findDOMNode(this.refs.div);
        $(div).slimScroll({ width: '340px', height: '500px' });
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'update-modal-popup clearfix' },
            React.createElement(
                'div',
                { className: 'left' },
                React.createElement('img', { src: this.props.src, className: 'img-responsive' })
            ),
            React.createElement(
                'div',
                { ref: 'div', id: 'template', className: 'right' },
                React.createElement(UpdateList, { data: this.props.data, showType: '1' })
            )
        );
    }
});

var TimelinePhoto = React.createClass({
    displayName: 'TimelinePhoto',

    deletePhoto: function deletePhoto(e) {
        e.stopPropagation();
        var photo_id = this.props.id;

        BootstrapDialog.confirm({
            title: 'WARNING',
            message: 'Delete this photo?',
            type: BootstrapDialog.TYPE_DANGER,
            closable: true,
            cssClass: 'dialog-small',
            draggable: true,
            btnCancelLabel: 'Cancel',
            btnOKLabel: 'Remove',
            btnOKClass: 'btn-danger',
            callback: function callback(result) {
                if (result) {
                    $.ajax({
                        url: BASE_URL + '/services/users/deletePhoto',
                        data: { photo_id: photo_id },
                        success: function success(data) {
                            if (data.error == '') {
                                for (var i in currentPhotos) {
                                    if (currentPhotos[i]['id'] == photo_id) {
                                        currentPhotos.splice(i, 1);
                                        break;
                                    }
                                }
                                React.render(React.createElement(TimelineAlbum, { data: currentPhotos }), document.getElementById('photos'));
                                current_wall.upload_count--;
                                React.render(React.createElement(WallHeader, { data: current_wall }), document.getElementById('wall_header'));
                            }
                        }
                    });
                }
            }
        });
    },
    showDetailUpdate: function showDetailUpdate() {
        //chế độ xem ảnh
        viewMode = 1;
        var update_id = this.props.update_id;

        var action = 1;
        var that = this;
        $.ajax({
            url: BASE_URL + '/services/updates/detail',
            data: { object_id: update_id, action: action },
            success: function success(data) {
                updateSingle = data;
                var wrapper = document.createElement('div');
                React.render(React.createElement(Template, { src: that.props.src, data: updateSingle }), wrapper);

                var dialog = new BootstrapDialog({
                    message: function message(dialogRef) {

                        var $message = $(wrapper);

                        return $message;
                    },
                    cssClass: 'update-modal',
                    closable: true
                });
                dialog.realize();
                dialog.getModalHeader().hide();
                dialog.getModalFooter().hide();
                dialog.getModalBody().css('padding', '0px');

                dialog.open();
                $('.closeSingleUpdateDialog', wrapper).click(function () {
                    dialog.close();
                });
            }
        });
    },
    render: function render() {
        var deleteBt = React.createElement('span', null);
        if (current_wall.id == you.id) {
            deleteBt = React.createElement('span', { onClick: this.deletePhoto, className: 'closeBt', title: 'delete this photo' });
        }
        return React.createElement(
            'a',
            { ref: 'a', key: this.props.src, className: 'timelinePhoto', href: 'javascript:void(0)', onClick: this.showDetailUpdate },
            React.createElement('img', { src: this.props.src }),
            deleteBt
        );
    }
});

var Gallery = React.createClass({
    displayName: 'Gallery',

    componentDidMount: function componentDidMount() {
        if (this.props.data.length > 0) {
            var gallery = React.findDOMNode(this.refs.gallery);
            var id = this.props.id;
            $(gallery).justifiedGallery({
                rowHeight: 70,
                lastRow: 'justify',
                rel: id,
                margins: 3
            }).on('jg.complete', function () {
                $(this).find('a').colorbox({ rel: id });
            });
        }
    },
    render: function render() {

        var images = this.props.data.map(function (image) {
            return React.createElement(
                'a',
                { key: image, href: "/facebook/resources/images/uploads/" + image },
                React.createElement('img', { src: '/facebook/resources/images/uploads/' + image })
            );
        });

        return React.createElement(
            'div',
            { ref: 'gallery' },
            images
        );
    }
});