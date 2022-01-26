const Jimp = require('jimp');
const fs = require('fs')
const wav = require('node-wav');


const _args = process.argv;
console.log(_args);


let dataArray = new Array();
let imgY = 1800;
let imgX = 200;



// Data unpacking
function audioToDataArray(file) {
    let buffer = fs.readFileSync(file);
    let channels = wav.decode(buffer).channelData;

    for (let i = 0; i < channels[0].length; i++) {
        dataArray[dataArray.length] = channels[0][i];
        dataArray[dataArray.length] = channels[1][i];
    }
}



// The function
function audioToImage(file) {
    audioToDataArray('./' + file);

    let image = new Jimp(imgX, imgY);
    image.rgba = true;

    let arrayIndex = 0;

    for (let x = 0; x < imgX; x++) {
        for (let y = 0; y < imgY; y++) {

            if (arrayIndex < dataArray.length) {
                image.setPixelColor(sampleToColor(dataArray[arrayIndex]), x, y);
            }
            else { image.setPixelColor(lowestHex, x, y); }

        }
    }

    image.write('./out.png');

    console.log(dataArray);
    console.log('\nConverted audio to image');
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