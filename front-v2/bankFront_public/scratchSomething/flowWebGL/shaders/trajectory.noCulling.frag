#version 300 es
precision highp float;

in struct Stream_line_setting {
    float edgeParam;
    float alphaDegree;
    float velocity; // a percentage
    float isDiscarded;
} sls;

layout(std140) uniform FlowFieldUniforms {
    float progress;
    float segmentNum;
    float fullLife;
    float dropRate;
    float dropRateBump;
    float speedFactor;
    float colorScheme;
    vec4 flowBoundary;
};
uniform float fillWidth;
uniform float aaWidth;
uniform float exagration;

out vec4 fragColor;

int rampColors0[8] = int[](0x0084ff, 0x0074f5, 0x0065ea, 0x0055de, 0x0844d2, 0x1433c5, 0x1c1fb7, 0x200a8e);

int rampColors1[8] = int[](0x6c8cfc, // vec3(108, 140, 252)
0x8d9ffd, // vec3(141, 163, 253)
0xabbafe, // vec3(171, 186, 254)
0xc8d1fe, // vec3(200, 209, 254)
0xf9c3c4, // vec3(249, 195, 196)
0xff8979, // vec3(255, 137, 135)
0xfe6967, // vec3(254, 105, 103)
0xf94346  // vec3(249, 67, 70)
);
int rampColors2[8] = int[](0x3288bd, 0x66c2a5, 0xabdda4, 0xe6f598, 0xfee08b, 0xfdae61, 0xf46d43, 0xd53e4f);

int[8] rampColors() {
    if(colorScheme == 1.0f)
        return rampColors0;
    if(colorScheme == 2.0f)
        return rampColors1;
    if(colorScheme == 3.0f)
        return rampColors2;
}

vec3 colorFromInt(int color) {
    float b = float(color & 0xFF) / 255.0f;
    float g = float((color >> 8) & 0xFF) / 255.0f;
    float r = float((color >> 16) & 0xFF) / 255.0f;

    return vec3(r, g, b);
}


vec3 velocityColor(float speed) {

    float ogIndex = speed * exagration * 8.0f;
    float bottomIndex = floor(ogIndex);
    float topIndex = min(bottomIndex + 1.0f, 7.0f);
    float interval = ogIndex - bottomIndex;

    vec3 slowColor = colorFromInt(rampColors()[int(bottomIndex)]);
    vec3 fastColor = colorFromInt(rampColors()[int(topIndex)]);

    return mix(slowColor, fastColor, interval);
}

float getAlpha(float param) {
    if(aaWidth == 0.0f)
        return 1.0f;
    float alpha = 1.0f - sin(clamp((param * (0.5f * fillWidth + aaWidth) - 0.5f * fillWidth) / aaWidth, 0.0f, 1.0f) * 2.0f / 3.141592653f);
    return alpha;
}

void main() {
    if(sls.isDiscarded >= fullLife)
        discard;
    float alpha = getAlpha(abs(sls.edgeParam));

    // vec3 color = mix(colorFromInt(rampColors[int(sls.velocity * 7.0)]), colorFromInt(rampColors[int(sls.velocity * 7.0 + 0.5)]), fract(sls.velocity * 7.0));
    vec3 color = velocityColor(sls.velocity);
    // color = mix(vec3(0.7), color, alpha);
    fragColor = vec4(color, 1.0f) * alpha * sls.alphaDegree;
    // fragColor = vec4(1.0) * alpha;
}