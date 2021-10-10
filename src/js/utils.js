export function degToRad(angle) {
    return angle * (Math.PI / 180);
}

export function radToDeg(angle) {
    return angle * (180 / Math.PI);
}

export function calculator_angle(x1, x2, x3, x4, y1, y2, y3, y4) {
    var d1x = x2 - x1;
    var d1y = y2 - y1;
    var d2x = x4 - x3;
    var d2y = y4 - y3;
    var result = Math.acos((d1x * d2x + d1y * d2y) / (Math.sqrt(d1x * d1x + d1y * d1y) * (Math.sqrt(d2x * d2x + d2y * d2y))));
    var angle = radToDeg(result);
    return 180 - angle;
}

export function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}