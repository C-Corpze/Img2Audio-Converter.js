const Jimp = require('jimp');
const fs = require('fs')
const wav = require('node-wav');


const _args = process.argv;
console.log(_args);


let dataArray = new Array();
let imgX = 2200;
let imgY = 2200;

let conversionMethod = 0;

let defaultColor = Jimp.rgbaToInt(0, 0, 0, 255);



// Data unpacking
function audioToDataArray(file) {
    let buffer = fs.readFileSync(file);
    let channels = wav.decode(buffer).channelData;

    for (let i = 0; i < channels[0].length; i++) {
        dataArray[dataArray.length] = channels[0][i];
        dataArray[dataArray.length] = channels[1][i];
    }
}




// Binary stuff
function toBinary(number, bit) {
    // Make binary
    let bin = Math.abs(number).toString(2);
    // Add bits if bitrange too short
    if (bin.length < bit) {
        bin = '0'.repeat(bit - bin.length) + bin;
    }
    return bin;
}
function fromBinary(text) {
    return Math.abs(parseInt(text, 2));
}


// default conversion method
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
    let image = new Jimp(imgX, imgY, defaultColor);
    image.rgba = true;

    console.log(dataArray);

    // Convert sample array to a color array
    for (let i = 0; i < dataArray.length; i++) {
        switch (conversionMethod) {
            default:
                dataArray[i] = sampleToColor(dataArray[i]);
                break;
        }

    }

    // Add pixels if array too small
    if (dataArray.length < imgX * imgY) {
        while (dataArray.length < imgX * imgY) {
            dataArray[dataArray.length] = defaultColor;
        }
    }

    console.log(dataArray);
    let arrayIndex = 0;

    // Write image
    for (let y = 0; y < imgY; y++) {
        for (let x = 0; x < imgX; x++) {
            image.setPixelColor(dataArray[arrayIndex], x, y);
            arrayIndex += 1;
        }
    }

    image.write('./out.png');
    console.log('\nConverted audio to image');
}



// Command line buttsauce

switch (_args[2]) {
    case 'def':
        imgX = parseInt(_args[4]);
        imgY = parseInt(_args[5]);
        audioToImage(_args[3]);
        break;

    case '2':
        imgX = parseInt(_args[4]);
        imgY = parseInt(_args[5]);
        audioToImage(_args[3]);
        break;

    default: // For the lazy
        audioToImage('audin.wav');
        console.log('\nLazily converted audio to image\n');
        break;
}