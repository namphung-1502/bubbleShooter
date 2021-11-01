import { BALL_WIDTH, BALL_HEIGHT, PADDING_TOP } from "./constant";
import Queue from "./model/queue";
import { Loader } from 'pixi.js'
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
export function getBubbleCoordinate(bubble, r, c) {
    bubble.x = c * BALL_WIDTH;
    if (Math.abs(r) % 2)
        bubble.x += BALL_WIDTH / 2;
    bubble.y = r * BALL_HEIGHT + PADDING_TOP;
    return bubble;
}

export function checkBubbleOnGrid(list_bubble, c, r) {
    for (let i = 0; i < list_bubble.length; i++) {
        if (list_bubble[i].c == c && list_bubble[i].r == r)
            return true;
    }
    return false;
}

export function findNeighbor(list_bubble, column, row) {
    var neighbor = [];
    for (let i = 0; i < list_bubble.length; i++) {
        var bubble = list_bubble[i];
        if ((bubble.r == row && bubble.c == column + 1) || (bubble.r == row && bubble.c == column - 1)) {
            neighbor.push(bubble);
        }
        if (row % 2 == 0) {
            if ((bubble.r == row - 1 && bubble.c == column) || (bubble.r == row - 1 && bubble.c == column - 1) ||
                (bubble.r == row + 1 && bubble.c == column) || (bubble.r == row + 1 && bubble.c == column - 1)) {
                neighbor.push(bubble);
            }
        } else if (row % 2 != 0) {
            if ((bubble.r == row - 1 && bubble.c == column) || (bubble.r == row - 1 && bubble.c == column + 1) ||
                (bubble.r == row + 1 && bubble.c == column) || (bubble.r == row + 1 && bubble.c == column + 1)) {
                neighbor.push(bubble);
            }
        }
    }
    return neighbor;
}

export function isInArray(list, value) {
    return list.indexOf(value) > -1;
}

// find neighbor same or down row of bubble
export function findNeighborDown(list_bubble, column, row) {
    var neighbor = [];
    for (let i = 0; i < list_bubble.length; i++) {
        var bubble = list_bubble[i];
        if ((bubble.r == row && bubble.c == column + 1) || (bubble.r == row && bubble.c == column - 1)) {
            neighbor.push(bubble);
        }
        if (row % 2 == 0) {
            if ((bubble.r == row - 1 && bubble.c == column) || (bubble.r == row - 1 && bubble.c == column - 1)) {
                neighbor.push(bubble);
            }
        } else if (row % 2 != 0) {
            if ((bubble.r == row - 1 && bubble.c == column) || (bubble.r == row - 1 && bubble.c == column + 1)) {
                neighbor.push(bubble);
            }
        }
    }
    return neighbor;

}

export function checkFloatBubble(list_bubble, bubble) {
    var hasChecked = [];
    var result = false;
    var queue = new Queue();
    queue.enqueue(bubble);
    if (bubble.r == 0) {
        result = true;
    }
    while (queue.length() > 0 && result == false) {
        var element = queue.peek();
        var neighbor = findNeighborDown(list_bubble, element.c, element.r);
        for (let i = 0; i < neighbor.length; i++) {
            if (neighbor[i].r == 0) {
                result = true;
            } else if (!isInArray(hasChecked, neighbor[i])) {
                queue.enqueue(neighbor[i]);
                hasChecked.push(neighbor[i]);
            }
        }
        queue.dequeue();
    }
    return result;
}
export function countNeighborSameColor(list_bubble, bubble) {
    var count = 0;
    var neighBor = findNeighbor(list_bubble, bubble.c, bubble.r);
    for (var i = 0; i < neighBor.length; i++) {
        if (neighBor[i].color == bubble.color)
            count += 1;
    }
    return count;
}
export function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function checkColorGuideLine(color) {
    var color;
    switch (color) {
        case "red":
            color = 0xff0000;
            break;
        case "yellow":
            color = 0xffff00;
            break;
        case "green":
            color = 0x00bf00;
            break;
        case "blue":
            color = 0x0000ff;
            break;
        case "transparent":
            color = 0xb2b2b2;
            break;
        case "lightblue":
            color = 0x56aaff;
            break;
        case "pink":
            color = 0xffaad4;
            break;
        default:
            break;
    }
    return color;
}

export function getNewPositionBubble(column, row) {
    let x = column * BALL_WIDTH;
    if (Math.abs(row) % 2)
        x += BALL_WIDTH / 2;
    let y = (row + 2) * BALL_HEIGHT + PADDING_TOP;
    return { x: x, y: y };
}

export function checkColorBubble(value) {
    var textures;
    switch (value) {
        case "blue":
            textures = Loader.shared.resources["image/bubble_blue.png"].texture;
            break;
        case "green":
            textures = Loader.shared.resources["image/bubble_green.png"].texture;
            break;
        case "lightblue":
            textures = Loader.shared.resources["image/bubble_lightBlue.png"].texture;
            break;
        case "pink":
            textures = Loader.shared.resources["image/bubble_pink.png"].texture;
            break;
        case "red":
            textures = Loader.shared.resources["image/bubble_red.png"].texture;
            break;
        case "transparent":
            textures = Loader.shared.resources["image/bubble_transparent.png"].texture;
            break;
        case "yellow":
            textures = Loader.shared.resources["image/bubble_yellow.png"].texture;
            break;
        default:
            break;
    }
    return textures;
}

export function randomElementInArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function checkElementInList(list, element) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == element)
            return true;
    }
    return false;
}