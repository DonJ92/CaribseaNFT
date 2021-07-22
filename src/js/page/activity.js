/* javascriptのコードを記載 */
$(document).ready(function() {
    $('#btn-filter-all-select').click(function() {
        $('.filters-list input[type=checkbox]').prop('checked', true);
        return false;
    });

    $('#btn-filter-all-unselect').click(function() {
        $('.filters-list input[type=checkbox]').prop('checked', false);
        return false;
    });

    $('#btn-show-filter').click(function() {
        $(this).css('visibility', 'hidden');
        $('#btn-hide-filter').css('visibility', 'visible');
        $('#filters').slideDown(100);
    });

    $('#btn-hide-filter').click(function() {
        $(this).css('visibility', 'hidden');
        $('#btn-show-filter').css('visibility', 'visible');
        $('#filters').slideUp(100);
    });
});