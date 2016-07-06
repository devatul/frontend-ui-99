module.exports = function() {
	$(document).on('click', '.dropdown-menu.has-arrow', function (e) {
            e.stopPropagation();
        });    

        jQuery(document).on('click', '.dropdown-menu.has-child', function(e){
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

        $(function() {
          var renderFilterBlock = function(){
            if ($('.filter-tags .filter-label').length){
              $('.filter-tags-block label').show();
            }
            else{
              $('.filter-tags-block label').hide();
            }
          };

          if ($('.select-multiple').length){
              $('.select-multiple').each(function(){
                  var buttonText = $(this).attr('data-title');
                  $(this).multiselect({
                      includeSelectAllOption: true,
                      buttonText: function(options, select) {
                          return buttonText;
                      },
                      onChange: function(option, checked){
                          var selectedOption = $(option).val();
                          var filterCriteria = $(option).parents('.overview-filter').attr('name');
                          if(checked == true) {
                              $('<span class="filter-label label label-info" data-value="'+selectedOption+'" data-crit="'+filterCriteria+'"><a class="filter-remove"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags');
                              renderFilterBlock();
                          }
                          else{
                              $('.filter-label[data-value="'+selectedOption+'"]').remove();
                              renderFilterBlock();
                          }
                      }
                  });
              });
          }

          $('body').on('click', '.filter-remove', function(){
            var filterCriteria = $(this).parents('.filter-label').attr('data-crit');
            var value = $(this).parents('.filter-label').attr('data-value');
            $(this).parents('.filter-label').remove();
            $('.select-multiple[name="'+filterCriteria+'"]').multiselect('deselect', [value]);
            renderFilterBlock();
          });
        });
}