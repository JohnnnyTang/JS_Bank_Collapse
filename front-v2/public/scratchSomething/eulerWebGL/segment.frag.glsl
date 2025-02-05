#version 300 es

precision highp float;
in float opacity;

uniform float aaWidth;
uniform float fillWidth;
uniform vec3 u_arrowColor;

const float PI = 3.14159265359f;

out vec4 fragColor;

float getAlpha(float param) {
    if(aaWidth == 0.0f) {
        return 1.0f;
    } else {
        return 1.0f - sin(clamp((param * (0.5f * fillWidth + aaWidth) - 0.5f * fillWidth) / aaWidth, 0.0f, 1.0f) * 2.0f / PI);
    }
}
void main() {
    float alpha = getAlpha(opacity);
    alpha = 0.7f;
    fragColor = vec4(u_arrowColor / 255.0f, 1.0f) * alpha;
    // fragColor = vec4(0.27f, 0.27f, 0.27f, 1.0f);

}