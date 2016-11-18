'Use Strict';
import React, { Component } from 'react'
import { render } from 'react-dom'
import update from 'react-addons-update'
import $, { JQuery } from 'jquery';

var Upload = React.createClass({
	getInitialState() {
		return {
			file: '',
			imagePreviewUrl: ''
		}
	},

	_handleSubmit() {
		var fd = new FormData();
		var fileInput = document.getElementById('myFile');
		var file = fileInput.files[0];
	     fd.append('file', file);
	   	this.props.upload(fd,this);
  	},

	_handleImageChange(e) {
	    e.preventDefault();
	    let reader = new FileReader();
	    let file = e.target.files[0];

	    reader.onloadend = () => {
	      this.setState({
	        file: file,
	        imagePreviewUrl: reader.result
	      });
	    },

	    reader.readAsDataURL(file)
	  },


  render() {
	    let {imagePreviewUrl} = this.state;
	    let $imagePreview = null;
	    if (imagePreviewUrl) {
	      $imagePreview = (<img src={imagePreviewUrl}  />);
	    } else {
	      $imagePreview = (<img src="/assets/images/User_font_awesome.svg.jpg" />);
	    }

    return (
    		<div>
      	<h4 className="mpe_top_h4">Change Profile Photo</h4>
       	<div className="my-profile-photo-upload">
           	 <p className="my-profile-photo-user"><a className="my-profile-photo-a">{$imagePreview}</a></p>
                <form  ref="uploadForm" className="uploader" encType="multipart/form-data" >
                	<p>
                    <a className="my-profile-photo-a2" href="#" type="file">
                      <i className="fa fa-upload" aria-hidden="true" onClick={this._handleSubmit}></i>
                      <span className="fileinput-button">
                        <span>Upload Your Photo</span>
                        <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} id="myFile"/>
                      </span>

                    </a>
                  </p>
                </form>
			</div>
          </div>
    )
  }




});

module.exports = Upload
