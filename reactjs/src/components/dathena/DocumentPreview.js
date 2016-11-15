import React, {Component, PropTypes} from 'react';
import {render, findDOMNode} from 'react-dom';
import Row from 'react-bootstrap/lib/Row';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import {cloneDeep, isEqual} from 'lodash';

var documentPreview = React.createClass({
  PropTypes: {
    undo: PropTypes.func,
    nextDocument: PropTypes.func,
    open: PropTypes.bool,
    document: PropTypes.object,
    onHide: PropTypes.func,
    hasNextDocument: PropTypes.bool,
    currentReview: PropTypes.object,
    isNextCategory: PropTypes.bool
  },

  getDefaultProps() {
    return {
      undo: function () {
      },
      nextDocument: function () {
      },
      document: {},
      onHide: function () {
      }
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.open != nextProps.open || !isEqual(this.props.document, nextProps.document);
  },

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.open === false && this.props.open) || (this.props.document != null && !isEqual(this.props.document.image_url, prevProps.document.image_url))) {
      this.loadDocument();
    }
  },

  handleOnHide(event) {
    this.props.onHide && this.props.onHide(event);
  },

  handleNextDocument(event) {
    this.props.nextDocument(event)
  },

  handleUndo(event) {
    this.props.undo(event)
  },

  loadDocument() {
    let {preview} = this.refs,
        {document} = this.props;

    if (preview) {
      render(React.createElement('div', {
          className: "gdocsviewer"
        },
        React.createElement('iframe', {
          src: 'http://docs.google.com/viewer?embedded=true&url=' + document.image_url,
          width: 600,
          height: 700,
          style: {border: 'none'}
        })), preview)
    }
  },

  closeModal(event) {
    this.props.closeModal();
  },

  cutPath(str) {
    if (str !== undefined && str.length > 0) {
      return str.substring(0, str.lastIndexOf('/') + 1);
    }
  },

  render() {
    let nextDocumentButton = null,
        {document, open} = this.props,
        currentReview = this.props.currentReview;

    if (this.props.hasNextDocument) {
      if (this.props.isNextCategory) {
        nextDocumentButton =
          <Button className="mb-xs mr-xs btn btn-green" bsClass="my-btn" onClick={this.handleNextDocument}>
            Go to Next Category <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </Button>
      } else {
        nextDocumentButton =
          <Button className="mb-xs mr-xs btn btn-green" bsClass="my-btn" onClick={this.handleNextDocument}>
            Go to Next Document <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </Button>
      }
    }

    if (document != null) {
      return (
        <Modal
            role="dialog"
            animation
            show={open}
            onHide={this.handleOnHide}
            keyboard={true}
            dialogClassName="modal-preview">
          <Modal.Header>
            <Row>
              <Modal.Title className="col-sm-3 col-xs-12 modal-title-preview">
                <i className="fa fa-search"></i>
                <span>Document Preview</span>
              </Modal.Title>
              <div className="col-sm-4 col-xs-12 modal-info margin-top-14">
                <span className="text-itatic">Predicted Label: </span>
                <span><strong>{document && document.category && document.category.name + ' - ' + document.confidentiality.name}</strong></span>
              </div>
              <div className="col-sm-2 col-xs-12 margin-top-14">
                { this.props.hideLanguage ? '' :
                  <div className="inline-block-item">
                    <span className="text-itatic">Detected Language: </span>
                    <span><strong>{currentReview && currentReview.language && currentReview.language.name}</strong></span>
                  </div>}
              </div>
              <div className="col-sm-3 col-xs-12 text-right modal-actions modal-action-preview">
                {nextDocumentButton}
                <Button className="mb-xs mt-none mr-xs btn btn-green" bsClass="my-btn" onClick={this.handleUndo}>
                  Undo <i className="fa fa-undo" aria-hidden="true"></i>
                </Button>
                <Button className="modal-button btn-close" bsClass="my-btn" onClick={this.closeModal}>
                  <i className="fa fa-times" aria-hidden="true"></i>
                </Button>
              </div>
            </Row>
          </Modal.Header>
          <Modal.Body>
            {this.props.children}
            <div ref="preview" className="file-preview mt-md"></div>
          </Modal.Body>
        </Modal>
      );
    }

    return <span></span>;
  }
});

module.exports = documentPreview;
