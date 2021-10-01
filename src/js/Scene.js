import { Container } from 'pixi.js'

class Scene extends Container {
    constructor() {
        super();
    }
    setVisible(visible) {
        this.visible = visible;
    }
    addChild(child) {
        super.addChild(child);
    }
}

export default Scene;