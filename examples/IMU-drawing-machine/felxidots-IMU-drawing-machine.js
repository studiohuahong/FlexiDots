/*
FlexiDots IMU Drawing Machine
https://studiohuahong.github.io/FlexiDots/examples/IMU-drawing-machine.html
*/

// The serviceUuid must match the serviceUuid of the device you would like to connect
const serviceUuid = "2A5A20B9-0000-4B9C-9C69-4975713E0FF2";
let accelerationCharacteristic;
let myBLE;

let ax = 0, ay = 0, az = 0;

let moveX = 200;
let moveY = 200;

let dynamicR = 10; //set the dynamic circle radius

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

  createCanvas(400, 400);
  background("#FFF");
  textSize(16);

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
  for (let i = 0; i < characteristics.length; i++) {
    if (i == 0) {
      accelerationCharacteristic = characteristics[i];
      // Set datatype to 'custom', p5.ble.js won't parse the data, will return data as it is.
      myBLE.startNotifications(accelerationCharacteristic, handleAcceleration, 'custom');
    } else {
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


function draw() {

//   text(`Acceleration X: ${ax}`, 100, 50);
//   text(`Acceleration Y: ${ay}`, 100, 100);
//   text(`Acceleration Z: ${az}`, 100, 150);
  
  if(moveX >= 0 && moveX <= 400){
    moveX = moveX + ay*10; //change to ax/ay/az according to the microcontroller's orientation
  } else if (moveX < 0){
    moveX = 1;
  } else if(moveX > 400){
    moveX = 399;
  }
  
  if(moveY > 0 && moveY < 400){
    moveY = moveY - az*10; //change to ax/ay/az according to the microcontroller's orientation
  }  else if (moveY < 0){
    moveY = 1;
  } else if(moveY > 400){
    moveY = 399;
  }
  
  dynamicR = map((abs(ay*10)+abs(az*10))/2,0,3,10,80,true);
  
  circle(moveX, moveY, dynamicR)
}