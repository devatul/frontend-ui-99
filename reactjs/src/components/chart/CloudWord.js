'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import HelpButton from '../dathena/HelpButton'

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
            this.draw();
        }  
    },
    

    draw() {
        var wordframe = $(this.refs.wordframe);
        var data = this.props.data;
        $(wordframe).html('');
        $(wordframe).jQCloud(data, {
          autoResize: true
        });
        
    },

    render() {
        return (
            <div>
                <h4 className="review_cloud_p">{this.props.title}
                    <HelpButton classNote="review_question_chart" classIcon="fa-question-circle"
                        setValue={this.props.help && this.props.help} />
                </h4>
                <div ref="wordframe" id="words-cloud"></div>
            </div>
            );
    }

});
module.exports = CloudWord;