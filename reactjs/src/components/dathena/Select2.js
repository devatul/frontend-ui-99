'Use Strict';
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { isEqual } from 'lodash'
// import $ from 'jquery'
// import 'select2/'
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
        onUnSelecting: PropTypes.func,
        onLoaded: PropTypes.func
    },

    statics: {
        events: [
                { react: 'onChange', select2: 'change' },
                { react: 'onOpen', select2: 'select2:open' },
                { react: 'onClose', select2: 'select2:close' },
                { react: 'onClosing', select2: 'select2:closing' },
                { react: 'onOpening', select2: 'select2:opening' },
                { react: 'onSelect', select2: 'select2:select' },
                { react: 'onSelecting', select2: 'select2:selecting' },
                { react: 'onUnSelect', select2: 'select2:unselect' },
                { react: 'onUnSelecting', select2: 'select2:unselecting' },
                { react: 'onLoaded', select2: 'select2-loaded' },
            ]
    },

    getDefaultProps() {
        return {
            minimumResultsForSearch: Infinity,
            containerCssClass: "dathena-select",
            dropdownCssClass: "dathena-select-dropdown"
        };
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
            } = this.props;
            
            $(this.refs.select2).select2(this.props);
        }
    },
    

    componentDidMount() {
        let {
                adaptDropdownCssClass, 
                containerCssClass,
                minimumResultsForSearch
            } = this.props,

            { events } = this.constructor,

            _props = Object.assign({}, this.props),
            select = $(this.refs.select2).select2(_props);

            for(let i = events.length - 1; i >= 0; i--) {
                if(this.props[events[i].react] !== undefined) {
                    select.on(events[i].select2, this.props[events[i].react]);
                }
            }
    },

    componentWillUnmount() {
        $(this.refs.select2).select2('close');
    },

    render() {
        let _props = Object.assign({}, this.props);
            _props.adaptDropdownCssClass &&
                delete _props.adaptDropdownCssClass;
            _props.containerCssClass &&
                delete _props.containerCssClass;
            _props.minimumResultsForSearch &&
                delete _props.minimumResultsForSearch;
            _props.dropdownCssClass &&
                delete _props.dropdownCssClass;
        return(
            <select ref="select2" {..._props} className="js-example-basic-single js-states form-control dathena-select">
                {this.props.children}
            </select>
        );
    }
});

module.exports = Select2;