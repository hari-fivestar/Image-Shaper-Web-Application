const imageUpload = document.getElementById("imageUpload");
const shapeSelect = document.getElementById("shapeSelect");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const generateBtn = document.getElementById("generateBtn");
const saveBtn = document.getElementById("saveBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = null;

imageUpload.addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        img = new Image();
        img.src = e.target.result;
        img.onload = drawImage;
    };
    reader.readAsDataURL(file);
});

function drawImage() {
    const w = canvas.width;
    const h = canvas.height;
    const padding = 30;

    ctx.clearRect(0, 0, w, h);

    // frame area
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(padding, padding, w - padding * 2, h - padding * 2);

    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const hasText = title || desc;

    let imgSize = hasText ? 270 : 420;
    let imgX = (w - imgSize) / 2;
    let imgY = padding + 10;

    ctx.save();
    ctx.beginPath();

    switch (shapeSelect.value) {
        case "circle":
            ctx.arc(w / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
            break;

        case "square":
            ctx.rect(imgX, imgY, imgSize, imgSize);
            break;

        case "rectangle":
            ctx.rect(imgX - 40, imgY + 40, imgSize + 80, imgSize - 80);
            break;

        case "triangle":
            ctx.moveTo(w / 2, imgY);
            ctx.lineTo(imgX, imgY + imgSize);
            ctx.lineTo(imgX + imgSize, imgY + imgSize);
            ctx.closePath();
            break;

        case "star":
            drawStar(w / 2, imgY + imgSize / 2, imgSize / 2, 5);
            break;
    }

    ctx.clip();
    ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
    ctx.restore();

    // text container
    ctx.textAlign = "center";
    const textWidth = w - padding * 2;

    if (title) {
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#111";
        ctx.fillText(title, w / 2, imgY + imgSize + 40);
    }

    if (desc) {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#555";
        wrapText(desc, w / 2, imgY + imgSize + 70, textWidth - 20, 22);
    }

    // outer frame border
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#dcdcdc";
    ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2);
}

// ⭐ text wrapping helper
function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";

    for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + " ";
        if (ctx.measureText(test).width > maxWidth) {
            ctx.fillText(line, x, y);
            line = words[i] + " ";
            y += lineHeight;
        } else {
            line = test;
        }
    }
    ctx.fillText(line, x, y);
}

// ⭐ star helper
function drawStar(cx, cy, outerRadius, spikes) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let inner = outerRadius / 2;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * inner;
        y = cy + Math.sin(rot) * inner;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.closePath();
}

// generate
generateBtn.addEventListener("click", function() {
    if (!img) {
        alert("Please upload an image first!");
        return;
    }
    drawImage();
});

// save
saveBtn.addEventListener("click", function() {
    const link = document.createElement("a");
    link.download = "shaped-image.jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
});