# Img2Audio-Converter
Simple JS program I wrote to convert between images and audio.
The idea behind this is to be able to edit or create audio through photoshop software.

I've always wanted to see how audio would look like in image format
and be able to edit or "draw" it.

I hope to create a algorithm that can convert images <-> audio in such a way that
the process can be reversed in order to get the source image/audio back
out of it.

=====================================================================
Requires these NodeJS libraries:
`jimp`
`node-wav`

Install through `npm install [library]`.

Convert image to audio: `node imgtoaud.js convert [image.png]`

Convert audio to image: `node audtoimg.js convert [audio.wav] resX resY`

The `.blend` file is for quickly generating/rendering images to test the conversion with Blender.


Note:
-Converting audio to images still does not work properly.
-I want to add more algorithms later, some may not be reversible.
