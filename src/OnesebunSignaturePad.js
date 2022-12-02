import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Pressure from 'pressure';
import SignaturePad from './sp'


let mediaRecorder;
let recordedBlobs;
let sourceBuffer;


class OnesebunSignaturePad extends Component {
  constructor(props) {
    super(props);

    this.handlePressureUnsupported = this.handlePressureUnsupported.bind(this);
    this.handlePressureChanged = this.handlePressureChanged.bind(this);
    this.clear = this.clear.bind(this);
    this.resize = this.resize.bind(this);
    this.addPoint = this.addPoint.bind(this);

    this.state = {
      currentPressure: 0,
      signatureData: [],
      pressureConfig: {
        change: this.handlePressureChanged,
        unsupported: this.handlePressureUnsupported,
      },
    };

    this.callbacks = {
      onChange: (point) => {
        if (typeof this.props.onChange === 'function') this.props.onChange(point);
      },
    };
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.signaturePad = new SignaturePad(this.canvas);
    this.signaturePad._addPoint = this.addPoint;

    this.resize();

    Pressure.set(
      this.canvas,
      this.state.pressureConfig,
      { polyfill: false });

    window.onresize = this.resize;
  }

  handlePressureUnsupported() {
    console.log('handlePressureUnsupported')
    this.handlePressureChanged(null);
  }

  handlePressureChanged(value, e) {
    console.log('handlePressureChanged')
    this.setState({ currentPressure: value });
  }

  render() {
    return (
      <div id="pressure-signature-pad" className="pressure-signature-pad">
        <canvas
          style={{ height: '400px', width: '100%', ...this.props.style }}
          ref="canvas">
        </canvas>
      </div>);
  }

  addPoint(point) {
    point.pressure = this.state.currentPressure;
    this.callbacks.onChange(point);
    return SignaturePad.prototype._addPoint.call(this.signaturePad, point);
  }

  clear() {
    this.signaturePad.clear();
  }

  isEmpty() {
    return this.signaturePad.isEmpty();
  }

  toDataURL = () => {
    return this.signaturePad.toDataURL()
  }

  toData = () => {
    return this.signaturePad.toData()
  }

  startRecording = () => {
    const stream = this.canvas.captureStream();

    recordedBlobs = [];

    try {
      var options = { mimeType: 'video/webm' };
      mediaRecorder = new MediaRecorder(stream, options);
      console.log(mediaRecorder)
    } catch (error) {
      console.log(error)
    }

    mediaRecorder.onstop = this.handleStop;
    mediaRecorder.ondataavailable = this.handleDataAvailable;
    mediaRecorder.start(100);
  }


  handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  handleStop = () => {
    const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
    mediaRecorder.stop();
    return window.URL.createObjectURL(superBuffer)
  }

  toggleRecording = () => {
    if (recordButton.textContent === 'Start Recording') {
      startRecording();
    } else {
      stopRecording();
      recordButton.textContent = 'Start Recording';
      playButton.disabled = false;
      downloadButton.disabled = false;
    }
  }


  resize() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = this.canvas.offsetWidth * ratio;
    this.canvas.height = this.canvas.offsetHeight * ratio;
    this.canvas.getContext('2d').scale(ratio, ratio);
    this.clear();
  }
}


OnesebunSignaturePad.propTypes = {
  style: PropTypes.object,
  onChange: PropTypes.func,
};

OnesebunSignaturePad.defaultProps = {
  style: null,
  onChange: null,
};

export default OnesebunSignaturePad