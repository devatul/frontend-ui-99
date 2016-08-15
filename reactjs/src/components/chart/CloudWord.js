'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'

var CloudWord = React.createClass({
    displayName: 'CloudWord',
    
    PropTypes: {
        title: PropTypes.string,
        data: PropTypes.array
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.data != nextProps.data;
    },
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.data != prevProps.data) {
            debugger
            this.draw();
        }  
    },
    

    draw() {
        var wordframe = $(this.refs.wordframe);
        var data = this.props.data;
        debugger
        $(wordframe).html('');
        $(wordframe).jQCloud(data, {
          autoResize: true
        });
        
    },

    render() {
        return (
            <div>
                <h4 class="review_cloud_p">{this.props.title}</h4>
                <div ref="wordframe" id="words-cloud"></div>
            </div>
            );
    }

});
module.exports = CloudWord;