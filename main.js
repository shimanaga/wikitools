function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return [r, g, b];
}

function expandShortHex(hex) {
    if (hex.length === 4) {
        return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
}

function isValidHexColor(hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

function updateRGBFields(hex, rField, gField, bField) {
    if (isValidHexColor(hex)) {
        hex = expandShortHex(hex);
        document.getElementById(rField).value = parseInt(hex.slice(1, 3), 16);
        document.getElementById(gField).value = parseInt(hex.slice(3, 5), 16);
        document.getElementById(bField).value = parseInt(hex.slice(5, 7), 16);
    }
}

function updateColorInputs(picker, code, r, g, b) {
    picker.addEventListener('input', function () {
        code.value = picker.value;
        let [red, green, blue] = hexToRgb(picker.value);
        r.value = red;
        g.value = green;
        b.value = blue;
        generateGradientText();
    });

    code.addEventListener('input', function () {
        if (!isValidHexColor(code.value)){
            return;
        }
        picker.value = expandShortHex(code.value);
        let [red, green, blue] = hexToRgb(code.value);
        r.value = red;
        g.value = green;
        b.value = blue;
        generateGradientText();
    });

    r.addEventListener('input', function () {
        let hex = rgbToHex(parseInt(r.value), parseInt(g.value), parseInt(b.value));
        code.value = hex;
        picker.value = hex;
        generateGradientText();
    });
    g.addEventListener('input', function () {
        let hex = rgbToHex(parseInt(r.value), parseInt(g.value), parseInt(b.value));
        code.value = hex;
        picker.value = hex;
        generateGradientText();
    });
    b.addEventListener('input', function () {
        let hex = rgbToHex(parseInt(r.value), parseInt(g.value), parseInt(b.value));
        code.value = hex;
        picker.value = hex;
        generateGradientText();
    });
}

function generateGradientText() {
    const text = document.getElementById('inputText').value;
    let color1 = document.getElementById('color1-code').value;
    let color2 = document.getElementById('color2-code').value;
    const output = document.getElementById('output');
    const preview = document.getElementById('preview');

    if (!isValidHexColor(color1) || !isValidHexColor(color2)) {
        return;
    }

    color1 = expandShortHex(color1);
    color2 = expandShortHex(color2);

    updateRGBFields(color1, 'color1-r', 'color1-g', 'color1-b');
    updateRGBFields(color2, 'color2-r', 'color2-g', 'color2-b');

    let gradientText = '';
    let previewText = '';

    if (text.length === 1) {
        gradientText = `&color(${color1}){${text}};`;
        previewText = `<span style="color:${color1}">${text}</span>`;
    } else {
        const length = text.length;
        for (let i = 0; i < length; i++) {
            let ratio = i / (length - 1);
            let r = Math.round((1 - ratio) * parseInt(color1.slice(1, 3), 16) + ratio * parseInt(color2.slice(1, 3), 16));
            let g = Math.round((1 - ratio) * parseInt(color1.slice(3, 5), 16) + ratio * parseInt(color2.slice(3, 5), 16));
            let b = Math.round((1 - ratio) * parseInt(color1.slice(5, 7), 16) + ratio * parseInt(color2.slice(5, 7), 16));
            let color = rgbToHex(r, g, b);

            gradientText += `&color(${color}){${text[i]}};`;
            previewText += `<span style="color:${color}">${text[i]}</span>`;
        }
    }

    output.textContent = gradientText;
    preview.innerHTML = previewText;
}

function copyToClipboard() {
    const outputText = document.getElementById('output').textContent;
    navigator.clipboard.writeText(outputText);
}

document.getElementById('copyButton').addEventListener('click', copyToClipboard);

document.getElementById('inputText').addEventListener('input', generateGradientText);

updateColorInputs(
    document.getElementById('color1-picker'),
    document.getElementById('color1-code'),
    document.getElementById('color1-r'),
    document.getElementById('color1-g'),
    document.getElementById('color1-b')
);

updateColorInputs(
    document.getElementById('color2-picker'),
    document.getElementById('color2-code'),
    document.getElementById('color2-r'),
    document.getElementById('color2-g'),
    document.getElementById('color2-b')
);

generateGradientText();
