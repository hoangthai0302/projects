"use strict";

var Timer = React.createClass({
    displayName: "Timer",

    render: function render() {
        var unixSeconds = parseInt(this.props.time);
        var timeStr = moment.unix(unixSeconds).from(now);
        return React.createElement(
            "small",
            { className: this.props.className },
            " ",
            timeStr,
            " "
        );
    }
});

function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
var Text = React.createClass({
    displayName: "Text",

    render: function render() {
        var text = this.props.text.trim();
        text = escapeHtml(text);
        var emoj = {
            ":)": "<span class='emoticons emo-smile'></span>",
            ":(": "<span class='emoticons emo-frown'></span>",
            ":p": "<span class='emoticons emo-tongue'></span>",
            "=d": "<span class='emoticons emo-grin'></span>",
            ":o": "<span class='emoticons emo-gasp'></span>",
            ";)": "<span class='emoticons emo-wink'></span>",
            ":v": "<span class='emoticons emo-pacman'></span>",
            " :/": "<span class='emoticons emo-unsure'></span>",
            ":'(": "<span class='emoticons emo-cry'></span>",
            "^_^": "<span class='emoticons emo-kiki'></span>",
            "8-)": "<span class='emoticons emo-glasses'></span>",
            "b|": "<span class='emoticons emo-sunglasses'></span>",
            "<3": "<span class='emoticons emo-heart'></span>",
            "3:)": "<span class='emoticons emo-devil'></span>",
            "o:)": "<span class='emoticons emo-angel'></span>",
            "-_-": "<span class='emoticons emo-squint'></span>",
            "o.o": "<span class='emoticons emo-confuse'></span>",
            ">:o": "<span class='emoticons emo-upset'></span>",
            ":3": "<span class='emoticons emo-colonthree'></span>",
            "(y)": "<span class='emoticons emo-like'></span>"
        };

        var keys = Object.keys(emoj);
        for (var i in keys) {
            var find = keys[i];
            var replace = emoj[find];
            text = text.replace(find, replace);
        }
        text = Autolinker.link(text, { className: "myLink" });
        return React.createElement("span", { className: "update-text", dangerouslySetInnerHTML: { __html: text } });
    }
});

var FluidVid = React.createClass({
    displayName: "FluidVid",

    getDefaultProps: function getDefaultProps() {
        return {
            src: '',
            width: 1600,
            height: 900
        };
    },
    getRatio: function getRatio(width, height) {
        return parseInt(height, 10) / parseInt(width, 10) * 100 + '%';
    },
    render: function render() {
        var ratio = {
            paddingTop: this.getRatio(this.props.width, this.props.height)
        };
        return React.createElement(
            "div",
            { className: 'fluidvids', style: ratio },
            React.createElement("iframe", { src: this.props.src, width: this.props.width, height: this.props.height, frameBorder: 0, allowfullscreen: true })
        );
    }
});

var Box = React.createClass({
    displayName: "Box",

    render: function render() {
        return React.createElement(
            "div",
            { className: this.props.className },
            this.props.children
        );
    }
});
var Line = React.createClass({
    displayName: "Line",

    render: function render() {
        return React.createElement(
            Box,
            { className: this.props.className },
            this.props.children
        );
    }
});

var ImageButton = React.createClass({
    displayName: "ImageButton",

    render: function render() {
        return React.createElement(
            "a",
            { href: "#", onClick: this.props.onClick, className: this.props.className, title: this.props.title },
            this.props.children
        );
    }
});