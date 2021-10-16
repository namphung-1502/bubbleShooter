import { BALL_WIDTH, BALL_HEIGHT } from "./constant";
import Queue from "./model/Queue";
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
    if (r % 2)
        bubble.x += BALL_WIDTH / 2;
    bubble.y = r * BALL_HEIGHT;
    return bubble;
}

export function checkBubbleOnGrid(list_bubble, c, r) {
    for (let i = 0; i < list_bubble.length; i++) {
        if (list_bubble[i].c == c && list_bubble[i].r == r)
            return true;
    }
    return false;
}

export function findNeighbor(list_bubble, c, r) {
    var neighbor = [];
    for (let i = 0; i < list_bubble.length; i++) {
        if ((list_bubble[i].r == r && list_bubble[i].c == c + 1) || (list_bubble[i].r == r && list_bubble[i].c == c - 1)) {
            neighbor.push(list_bubble[i]);
        }
        if (r % 2 == 0) {
            if ((list_bubble[i].r == r - 1 && list_bubble[i].c == c) || (list_bubble[i].r == r - 1 && list_bubble[i].c == c - 1) ||
                (list_bubble[i].r == r + 1 && list_bubble[i].c == c) || (list_bubble[i].r == r + 1 && list_bubble[i].c == c - 1)) {
                neighbor.push(list_bubble[i]);
            }
        } else if (r % 2 != 0) {
            if ((list_bubble[i].r == r - 1 && list_bubble[i].c == c) || (list_bubble[i].r == r - 1 && list_bubble[i].c == c + 1) ||
                (list_bubble[i].r == r + 1 && list_bubble[i].c == c) || (list_bubble[i].r == r + 1 && list_bubble[i].c == c + 1)) {
                neighbor.push(list_bubble[i]);
            }
        }
    }
    return neighbor;
}

export function isInArray(list, value) {
    return list.indexOf(value) > -1;
}

// find neighbor same or down row of bubble
export function findNeighborDown(list_bubble, c, r) {
    var neighbor = [];
    for (let i = 0; i < list_bubble.length; i++) {
        if ((list_bubble[i].r == r && list_bubble[i].c == c + 1) || (list_bubble[i].r == r && list_bubble[i].c == c - 1)) {
            neighbor.push(list_bubble[i]);
        }
        if (r % 2 == 0) {
            if ((list_bubble[i].r == r - 1 && list_bubble[i].c == c) || (list_bubble[i].r == r - 1 && list_bubble[i].c == c - 1)) {
                neighbor.push(list_bubble[i]);
            }
        } else if (r % 2 != 0) {
            if ((list_bubble[i].r == r - 1 && list_bubble[i].c == c) || (list_bubble[i].r == r - 1 && list_bubble[i].c == c + 1)) {
                neighbor.push(list_bubble[i]);
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

export function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}