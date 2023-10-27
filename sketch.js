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

function setup() {
  // createCanvas(640, 480);
  capture = createCapture(VIDEO);
  // createCanvas(capture.width, capture.height);
  // 映像をロードできたらキャンバスの大きさを設定
  capture.elt.onloadeddata = function () {
    videoDataLoaded = true;
    orgWidth = capture.width;
    orgHeight = capture.height;
    let canvas = createCanvas(capture.width, capture.height);
    // let canvas = createCanvas(windowWidth, orgHeight * (windowWidth/orgWidth)*0.9);
    // let canvas = createCanvas(window.innerWidth*(window.innerHeight/orgHeight), window.innerHeight*0.85);
    // let canvas = createCanvas(windowWidth, windowHeight*0.9);
    pWindowWidth = windowWidth;
    // canvas.position(0, window.innerHeight/10);
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
}

function draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(capture, 0, 0, width, height);
    pop();

//   line(0, height/3, width, height/3);
//   line(0, height*2/3, width, height*2/3);

    // 手の頂点を表示
    drawDoubleHands();
   

//   updateView();
}

// function updateView(){
//   if(pWindowWidth != windowWidth){
//     // resizeCanvas(windowWidth, windowHeight);
//     resizeCanvas(windowWidth, orgHeight * (windowWidth/orgWidth)*0.9);
//     sizeButton = [windowWidth/10, windowHeight/10];
//     buttonStop.size(sizeButton[0], sizeButton[1]-20);
//     buttonStop.position(0, 5);
//     buttonLoading.size(sizeButton[0], sizeButton[1]-20);
//     buttonLoading.position(0, 5);
//     buttonRunning.size(sizeButton[0], sizeButton[1]-20);
//     buttonRunning.position(0, 5);
//     buttonView.size(sizeButton[0], sizeButton[1]-20);
//     buttonView.position(sizeButton[0], 5);
//     buttonTrack.size(sizeButton[0], sizeButton[1]-20);
//     buttonTrack.position(sizeButton[0]*2, 5);
//     sliderVelocity.position(sizeButton[0]*3+30, sizeButton[1]/2-15);
//     radioMode.position(sizeButton[0]*3+30, sizeButton[1]/2+15);
//   }
//   pWindowWidth = windowWidth;
// }


function drawDoubleHands() {
  
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
        // case 4:
        //   fill(palette[0]);
        //   break;
        // case 8:
        //   fill(palette[1]);
        //   break;
        // case 12:
        //   fill(palette[2]);
        //   break;
        // case 16:
        //   fill(palette[3]);
        //   break;
        // case 20:
        //   fill(palette[4]);
        //   break;
        case 4:
          fill("#9b5de5");
          circle(width - landmark.x * width, landmark.y * height, circleSize*2);
          break;
        case 8:
        case 12:
        case 16:
        case 20:
          // print(note_colors)
          // print(note_colors[handIndex][landmarkIndex]);
          fill(note_colors[label][landmarkIndex][1]);
          // fill(color(note_colors[handIndex][landmarkIndex][1][0], note_colors[handIndex][landmarkIndex][1][1], note_colors[handIndex][landmarkIndex][1][2]));
          circle(width - landmark.x * width, landmark.y * height, circleSize*2);
          // circle(width - landmark.x * width, landmark.y * height, circleSize);
          fill("#000000");
          textSize(16);
          textStyle(BOLD);
          text(note_colors[label][landmarkIndex][0], width - landmark.x * width-textWidth(note_colors[label][landmarkIndex][0])/2, landmark.y * height+textWidth(note_colors[label][landmarkIndex][0])/2);
          break;
        case 21:
          let y = landmark.y*height;
          print(landmark.y, y, height/3);
          if(y < height/3){
            toneShift[label] = 2;
          }else if(y >= height/3 && y < height*2/3){
            toneShift[label] = 1;
          }else{
            toneShift[label] = 0;
          }
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

  // console.log(handsfree.data.hands.pinchState[0])
  
}