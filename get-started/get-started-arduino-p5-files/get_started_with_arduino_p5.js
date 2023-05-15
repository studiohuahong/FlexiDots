/*
  FLEXIDOTS Get Started with Arduino & p5.js
  https://studiohuahong.github.io/FlexiDots/get-started/get-started-arduino-p5.html
*/

//create p5.ble communication variables
const serviceUuid = "19b10010-e8f2-537e-4f6c-d104768a1214";
const characteristicsUUID = {led:"19b10011-e8f2-537e-4f6c-d104768a1214",button:"19b10012-e8f2-537e-4f6c-d104768a1214"}
let buttonCharacteristic;
let ledCharacteristic;
let myBLE;

//create distance variables to detect collision
let dis;

//send notifications at intervals to prevent GATT operation congestion
let GATTinterval = 20;
let GATTsendData = false;
//avoid send duplicate notifications to prevent GATT operation congestion
let avoidDuplicateData = true;

//read value from button
let buttonValue = 0;

function setup() {
  //create a p5ble class
  myBLE = new p5ble();
  
  createCanvas(400, 400);
  background("#FFF");
  
  //create a 'Connect' button,
  const connectButton = createButton('Connect Device')
  connectButton.mousePressed(connectAndStartNotify);
}

function draw() {
  noStroke();

  //read buttonValue from arduino
  if(buttonValue>0){ 
    fill("#1dffe1");
  }else{
    fill("#9AFFBC");
  }
  //change background color according to buttonValue
  rect(0, 0, width, height);
  
  //create a circle in the middle of canvas to detect collision
  push();
  fill("#49b6ff");
  circle(width/2, height/2, 100);
  pop();
  //create a circle following the cursor to collide the middle circle
  push();
  fill("white");
  circle(mouseX, mouseY, 100);
  pop();
  //detect collision
  dis = dist(mouseX, mouseY, width/2, height/2);
  
  //countdown the GATTinterval to send notifications at intervals to prevent GATT operation congestion
  if(GATTinterval > 0 ){
    GATTinterval -= 1;
    GATTsendData = false;
  }else{
    GATTinterval = 20;
    GATTsendData = true;
  }
  
  //send notifications when two circles collide
  if(myBLE.isConnected() && GATTsendData == true){
    if(dis <= 100 && avoidDuplicateData == true){
      myBLE.write(ledCharacteristic, 1);
      avoidDuplicateData = false;
    }else if(dis > 100 && avoidDuplicateData == false){
      myBLE.write(ledCharacteristic, 0);
      avoidDuplicateData = true;
    }
  } 
}

function connectAndStartNotify() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log(characteristics);
   for(let i = 0; i < characteristics.length;i++){
    if(characteristics[i].uuid == characteristicsUUID.button){
      buttonCharacteristic = characteristics[i];
      myBLE.startNotifications(buttonCharacteristic, handleButton);
    }else if(characteristics[i].uuid == characteristicsUUID.led){
      ledCharacteristic = characteristics[i];
    }else{
      console.log("nothing");
    }
   }
  // Start notifications on the first characteristic by passing the characteristic
  // And a callback function to handle notifications  
}

// A function that will be called once got Characteristics from Arduino
function handleButton(data) {
  console.log('Button: ', data);
  buttonValue = Number(data);
}
