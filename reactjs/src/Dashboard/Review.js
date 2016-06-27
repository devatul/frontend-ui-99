import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import template from './Review.rt';
import $ from 'jquery'
var Review = React.createClass
({
	getInitialState() {
	    return {
	    	detailLastScan:{}
		};
	},
	componentDidMount() {
		// and when you hide it, reattach the drop down, and hide it normally                                                   
	    $(window).on('hide.bs.dropdown', function (e) {
	        var windowWidth = $(window).innerWidth();

	        if ( windowWidth <=996 && dropdownMenu.hasClass('full-mobile') ){
	            $(e.target).append(dropdownMenu.detach());
	            dropdownMenu.hide();
	        }
	    });     

	   $('.approve-button').click(function(){
    $(this).hide();
    $('.actions-success').show();
    $('.doc-check').addClass('validated');
  });
  $(".alert-close[data-hide]").on("click", function(){
      $(this).closest("." + $(this).attr("data-hide")).hide();
  });

  $('.select-group select').focus(function(){
      var selectedRow = $(this).parents('tr');
      $('.table-my-actions tr').not(selectedRow).addClass('inactive');
  });

  $('.doc-check').on('click', function(e){
    e.preventDefault();
    $(this).addClass('validated');
  });

  $('.select-group select').change(function(){
      var selectedRow = $(this).parents('tr');
      selectedRow.find('.doc-check').addClass('validated');
  });

  $('.select-group select').blur(function(){
    $('.table-my-actions tr').removeClass('inactive');
  });

  //check all checkbox on table
  $('.checkbox-all').on('change', function(){
      var target = $(this).attr('data-target');
      if ($(this).prop('checked')){
          $(target).find('input[type="checkbox"].checkbox-item').prop('checked', true);
          $('.show-on-checked-all').show();
          $('.show-on-checked-all').text('Approve All');
      }
      else{
          $(target).find('input[type="checkbox"].checkbox-item').prop('checked', false);
          $('.show-on-checked-all').hide();
      }
  });  

  $('.checkbox-item').on('change', function(){
      var target = $(this).attr('data-target');

      var checkboxNum = $('.checkbox-item').length;
      var checkedNum = 0;
      $(target).find('input[type="checkbox"].checkbox-item').each(function(){
          if ($(this).prop('checked')){
              checkedNum++;
          }
      });
      if (checkedNum > 0){
          $('.show-on-checked-all').show();
          if (checkedNum != checkboxNum){
              $('.show-on-checked-all').text('Approve Selected Documents');
          }
          else{
              $('.show-on-checked-all').text('Approve All');
          }
      }
      else{
          $('.show-on-checked-all').hide();
      }
  }); 


  	},
	componentWillUnmount() {
	    //this.serverRequest.abort();
  	},
	showLastScan(){
        $.ajax({
            url:'http://54.169.106.24/hadoop/last/',
            dataType: 'json',
            type: 'GET',
            beforeSend: function(xhr) 
            {
                xhr.setRequestHeader("Authorization", "JWT " + localStorage.getItem('token'));
            },
            success: function(data) 
            {
                this.setState({detailLastScan: data});
                console.log(this.state.detailLastScan);
            }.bind(this),
            error: function(xhr, status, err) 
            {
            }.bind(this)
        }); 
    },
	render:template
});
module.exports = Review;