import React,  { Component, PropTypes } from 'react'
import { render, findDOMNode } from 'react-dom'
import Row from 'react-bootstrap/lib/Row'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import { cloneDeep, isEqual } from 'lodash'

var documentPreview = React.createClass({

    getInitialState() {
        return {
            setOpen: false
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.setOpen != nextState.setOpen || !isEqual(this.props.document, nextProps.document);
    },

    componentDidUpdate(prevProps, prevState) {
        if(this.props.open != prevProps.open) {
            this.setState({ setOpen: this.props.open });
        }

        if(this.props.open === true) {
            debugger
            $(this.refs.link).gdocsViewer();
        }
    },

    handleNextDocument(event) {

    },

    handleUndo(event) {

    },

    closeModal(event) {
        this.props.closeModal();
    },

    cutPath(str) {
        if(str.length > 0) {
            return str.substring(0,str.lastIndexOf('/') + 1);
        }
    },

    render() {

        let { open, document } = this.props;
        debugger
        return(
            <Modal
                role="dialog"
                animation
                show={this.state.setOpen}
                dialogClassName="modal-preview">
                <Modal.Header>
                    <Row>
                        <Modal.Title className="col-sm-4">
                            <i className="fa fa-search"></i>
                            Document Preview
                        </Modal.Title>
                        <div className="col-sm-4 modal-info text-center">
                            <span className="text-itatic">{document.name}</span><br/>
                            <span>Folder {this.cutPath(document.path)}</span>
                        </div>
                        <div className="col-sm-4 modal-actions text-right">
                            <Button className="mb-xs mr-xs btn btn-green" bsClass={false} onClick={this.props.nextDocument}>Go to Next Document <i className="fa fa-arrow-right" aria-hidden="true"></i></Button>
                            <Button className="mb-xs mt-none mr-xs btn btn-green" bsClass={false} onClick={this.props.handleUndo}>Undo <i className="fa fa-undo" aria-hidden="true"></i></Button>
                            <Button className="modal-button" bsClass={false} onClick={this.closeModal}><i className="fa fa-times" aria-hidden="true"></i></Button>
                        </div>
                    </Row>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                    <div className="file-preview mt-md">
                        <a ref="link" href={document.image_url}></a>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
});

module.exports = documentPreview;