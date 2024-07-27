export class FlowFieldController{
    //控制面板变量
    lineNum: number;
    segmentNum: number;
    fullLife: number;
    progressRate: number;
    speedFactor: number;
    dropRate: number;
    dropRateBump: number;
    fillWidth: number;
    aaWidth: number;
    colorScheme: number;
    isUnsteady: boolean;
    content: string;
    primitive: number;
    platform: string;

    stop: boolean;

    constructor(){
        this.lineNum =30000;
        this.segmentNum = 24;
        this.fullLife = this.segmentNum * 10;
        this.progressRate = 0.0;
        this.speedFactor = 2.0;
        this.dropRate = 0.01;
        this.dropRateBump = 0.002;
        this.fillWidth = 2;
        this.aaWidth = 3;
        this.colorScheme = 1;
        this.isUnsteady = true;
        this.content = "none";
        this.primitive = 0;
        this.platform = "mapbox no worker";
        this.stop = false;
    }

    //省去 Constrainst，先用这里的死数据来尝试
}