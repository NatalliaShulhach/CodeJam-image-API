let canvas = document.getElementById('center');
let ctx = canvas.getContext('2d');
let loadImage;

async function drawImage() {
    let elemColor = document.getElementById('color');
    var myColor = elemColor.value;

    elemColor.oninput = function () {
        myColor = this.value;
    }

    canvas.onmousedown = function (_event) {
        canvas.onmousemove = function (event) {
            let x = event.offsetX;
            let y = event.offsetY;
            ctx.fillRect(x - 5, y - 5, 5, 5);
            ctx.fillStyle = `${myColor}`;
            ctx.fill();
        }
        canvas.onmouseup = function () {
            canvas.onmousemove = null;
        }
    }
}

async function uploadImage() {

    let userCity = document.getElementsByClassName('user-town-input')[0].value.trim();

    let url = `https://api.unsplash.com/photos/random?query=${userCity}&client_id=aaf0367dfd37ec3ab19a16cbf08b53ea4bbff09ac3ca674d354232eae1802313`;
    let response = await fetch(url);
    if (response.ok) {
        let answer = await response.json();
        setBackground(answer.urls.regular);
    }
    else {
        alert('error could not open page' + response.status);
    }
}

async function setBackground(url) {

    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
        if (img.width > img.height) {
            let ratio = img.width / img.height;
            let newHight = canvas.width / ratio;
            let offsetY = (canvas.height - newHight) / 2;
            ctx.drawImage(img, 0, offsetY, canvas.width, newHight);
        }
        else if (img.width < img.height) {
            let ratio = img.height / img.width;
            let newWidth = canvas.height / ratio;
            let offsetX = (canvas.width - newWidth) / 2;
            ctx.drawImage(img, offsetX, 0, newWidth, canvas.height);
        }
        else {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        
        loadImage = img;
    }
    img.src = url;
}

async function repaintToGray() {

    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let d = pixels.data;
    for (var i = 0, dLength = d.length; i < dLength; i += 4) {
        let r = d[i];
        let g = d[i + 1];
        let b = d[i + 2];
        let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v
    }
    ctx.putImageData(pixels, 0, 0);
}

async function scrollBar(value) {

    let size = Math.pow(2, +value);
    canvas.width = canvas.height = size;
    
    if (loadImage) {
        loadImage.onload();
    }
}

//..................//

function saveImage() {
    var imageBase64 = canvas.toDataURL('image.png');
    localStorage.setItem('userImage', imageBase64);
}

function getImage() {
    return localStorage['userImage'];
}

function loadFromCache() {
    var cachedImage = getImage();
    if (cachedImage) {
        setBackground(cachedImage);
    }
}

loadFromCache();
drawImage();
