#ifdef VERTEX_SHADER

precision highp float;

out vec2 texcoords;

vec4[] vertices = vec4[4](
    vec4(-1.0, -1.0, 0.0, 0.0),
    vec4(1.0, -1.0, 1.0, 0.0),
    vec4(-1.0, 1.0, 0.0, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0)
);

void main() {

    vec4 attributes = vertices[gl_VertexID];

    gl_Position = vec4(attributes.xy, 0.0, 1.0);
    texcoords = attributes.zw;
}

#endif

#ifdef FRAGMENT_SHADER

precision highp float;
precision highp usampler2D;

in vec2 texcoords;

uniform sampler2D srcTexture;

out vec4 fragColor;

vec3 colorMap(int index) {

    vec3 palette[11] = vec3[11](
        vec3(158.0, 1.0, 66.0),
        vec3(213.0, 62.0, 79.0),
        vec3(244.0, 109.0, 67.0),
        vec3(253.0, 174.0, 97.0),
        vec3(254.0, 224.0, 139.0),
        vec3(255.0, 255.0, 191.0),
        vec3(230.0, 245.0, 152.0),
        vec3(171.0, 221.0, 164.0),
        vec3(102.0, 194.0, 165.0),
        vec3(50.0, 136.0, 189.0),
        vec3(94.0, 79.0, 162.0)
    );

    return palette[index] / 255.0;
}


void main() {
    
    // int level = int(texture(lodMap, texcoords).r);
    // vec3 levelColor = colorMap(level % 11);

    vec4 color = texture(srcTexture, texcoords);

    fragColor = vec4(color.rgb, 0.45);
}

#endif