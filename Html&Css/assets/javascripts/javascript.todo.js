$(function () {
  $('.approve-button').click(function(){
    $(this).hide();
    $('.actions-success').show();
    $('.table-my-actions tr').each(function () {
      if ($(this).find('input[type="checkbox"].checkbox-item').prop('checked')){
        $(this).find('.doc-check').addClass('validated');

      };
    });
    if ($('.table-my-actions .doc-check').length == $('.table-my-actions .doc-check.validated').length){
      $('.btn-end-review').removeClass('btn-disabled');
    }
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
    $(this).addClass('validated');
    if ($('.table-my-actions .doc-check').length == $('.table-my-actions .doc-check.validated').length){
      $('.actions-success').show();
      $('.doc-check').addClass('validated');
      $('.btn-end-review').removeClass('btn-disabled');
    }
  });

  $('.select-group select').change(function(){
      var selectedRow = $(this).parents('tr');
      selectedRow.find('.doc-check').addClass('validated');
  });

  $('.select-group select').blur(function(){
    $('.table-my-actions tr').removeClass('inactive');
  });

  //check all checkbox on table
  $('.checkbox-all').on('change', function(){
      var target = $(this).attr('data-target');
      if ($(this).prop('checked')){
          $(target).find('input[type="checkbox"].checkbox-item').prop('checked', true);
          $('.show-on-checked-all').show();
          $('.table-my-actions tr').removeClass('inactive');
      }
      else{
          $(target).find('input[type="checkbox"].checkbox-item').prop('checked', false);
          $('.show-on-checked-all').hide();
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

  $(window).on('show.bs.dropdown', function (e) {

      var windowWidth = $(window).innerWidth();

      var selectedRow = $(e.target).parents('tr');
      if ((selectedRow).is('tr') && (selectedRow.parent()).is('tbody')){
        $('.table-my-actions tr').not(selectedRow).addClass('inactive');
      }

      // grab the menu     
      dropdownMenu = $(e.target).find('.dropdown-menu');

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

});


