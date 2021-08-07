$(document).ready(function() {
    // $('#mv-infos-tabs a').click(function() {
    //     if ($(this).hasClass('active')) return false;
        
    //     $('.mv-infos-panel').hide();
    //     $('.mv-infos-tabs a.active').removeClass('active');
    //     $(this).addClass('active');
        
    //     var panel = $(this).attr('href');
    //     $(panel).fadeIn(1000);
        
    //     return false;
    // });

    // $('#mv-infos-tabs a:first').click();

    $('#btn-discover-search-header-filter').click(function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('#discover-search-body').slideDown(300);
        } else {
            $('#discover-search-body').slideUp(300);            
        }
        return false;
    });

    // var ps_childs = document.getElementById("ps-slide-wrapper").children;
    // if (ps_childs.length > 5) {
        var swiper_ps = new Swiper('#ps-slide', {
            cssWidthAndHeight: true,
            slidesPerView: 'auto',
            loop: false, 
            visibilityFullFit: true,
            autoResize: false,
            navigation: {
                prevEl: '#ps-body .swiper-button-prev',
                nextEl: '#ps-body .swiper-button-next',
            },
        });
    // }

    // var hb_childs = document.getElementById("hb-swiper-wrapper").children;
    // if (hb_childs.length > 4) {
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
    // }

    // var swiper_hc = new Swiper('#hc-slide', {
    //     cssWidthAndHeight: true,
    //     slidesPerView: 'auto',
    //     loop: true, 
    //     visibilityFullFit: true,
    //     autoResize: false,
    //     navigation: {
    //         prevEl: '#hot-collections .swiper-button-prev',
    //         nextEl: '#hot-collections .swiper-button-next',
    //     },
    // });

    // if ( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //     var swiper_discover = new Swiper('#discover-slide', {
    //         cssWidthAndHeight: true,
    //         slidesPerView: 'auto',
    //         spaceBetween: 16, 
    //         loop: true, 
    //         visibilityFullFit: true,
    //         autoResize: false,
    //         navigation: {
    //             prevEl: '#discover .swiper-button-prev',
    //             nextEl: '#discover .swiper-button-next',
    //         },
    //     });
    // }
});