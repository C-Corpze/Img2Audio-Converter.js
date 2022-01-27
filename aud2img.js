const Jimp = require('jimp');
const fs = require('fs')
const wav = require('node-wav');


const _args = process.argv;
console.log(_args);


let dataArray = new Array();
let imgX = 2000;
let imgY = 200;



// Data unpacking
function audioToDataArray(file) {
    let buffer = fs.readFileSync(file);
    let channels = wav.decode(buffer).channelData;

    for (let i = 0; i < channels[0].length; i++) {
        dataArray[dataArray.length] = channels[0][i];
        dataArray[dataArray.length] = channels[1][i];
    }
}




// Conversion stuff
function toBinary(number, bit) {
    // console.log(number + ' bit: ' + bit);

    // Make binary
    let bin = Math.abs(number).toString(2);
    // console.log(bin);

    // Add bits if bitrange too short
    if (bin.length < bit) {
        bin = '0'.repeat(bit - bin.length) + bin;
    }
    // console.log(bin);

    return bin;
}
function fromBinary(text) {
    return Math.abs(parseInt(text, 2));
}


function sampleToColor(sample) {
    // console.log(sample);
    let bin = toBinary(
        parseInt(
            ((sample + 1) / 2) * 4_294_967_296
        ),
        32);
    // console.log(bin);

    let r = fromBinary(bin.slice(0, 8));
    let g = fromBinary(bin.slice(8, 16));
    let b = fromBinary(bin.slice(16, 24));
    let a = fromBinary(bin.slice(24, 32));
    // console.log(r + '\n' + g + '\n' + b + '\n' + a);

    return Jimp.rgbaToInt(r, g, b, a);
    // return Jimp.rgbaToInt(200, 200, 200, 255);
}






// The function
function audioToImage(file) {
    audioToDataArray('./' + file);
    let image = new Jimp(imgX, imgY);
    image.rgba = true;

    console.log(dataArray);

    for (let i = 0; i < dataArray.length; i++) {
        // console.log(dataArray[i]);
        dataArray[i] = sampleToColor(dataArray[i]);
        // console.log(dataArray[i]);
    }

    console.log(dataArray);
    let arrayIndex = 0;

    // Write image
    for (let x = 0; x < imgX; x++) {
        for (let y = 0; y < imgY; y++) {
            if (arrayIndex < dataArray.length) {
                image.setPixelColor(
                    dataArray[arrayIndex],
                    x, y);
            } else {
                image.setPixelColor(lowestHex, x, y);
                console.log('Image too large, filling with solid pixel');
            }
        }
    }

    image.write('./out.png');
    console.log('\nConverted audio to image');
}



// Command line buttsauce

switch (_args[2]) {
    case 'convert':
        audioToImage(_args[3]);
        break;

    case 'printwav': // For reading the structure of a wav file
        let buffer = fs.readFileSync('./' + _args[3]);
        let channels = wav.decode(buffer);
        console.log(channels.sampleRate);
        console.log(channels.channelData);
        break;

    default: // For the lazy
        audioToImage('audin.wav');
        console.log('\nLazily converted audio to image\n');
        break;
}