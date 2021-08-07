function init_ps() {
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
}

function init_hb() {
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
}

function init_discover() {
    if ( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        var swiper_discover = new Swiper('#discover-slide', {
            cssWidthAndHeight: true,
            slidesPerView: 'auto',
            spaceBetween: 16, 
            loop: true, 
            visibilityFullFit: true,
            autoResize: false,
            navigation: {
                prevEl: '#discover .swiper-button-prev',
                nextEl: '#discover .swiper-button-next',
            },
        });
    }
}

export default {
    init_ps,
    init_hb,
    init_discover
}