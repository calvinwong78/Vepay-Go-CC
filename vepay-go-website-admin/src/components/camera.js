import React from "react";
import * as tf from "@tensorflow/tfjs";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
tf.setBackend("webgl");

async function load_model() {
  const model = await loadGraphModel("/web_model/model.json");
  return model;
}

class CameraLive extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();
  canvasOutput = React.createRef();

  state = {
    objects: {},
    threshold: 0.4,
    names: ["license-plate"],
    maxFrameDisappeared: 10,
    disappeared: {},
    nextObjectId: 0,
    increment: 1,
    currentImage: null,
  };

  // invoke as soon as the compoenents is mounted (inserted to the tree)
  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            mirrored: true,
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          try {
            return new Promise((resolve, reject) => {
              this.videoRef.current.onloadedmetadata = () => {
                resolve();
              };
            });
          } catch (error) {
            return console.log(error);
          }
        });

      const modelPromise = load_model();

      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  // componentDidUpdate() {
  //   console.log("Updates");
  //   console.log(this.state.objects);
  //   console.log(this.state.disappeared);
  //   console.log(this.state.nextObjectId);
  //   console.log(this.state.increment);
  // }

  // ###################################################################################################
  detectFrame = (video, model) => {
    // startScope() and endScope() clean up unused tensor
    tf.engine().startScope();
    model.executeAsync(this.processInput(video)).then((predictions) => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
      // startScope() and endScope() clean up unused tensor
      tf.engine().endScope();
    });
  };

  processInput = (videoFrame) => {
    const image = tf.browser
      .fromPixels(videoFrame)
      .resizeBilinear([
        this.videoRef.current.offsetHeight,
        this.videoRef.current.offsetWidth,
      ])
      .toFloat();
    // result shape: [height, width, channels]
    
    // update the image
    this.setState({
      currentImage: image,
    });

    // resize and normalized image expand the dimension by 1 so that
    // it can be input to the object detection model
    const tfImg = image.resizeBilinear([640, 640]).toFloat();
    const normalizedTfImg = tfImg.div(255.0);
    const expandedimg = normalizedTfImg.expandDims(0);
    return expandedimg;
  };

  renderPredictions = (predictions) => {
    // get canvas element and resize according to camera size\
    // so that it the annotation will fit perfectly
    const canvas = this.canvasRef.current;
    canvas.width = this.videoRef.current.offsetWidth;
    canvas.height = this.videoRef.current.offsetHeight;

    // get context for drawing
    const ctx = this.canvasRef.current.getContext("2d");

    // console.log(this.videoRef.current.width, this.videoRef.current.height);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    const [boxes, scores, classes, _] = predictions;

    //Getting predictions
    const boxesData = boxes.dataSync();
    const scoresData = scores.dataSync();
    const classesData = classes.dataSync();

    const valid_detections_data = this.buildDetectedObjects(
      this.videoRef.current,
      scoresData,
      this.state.threshold,
      boxesData,
      classesData,
      this.state.names
    );

    this.update(valid_detections_data);

    valid_detections_data.forEach((item) => {
      const ctx = this.canvasRef.current.getContext("2d");
      this.drawBoundingBox(item, ctx);
      this.drawText(item, ctx);
    });
  };

  // extract and process information to dictionary form
  buildDetectedObjects = (
    videoFrame,
    scoresData,
    threshold,
    boxesData,
    classesData,
    names
  ) => {
    const detectionObjects = [];

    // Detail abput the function
    // array.forEach(function(currentValue, index, arr), thisValue)
    scoresData.forEach((score, i) => {
      if (score > threshold) {
        const bbox = [];
        let [minX, minY, maxX, maxY] = boxesData.slice(i * 4, (i + 1) * 4);
        minX *= videoFrame.offsetWidth;
        minY *= videoFrame.offsetHeight;
        maxX *= videoFrame.offsetWidth;
        maxY *= videoFrame.offsetHeight;

        bbox[0] = minX;
        bbox[1] = minY;
        bbox[2] = maxX - minX;
        bbox[3] = maxY - minY;
        detectionObjects.push({
          class: classesData[i],
          label: names[classesData[i]],
          score: score.toFixed(2),
          bbox: bbox,
        });
      }
    });

    return detectionObjects;
  };

  drawBoundingBox = (item, ctx) => {
    const x = item["bbox"][0];
    const y = item["bbox"][1];
    const width = item["bbox"][2];
    const height = item["bbox"][3];

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    // Draw the bounding box.
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // Draw the label background.
    ctx.fillStyle = "#00FFFF";
    const textWidth = ctx.measureText(
      item["label"] + " " + (100 * item["score"]).toFixed(2) + "%"
    ).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
  };

  drawText = (item, ctx) => {
    const x = item["bbox"][0];
    const y = item["bbox"][1];

    // draw text
    ctx.fillStyle = "#000000";
    ctx.fillText(
      item["label"] + " " + (100 * item["score"]).toFixed(2) + "%",
      x,
      y
    );
  };
  // ###################################################################################################

  addObj = (data) => {
    // add objectc
    const copyObjects = { ...this.state.objects };
    copyObjects[this.state.nextObjectId] = {
      x: data["x"],
      y: data["y"],
      width: data["width"],
      height: data["height"],
      centerX: data["centerX"],
      centerY: data["centerY"],
      regionOfInterestArr: data["regionOfInterestArr"],
    };

    // add disappeared
    const copyDisappeared = { ...this.state.disappeared };
    copyDisappeared[this.state.nextObjectId] = 0;

    this.setState((state) => ({
      nextObjectId: state.nextObjectId + 1,
      objects: copyObjects,
      disappeared: copyDisappeared,
    }));
  };

  updateObj = (data, objectId) => {
    // add objectc
    const copyObjects = { ...this.state.objects };
    copyObjects[objectId] = {
      x: data["x"],
      y: data["y"],
      width: data["width"],
      height: data["height"],
      centerX: data["centerX"],
      centerY: data["centerY"],
      regionOfInterestArr: data["regionOfInterestArr"],
    };

    // add disappeared
    const copyDisappeared = { ...this.state.disappeared };
    copyDisappeared[objectId] = 0;

    this.setState({
      objects: copyObjects,
      disappeared: copyDisappeared,
    });
  };

  removeObj = (objectId) => {
    // display image
    this.canvasOutput.current.top = this.videoRef.current.offsetHeight;
    tf.browser
    .toPixels(
      this.state.objects[objectId]["regionOfInterestArr"],
      this.canvasOutput.current
      )
      .then(() => {
        // It's not bad practice to clean up and make sure we got everything
        console.log("Make sure we cleaned up", tf.memory().numTensors);
      });
      
    // upload image information
    // send data to the image segmentation
    console.log(this.state.objects[objectId]["regionOfInterestArr"])



    // delete objects element based on key from objectId argument
    const copyObjects = { ...this.state.objects };
    delete copyObjects[objectId];

    // delete disappeared element based on key from objectId argument
    const copyDisappeared = { ...this.state.disappeared };
    delete copyDisappeared[objectId];

    this.setState({
      objects: copyObjects,
      disappeared: copyDisappeared,
    });
  };

  update = (valid_detections_data) => {
    if (!valid_detections_data.length) {
      // copy the disappeared dictionary
      let copyDisappeared = { ...this.state.disappeared };
      // increment each value
      for (let objectId in copyDisappeared) {
        copyDisappeared[objectId]++;
        this.setState({
          disappeared: copyDisappeared,
        });
        // check if the value has reach maxFrameDisappeared
        if (copyDisappeared[objectId] >= this.state.maxFrameDisappeared) {
          this.removeObj(objectId);
        }
      }
      return;
    }
    // adding centroid for every newly detected objects from Yolov5
    let inputData = [];
    for (let item of valid_detections_data) {
      inputData.push(this.extractData(item));
    }

    let count = Object.keys(this.state.objects).length;

    // check if current obejcts are emtpy
    // if "true" than all of the detected objects are still
    // just add them all.
    if (!count) {
      for (let data of inputData) {
        this.addObj(data);
      }
    }
    // if "false" calculate euclesian distance for each new detected objects with the previous objects.
    // update the previous objects centroid with the new one that is closed.
    else {
      // console.log("masuk sene");
      let distances = {};
      let distancesRowCount = 0;
      let distancesColumnCount = 0;
      for (let key in this.state.objects) {
        distances[key] = [];
        distancesRowCount++;
        for (let inputCentroid of inputData) {
          const currObject = this.state.objects[key];
          distances[key].push(
            this.calculateEucledianDistance(inputCentroid, currObject)
          );
          distancesColumnCount++;
        }
      }
      distancesColumnCount /= distancesRowCount;


      let usedKey = new Set();
      let usedCentroidIndex = new Set();

      for (let key in distances) {
        const argSortedDistances = distances[key]
          .map((val, ind) => {
            return { ind, val };
          })
          .sort((a, b) => {
            return a.val > b.val ? 1 : a.val === b.val ? 0 : -1;
          })
          .map((obj) => obj.ind);
        usedKey.add(parseInt(key));
        usedCentroidIndex.add(argSortedDistances[0]);
        this.updateObj(inputData[argSortedDistances[0]], key);
      }

      if (distancesRowCount >= distancesColumnCount) {
        for (let key in distances) {
          if (!usedKey.has(key)) {
            const copyDisappeared = { ...this.state.disappeared };
            copyDisappeared[key]++;
            if (copyDisappeared[key] >= this.state.maxFrameDisappeared) {
              this.removeObj(key);
            }
          }
        }
      } else {
        for (let i = 0; i < distancesColumnCount; i++) {
          if (!usedCentroidIndex.has(i)) {
            this.addObj(inputData[i]["centerX"], inputData[i]["centerY"]);
          }
        }
      }
    }
  };

  extractData = (item) => {
    let x = parseInt(item["bbox"][0].toFixed(0));
    x = x < 0 ? 0 : x;
    x = x > this.videoRef.current.width ? this.videoRef.current.width : x;
    let y = parseInt(item["bbox"][1].toFixed(0));
    y = y < 0 ? 0 : y;
    y = y > this.videoRef.current.height ? this.videoRef.current.height : y;

    let width = parseInt(item["bbox"][2].toFixed(0));
    let height = parseInt(item["bbox"][3].toFixed(0));
    let centerX = x + width / 2.0;
    let centerY = y + height / 2.0;

    const image = this.state.currentImage;
    const startingPoint = [y, x, 0];
    const newSize = [height, width, 3];
    const regionOfInterest = tf.slice(image, startingPoint, newSize);
    console.log(regionOfInterest);
    const regionOfInterestArr = regionOfInterest.arraySync();

    return { x, y, width, height, centerX, centerY, regionOfInterestArr, };
  };

  calculateEucledianDistance = (x1_y1, x2_y2) => {
    const deltaXSquared = (x1_y1["centerX"] - x2_y2["centerX"]) ** 2;
    const deltaYSquared = (x1_y1["centerY"] - x2_y2["centerY"]) ** 2;
    return (deltaXSquared + deltaYSquared) ** (1 / 2);
  };

  render() {
    return (
      <div>
        <video
          className="size"
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          id="frame"
          width={840}
          height={630}
        />
        <canvas
          className="size"
          ref={this.canvasRef}
          width={640}
          height={480}
        />
        <div>
          <canvas
            id="output"
            style={{ position: "fixed"}}
            ref={this.canvasOutput}
          />
        </div>
      </div>
    );
  }
}

export default CameraLive;
