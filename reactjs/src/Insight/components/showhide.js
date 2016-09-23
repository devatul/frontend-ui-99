'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'



var ShowHide = React.createClass({
      getInitialState() {
        return {
               doc_path: 'doc-path my-doc-path',
               style : { "font-family" : " 'Roboto', 'Helvetica', sans-serif "}
        }
    },
    showHide(){
        if(this.state.doc_path != ''){
             this.setState({doc_path : ''})
         } else {
            this.setState({doc_path : 'doc-path my-doc-path'})
         }

    },
    render(){
        return(
            <div>
             <span className={this.state.doc_path} style={{'marginBottom': '5px'}}>{this.props.content}</span>
                <a href="javascript:;" className="details-toggle" onClick={this.showHide}   style={this.state.style}><i className="fa fa-caret-right mr-xs"><span>{this.state.doc_path == '' ? 'Show less' : 'Show details'}</span></i></a>

            </div>
        )
    }
});

module.exports = ShowHide