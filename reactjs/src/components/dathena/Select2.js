'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { isEqual } from 'lodash'
import $ from 'jquery'
import 'select2/dist/js/select2.full'
var Select2 = React.createClass({

    PropTypes: {
        onChange: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onClosing: PropTypes.func,
        onOpening: PropTypes.func,
        onSelect: PropTypes.func,
        onSelecting: PropTypes.func,
        onUnSelect: PropTypes.func,
        onUnSelecting: PropTypes.func
    },

    statics: {
        events: [
                { react: 'onChange', select2: 'change' },
                { react: 'onOpen', select2: 'select2:open' },
                { react: 'onClose', select2: 'select2:close' },
                { react: 'onClosing', select2: 'select2:closing' },
                { react: 'onOpening', select2: 'elect2:opening' },
                { react: 'onSelect', select2: 'select2:select' },
                { react: 'onSelecting', select2: 'select2:selecting' },
                { react: 'onUnSelect', select2: 'select2:unselect' },
                { react: 'onUnSelecting', select2: 'select2:unselecting' },
            ]
    },

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props, nextProps);
    },
    
    componentDidUpdate(prevProps, prevState) {
        if(!isEqual(this.props, prevProps)) {
            let { events } = this.constructor,
            {
                adaptDropdownCssClass, 
                containerCssClass,
                minimumResultsForSearch
            } = this.props,

            _props = Object.assign({}, this.props, {
                minimumResultsForSearch: minimumResultsForSearch && Infinity,
                containerCssClass: containerCssClass && "dathena-select",
                adaptDropdownCssClass: adaptDropdownCssClass ? adaptDropdownCssClass : function() {
                    return "dathena-select-dropdown";
                }
            });
            
            $(this.refs.select2).select2(_props);
        }
    },
    

    componentDidMount() {
        let {
                adaptDropdownCssClass, 
                containerCssClass,
                minimumResultsForSearch
            } = this.props,

            { events } = this.constructor,

            _props = Object.assign({}, this.props, {
                minimumResultsForSearch: minimumResultsForSearch && Infinity,
                containerCssClass: containerCssClass && "dathena-select",
                adaptDropdownCssClass: adaptDropdownCssClass ? adaptDropdownCssClass : function() {
                    return "dathena-select-dropdown";
                }
            }),
            select = $(this.refs.select2).select2(_props);

            for(let i = events.length - 1; i >= 0; i--) {
                if(this.props[events[i].react] !== undefined) {
                    select.on(events[i].select2, this.props[events[i].react]);
                }
            }
    },

    render() {
        let props = this.props;
        return(
            <select ref="select2" {...this.props} className="js-example-basic-single js-states form-control dathena-select">
                {this.props.children}
            </select>
        );
    }
});

module.exports = Select2;