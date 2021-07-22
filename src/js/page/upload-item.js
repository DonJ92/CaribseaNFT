$(document).ready(function() {
    $('#btn-create-item').click(function() {
        if (isValidInput()) $('#popup').fadeIn(100);
        return false;
    });

    $('#popup-close').click(function() {
        $('#popup').fadeOut(100);
        return false;
    });

    $('#btn-preview').click(function() {
        $('aside').fadeIn(100);
        return false;
    });

    $('#btn-uic-preview-close').click(function() {
        $('aside').fadeOut(100);
        return false;
    });

    function isValidInput() {
        var name = document.getElementById("name").value;
        var description = document.getElementById("description").value;
        var preview_png = document.getElementById("preview_png").src;
        var copies = document.getElementById("copies").value;
        
        if (name == "") {
            alert("Please input name.");
            return false;
        }

        if (description == "") {
            alert("Please input description.");
            return false;
        }

        if (isNaN(copies) || copies <= 0) {
            alert("Please input valid copies.");
            return false;
        }

        if (preview_png.includes("default_token.png")) {
            alert("Please select token image.");
            return false;
        }

        return true;
    }
});