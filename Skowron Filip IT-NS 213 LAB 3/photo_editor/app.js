const brightnessRange = document.getElementById("brightnessRange");
const contrastRange = document.getElementById("contrastRange");
const saturationRange = document.getElementById("saturationRange");

let canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

document.getElementById("filePicker").onchange = function (e) {
    const URL = window.webkitURL || window.URL;
    const url = URL.createObjectURL(e.target.files[0]);
    let image = new Image();
    image.src = url;
    image.onload = function () {
        draw(this)
    };
};

function draw(image) {
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

    const brightness = function (scale, imageData) {
        function calculateBrightness() {
            return 255 * (scale / 100);
        }

        let pixelColors = imageData.data;
        for (let i = 0; i < pixelColors.length; i += 4) {
            pixelColors[i] += calculateBrightness();
            pixelColors[i + 1] += calculateBrightness();
            pixelColors[i + 2] += calculateBrightness();
        }
        context.putImageData(imageData, 0, 0);
    };

    const contrast = function (scale, imageData) {
        const factor = (259.0 * (scale + 255.0)) / (255.0 * (259.0 - scale));
        let pixelColors = imageData.data;

        function calculateContrastForPixel(index) {
            return factor * (pixelColors[index] - 128.0) + 128.0;
        }

        for (let i = 0; i < pixelColors.length; i += 4) {
            pixelColors[i] = calculateContrastForPixel(i);
            pixelColors[i + 1] = calculateContrastForPixel(i + 1);
            pixelColors[i + 2] = calculateContrastForPixel(i + 2);
        }
        context.putImageData(imageData, 0, 0);
    };

    const saturation = function (scale) {
        context.globalCompositeOperation = 'saturation';
        context.fillStyle = "hsl(0," + scale.toString() + "%,50%)";
        context.fillRect(0, 0, image.width, image.height);
    };

    function retrieveImageData() {
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        return context.getImageData(0, 0, image.width, image.height);
    }

    brightnessRange.onchange = function () {
        brightness(parseInt(brightnessRange.value, 10), retrieveImageData());
    };

    contrastRange.onchange = function () {
        contrast(parseInt(contrastRange.value, 10), retrieveImageData());
    };

    saturationRange.onchange = function () {
        saturation(saturationRange.value);
    };

}
