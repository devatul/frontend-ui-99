import React, {Component, PropTypes} from 'react';
import {render, findDOMNode} from 'react-dom';
import {cloneDeep, isEqual} from 'lodash';

var DropdownCustom = React.createClass({
  getInitialState() {
    return {
      open: this.props.open
    };
  },

  propTypes: {
    id: PropTypes.string.isRequired,
    elementType: PropTypes.string,
    className: PropTypes.string,
    onShow: PropTypes.func,
    onClose: PropTypes.func,
    onToggle: PropTypes.func,
    open: PropTypes.bool
  },

  getDefaultProps() {
    return {
      elementType: 'div',
      className: 'dropdown',
      open: false
    };
  },

  componentDidMount() {
    window.addEventListener('click', this.handleClickBackDrop);
  },

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickBackDrop);
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.open != nextState.open || !isEqual(this.props, nextProps);
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.open != prevState.open) {
      let {open} = this.state;

      if (open) {
        this.props.onShow &&
        this.props.onShow(this);
      } else {
        this.props.onClose &&
        this.props.onClose(this);
      }
    }
  },

  handleOnSelect() {
  },

  handleSetToggle: function (_child) {
    switch (true) {
      case _child.refs.Toggle !== undefined:
        this.props.onToggle && this.props.onToggle(!_child.props.isOpen);
        this.setState({
          open: !_child.props.isOpen
        });
        break;
      case _child.refs.Menu !== undefined:
        this.setState({
          open: !_child.props.isOpen
        });
        break;
    }
  },

  handleClickBackDrop(event) {
    this.setState({
      open: false
    });

    event.stopPropagation();
  },

  render() {
    let {open} = this.state,
        {elementType, hasChild} = this.props,
        _props = this.props,
        showBack = open ? 'block' : 'none',
        show = open ? ' open' : '',
        children = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
          isOpen: open,
          setToggle: this.handleSetToggle,
          ref: 'dropdown_' + child.type.displayName
        }));

    return React.createElement(
        elementType, Object.assign({}, this.props, {
          className: _props.className + show
        }),
        children,
        React.createElement('span', {
          ref: "backdrop",
          onClick: this.handleClickBackDrop,
          className: "dropdown-backdrop-custom",
          style: {display: showBack}
        })
    );
  }
});

var Toggle = React.createClass({
  propTypes: {
    elementType: PropTypes.string,
    noCaret: PropTypes.bool,
    className: PropTypes.string,
    'data-toggle': PropTypes.string
  },

  getDefaultProps() {
    return {
      noCaret: false,
      elementType: 'button',
      className: 'dropdown-toggle btn btn-default',
      'data-toggle': "dropdown"
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  handleClick(e) {
    this.props.setToggle(this);
    e.preventDefault();
    e.stopPropagation();
  },

  render() {
    let _props = this.props, {noCaret, elementType, isOpen} = this.props,
        classCaret = _props.isOpen ? 'dropup' : '',
        child = React.createElement(
            elementType, Object.assign({}, this.props, {
              ref: 'Toggle',
              onClick: this.handleClick
            }),
            this.props.children,
            !noCaret && React.createElement('span', {
              className: classCaret
            }, <span className="caret"></span>)
        );

    return (child);
  }
});

var Menu = React.createClass({
  propTypes: {
    elementType: PropTypes.string,
    className: PropTypes.string
  },

  getDefaultProps() {
    return {
      elementType: 'div',
      className: 'dropdown-menu'
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  },

  handleOnClick(event) {
    let {noClose} = this.props;
    this.props.setToggle(this);
    event.stopPropagation();
  },

  render() {
    let {elementType, subMenu} = this.props, _props = this.props,
        element = React.createElement(
          elementType, Object.assign({}, this.props, {
            ref: 'Menu',
            onClick: this.handleOnClick
          }),
          this.props.children
        );

    return (element);
  }
});

module.exports = {
  custom: DropdownCustom,
  toggle: Toggle,
  menu: Menu
};
