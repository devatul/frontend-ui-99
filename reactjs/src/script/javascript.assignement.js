module.exports = function() {
    /*$("div div.off").click(function()
    {
        debugger;
        $(this).toggleClass("on");
    // });*/
    // $('.assignent-select').on('change', function(){
    //     var selectedOption = $(this).find('option:selected').text();
    //     var filterCriteria = $(this).attr('name');
    //       if(selectedOption) {
    //         if ($('[data-crit="'+filterCriteria+'"]').length){
    //             $('[data-crit="'+filterCriteria+'"]').find('.option-name').text(selectedOption);
    //         }
    //         else{
    //             $('<span class="filter-label-assign label label-info" data-value="'+selectedOption+'" data-crit="'+filterCriteria+'"><a class="filter-remove-assign"><i class="fa fa-times"></i></a><span class="option-name">'+selectedOption+'</span></span>').appendTo('.filter-tags-userassign');
    //         }
    //       }
    //       else{
    //           $('.filter-label[data-value="'+selectedOption+'"]').remove();
    //     }
    // });

    // $('select#select1').on('change', function(){
    //     $('#icon1').addClass('icon-success');
    //     $('#icon2').removeClass('icon-success');
    // });
    // $('select#select2').on('change', function(){
    //     $('#icon2').addClass('icon-success');
    //     $('#icon1').removeClass('icon-success');
    // });

    // $('.btn-next-cat').on('click', function(){
    //     $('.cat-list > .active').next('li').find('a').trigger('click');
    // });
    // $('body').on('click', '.filter-remove-assign', function(){
    //   var filterCriteria = $(this).parents('.filter-label').attr('data-crit');
    //   var value = $(this).parents('.filter-label').attr('data-value');
    //   $(this).parents('.filter-label-assign').remove();
    //   var a = $('.select-multiple[name="'+filterCriteria+'"]').multiselect('deselect', [value]).change();
    //   console.log("ddddddddddds", a);
    // });
}