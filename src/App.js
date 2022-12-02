import React, { Component } from 'react';

import OnesebunSignaturePad from './OnesebunSignaturePad';
import Stats from './Stats';
// import * as main from './cr';



// let mediaRecorder;
// let recordedBlobs;
// let sourceBuffer;




class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signatureData: [], // current signature data
      db: [], // database of signature data
      blob: ''
    }

    this.save = this.save.bind(this);
    this.export = this.export.bind(this);
    // this.addPoint = this.addPoint.bind(this);
  }


  save() {
    this.setState({
      db: [this.state.signatureData, ...this.state.db],
      signatureData: []
    });

    var signature = this.refs.signature;
    console.log('signature.toData()', signature.toData());
    signature.clear();
  }

  export() {
    var signature = this.refs.signature;
    console.log(signature.toDataURL());
  }

  addPoint = (p) => {
    
    // console.log(p)
    this.setState({ signatureData: [...this.state.signatureData, p] });
  }

  player = () => {
    // this.addPoint()
    let fake_data = { color: 'black', pressure: null, x: 332, y: 154.73333740234375, time: new Date().getTime() }
    let signature = this.refs.signature;
    // signature.addPoint(fake_data)
    this.setState({ signatureData: [...this.state.signatureData, fake_data] });
    // this.setState({ signatureData: [...this.state.signatureData, p] });
  }

  clear = () => {
    let signature = this.refs.signature;
    signature.clear();
    this.setState({ blob: '' })
  }

  startRecording = () => {
    console.log('startRecording!')
    let signature = this.refs.signature;
    signature.startRecording();
    this.setState({ blob: '' })
  }

  stopRecording = () => {
    let signature = this.refs.signature;
    const video_blob = signature.handleStop();
    this.setState({ blob: video_blob })
  }

  done = () => {
    this.stopRecording()
  }

  render() {
    const renderStats = (data) => (
      <div className="row">
        <div className="col-4">
          Pressure <Stats color="#0275d8" data={data.map(i => i.pressure)} />
        </div>
        <div className="col-4">
          X <Stats color="#0275d8" data={data.map(i => i.x)} />
        </div>
        <div className="col-4">
          Y <Stats color="#0275d8" data={data.map(i => i.y)} />
        </div>
      </div>
    );

    return (
      <div className="App container-fluid">
        <div className="row align-items-center">
          {/* <h1>React Pressure Signature Pad</h1> */}
        </div>
        <div className="row" >
          <div className="col-12">
            <OnesebunSignaturePad
              style={{ height: '200px' }}
              onChange={this.addPoint}
              ref="signature" />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div style={{ textAlign: 'center' }}>
              {/* <input className="btn btn-sm btn-outline-primary" type="button" onClick={this.player} value="|>" /> */}
              <input className="btn btn-sm btn-outline-primary" type="button" style={{ marginLeft: '5px' }} onClick={this.startRecording} value="Recording" />
              <input className="btn btn-sm btn-outline-primary" type="button" style={{ marginLeft: '5px' }} onClick={this.save} value="Save data" />
              <input className="btn btn-sm btn-outline-primary" style={{ marginLeft: '5px' }} type="button" onClick={this.export} value="Export image" />
              <input className="btn btn-sm btn-outline-primary" style={{ marginLeft: '5px' }} type="button" onClick={this.clear} value="clear" />
              <input className="btn btn-sm btn-outline-primary" style={{ marginLeft: '5px' }} type="button" onClick={this.done} value="done" />
            </div>
          </div>
        </div>
        <div>
          {this.state.blob && (
            <video id="recorded" controls autoPlay>
              <source src={this.state.blob}></source>
            </video>
          )}

          <div>
            {/* <button id="record" onClick={this.startRecording}>Start Recording</button> */}
            {/* <button id="record" onClick={this.stopRecording}>Stop</button> */}
            {/* <button id="play" disabled>Play</button>
            <button id="download" disabled>Download</button> */}
          </div>
        </div>
        <div className="row">
          <hr />
        </div>
        {/* <div className="row">
          <div className="col-4">
            <h5>Pressure</h5>
          </div>
          <div className="col-4">
            <h5>X coordinate</h5>
          </div>
          <div className="col-4">
            <h5>Y coordinate</h5>
          </div>
        </div> */}
        {/* {renderStats(this.state.signatureData)}
        {this.state.db.map(entry => renderStats(entry))} */}
      </div>
    );
  }
}

export default App;
