/* javascriptのコードを記載 */
$(document).ready(function() {
    $(".faq-item .faq-item-ttl").on("click", function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).parent().find('.faq-item-content').slideUp(300);
            $(this).find('i').removeClass('fa-angle-up');
            $(this).find('i').addClass('fa-angle-down');
        } else {
            $(this).addClass('active');
            $(this).parent().find('.faq-item-content').slideDown(300);
            $(this).find('i').removeClass('fa-angle-down');
            $(this).find('i').addClass('fa-angle-up');
        }

        return false;
    });

    var swiper_hb = new Swiper('#hb-slide', {
        cssWidthAndHeight: true,
        slidesPerView: 'auto',
        loop: false, 
        visibilityFullFit: true,
        autoResize: false,
        navigation: {
            prevEl: '#hot-bid .swiper-button-prev',
            nextEl: '#hot-bid .swiper-button-next',
        },
    });
});