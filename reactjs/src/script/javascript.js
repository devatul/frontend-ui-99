module.exports = function () {
    $(document).on('click', '.dropdown-menu.has-arrow', function (e) {
        e.stopPropagation();
    });    

    $(document).on('click', '.dropdown-menu.has-child', function(e){
        e.stopPropagation();
    });

    $('.toggle-button').on('click', function(){
        var parent = $(this).parents('.dropdown');
        $(parent).find('.dropdown-backdrop-custom').toggle();
        $(parent).find('.dropdown-menu.has-child').toggle();
    });

    $('.dropdown-backdrop-custom').on('click', function(e){
        $('.dropdown-backdrop-custom').toggle();
        $('.dropdown-menu.has-child').toggle();
    });

    $('body').on('click', '.dropdown-backdrop', function(e){
        $(this).remove();
        $(this).parent().find('.dropdown-menu').toggle();
    });

    // hold onto the drop down menu                                             
    var dropdownMenu;

    // and when you show it, move it to the body                                     
    $(window).on('show.bs.dropdown', function (e) {

        var windowWidth = $(window).innerWidth();
        // grab the menu     
        dropdownMenu = $(e.target).find('.dropdown-menu');
        console.log($(e.target));
        setTimeout(function(){
            if (!$(e.target).find('.dropdown-backdrop').length && !$(e.target).find('.dropdown-backdrop-custom').length){
                $(e.target).append('<span class="dropdown-backdrop"></span>');
            }

        });
        if ( windowWidth <=996 && dropdownMenu.hasClass('full-mobile') ){   
            // detach it and append it to the body
            $('body').append(dropdownMenu.detach());

            // grab the new offset position
            var eOffset = $(e.target).offset();

            // make sure to place it where it would normally go (this could be improved)
            dropdownMenu.css({
                'display': 'block',
                'top': eOffset.top + $(e.target).outerHeight(),
                'left': eOffset.left
            });
        }
    });

    // and when you hide it, reattach the drop down, and hide it normally                                                   
    $(window).on('hide.bs.dropdown', function (e) {
        var windowWidth = $(window).innerWidth();

        if ( windowWidth <=996 && dropdownMenu.hasClass('full-mobile') ){
            $(e.target).append(dropdownMenu.detach());
            dropdownMenu.hide();
        }
    });     

    $('select.detail-select').select2({
        minimumResultsForSearch: Infinity
    }).select2('val', null);;

    var notiType;
    $('.filter-noti-icon').on('click', function(){
        if (notiType == $(this).attr('data-type')){
            $('[data-noti-type]').show();
            $('.filter-noti-icon').parents('span').show();
            notiType = '';
        }
        else{
            notiType = $(this).attr('data-type');
            $('.filter-noti-icon').parents('span').hide();
            $('.filter-noti-icon[data-type='+notiType+']').parents('span').show();
            $('[data-noti-type]').each(function(){
                if ($(this).attr('data-noti-type') == notiType){
                    $(this).show();
                }
                else{
                    $(this).hide();   
                }
            });
        }
    });

    $('.filter-noti').on('change', function(){
        var filterType = $( '.filter-noti option:selected' ).attr('data-update-time');
        if (filterType == 'update-default'){
            $('[data-last-update]').show();
        }
        else if (filterType == 'update-pending' || filterType == 'update-completed'){
            $('[data-last-update]').show();
            $('[data-update-status]').hide();
            $('[data-update-status='+filterType+']').show();
        }
        else if (filterType == 'update-week'){
            $('[data-update-status]').show();
            $('[data-last-update]').hide();
            $('[data-last-update='+filterType+']').show();
            $('[data-last-update="update-yesterday"]').show();
            $('[data-last-update="update-today"]').show();
        }
        else{
            $('[data-last-update]').hide();
            $('[data-last-update='+filterType+']').show();
        }

    });

    $('.dropdown-noti .overview_question_a').on('click', function(e){
        e.preventDefault();
    });
}