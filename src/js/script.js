import $ from 'jquery';

$(function() {
    $(document).on("click", function(event) {
        if (!$(event.target).closest(".shr-notice-popup").length) {
            $('#btn-show-notice-popup').removeClass('active');
            $(".shr-notice-popup").slideUp(100);
        }

        if (!$(event.target).closest(".shr-user-profile-popup").length) {
            $('#btn-show-user-profile-popup').removeClass('active');
            $(".shr-user-profile-popup").slideUp(100);
        }

        if (!$(event.target).closest("#hamburger").length) {
            $('.hamburger').removeClass('active');
            $(".shr-menu-popup").slideUp(100);
        }
    });

    function triger_btn_notice() {
        $('#btn-show-notice-popup').click(function() {
            $('#shr-user-profile-popup').slideUp(100);
            $(".shr-menu-popup").slideUp(100);

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('#shr-notice-popup').slideUp(100);
            } else {
                $(this).addClass('active');
                $('#shr-notice-popup').slideDown(100);
            }
    
            return false;
        });

        $('#btn-show-user-profile-popup').click(function(e) {
            $('#shr-notice-popup').slideUp(100);
            $(".shr-menu-popup").slideUp(100);

            if ($(e.target).hasClass('shr-upp-link-page')) {
                $('#shr-user-profile-popup').slideUp(100);
                return true;
            }
            
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('#shr-user-profile-popup').slideUp(100);
            } else {
                $(this).addClass('active');
                $('#shr-user-profile-popup').slideDown(100);
            }
    
            return false;
        });

        $('#hamburger').click(function() {
            $('#shr-notice-popup').slideUp(100);
            $('#shr-user-profile-popup').slideUp(100);
            
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('#shr-menu-popup').slideUp(100);
            } else {
                $(this).addClass('active');
                $('#shr-menu-popup').slideDown(100);
            }
        });
    }
    
    triger_btn_notice();

    // $('#header').load('/assets/inc/header.html', function () {
    //     triger_btn_notice();
    // });

    // $('#header-profile').load('/assets/inc/header-profile.html', function () {
    //     triger_btn_notice();
    // });

    // $('#footer').load('/assets/inc/footer.html', function () {
    // });
});