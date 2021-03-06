/* eslint-disable no-fallthrough */
import React from "react";
import Canvas from "../../components/Canvas/Canvas";
import Table from "../../components/Table/Table";
import InferenceResult from "../../components/InferenceResult/InferenceResult";
import LicensePlateDetectionVideo from "../../components/LicensePlateDetectionVideo/LicensePlateDetectionVideo";
import ToggleSwitchButton from "../../components/ToggleSwitchButton/ToggleSwitchButton";
import LicensePlateDetectionImage from "../../components/LicensePlateDetectionImage/LicensePlateDetectionImage";
import * as Constants from "../../constants";
import * as tf from "@tensorflow/tfjs";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class LicensePlateDetection extends React.Component {
  constructor(props) {
    super(props);
    // Setting up states
    this.state = {
      objects: {},
      names: ["license-plate"],
      disappeared: {},
      countSamePosition: {},
      nextObjectId: 0,
      currentImage: null,
      isDataReceived: false,
      inferenceResult: "",
      typeDataInput: "camera",
      model: null,
      loadingInferenceResult: false,
      date: "",
      time: "",
    };
    // Setting up refs
    this.videoRef = React.createRef();
    this.canvasAnnotRef = React.createRef();
    this.canvasOutputRef = React.createRef();
    this.prevObject = React.createRef();
  }

  componentDidMount() {
    tf.loadGraphModel(Constants.OBJ_DETECTION_MODEL_PATH).then((model) => {
      this.setState({
        model: model,
      });
    });
  }

  // reset state except model and typeDataInput
  reset = () => {
    this.setState({
      objects: {},
      names: ["license-plate"],
      disappeared: {},
      countSamePosition: {},
      nextObjectId: 0,
      currentImage: null,
      isDataReceived: false,
      inferenceResult: "",
      loadingInferenceResult: false,
      date: "",
      time: "",
    });
    this.videoRef = React.createRef();
    this.prevObject = React.createRef();
  };

  // functions for updating states
  setIsDataReceived = (bool) => {
    this.setState({
      isDataReceived: bool,
    });
  };

  setCurrentImage = (image) => {
    this.setState({
      currentImage: image,
    });
  };

  setNextObjectId = () => {
    this.setState(() => ({
      nextObjectId: this.state.nextObjectId + 1,
    }));
  };

  setObjects = (newObjects) => {
    this.setState(() => ({
      objects: newObjects,
    }));
  };

  setDisappeared = (newDisappeared) => {
    this.setState({
      disappeared: newDisappeared,
    });
  };

  setCountSamePosition = (newCountSamePosition) => {
    this.setState({
      countSamePosition: newCountSamePosition,
    });
  };

  setInferenceResult = (newInferenceResult) => {
    this.setState({
      inferenceResult: newInferenceResult,
    });
  };

  setDateAndTime = () => {
    let today = new Date();
    let date =
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
    let time = today.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    this.setState({
      date: date,
      time: time,
    });
  };

  setLoadingInferenceResult = (bool) => {
    this.setState({
      loadingInferenceResult: bool,
    });
  };

  clearCanvas = () => {
    let canvas = this.canvasAnnotRef.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    canvas = this.canvasOutputRef.current;
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  notify = (text, type) => {
    // eslint-disable-next-line default-case
    switch (type) {
      case "success":
        toast.success(text, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;

      case "error":
        toast.error(text, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
    }
  };

  changeTypeDataInput = () => {
    this.setState({
      typeDataInput: this.state.typeDataInput === "camera" ? "image" : "camera",
    });
    this.reset();
    this.clearCanvas();
  };

  render() {
    return (
      <div>
        <ToastContainer />
        <div>
          <div className="liveheader">
            <h1>Live Camera Feed</h1>
          </div>
          <ToggleSwitchButton
            label="Change Data Input"
            changeTypeDataInput={this.changeTypeDataInput}
          />
          <div className="video-wrapper">
            {this.state.model ? (
              <div>
                {this.state.typeDataInput === "camera" ? (
                  <LicensePlateDetectionVideo
                    // passin states
                    parentState={this.state}
                    // passing functions
                    setIsDataReceived={this.setIsDataReceived}
                    setCurrentImage={this.setCurrentImage}
                    setNextObjectId={this.setNextObjectId}
                    setObjects={this.setObjects}
                    setDisappeared={this.setDisappeared}
                    setCountSamePosition={this.setCountSamePosition}
                    setInferenceResult={this.setInferenceResult}
                    // passing refs
                    videoRef={this.videoRef}
                    canvasAnnotRef={this.canvasAnnotRef}
                    canvasOutputRef={this.canvasOutputRef}
                    prevObject={this.prevObject}
                    setLoadingInferenceResult={this.setLoadingInferenceResult}
                    setDateAndTime={this.setDateAndTime}
                  />
                ) : (
                  <LicensePlateDetectionImage
                    // passing functions
                    setIsDataReceived={this.setIsDataReceived}
                    setInferenceResult={this.setInferenceResult}
                    parentState={this.state}
                    canvasAnnotRef={this.canvasAnnotRef}
                    canvasOutputRef={this.canvasOutputRef}
                    setLoadingInferenceResult={this.setLoadingInferenceResult}
                    setDateAndTime={this.setDateAndTime}
                  />
                )}
              </div>
            ) : (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress style={{ color: "#D3B016" }} />
              </Box>
            )}
            <div className="inference-result">
              <h2 style={{ textAlign: "center" }}>Information</h2>
              <InferenceResult
                inferenceResult={this.state.inferenceResult}
                licensePlatePicture={
                  <Canvas canvasRef={this.canvasOutputRef} />
                }
                isDataReceived={this.state.isDataReceived}
                loadingInferenceResult={this.state.loadingInferenceResult}
                setLoadingInferenceResult={this.setLoadingInferenceResult}
                time={this.state.time}
                date={this.state.date}
              />
            </div>
            <div className="vehicle-parking-logs">
              <h2 style={{ textAlign: "center" }}>Vehicle Parking Logs</h2>
              <Table
                getUserDataUrl={
                  "https://us-central1-vepay-go.cloudfunctions.net/transaction/transactions"
                }
                postUserDataUrl={
                  "https://us-central1-vepay-go.cloudfunctions.net/transaction/transactions"
                }
                isDataReceived={this.state.isDataReceived}
                inferenceResult={this.state.inferenceResult}
                notify={this.notify}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LicensePlateDetection;
// import React from "react";
// import * as tf from "@tensorflow/tfjs";
// import "../../assets/Styles/Camera.css";
// import { load_model } from "../../functions/modelCalling";
// import Camera from "../../components/Camera/Camera";
// import Canvas from "../../components/Canvas/Canvas";
// import * as Constants from "../../constants";
// import Table from "../../components/Table/Table";
// import InferenceResult from "../../components/InferenceResult/InferenceResult";
// import axios from "axios";
// tf.setBackend("webgl");

// class LicensePlateDetection extends React.Component {
//   constructor(props) {
//     super(props);
//     // Setting up states
//     this.state = {
//       objects: {},
//       names: ["license-plate"],
//       disappeared: {},
//       countSamePosition: {},
//       nextObjectId: 0,
//       currentImage: null,
//       isDataInput: false,
//       inferenceResult: "",
//     };
//     console.log("test ", this.state.isDataInput)
//     // Setting up refs
//     this.videoRef = React.createRef();
//     this.canvasAnnotRef = React.createRef();
//     this.canvasOutputRef = React.createRef(null);
//     this.prevObject = React.createRef(null);
//   }

//   // invoke as soon as the compoenents is mounted (inserted to the tree)
//   componentDidMount() {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       const webCamPromise = navigator.mediaDevices
//         .getUserMedia({
//           audio: false,
//           video: {
//             facingMode: "user",
//             mirrored: true,
//           },
//         })
//         .then((stream) => {
//           window.stream = stream;
//           this.videoRef.current.srcObject = stream;
//           try {
//             return new Promise((resolve, reject) => {
//               this.videoRef.current.onloadedmetadata = () => {
//                 resolve();
//               };
//             });
//           } catch (error) {
//             return console.log(error);
//           }
//         });

//       const modelPromise = load_model();

//       Promise.all([modelPromise, webCamPromise])
//         .then((values) => {
//           this.detectFrame(this.videoRef.current, values[0]);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   }
//   componentDidUpdate() {
//     if (this.state.isDataInput === true) {
//       this.setState({
//         isDataInput: false,
//       });
//     }
//   }

//   // ###################################################################################################
//   detectFrame = (video, model) => {
//     // startScope() and endScope() clean up unused tensor
//     tf.engine().startScope();
//     model.executeAsync(this.processInput(video)).then((predictions) => {
//       this.renderPredictions(predictions);
//       requestAnimationFrame(() => {
//         this.detectFrame(video, model);
//       });
//       // startScope() and endScope() clean up unused tensor
//       tf.engine().endScope();
//     });
//   };

//   processInput = (videoFrame) => {
//     if (videoFrame) {
//       const image = tf.browser
//         .fromPixels(videoFrame)
//         .resizeBilinear([
//           this.videoRef.current.offsetHeight,
//           this.videoRef.current.offsetWidth,
//         ])
//         .toFloat();
//       // result shape: [height, width, channels]

//       // update the image
//       this.setState({
//         currentImage: image,
//       });

//       // resize and normalized image expand the dimension by 1 so that
//       // it can be input to the object detection model
//       const tfImg = image
//         .resizeBilinear([Constants.WIDTH, Constants.HEIGHT])
//         .toFloat();
//       const normalizedTfImg = tfImg.div(255.0);
//       const expandedimg = normalizedTfImg.expandDims(0);
//       return expandedimg;
//     }
//   };

//   renderPredictions = (predictions) => {
//     // get canvas element and resize according to camera size\
//     // so that it the annotation will fit perfectly
//     const canvas = this.canvasAnnotRef.current;
//     canvas.width = this.videoRef.current.offsetWidth;
//     canvas.height = this.videoRef.current.offsetHeight;

//     // get context for drawing
//     const ctx = this.canvasAnnotRef.current.getContext("2d");

//     // console.log(this.videoRef.current.width, this.videoRef.current.height);
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//     // Font options.
//     const font = "16px sans-serif";
//     ctx.font = font;
//     ctx.textBaseline = "top";

//     const [boxes, scores, classes, _] = predictions;

//     //Getting predictions
//     const boxesData = boxes.dataSync();
//     const scoresData = scores.dataSync();
//     const classesData = classes.dataSync();

//     const valid_detections_data = this.buildDetectedObjects(
//       this.videoRef.current,
//       scoresData,
//       boxesData,
//       classesData,
//       this.state.names
//     );

//     this.update(valid_detections_data);

//     valid_detections_data.forEach((item) => {
//       const ctx = this.canvasAnnotRef.current.getContext("2d");
//       this.drawBoundingBox(item, ctx);
//       this.drawText(item, ctx);
//     });
//   };

//   // extract and process information to dictionary form
//   buildDetectedObjects = (
//     videoFrame,
//     scoresData,
//     boxesData,
//     classesData,
//     names
//   ) => {
//     const detectionObjects = [];

//     // Detail abput the function
//     // array.forEach(function(currentValue, index, arr), thisValue)
//     scoresData.forEach((score, i) => {
//       if (score > Constants.THRESHOLD) {
//         const bbox = [];
//         let [minX, minY, maxX, maxY] = boxesData.slice(i * 4, (i + 1) * 4);
//         minX *= videoFrame.offsetWidth;
//         minY *= videoFrame.offsetHeight;
//         maxX *= videoFrame.offsetWidth;
//         maxY *= videoFrame.offsetHeight;

//         bbox[0] = minX;
//         bbox[1] = minY;
//         bbox[2] = maxX - minX;
//         bbox[3] = maxY - minY;
//         detectionObjects.push({
//           class: classesData[i],
//           label: names[classesData[i]],
//           score: score.toFixed(2),
//           bbox: bbox,
//         });
//       }
//     });

//     return detectionObjects;
//   };

//   drawBoundingBox = (item, ctx) => {
//     const x = item["bbox"][0];
//     const y = item["bbox"][1];
//     const width = item["bbox"][2];
//     const height = item["bbox"][3];

//     const font = "16px sans-serif";
//     ctx.font = font;
//     ctx.textBaseline = "top";

//     // Draw the bounding box.
//     ctx.strokeStyle = "#00FFFF";
//     ctx.lineWidth = 4;
//     ctx.strokeRect(x, y, width, height);

//     // Draw the label background.
//     ctx.fillStyle = "#00FFFF";
//     const textWidth = ctx.measureText(
//       item["label"] + " " + (100 * item["score"]).toFixed(2) + "%"
//     ).width;
//     const textHeight = parseInt(font, 10); // base 10
//     ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
//   };

//   drawText = (item, ctx) => {
//     const x = item["bbox"][0];
//     const y = item["bbox"][1];

//     // draw text
//     ctx.fillStyle = "#000000";
//     ctx.fillText(
//       item["label"] + " " + (100 * item["score"]).toFixed(2) + "%",
//       x,
//       y
//     );
//   };
//   // ###################################################################################################

//   addObj = (data) => {
//     // add objectc
//     const copyObjects = { ...this.state.objects };
//     copyObjects[this.state.nextObjectId] = {
//       x: data["x"],
//       y: data["y"],
//       width: data["width"],
//       height: data["height"],
//       centerX: data["centerX"],
//       centerY: data["centerY"],
//       regionOfInterestArr: data["regionOfInterestArr"],
//     };
//     this.prevObject.current = copyObjects[this.state.nextObjectId];

//     // add disappeared
//     const copyDisappeared = { ...this.state.disappeared };
//     copyDisappeared[this.state.nextObjectId] = 0;

//     // add disappeared
//     const copyCountSamePosition = { ...this.state.countSamePosition };
//     copyCountSamePosition[this.state.nextObjectId] = 0;

//     this.setState((state) => ({
//       nextObjectId: state.nextObjectId + 1,
//       objects: copyObjects,
//       disappeared: copyDisappeared,
//       countSamePosition: copyCountSamePosition,
//     }));
//   };

//   updateObj = (data, objectId) => {
//     // add objectc
//     const copyObjects = { ...this.state.objects };
//     copyObjects[objectId] = {
//       x: data["x"],
//       y: data["y"],
//       width: data["width"],
//       height: data["height"],
//       centerX: data["centerX"],
//       centerY: data["centerY"],
//       regionOfInterestArr: data["regionOfInterestArr"],
//     };
//     this.prevObject.current = copyObjects[objectId];

//     // add disappeared
//     const copyDisappeared = { ...this.state.disappeared };
//     copyDisappeared[objectId] = 0;

//     this.setState({
//       objects: copyObjects,
//       disappeared: copyDisappeared,
//     });
//   };

//   removeObj = (objectId) => {
//     // delete objects element based on key from objectId argument
//     const copyObjects = { ...this.state.objects };
//     delete copyObjects[objectId];
//     this.prevObject.current = null;

//     // delete disappeared element based on key from objectId argument
//     const copyDisappeared = { ...this.state.disappeared };
//     delete copyDisappeared[objectId];

//     const copyCountSamePosition = { ...this.state.countSamePosition };
//     delete copyCountSamePosition[objectId];

//     this.setState({
//       objects: copyObjects,
//       disappeared: copyDisappeared,
//       countSamePosition: copyCountSamePosition,
//     });
//   };

//   processDetectedLicensePlate = (data) => {
//     tf.browser
//       .toPixels(data["regionOfInterestArr"], this.canvasOutputRef.current)
//       .then(() => {
//         // It's not bad practice to clean up and make sure we got everything
//         console.log("Make sure we cleaned up", tf.memory().numTensors);
//       });
//     // function hans
//     // function bintang
//     this.setState({
//       isDataInput: true,
//     });

//     // console.log(data["regionOfInterestArr"]);
//     const body = { "license-plate": data["regionOfInterestArr"] };
//     const headers = {
//       "Access-Control-Allow-Origin": "*",
//       "Content-Type": "application/json",
//     };
//     // post data to machine learning python service (Google App Angine)
//     axios
//       .post("https://vepay-go.uc.r.appspot.com/character-segmentation", body, {
//         headers: headers,
//       })
//       .then((response) => {
//         // update the inference result
//         this.setState({
//           inferenceResult: response.data["prediction"],
//         });
//       });

//   };

//   update = (valid_detections_data) => {
//     if (!valid_detections_data.length) {
//       // copy the disappeared dictionary
//       let copyDisappeared = { ...this.state.disappeared };
//       // increment each value
//       for (let objectId in copyDisappeared) {
//         copyDisappeared[objectId]++;
//         this.setState({
//           disappeared: copyDisappeared,
//         });
//         // check if the value has reach maxFrameDisappeared
//         if (copyDisappeared[objectId] >= Constants.MAXFRAMEDISAPPEARED) {
//           this.removeObj(objectId);
//         }
//       }
//       return;
//     }
//     // adding centroid for every newly detected objects from Yolov5
//     let inputData = [];
//     for (let item of valid_detections_data) {
//       inputData.push(this.extractData(item));
//     }

//     let countExistingObjects = Object.keys(this.state.objects).length;

//     // check if current obejcts are emtpy
//     // if "true" than all of the detected objects are still
//     // just add them all.
//     if (!countExistingObjects) {
//       for (let data of inputData) {
//         this.addObj(data);
//       }
//     }
//     // if "false" calculate euclesian distance for each new detected objects with the previous objects.
//     // update the previous objects centroid with the new one that is closed.
//     else {
//       // console.log("masuk sene");
//       let distances = {};
//       for (let key in this.state.objects) {
//         distances[key] = [];
//         for (let inputCentroid of inputData) {
//           const currObject = this.state.objects[key];
//           distances[key].push(
//             this.calculateEucledianDistance(inputCentroid, currObject)
//           );
//         }
//       }

//       for (let key in distances) {
//         console.log("key in distances = ", key);
//         const argSortedDistances = distances[key]
//           .map((val, ind) => {
//             return { ind, val };
//           })
//           .sort((a, b) => {
//             return a.val > b.val ? 1 : a.val === b.val ? 0 : -1;
//           })
//           .map((obj) => obj.ind);
//         const currObject = inputData[argSortedDistances[0]];

//         if (this.prevObject.current != null) {
//           if (
//             this.calculateEucledianDistance(
//               this.prevObject.current,
//               currObject
//             ) < 30
//           ) {
//             let copyCountSamePosition = { ...this.state.countSamePosition };
//             copyCountSamePosition[key]++;
//             this.setState({
//               countSamePosition: copyCountSamePosition,
//             });
//             if (
//               copyCountSamePosition[key] === Constants.MAXFRAMEFORPROCESSING
//             ) {
//               this.processDetectedLicensePlate(currObject);
//             }
//           }
//         }
//         this.updateObj(inputData[argSortedDistances[0]], key);
//       }
//     }
//   };

//   extractData = (item) => {
//     let x = parseInt(item["bbox"][0].toFixed(0));

//     // check of the coordinate out of box or not
//     if (x < 0) {
//       x = 0;
//     }
//     console.log("x = ", x);

//     let y = parseInt(item["bbox"][1].toFixed(0));
//     // check of the coordinate out of box or not
//     if (y < 0) {
//       y = 0;
//     }

//     console.log("y = ", y);

//     let width = parseInt(item["bbox"][2].toFixed(0));
//     if (x + width > this.videoRef.current.offsetWidth) {
//       width = this.videoRef.current.offsetWidth - x;
//     }
//     console.log("width = ", width);

//     let height = parseInt(item["bbox"][3].toFixed(0));
//     if (y + height > this.videoRef.current.offsetHeight) {
//       height = this.videoRef.current.offsetHeight - y;
//     }
//     console.log("height = ", height);

//     let centerX = x + width / 2.0;
//     let centerY = y + height / 2.0;

//     const image = this.state.currentImage;
//     const startingPoint = [y, x, 0];
//     const newSize = [height, width, 3];
//     const regionOfInterest = tf.slice(image, startingPoint, newSize);
//     const regionOfInterestArr = regionOfInterest.arraySync();

//     return { x, y, width, height, centerX, centerY, regionOfInterestArr };
//   };

//   calculateEucledianDistance = (x1_y1, x2_y2) => {
//     const deltaXSquared = (x1_y1["centerX"] - x2_y2["centerX"]) ** 2;
//     const deltaYSquared = (x1_y1["centerY"] - x2_y2["centerY"]) ** 2;
//     return (deltaXSquared + deltaYSquared) ** (1 / 2);
//   };

//   render() {
//     return (
//       <div>
//         <div className="liveheader">
//           <h1>Live Camera Feed</h1>
//         </div>
//         <div className="video-wrapper">
//           <div className="video-container" id="video-container">
//             <h2 style={{ textAlign: "center" }}>Camera</h2>
//             <div className="license-plate-detection-container">
//               <Camera className={"camera"} videoRef={this.videoRef} />
//               <Canvas className={"canvas"} canvasRef={this.canvasAnnotRef} />
//             </div>
//           </div>
//           <div className="inference-result">
//             <h2 style={{ textAlign: "center" }}>Information</h2>
//             <InferenceResult
//               inferenceResult={this.state.inferenceResult}
//               isDataInput={this.state.isDataInput}
//               licensePlatePicture={<Canvas canvasRef={this.canvasOutputRef}
//             />}
//             />
//           </div>
//           <div className="vehicle-parking-logs">
//             <h2 style={{ textAlign: "center" }}>Vehicle Parking Logs</h2>
//             <Table
//               getUserDataUrl={
//                 "https://us-central1-vepay-go.cloudfunctions.net/transaction/transactions"
//               }
//               postUserDataUrl={
//                 "https://us-central1-vepay-go.cloudfunctions.net/transaction/transactions"
//               }
//               inferenceResult={this.state.inferenceResult}
//               isDataInput={this.state.isDataInput}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default LicensePlateDetection;
