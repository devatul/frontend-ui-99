module.exports = function() {

          var previousPoint = null;

          $('#choose_cluster').select2();
          /*$('#choose_cluster').on("change", function(e) {
            $('.cluster-block').hide();
            $('[id="'+$(this).val()+'"]').show();
          });*/

          $('#meter').liquidMeter({
            shape: 'circle',
            color: '#0088CC',
            background: '#F9F9F9',
            fontSize: '24px',
            fontWeight: '600',
            stroke: '#F2F2F2',
            textColor: '#333',
            liquidOpacity: 0.9,
            liquidPalette: ['#333'],
            speed: 3000,
            animate: !$.browser.mobile
          });

          $('.btn-refine').on('click', function(e){
            e.preventDefault();
            $(this).removeClass('btn-green').addClass('btn-disabled');
            //$('<span> (in progress)</span>').insertAfter($(this));
          });

      }