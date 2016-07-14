$(function () {
  $('.toggle-input-field').on('change', function(){
      var val = $(this).val();
      $(this).parents('.detail-right').find('[data-show-for]').hide();
      $(this).parents('.detail-right').find('[data-show-for="'+val+'"]').show();
      $('.detail-row[data-show-for]').hide();
      $('.detail-row[data-show-for="'+val+'"]').show();
  });

  $('.toggle-input-field').trigger('change');


  $('.validated-step').find('input').each(function(){
    $(this).prop('disabled', true);
  }); 

  $('body').on('click', '.add-sla', function(e){
    e.preventDefault();
    var parentBlock = $(this).parents('.sub-block');
    var addSLABlock = parentBlock.find('.sla-group').first().clone();
    addSLABlock.find('input').val('');
    var addSLABlockNum = parentBlock.find('.sla-group').length + 1;
    var groupNum = addSLABlock.attr('data-group');
    addSLABlock.find('.control-label').first().html('SLA '+groupNum+'.'+addSLABlockNum);
    addSLABlock.insertAfter(parentBlock.find('.sla-group').last());
  });

  $('body').on('click', '.add-domain-admin', function(e){
    e.preventDefault();
    var addDomainAdminBlock = $('.domain-admin-block').first().clone();
    addDomainAdminBlock.find('input').val('');
    addDomainAdminBlock.appendTo($(this).parents('.domain-block'));
  });

  $('body').on('click', '.add-server-admin', function(e){
    e.preventDefault();
    var addServerAdminBlock = $('.server-admin-block').first().clone();
    addServerAdminBlock.find('input').val('');
    addServerAdminBlock.appendTo($(this).parents('.server-block'));
  });

  $('body').on('click', '.add-server', function(e){
    e.preventDefault();
    var serverBlock = $('.server-block').first().clone();
    serverBlock.find('input').val('');
    serverBlock.insertAfter($('.server-block').last());
  });

  $('body').on('click', '.add-resposity', function(e){
    e.preventDefault();
    var cloneBlock = $('.resposity-block').first().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.resposity-block').last());
  });

  $('body').on('click', '.add-teamlead', function(e){
    e.preventDefault();
    var cloneBlock = $('.teamlead-block').first().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.teamlead-block').last());
  });

  $('body').on('click', '.add-coordinator', function(e){
    e.preventDefault();
    var cloneBlock = $('.coordinator-block').first().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.coordinator-block').last());
  });

  $('body').on('click', '.add-audit', function(e){
    e.preventDefault();
    var cloneBlock = $('.audit-block').first().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.audit-block').last());
  });

});