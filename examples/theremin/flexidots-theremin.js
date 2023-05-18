/*
FlexiDots Theremin
https://studiohuahong.github.io/FlexiDots/examples/IMU-drawing-machine.html
*/

// The serviceUuid must match the serviceUuid of the device you would like to connect
const serviceUuid = "2a5a20b9-0000-4b9c-9c69-4975713e0ff2";
const characteristicsUUID = {acceleration:"2a5a20b9-0001-4b9c-9c69-4975713e0ff2",button:"2a5a20b9-0002-4b9c-9c69-4975713e0ff2"}
let accelerationCharacteristic;
let buttonCharacteristic;
let myBLE;
//read value from button
let buttonValue = 0;

let ax = 0, ay = 0, az = 0;

//sound set up
let osc;
let reverb;
let vol = 0;

//theremin dots array
let dotX = []; //pitch
let dotY = []; //volume

//hand position
let moveX = 300;
let moveY = 200;

function preload() {
  backImg = loadImage('Images/back.png');
  handImg_1 = loadImage('Images/hand1.png');
  handImg_2 = loadImage('Images/hand2.png');
}

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

  createCanvas(600, 400);
  background("#000000");
  textSize(16);
  
  //Theremin Sound set-up
  osc = new p5.Oscillator('triangle'); //osc sound
  reverb = new p5.Reverb();//reverb effect
  delay = new p5.Delay();//delay effect
  osc.disconnect(); // so we'll only hear reverb
  //reverb.process(osc, 3, 5);// 3 second reverbTime, decayRate of 2%
  delay.process(osc, 0.12, 0.5, 2300); //source, delayTime (in seconds), feedback, filter frequency
  

  // Create a 'Connect and Start Notifications' button
  const connectButton = createButton('Connect Device')
  connectButton.mousePressed(connectAndStartNotify);
}

function connectAndStartNotify() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);

}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
    console.log(characteristics);
  for (let i = 0; i < characteristics.length; i++) {
    if (characteristics[i].uuid == characteristicsUUID.acceleration) {
      accelerationCharacteristic = characteristics[i];
      // Set datatype to 'custom', p5.ble.js won't parse the data, will return data as it is.
      myBLE.startNotifications(accelerationCharacteristic, handleAcceleration, 'custom');
      osc.start();
    } else if (characteristics[i].uuid == characteristicsUUID.button){
      buttonCharacteristic = characteristics[i];
      myBLE.startNotifications(buttonCharacteristic, handleButton);      
    }else {
      console.log("characteristic doesn't match.");
    }
  }
}

// A function that will be called once got characteristics
function handleAcceleration(data) {
  ax = data.getFloat32(0, true);
  ay = data.getFloat32(4, true);
  az = data.getFloat32(8, true);
}

// A function that will be called once got Characteristics from Arduino
function handleButton(data) {
  console.log('Button: ', data);
  buttonValue = Number(data);
}

function draw() {

  image(backImg, 0, 0); 
  
  // dots grid - equal temperament - common ratio 1.059
  for(x=0; x<=12; x++){   
    dotX[0] = 0
    dotX[x] = dotX[x-1] + 30 * pow(1.059, x);   
    
    for(y=0; y<5; y++){
      dotY[y] = y*40;
      fill(255);
      rect(dotX[x],dotY[y]+50,10);
    }
  } 
  
  if(moveX >= 0 && moveX <= 600){
    moveX = int(moveX + ay*10); //change to ax/ay/az according to the microcontroller's orientation
  } else if (moveX <= 0){
    moveX = 1;
  } else if(moveX >= 600){
    moveX = 599;
  }
  
  if(moveY > 0 && moveY < 400){
    moveY = int(moveY - az*10); //change to ax/ay/az according to the microcontroller's orientation
  }  else if (moveY <= 0){
    moveY = 1;
  } else if(moveY >= 400){
    moveY = 399;
  }
  
  //create the theremin sound
  
  
  if(buttonValue == 1){
    image(handImg_2, moveX-20, moveY-20,50,50); 
    vol = map(moveY, dotY[0]+50, dotY[4]+50, 0.8, 0, true);//vertical - volume
  }else{
    image(handImg_1, moveX-20, moveY-20,50,50); 
    vol = 0;
  }
  
  let pitch = map(moveX, dotX[1], dotX[12], 261.6, 493.88, true); //horizential - freq C4~B4

  osc.freq(pitch);
  osc.amp(vol);
}