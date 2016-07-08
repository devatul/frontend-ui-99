module.exports = function() {

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

  // hold onto the drop down menu                                             
  var dropdownMenu;

  // and when you show it, move it to the body                                     
  $(window).on('show.bs.dropdown', function (e) {

      var windowWidth = $(window).innerWidth();
      // grab the menu     
      dropdownMenu = $(e.target).find('.dropdown-menu');
      console.log($(e.target));
      if($(e.target).has(".dropdown-backdrop").length == 0) {
        $(e.target).append('<span class="dropdown-backdrop"></span>');
      }
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
  }).select2('val', null);

  $('.filter-noti-icon').on('click', function(){
      var notiType = $(this).attr('data-type');
      $('[data-noti-type]').each(function(){
          if ($(this).attr('data-noti-type') == notiType){
              $(this).show();
          }
          else{
              $(this).hide();   
          }
      });
  });

  $('.dropdown-noti .overview_question_a').on('click', function(e){
      e.preventDefault();
  });
}