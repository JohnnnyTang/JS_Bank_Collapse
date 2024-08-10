export class FlowFieldController {
    //控制面板变量
    lineNum;
    segmentNum;
    fullLife;
    progressRate;
    speedFactor;
    dropRate;
    dropRateBump;
    fillWidth;
    aaWidth;
    colorScheme;
    isUnsteady;
    content;
    primitive;
    platform;
    stop;
    constructor() {
        this.lineNum = 15000;
        this.segmentNum = 64;
        this.fullLife = this.segmentNum * 10;
        this.progressRate = 0.0;
        this.speedFactor = 2.0;
        this.dropRate = 0.01;
        this.dropRateBump = 0.002;
        this.fillWidth = 3;
        this.aaWidth = 3;
        this.colorScheme = 1;
        this.isUnsteady = true;
        this.content = "none";
        this.primitive = 0;
        this.platform = "mapbox no worker";
        this.stop = false;
    }
}
