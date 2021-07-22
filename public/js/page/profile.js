/* javascriptのコードを記載 */
$(document).ready(function() {
    // $('.profile-tags a').click(function() {
    //     $('.profile-infos-panel').hide();
    //     $('.profile-tags a.active').removeClass('active');
    //     $(this).addClass('active');
        
    //     var panel = $(this).attr('href');
    //     $(panel).fadeIn(1000);
        
    //     return false;
    // });

    // $('.profile-tags a:first').click();

    var slide_thumb = new Swiper('.slide-goods', {
        loop: true, 
        slidesPerView: 'auto',
        cssWidthAndHeight: true,
        visibilityFullFit: true,
        autoResize: false, 
    });
});