var React = require('react');

module.exports = React.createClass({
  displayName: 'ProgressLabel',

  propTypes: {
    size: React.PropTypes.number,
    startDegree: React.PropTypes.number,
    endDegree: React.PropTypes.number,
    progressWidth: React.PropTypes.number,
    trackWidth: React.PropTypes.number,
    cornersWidth: React.PropTypes.number,
    progress: React.PropTypes.number,
    fillColor: React.PropTypes.string,
    trackColor: React.PropTypes.string,
    progressColor: React.PropTypes.string
  },

  _props: {},

  getDefaultProps() {
    return {
      startDegree: 0,
      progress: 0,
      progressWidth: 5,
      trackWidth: 5,
      cornersWidth: 10,
      size: 200
    };
  },

  getPoint(r, degree) {
    var size = this.props.size,
        d = degree / 180 * Math.PI;

    return {
      x: r * Math.sin(d) + size / 2,
      y: this.props.trackWidth / 2 + r * (1 - Math.cos(d))
    };
  },

  render() {
    var size = this.props.size,
        progress = this.props.progress,
        r = size / 2 - this.props.trackWidth / 2,
        startDegree = this.props.startDegree,
        endDegree = startDegree + progress * 360 / 100,
        s = this.getPoint(r, this.props.startDegree),
        e = this.getPoint(r, endDegree),
        progressPath = null;

    if (progress < 50) {
      progressPath = `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    } else {
      var m = this.getPoint(r, startDegree + 180);
      progressPath = `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${m.x},${m.y} M ${m.x} ${m.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    }

    var progressStyle = {
      strokeWidth: this.props.progressWidth,
      stroke: this.props.progressColor,
      fill: 'none'
    };

    var trackStyle = {
      fill: this.props.fillColor,
      stroke: this.props.trackColor,
      strokeWidth: this.props.trackWidth
    };

    let _props = Object.assign({}, this.props);

    _props.size && delete _props.size;
    _props.startDegree != null && delete _props.startDegree;
    _props.endDegree != null && delete _props.endDegree;
    _props.progressWidth != null && delete _props.progressWidth;
    _props.trackWidth != null && delete _props.trackWidth;
    _props.cornersWidth != null && delete _props.cornersWidth;
    _props.progress >= 0 && delete _props.progress;
    _props.fillColor && delete _props.fillColor;
    _props.trackColor && delete _props.trackColor;
    _props.progressColor != "" && delete _props.progressColor;

    return (
      <svg {..._props} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} style={trackStyle} />

        {progress > 0 ? <path d={progressPath} style={progressStyle} /> : null}

        {progress > 0 ? <circle cx={s.x} cy={s.y} r={this.props.cornersWidth} fill={this.props.progressColor} /> : null}

        {progress > 0 ? <circle cx={e.x} cy={e.y} r={this.props.cornersWidth} fill={this.props.progressColor} /> : null}

        {this.props.children}
      </svg>
    );
  }
});
