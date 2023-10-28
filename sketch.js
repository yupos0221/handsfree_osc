let pWindowWidth;
let orgWidth;
let orgHeight;
let capture;
// webカメラのロードフラグ
let videoDataLoaded = false;

let buttonStop;
let buttonLoading;
let buttonView;
let buttonTrack;

let sliderVelocity;

let radioMode;

let onHandTracking = false;


let handsfree;

const circleSize = 12;

const targetIndex = [4, 8, 12, 16, 20];
const palette = ["#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4"];

// const note_colors = [{8:["C", (  0,   0, 255)], 12:["D", (  0, 255, 255)], 16:["E", (  0, 128,   0)], 20:["F", (  0, 255,   0)]},
//                      {8:["G", (255, 255,   0)], 12:["A", (128,   0, 128)], 16:["B", ( 128,  0, 255)], 20:["C", (  0,   0, 255)]}
//                     ];

const note_colors = [{8:["C", "#4040ff"], 12:["D", "#ffa040"], 16:["E", "#ff00ff"], 20:["F", "#00ff00"]},
                    {8:["G", "#0085ff"], 12:["A", "#fee440"], 16:["B", "#a000ff"], 20:["C", "#00f5d4"]}
                   ];

// const tones = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const leftTones = [["C3", "D3", "E3", "F3"], ["C4", "D4", "E4", "F4"], ["C5", "D5", "E5", "F5"]];
const rightTones = [["G3", "A3", "B3", "C4"], ["G4", "A4", "B4", "C5"], ["G5", "A5", "B5", "C6"]];
let toneShift = [1,1];
const singleTones = [["G3", "A3", "B3", "C4"], ["C4", "D4", "E4", "F4"], ["G4", "A4", "B4", "C5"]];
// let times = [Tone.now(),Tone.now(),Tone.now(),Tone.now()];
// let leftTimes = [Tone.now(),Tone.now(),Tone.now(),Tone.now()];
// let rightTimes = [Tone.now(),Tone.now(),Tone.now(),Tone.now()];
// let trigger = [false, false, false, false];
let leftTrigger = [false, false, false, false];
let rightTrigger = [false, false, false, false];

let osc = null;

function setup() {
  capture = createCapture(VIDEO);
  // createCanvas(capture.width, capture.height);
  // 映像をロードできたらキャンバスの大きさを設定
  capture.elt.onloadeddata = function () {
    videoDataLoaded = true;
    orgWidth = capture.width;
    orgHeight = capture.height;
    let canvas = createCanvas(capture.width, capture.height);
    pWindowWidth = windowWidth;
  };

  // handsfreeのhandモデルを準備
  handsfree = new Handsfree({
    // showDebug: true,
    hands: true,
    // The maximum number of hands to detect [0 - 4]
    maxNumHands: 2,
    // Minimum confidence [0 - 1] for a hand to be considered detected
    minDetectionConfidence: 1.0,
    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 1.0
  });

  // handsfreeを開始
//   handsfree.enablePlugins('browser');
//   handsfree.plugin.pinchScroll.disable()
  handsfree.start();

  // 映像を非表示化
  capture.hide();

  osc = new p5.Oscillator("sine")
}

function draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(capture, 0, 0, width, height);
    pop();

    // 手の頂点を表示
    drawHands();
    playOsc();
}

let point = null;
function drawHands() {
  
  const hands = handsfree.data?.hands;

  // 手が検出されなければreturn
  if (!hands?.multiHandLandmarks) return;

  const zip = (array1, array2) => array1.map((_, i) => [array1[i], array2[i]]);
  zip(hands.multiHandLandmarks, hands.multiHandedness).forEach(([hand, handedness]) => {
    
  // });

  // // 手の数だけlandmarkの地点にcircleを描写
  // hands.multiHandLandmarks.forEach((hand, handIndex) => {
    label = handedness["label"] == 'Left' ? 1 : 0;
    hand.forEach((landmark, landmarkIndex) => {
      // 指先だけ色を変更
      push();
      switch (landmarkIndex) {
        case 4:
          fill("#9b5de5");
          circle(width - landmark.x * width, landmark.y * height, circleSize*2);
          break;
        case 8:
          point = landmark.y;
        case 12:
        case 16:
        case 20:
          fill(note_colors[label][landmarkIndex][1]);
          circle(width - landmark.x * width, landmark.y * height, circleSize*2);
          break;
        case 21:

          fill(color(255, 255, 255));
          circle(width - landmark.x * width, landmark.y * height, circleSize);
          break;
        default:
          fill(color(255, 255, 255));
          circle(width - landmark.x * width, landmark.y * height, circleSize);
      }
      pop();
      // circle(width - landmark.x * width, landmark.y * height, circleSize);
    });
  });
}

let isPlaying = false;
function playOsc(){
  if(mouseIsPressed){
    if(!isPlaying){
      osc.start();
    }
    osc.amp(mouseY/height);
    osc.freq(440*(1-point)+220);
    isPlaying = true;
  } 
}

function mouseReleased(){
  osc.stop();
  isPlaying = false;
}