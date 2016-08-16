import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, IndexLink, browserHistory } from 'react-router'
import template from './DocumentPreview.rt'
import LinkedStateMixin from 'react-addons-linked-state-mixin'
import update from 'react-addons-update'
import Constant from '../Constant.js'
import loadScript from '../script/load.scripts.js';
import 'jquery'

var DocumentReview = React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
              
        };
    },
    getDefaultProps() {
        return {
            title: "",
            tableInner: "",
            url: ""
        };
    },
    componentWillMount: function() {
          
    },
    componentDidMount: function() {
    	loadScript("/assets/vendor/gdocsviewer/jquery.gdocsviewer.min.js", function() {
            $('#previewModal').on('show.bs.modal', function(e) {

                //get data-id attribute of the clicked element
                var fileURL = $(e.relatedTarget).attr('data-file-url');

                console.log(fileURL);
                
                $('#previewModal .file-preview').html('<a href="'+fileURL+'" id="embedURL"></a>');
                $('#embedURL').gdocsViewer();
            });
        }.bind(this));
    },
    shouldComponentUpdate: function(nextProps, nextState) {
          
    },
    componentDidUpdate: function(prevProps, prevState) {
          
    },
    renderTable: function() {

    },
    render:template
});
