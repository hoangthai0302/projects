$(document).ready(function () {
    function handle_mousedown(e) {
        window.my_dragging = {};
        my_dragging.pageX0 = e.pageX;
        my_dragging.pageY0 = e.pageY;
        my_dragging.elem = $(this).parent();
        my_dragging.offset0 = $(this).offset();
        function handle_dragging(e) {
            var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
            var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
            $(my_dragging.elem)
                    .offset({top: top, left: left});
        }
        function handle_mouseup(e) {
            $('body')
                    .off('mousemove', handle_dragging)
                    .off('mouseup', handle_mouseup);
        }
        $('body')
                .on('mouseup', handle_mouseup)
                .on('mousemove', handle_dragging);
    }
    $('.draggable').mousedown(handle_mousedown);
    $('input').mousedown(function (e) {

        e.stopPropagation();
    });
    $('i.fa').click(function () {
        $(this).parent().parent().children('.panel-body').slideToggle('fast');
    });

});