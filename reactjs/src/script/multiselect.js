module.exports = function() {
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
}