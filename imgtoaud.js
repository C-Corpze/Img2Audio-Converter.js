const Jimp = require('jimp');
const fs = require('fs')
const wav = require('node-wav');

const _args = process.argv;
console.log(_args);


let dataArray = new Array();
let imgY = 1800;
let imgX = 200;

let highestHex = Jimp.rgbaToInt(255, 255, 255, 255); // 4294967295




// File stuff
function writeWav(channels) {
  let buffer = wav.encode(
    channels,
    {
      sampleRate: 16000 * 2,
      numat: true,
      bitDepth: 32
    });

  fs.writeFile(
    './' + imgX + 'x' + imgY + '-output.wav',
    buffer, (err) => { if (err) return console.log(err); });
}


// Data structure stuff
function arrayToAudio() { // We convert dataArray to wav
  let channels = [[], []];

  for (let x = 0; x < dataArray.length; x++) {
    if (x % 2 === 0) { // Spread over 2 channels
      channels[0][channels[0].length] = dataArray[x];
    } else {
      channels[1][channels[1].length] = dataArray[x];
    }
  }
  writeWav(channels);
}




// Simple conversions and math
function lerp(v1, v2, a) {
  return v1 + (v2 - v1) * a;
}

function colorToSample(hex) {
  return lerp(-1, 1, hex / highestHex);
}



// ========== Main functions


function imageToAudio(file) { // Simple, straight forward conversion algorithm
  Jimp.read('./' + file).then(
    image => { ////
      image.rgba = true;
      imgY = image.bitmap.height; imgX = image.bitmap.width; // Set the height and width

      // Iterate over every pixel because we can
      for (let x = 0; x < imgX; x++) {
        for (let y = 0; y < imgX; y++) { // Pixels to dataArray
          dataArray[dataArray.length] = colorToSample(image.getPixelColor(x, y));;
        }
      }

      // Check if array is even for 2 sound channels
      if (dataArray.length % 2 !== 0) {
        dataArray[dataArray.length] = 0;
      }

      console.log(dataArray);
      arrayToAudio();
      
    }).catch(err => { console.log('Something went wrong loading the image\n'); console.log(err); });
}



// Command line buttsauce

switch (_args[2]) {
  case 'convert':
    imageToAudio(_args[3]);
    break;

  case 'printwav': // For reading the structure of a wav file
    let buffer = fs.readFileSync('./' + _args[3]);
    let channels = wav.decode(buffer);
    console.log(channels.sampleRate);
    console.log(channels.channelData);
    break;

  default: // For the lazy
    imageToAudio('imgin.png');
    console.log('\nLazily converted image to audio\n');
    break;
}