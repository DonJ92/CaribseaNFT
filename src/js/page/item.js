/* javascriptのコードを記載 */
$(document).ready(function() {
    $(document).on("click", function(event) {
        if (!$(event.target).closest(".shr-notice-popup").length) {
            $('#btn-show-item-popup').removeClass('active');
            $("#item-popup").slideUp(100);
        }
    });

    $('#btn-show-item-popup').click(function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('#item-popup').slideDown(100);
        } else {
            $('#item-popup').slideUp(100);            
        }
        return false;
    });

    $('#btn-purchase-now').click(function() {
        $('#popup-checkout-01').fadeIn(100);
        return false;
    });

    // $('#popup-purchase-01').click(function() {
    //     $('.popup').fadeOut(100);
    //     $('#popup-checkout-02').fadeIn(100);
    //     return false;
    // });

    $('#popup-purchase-02').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-checkout-03').fadeIn(100);
        return false;
    });

    $('#btn-place-a-bid').click(function() {
        // $('#popup-place-a-bid-01').fadeIn(100);
        $('#popup-place-a-bid-02').fadeIn(100);
        return false;
    });

    $('#btn-show-place-a-bid-01').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-place-a-bid-02').fadeIn(100);
        return false;
    });

    $('#btn-show-place-a-bid-02').click(function() {
        if (!isContinuable("bid-verify-notice")) return false;

        $('.popup').fadeOut(100);
        $('#popup-place-a-bid-03').fadeIn(100);
        return false;
    });

    $('#btn-cancel-bid').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-cancel-bid-01').fadeIn(100);
        return false;
    });

    $('#btn-accept-bid').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-accept-bid-01').fadeIn(100);
        return false;
    });

    // $('#btn_transfer').click(function() {
    //     $('.popup').fadeOut(100);
    //     $('#popup-transfer-01').fadeIn(100);
    //     return false;
    // });

    $('#btn_stake').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-stake-01').fadeIn(100);
        return false;
    });

    $('#btn_revoke').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-revoke-01').fadeIn(100);
        return false;
    });

    $('#popup-transfer-01-continue').click(function() {
        if (!isContinuable("transfer-verify-notice")) return false;

        $('.popup').fadeOut(100);
        $('#popup-transfer-02').fadeIn(100);
        return false;
    });

    $('#btn_sell').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-sale-01').fadeIn(100);

        return false;
    });

    $('#popup-sale-01-continue').click(function() {
        if (!isContinuable("sale-verify-notice")) return false;

        $('.popup').fadeOut(100);
        $('#popup-sale-02').fadeIn(100);
        return false;
    });

    $('#remove_fixed_price_sale').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-remove-fixed-price-01').fadeIn(100);

        return false;
    });

    $('#remove_auction_sale').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-remove-auction-01').fadeIn(100);

        return false;
    });

    $('#btn_edit_fee').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-fee-distribution-01').fadeIn(100);

        return false;
    });

    $('#btn_burn').click(function() {
        $('.popup').fadeOut(100);
        $('#popup-burn-01').fadeIn(100);

        return false;
    });

    $('.popup-close').click(function() {
        $('.popup').fadeOut(100);
        return false;
    });

    $('#congratulation-popup-close').click(function() {
        document.location.reload();
        return false;
    });

    $('.btn-cancel').click(function() {
        $('.popup').fadeOut(100);
        return false;
    });

    document.getElementById("uic-chk-fixed-price").checked = true;

    function isContinuable(verify_notice_id) {
        var element = document.getElementById(verify_notice_id);
        if (element.style.display == "none") {
            return true;
        }
        return false;
    }
});