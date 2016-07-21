$(function () {
  $('.toggle-input-field').on('change', function(){
      var val = $(this).val();
      $(this).parents('.detail-right').find('[data-show-for]').hide();
      $(this).parents('.detail-right').find('[data-show-for="'+val+'"]').show();
      $('.detail-row[data-show-for]').hide();
      $('.detail-row[data-show-for="'+val+'"]').show();
  });

  $('.toggle-input-field').trigger('change');


  $('.validated-step').find('input, select').each(function(){
    $(this).prop('disabled', true);
  });

  $('.validated-step').find('.panel-body a').each(function(){
    $(this).addClass('disabled-link');
  }); 

  $('.btn-group-admin .btn-edit-step').on('click', function(){
    $(this).hide();
    var parent = $(this).parents('.validated-step');
    parent.find('input, select').each(function(){
      $(this).prop('disabled', false);
    });

    parent.find('.panel-body a').each(function(){
      $(this).removeClass('disabled-link');
    }); 
    $(this).parent().find('.btn-save-step').show();
  });

  $('.btn-group-admin .btn-save-step').on('click', function(){
    $(this).hide();
    var parent = $(this).parents('.validated-step');
    parent.find('input, select').each(function(){
      $(this).prop('disabled', true);
    });

    parent.find('.panel-body a').each(function(){
      $(this).addClass('disabled-link');
    }); 
    $(this).parent().find('.btn-edit-step').show();
  });

  $('body').on('click', '.add-sla', function(e){
    e.preventDefault();
    var parentBlock = $(this).parents('.sub-block');
    var addSLABlock = $('.sla-group-org').clone();
    addSLABlock.removeClass('sla-group-org'); 
    var addSLABlockNum = parentBlock.find('.sla-group').length + 1;
    var groupNum = parentBlock.find('.sla-group').first().attr('data-group');
    addSLABlock.find('.control-label').first().html('SLA '+groupNum+'.'+addSLABlockNum);
    addSLABlock.insertAfter(parentBlock.find('.sla-group').last()).show();
    addSLABlock.find('select').select2({
      "placeholder": "Confidentiality Level", "theme": "bootstrap", "minimumResultsForSearch": "Infinity"
    });
  });

  $('body').on('click', '.add-domain-admin', function(e){
    e.preventDefault();
    var addDomainAdminBlock = $('.domain-admin-block').first().clone();
    addDomainAdminBlock.find('input').val('');
    addDomainAdminBlock.appendTo($(this).parents('.domain-block'));
    $('.domain-admin-block').not($('.domain-admin-block').last()).find('.add-domain-admin').remove();
  });

  $('body').on('click', '.add-server-admin', function(e){
    e.preventDefault();
    var addServerAdminBlock = $('.server-admin-block').first().clone();
    addServerAdminBlock.find('input').val('');
    addServerAdminBlock.appendTo($(this).parents('.server-block'));
    $('.server-admin-block').not($('.server-admin-block').last()).find('.add-server-admin').remove();
  });

  $('body').on('click', '.add-folder', function(e){
    e.preventDefault();
    var folderBlock = $('.folder-block').last().clone();
    folderBlock.find('input').val('');
    folderBlock.insertAfter($('.folder-block').last());
    $('.folder-block').not($('.folder-block').last()).find('.add-folder').remove();
  });

  $('body').on('click', '.add-server', function(e){
    e.preventDefault();
    var serverBlock = $('.server-block').first().clone();
    serverBlock.find('input').val('');
    serverBlock.insertAfter($('.server-block').last());
    $('.server-block').not($('.server-block').last()).find('.add-server').remove();
  });

  $('body').on('click', '.add-resposity', function(e){
    e.preventDefault();
    var cloneBlock = $('.resposity-block').last().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.resposity-block').last());
    $('.resposity-block').not($('.resposity-block').last()).find('.add-resposity').remove();
  });

  $('body').on('click', '.add-teamlead', function(e){
    e.preventDefault();
    var cloneBlock = $('.teamlead-block').last().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.teamlead-block').last());
    $('.teamlead-block').not($('.teamlead-block').last()).find('.add-teamlead').remove();
  });

  $('body').on('click', '.add-coordinator', function(e){
    e.preventDefault();
    var cloneBlock = $('.coordinator-block').last().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.coordinator-block').last());
    $('.coordinator-block').not($('.coordinator-block').last()).find('.add-coordinator').remove();
  });

  $('body').on('click', '.add-audit', function(e){
    e.preventDefault();
    var cloneBlock = $('.audit-block').last().clone(); 
    cloneBlock.find('input').val('');
    cloneBlock.insertAfter($('.audit-block').last());
    $('.audit-block').not($('.audit-block').last()).find('.add-audit').remove();
  });

  $('.id-file-name').on('click', function(){
    $('.id-file').trigger('click');
  });

  $('.id-file').on('change', function(){
    var filename = $('.id-file').val().replace(/C:\\fakepath\\/i, '');
    $('.id-file-name').val(filename);
  });

});