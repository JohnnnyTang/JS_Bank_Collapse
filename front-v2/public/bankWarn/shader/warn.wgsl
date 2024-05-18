struct VertexInput {
    @builtin(vertex_index) vertexIndex: u32,
    @location(0) position: vec4f,
    @location(1) warnValue: f32,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(1) warnValue: f32,
};

struct DynamicUniformBlock {
    far: f32,
    near: f32,
    uMatrix: mat4x4f,
    centerLow: vec3f,
    centerHigh: vec3f,
    mvpInverse: mat4x4f,
};

// Uniform bindings
@group(0) @binding(0) var<uniform> dynamicUniform: DynamicUniformBlock;



fn translateRelativeToEye(high: vec3f, low: vec3f) -> vec3f {

    let highDiff = high - dynamicUniform.centerHigh;
    let lowDiff = low - dynamicUniform.centerLow;

    return highDiff + lowDiff;
}


fn colorFromInt(color: u32) -> vec3f {
    
    let b = f32(color & 0xFF) / 255.0;
    let g = f32((color >> 8) & 0xFF) / 255.0;
    let r = f32((color >> 16) & 0xFF) / 255.0;

    return vec3f(r, g, b);
}

fn getWarnColor(value:f32) -> vec3f {
    let rampColors = array<u32, 11>(
        0x00b0f0,//0.0
        0x76a9c8,
        0xa69f9f,
        0xcc9071,
        0xed7c31,
        0xed7c31,//0.5
        0xf06f24,
        0xf46018,
        0xf84e0d,
        0xfb3704,
        0xff0000,//1.0
    );

    let bottomIndex = floor(value * 10.0);// 0-9
    let topIndex = ceil(value * 10.0);// 1-10
    let interval = value * 10.0 - bottomIndex;

    let botColor = colorFromInt(rampColors[u32(bottomIndex)]);
    let topColor = colorFromInt(rampColors[u32(topIndex)]);

    return mix(botColor, topColor, interval);

}

@vertex
fn vMain(input: VertexInput) -> VertexOutput {

    let posHigh = vec3f(input.position.x, input.position.z, 0.0);
    let posLow =  vec3f(input.position.y, input.position.w, 0.0);
    let pos = translateRelativeToEye(posHigh, posLow);

    let pos_clipSpace = dynamicUniform.uMatrix * vec4f(pos, 1.0);
    
    var output:VertexOutput;
    output.position = pos_clipSpace;
    output.warnValue = input.warnValue;
    
    return output;
}


@fragment
fn fMain(input: VertexOutput) -> @location(0) vec4f {

    let color = getWarnColor(input.warnValue);
    let alpha = 0.8;
    return vec4f(color, 1.0) * alpha;
    // return vec4f(1.0,0.0,0.0,1.0);

}
