import React from "react";
class InferenceResult extends React.Component {
  constructor() {
    super();
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    this.state = {
      currentDate: date,
      currentTime: time,
    };
  }
  render() {
    return (
      <div className="inference-result__content">
        <div style={{height: "20%"}}>
          <h3>License Plate Picture: </h3>
          {this.props.licensePlatePicture}
        </div>
        <div style={{height: "20%"}}>
          <h3>Inference Result: </h3>
          <span>{this.props.inferenceResult}</span>
        </div>
        <div style={{height: "20%"}}>
          <h3>Location: </h3>
          <span>{this.props.location}</span>
        </div>
        <div style={{height: "20%"}}>
          <h3>Date Entered: </h3>
          <span>{this.state.currentDate}</span>
        </div>
        <div style={{height: "20%"}}>
          <h3>Time Entered: </h3>
          <span>{this.state.currentTime}</span>
        </div>
      </div>
    );
  }
}
export default InferenceResult;