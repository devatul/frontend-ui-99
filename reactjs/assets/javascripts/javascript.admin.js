$(function () {
  $('.toggle-input-field').on('change', function(){
      var val = $(this).val();
      $(this).parents('.detail-right').find('[data-show-for]').hide();
      $(this).parents('.detail-right').find('[data-show-for="'+val+'"]').show();
  });

  $('.toggle-input-field').trigger('change');
});