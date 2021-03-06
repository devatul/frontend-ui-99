import React, {Component} from 'react';
import {render} from 'react-dom';
import update from 'react-addons-update';
import Constant, {fetching} from '../../App/Constant.js';
import ProgressLabel from './progress-label';

var Loader = React.createClass({
  displayName: 'Loader',

  getInitialState() {
    return {
      xhr: this.props.xhr || {
        status: "Report is loading",
        message: "Please wait!",
        timer: 20,
        loading: 0,
        isFetching: fetching.STARTED,
        error: false
      },
      delay: 0
    };
  },

  componentDidMount() {
    var delay = setInterval(this.setLoading, this.state.xhr.timer * (this.state.xhr.loading / 2));
    this.setState({delay: delay});
  },

  setLoading() {
    this.setState({
      xhr: update(this.state.xhr, {
        loading: {
          $set: this.state.xhr.loading + 1
        }
      })
    });
    if (this.state.xhr.loading >= 100) clearInterval(this.state.delay);
  },

  componentWillReceiveProps() {
    var {xhr} = this.state;

    if (xhr.isFetching) {
      var {isFetching} = xhr;

      switch (isFetching) {
        case fetching.START:
          this.setState({
            xhr: update(this.state.xhr, {
              loading: {
                $set: 0
              },
              isFetching: {
                $set: fetching.STARTED
              },
              timer: {
                $set: 50
              },
              status: {
                $set: "Report is loading"
              },
              message: {
                $set: "Please wait!"
              },
              error: {
                $set: false
              }
            })
          });
          break;

        case fetching.STARTED:
          break;

        case fetching.SUCCESS:
          this.setState({
            xhr: update(this.state.xhr, {
              loading: {
                $set: 90
              },
              timer: {
                $set: 0
              },
              error: {
                $set: false
              }
            })
          });
          break;

        case fetching.ERROR:
          this.setState({
            xhr: update(this.state.xhr, {
              status: {
                $set: 'Oops!'
              },
              message: {
                $set: "We're sorry, but something went wrong."
              },
              error: {
                $set: true
              }
            })
          });
          break;
      }
    }
  },

  componentWillUnmount() {
    clearInterval(this.state.delay);
  },

  renderMessage() {
    let {message, status} = this.state.xhr;

    return (
      <p className="loading-label-2">
        {status}
        <br/>
        <span className="pls">{message}</span>
      </p>
    )
  },

  render() {
    return (
      <div className="progress-label-container">
        <div className="progress-example">
          <ProgressLabel
            className="label-1"
            progress={Math.min(this.state.xhr.loading, 100)}
            startDegree={-45}
            progressWidth={3.5}
            trackWidth={4}
            cornersWidth={2}
            progressColor="#3f989a"
            trackColor="transparent"
            fillColor="transparent"
            size={45}>
          </ProgressLabel>
          <ProgressLabel
            className="label-2"
            progress={Math.min(this.state.xhr.loading, 100)}
            startDegree={-90}
            progressWidth={3.5}
            trackWidth={4}
            cornersWidth={2}
            progressColor="#3f989a"
            trackColor="transparent"
            fillColor="transparent"
            size={33}>
          </ProgressLabel>
          <span className="loading-label">Loading...</span>
        </div>
        {this.renderMessage()}
      </div>
    );
  }
});

module.exports = Loader;
