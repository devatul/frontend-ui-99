'use strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'

var LiquidMeter = React.createClass({
    displayName: 'LiquidMeter',
    
    PropTypes: {
        title: PropTypes.string,
        setValue: PropTypes.number
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.setValue != nextProps.setValue || this.props.setValue === 0;
    },
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.setValue != prevProps.setValue || this.props.setValue === 0) {
            this.draw();
        }  
    },
    

    draw() {
        var value = this.props.setValue;
        $('.liquid-meter').replaceWith('<div class="liquid-meter" id="LiquidMeter"  min="0" max="100" value="' + value + '"></div>');
        $('#LiquidMeter').liquidMeter({
            id:'meterCircle',
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
        
    },

    render() {
        return (
            <div>
                <h4>{this.props.title}</h4>
                <div class="liquid-meter" id="LiquidMeter"  min="0" max="100" value="0"></div>
            </div>
            );
    }

});
module.exports = LiquidMeter;