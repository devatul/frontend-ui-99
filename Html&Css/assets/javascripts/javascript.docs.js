$(function () {

  $('#previewModal').on('show.bs.modal', function(e) {

    //get data-id attribute of the clicked element
    var fileURL = $(e.relatedTarget).attr('data-file-url');
    
    $('#previewModal .file-preview').html('<a href="'+fileURL+'" id="embedURL"></a>');
    $('#embedURL').gdocsViewer();
});

});