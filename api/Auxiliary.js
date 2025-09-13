import convert from 'color-convert';

export default function generateColors(n) {
    const split = 360 / n;
    const colors = [];
    for (let i = 0; i < n; i++) {
        colors.push('#' + hsvToHex((n - 1 - i) * split, 100, 100));
    }
    return colors;
}

function hsvToHex(h, s, v) {
    return convert.hsv.hex(h, s, v);
}