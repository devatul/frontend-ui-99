module.exports = function () {
  //javascript.js
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
    //javascrip.todo.js
  $('.btn-end-review').click(function(){
    var table = $(this).parents('.dataTables_wrapper').find('.table-my-actions');
    table.find('tr').each(function () {
      $(this).removeClass('inactive');
      if ($(this).find('input[type="checkbox"]').prop('checked')){
        $(this).find('.doc-check').addClass('validated');
        $(this).addClass('item-validated');
        $(this).find('input[type="checkbox"]').prop('checked', false);
      };
    });
    if (table.find('.doc-check').length == table.find('.doc-check.validated').length){
      table.find('.btn-end-review').removeClass('btn-disabled');
       table.parents('.dataTables_wrapper').find('.actions-success').show();
    }
    var docToReview = 2 - table.find('.doc-check.validated').length;
    $(this).parents('.panel-body').find('.document_note').html('You have to review '+docToReview+' documents in Legal Category of Secret Confidentiality by latest 28th June');
  });

  $(".alert-close[data-hide]").on("click", function(){
      $(this).closest("." + $(this).attr("data-hide")).hide();
  });
    $('.approve-button-2').click(function(){
        $(this).hide();
        var target = $(this).attr('data-target');
        var table = $(target).find('.table-my-actions');
        var trNum = $(target).find('tbody tr').length;
        var tableTitle = $(target).find('.document_panel-title.panel-title').text();

        table.find('tr').each(function () {
          $(this).removeClass('inactive');
          if ($(this).find('input[type="checkbox"]').prop('checked')){
            $(this).find('.doc-check').addClass('validated');
            //$(this).addClass('item-validated');
            $(this).find('input[type="checkbox"]').prop('checked', false);
            $(this).find( 'i.fa-check').attr('style', 'color: #59D0A7');
            $(this).find( 'i.fa-check').addClass('icon-success');
          };
        });
        if($(target).find('.challenge-btn i').hasClass('icon-danger')) {
              $(target).find('.challenge-btn i').removeClass('icon-danger');
           }
        if (table.find('.doc-check').length == table.find('.doc-check.validated').length && $(target).find('.checkbox-all-1').attr('checked')){
            $(target).find('.btn-end-review').removeClass('btn-disabled');
           $(target).find('.actions-success').show();
        }
        if(table.find('.doc-check.validated').length > 0) {
          var docToReview = trNum - table.find('.doc-check.validated').length;
          $(target).find('.document_note span.document_number').html(docToReview);
          $(target).find('.document_note span.document_category').html(tableTitle);
        }
        if($(target).find('.challenge-btn i.icon-success').length > 0) {
          var docToReview = trNum - table.find('.challenge-btn i.icon-success').length;
          $(target).find('.document_note span.document_number').html(docToReview);
          $(target).find('.document_note span.document_category').html(tableTitle);
        }
    });
  $('.approve-button').click(function(){
    $(this).hide();
    var table = $(this).parents('.dataTables_wrapper').find('.table-my-actions');
    table.find('tr').each(function () {
      $(this).removeClass('inactive');
      if ($(this).find('input[type="checkbox"]').prop('checked')){
        $(this).find('.doc-check').addClass('validated');
        //$(this).addClass('item-validated');
        $(this).find('input[type="checkbox"]').prop('checked', false);
      };
    });
    if (table.find('.doc-check').length == table.find('.doc-check.validated').length){
      table.find('.btn-end-review').removeClass('btn-disabled');
       table.parents('.dataTables_wrapper').find('.actions-success').show();
    }
    var docToReview = 2 - table.find('.doc-check.validated').length;
    $(this).parents('.panel-body').find('.document_note').html('You have to review '+docToReview+' documents in Legal Category of Secret Confidentiality by latest 28th June');
  });

  $(".alert-close[data-hide]").on("click", function(){
      $(this).closest("." + $(this).attr("data-hide")).hide();
  });

  $('.select-group select').focus(function(){
      var selectedRow = $(this).parents('tr');
      $('.table-my-actions tr').each(function(){
        if (!$(this).find('.checkbox-item').prop('checked')){
          $(this).addClass('inactive');
        }
      });
      selectedRow.removeClass('inactive');
  });

  $('.doc-check').on('click', function(e){
    e.preventDefault();
    var target = $(this).attr('data-target');
    if($(this).find('i.fa-check').attr('style') != null) {
      $(this).find('i.fa-check').removeAttr('style');
    }
    $(this).addClass('validated');
    $(this).addClass('item-validated-0');
   // $(this).parents('tr').addClass('item-validated');
    if ($(this).parents('.table-my-actions').find('.doc-check').length == $(this).parents('.table-my-actions').find('.doc-check.item-validated-0').length){
      $(target).find('.actions-success').show();
      $(target).find('.doc-check').addClass('validated');
      $(target).find('.btn-end-review').removeClass('btn-disabled');
    }
    var docToReview = 2 - $(this).parents('.table-my-actions').find('.doc-check.validated').length;
    $(this).parents('.panel-body').find('.document_note').html('You have to review '+docToReview+' documents in Legal Category of Secret Confidentiality by latest 28th June');
  });

  $('.select-group select').change(function(){
      var target = $(this).attr('data-target');
      var selectedRow = $(this).parents('tr');
      selectedRow.find('.doc-check').addClass('validated');
      if(selectedRow.find('.doc-check').hasClass('item-validated-0')) {
        selectedRow.find('.doc-check').removeClass('item-validated-0');
        selectedRow.find('.doc-check i.fa-check').css('color', '#FFC200');
        $(target).find('.actions-success').hide();
        $(target).find('.btn-end-review').removeClass('btn-disabled');
      }
  });

  $('.select-group select').blur(function(){
    $('.table-my-actions tr').removeClass('inactive');
  });

  //check all checkbox on table
  $('.checkbox-all').on('change', function(){
      var target = $(this).attr('data-target');
      if ($(this).prop('checked')){
          $(target).find('tr:not(.item-validated) input[type="checkbox"].checkbox-item').prop('checked', true);
          $(target).find('.show-on-checked-all').show();
          $(target).find('.table-my-actions tr').removeClass('inactive');
      }
      else{
          $(target).find('input[type="checkbox"].checkbox-item').prop('checked', false);
          $(target).find('.show-on-checked-all').hide();
      }
  });  
  $('.checkbox-all-1').on('change', function(){
      var target = $(this).attr('data-target');
      if ($(this).prop('checked')){
          $(this).attr('checked', 'checked');
          $(target).find('tr:not(.item-validated) input[type="checkbox"].checkbox-item-1').prop('checked', true);
          $(target).find('.show-on-checked-all-1').show();
          $(target).find('.table-my-actions tr').removeClass('inactive');
      }
      else{
          $(target).find('input[type="checkbox"].checkbox-item-1').prop('checked', false);
          $(target).find('.show-on-checked-all-1').hide();
      }
  });  
  $('.checkbox-all-2').on('change', function(){
      var target = $(this).attr('data-target');
      if ($(this).prop('checked')){
          $(target).find('tr:not(.item-validated) input[type="checkbox"].checkbox-item-2').prop('checked', true);
          $('.show-on-checked-all-2').show();
          $('.table-my-actions tr').removeClass('inactive');
      }
      else{
          $(target).find('input[type="checkbox"].checkbox-item-2').prop('checked', false);
          $('.show-on-checked-all-2').hide();
      }
  });  

  $('.checkbox-item').on('change', function(){
      var target = $(this).attr('data-target');
      var checkboxNum = $('.checkbox-item').length;
      var checkedNum = 0;
      $(target).find('input[type="checkbox"].checkbox-item').each(function(){
          if ($(this).prop('checked')){
              checkedNum++;
              $(this).parents('tr').removeClass('inactive');
          }
          else{
              $(this).parents('tr').addClass('inactive');
          }
      });
      if (checkedNum > 0){
          $('.show-on-checked-all').show();
      }
      else{
          $('.show-on-checked-all').hide();     
          $('.table-my-actions tr').removeClass('inactive');
      }
  });

$('.checkbox-item-1').on('change', function(){
      var target = $(this).attr('data-target');
      var checkboxNum = $(target).find('.checkbox-item-1').length;
      var checkedNum = 0;

      $(target).find('input[type="checkbox"].checkbox-item-1').each(function(){
          if ($(this).prop('checked')){
              checkedNum++;
              $(this).parents('tr').removeClass('inactive');
          }
          else{
              $(this).parents('tr').addClass('inactive');
          }
      });

      if (checkedNum == checkboxNum){
        $(target).find('input[type="checkbox"].checkbox-all-1').prop('checked', true);
        $(target).find('input[type="checkbox"].checkbox-all-1').attr('checked', true);
      } else {
        $(target).find('input[type="checkbox"].checkbox-all-1').prop('checked', false);
        //$(target).find('input[type="checkbox"].checkbox-all-1').attr('checked', false);
      }
      if(checkedNum > 0) {
        $(target).find('.show-on-checked-all-1').show();
      } else {
          $(target).find('.show-on-checked-all-1').hide();     
          $(target).find('.table-my-actions tr').removeClass('inactive');
      }
  }); 
  $('.checkbox-item-2').on('change', function(){
      var target = $(this).attr('data-target');

      var checkboxNum = $('.checkbox-item-2').length;
      var checkedNum = 0;
      $(target).find('input[type="checkbox"].checkbox-item-2').each(function(){
          if ($(this).prop('checked')){
              checkedNum++;
              $(this).parents('tr').removeClass('inactive');
          }
          else{
              $(this).parents('tr').addClass('inactive');
          }
      });
      if (checkedNum > 0){
          $('.show-on-checked-all-2').show();
      }
      else{
          $('.show-on-checked-all-2').hide();     
          $('.table-my-actions tr').removeClass('inactive');
      }
  }); 

  $('.challenge-btn').on('click', function(e){
    
    e.preventDefault();
    var target = $(this).attr('data-target');
    $(this).find('i').addClass('icon-success');
    if($(target).find('select.challenge-confidentiality').hasClass('red')) {
      $(target).find('select.challenge-confidentiality').removeClass('red');
    }
    if($(target).find('select.challenge-category').hasClass('red')) {
      $(target).find('select.challenge-category').removeClass('red');
    }
    $().removeClass();
    
    if($(target).find('.challenge-btn').length == $(target).find('.challenge-btn i.icon-success').length) {
        $(target).find('.actions-success').show();
        $(target).find('.btn-end-review').removeClass('btn-disabled');
    }
    var percent = $(target).find('.challenge-btn i.icon-success').length * 50;
    var classes =  $("#reviewValidation .progress-radial").attr('class').split(' ');
    $.each(classes, function(i, c) {
        if (c != 'progress-radial' && c.indexOf('progress') == 0) {
            $("#reviewValidation .progress-radial").removeClass(c);
        }
    });
    $("#reviewValidation .progress-radial").addClass('progress-'+percent);

  });

  $('.challenge-confidentiality').on('change', function(){
    var target = $(this).attr('data-target');
    var btn = $(this).parents('tr').find('.challenge-btn i');
    if (btn.hasClass('icon-success')){
      btn.remove();
      $(target).find('.actions-success').hide();
      $(target).find('.btn-end-review').addClass('btn-disabled');
    }
    var percent = $(target).find('.challenge-btn i.icon-success').length * 50;
    var classes =  $("#reviewValidation .progress-radial").attr('class').split(' ');
    $.each(classes, function(i, c) {
        if (c != 'progress-radial' && c.indexOf('progress') == 0) {
            $("#reviewValidation .progress-radial").removeClass(c);
        }
    });
    $("#reviewValidation .progress-radial").addClass('progress-'+percent);

    $(this).addClass('red changed');
    $(this).parents('tr').find('.challenge-btn').html('<i id="icon_0" class="fa fa-check icon-danger" data-toggle="tooltip" data-placement="top" title="" data-original-title="You challenged back the review"></i>');
    $(this).parents('tr').find('.challenge-btn i').tooltip();
  });
  $('.challenge-category').on('change', function(){
    var target = $(this).attr('data-target');
    var btn = $(this).parents('tr').find('.challenge-btn i');
    if (btn.hasClass('icon-success')){
      btn.remove();
      $(target).find('.actions-success').hide();
      $(target).find('.btn-end-review').addClass('btn-disabled');
    }
    $(this).addClass('red changed');
    $(this).parents('tr').find('.challenge-btn').html('<i id="icon_0" class="fa fa-check icon-danger" data-toggle="tooltip" data-placement="top" title="" data-original-title="You challenged back the review"></i>');
    $(this).parents('tr').find('.challenge-btn i').tooltip();
    
    var percent = $(target).find('.challenge-btn i.icon-success').length * 50;
    var classes =  $("#reviewValidation .progress-radial").attr('class').split(' ');
    $.each(classes, function(i, c) {
        if (c != 'progress-radial' && c.indexOf('progress') == 0) {
            $("#reviewValidation .progress-radial").removeClass(c);
        }
    });
    $("#reviewValidation .progress-radial").addClass('progress-'+percent);
  });

  $('.btn-next-reviewer').on('click', function(){
    $('.reviewer-list > .active').next('li').find('a').trigger('click');
  });

  $('.btn-next-cat').on('click', function(){
    $('.cat-list > .active').next('li').find('a').trigger('click');
  });

  $(window).on('show.bs.dropdown', function (e) {

      var windowWidth = $(window).innerWidth();

      var selectedRow = $(e.target).parents('tr');
      if ((selectedRow).is('tr') && (selectedRow.parent()).is('tbody')){
        $('.table-my-actions tr').not(selectedRow).addClass('inactive');
      }

      // grab the menu     
      var dropdownMenu = $(e.target).find('.dropdown-menu');

      if ( dropdownMenu.hasClass('append-to-body') ){   
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

  $(window).on('hide.bs.dropdown', function (e) {
        var windowWidth = $(window).innerWidth();

        if ( dropdownMenu.hasClass('append-to-body') ){
            $(e.target).append(dropdownMenu.detach());
            dropdownMenu.hide();
            $('.table-my-actions tr').removeClass('inactive');
        }

  });   

}


