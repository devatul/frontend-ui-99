$(function () {

  $('.overview-filter').on('change', function(){
    var filterCriteria = $(this).attr('name');
    var selectedOption = $(this).find('option:selected').text();
    var filterLabel = $('.filter-label[data-crit="'+filterCriteria+'"]');
    if (filterLabel.length){
      filterLabel.find('.option-name').text(selectedOption);
    }
    else{
      $('<span class="filter-label label label-info" data-crit="'+filterCriteria+'"><a class="filter-remove"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags');
    }
  });

  $('body').on('click', '.filter-remove', function(){
    var filterCriteria = $(this).parents('.filter-label').attr('data-crit');
    $('select[name="'+filterCriteria+'"]').val('');
    $(this).parents('.filter-label').remove();
  });

});