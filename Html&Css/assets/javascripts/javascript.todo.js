$(function () {
    $('.approve-button-2').click(function(){
        $(this).hide();
        var table = $(this).parents('.dataTables_wrapper').find('.table-my-actions');
        console.log(table);
        table.find('tr').each(function () {
          if ($(this).find('input[type="checkbox"].checkbox-item-1').prop('checked')){
            $(this).find('.doc-check').addClass('validated');
          };
        });
        if (table.find('.doc-check').length == table.find('.doc-check.validated').length){
          table.find('.btn-end-review').removeClass('btn-disabled');
           table.parents('.dataTables_wrapper').find('.actions-success').show();
        }
    });


  $('.approve-button').click(function(){
    $(this).hide();
    var table = $(this).parents('.dataTables_wrapper').find('.table-my-actions');
    table.find('tr').each(function () {
      if ($(this).find('input[type="checkbox"].checkbox-item').prop('checked')){
        $(this).find('.doc-check').addClass('validated');
      };
    });
    if (table.find('.doc-check').length == table.find('.doc-check.validated').length){
      table.find('.btn-end-review').removeClass('btn-disabled');
       table.parents('.dataTables_wrapper').find('.actions-success').show();
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
  $('.checkbox-all-1').on('change', function(){
      var target = $(this).attr('data-target');
      if ($(this).prop('checked')){
          $(target).find('input[type="checkbox"].checkbox-item-1').prop('checked', true);
          $('.show-on-checked-all-1').show();
          $('.table-my-actions tr').removeClass('inactive');
      }
      else{
          $(target).find('input[type="checkbox"].checkbox-item-1').prop('checked', false);
          $('.show-on-checked-all-1').hide();
      }
  });  
  $('.checkbox-all-2').on('change', function(){
      var target = $(this).attr('data-target');
      if ($(this).prop('checked')){
          $(target).find('input[type="checkbox"].checkbox-item-2').prop('checked', true);
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

      var checkboxNum = $('.checkbox-item-1').length;
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
      if (checkedNum > 0){
          $('.show-on-checked-all-1').show();
      }
      else{
          $('.show-on-checked-all-1').hide();		  
          $('.table-my-actions tr').removeClass('inactive');
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


