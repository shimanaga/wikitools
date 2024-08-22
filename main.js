function isValidHexColor(hex) {
    return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex);
}

function expandShortHex(hex) {
    if (hex.length === 4) {
        return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

function updateRGBFields(hex, rField, gField, bField) {
    if (isValidHexColor(hex)) {
        hex = expandShortHex(hex);
        document.getElementById(rField).value = parseInt(hex.slice(1, 3), 16);
        document.getElementById(gField).value = parseInt(hex.slice(3, 5), 16);
        document.getElementById(bField).value = parseInt(hex.slice(5, 7), 16);
    }
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

    const length = text.length;
    if (length <= 1) {
        const color = isValidHexColor(color1) ? color1 : '#000000';
        output.textContent = `&color(${color}){${text}};`;
        preview.innerHTML = `<span style="color:${color}">${text}</span>`;
        return;
    }

    const gradientText = [];
    const previewText = [];
    for (let i = 0; i < length; i++) {
        let ratio = i / (length - 1);
        let r = Math.round((1 - ratio) * parseInt(color1.slice(1, 3), 16) + ratio * parseInt(color2.slice(1, 3), 16));
        let g = Math.round((1 - ratio) * parseInt(color1.slice(3, 5), 16) + ratio * parseInt(color2.slice(3, 5), 16));
        let b = Math.round((1 - ratio) * parseInt(color1.slice(5, 7), 16) + ratio * parseInt(color2.slice(5, 7), 16));
        let color = rgbToHex(r, g, b);

        gradientText.push(`&color(${color}){${text[i]}};`);
        previewText.push(`<span style="color:${color}">${text[i]}</span>`);
    }

    requestAnimationFrame(() => {
        output.textContent = gradientText.join('');
        preview.innerHTML = previewText.join('');
    });
}

document.getElementById('color1-code').addEventListener('input', generateGradientText);
document.getElementById('color2-code').addEventListener('input', generateGradientText);
document.getElementById('inputText').addEventListener('input', generateGradientText);
