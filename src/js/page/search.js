/* javascriptのコードを記載 */
$(document).ready(function() {
    $('.color-list .color-item').click(function() {
        var selected = $(this).hasClass('selected');
        if ($(this).hasClass('color-item-all')) {
            if (!selected) {
                $('.color-list .color-item').removeClass('selected');
            }
            $(this).toggleClass('selected');
        } else {
            $('.color-list .color-item-all').removeClass('selected');
            $(this).toggleClass('selected');
        }
    });
});