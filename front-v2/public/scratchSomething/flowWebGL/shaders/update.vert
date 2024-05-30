#version 300 es
precision highp float;

layout(location = 0) in vec3 particleInfo;
layout(location = 1) in float age;

layout(std140) uniform FlowFieldUniforms {
    float progress;
    float segmentNum;
    float fullLife;
    float dropRate;
    float dropRateBump;
    float speedFactor;
    vec4 flowBoundary; // vec4(uMin, vMin, uMax, vMax)

};

uniform sampler2D flowField[2];
uniform sampler2D mask[2];
// uniform sampler2D validAddress;
uniform float randomSeed;

out vec3 newInfo;
out float aliveTime;

vec2 uvCorrection(vec2 uv, vec2 dim) {
    return clamp(uv, vec2(0.0f), dim - vec2(1.0f));
}
// pseudo-random generator
float rand(const vec2 co) {
    const vec3 rand_constants = vec3(12.9898f, 78.233f, 4375.85453f);
    float t = dot(rand_constants.xy, co);
    return abs(fract(sin(t) * (rand_constants.z + t)));
}

float drop(float velocity, vec2 uv) {
    vec2 seed = (particleInfo.xy + uv) * randomSeed;
    float drop_rate = dropRate + velocity * dropRateBump;
    return step(drop_rate, rand(seed));
}

ivec2 MakeCoordValid(ivec2 texcoords, vec2 resolution){
    ivec2 resol = ivec2(resolution);
    resol.x = resol.x - 1;
    resol.y = resol.y - 1;
    ivec2 validCoord = clamp(texcoords, ivec2(0), resol);
    return validCoord;
}

float is_in_flow_progress(vec2 resolution, vec2 uv) {
    ivec2 texcoords = ivec2(uv * resolution);//这里的uv是归一的坐标

    vec4 color1 = texelFetch(mask[0], texcoords, 0);//这里的color存的是4326下的归一坐标，mapbox用的归一化墨卡托
    vec4 color2 = texelFetch(mask[1], texcoords, 0);

    ivec2 xy1 = ivec2((int(color1.r * 255.0f) << 8) + int(color1.g * 255.0f), (int(color1.b * 255.0f) << 8) + int(color1.a * 255.0f));
    ivec2 xy2 = ivec2((int(color2.r * 255.0f) << 8) + int(color2.g * 255.0f), (int(color2.b * 255.0f) << 8) + int(color2.a * 255.0f));
    float isInFlow1 = float((xy1 == texcoords));
    float isInFlow2 = float((xy2 == texcoords));

    return step(0.0f, 2.0f * mix(isInFlow1, isInFlow2, progress) - 1.0f);
}

vec2 get_speed(sampler2D sFlowField, vec2 uv) {
    // vec2 speed_tl = texture(sFlowField, uv).rg;

    vec2 dim = vec2(textureSize(sFlowField, 0));
    vec2 speed_tl = texture(sFlowField, uvCorrection(uv, dim)).rg;
    return speed_tl;
}

vec2 lookup_speed(vec2 uv, vec2 resolution) {
    vec2 lSpeed = get_speed(flowField[0], uv);
    vec2 nSpeed = get_speed(flowField[1], uv);
    vec2 speed = mix(lSpeed, nSpeed, progress);
    return mix(flowBoundary.xy, flowBoundary.zw, speed);
    // vec2 speed = get_speed(flowField[0], uv);
    return speed;
}

float speed_rate(vec2 speed) {
    return length(speed) / length(flowBoundary.zw);
}

void die(vec2 resolution) {
    vec2 seed = randomSeed + particleInfo.xy;

    vec2 uv = vec2(rand(seed + 1.3f), rand(seed + 2.1f));
    vec2 dim = vec2(textureSize(mask[1], 0));
    vec4 rebirthColor = texture(mask[1], uvCorrection(uv, dim));
    float rebirth_x = float((int(rebirthColor.r * 255.0f) << 8) + int(rebirthColor.g * 255.0f));
    float rebirth_y = float((int(rebirthColor.b * 255.0f) << 8) + int(rebirthColor.a * 255.0f));
    rebirth_x = rebirth_x + rand(seed + rebirth_x);
    rebirth_y = rebirth_y + rand(seed + rebirth_y);

    vec2 rebirthPos = vec2(rebirth_x, rebirth_y) / resolution;
    newInfo = vec3(rebirthPos, speed_rate(lookup_speed(rebirthPos, resolution)));
    aliveTime = age + 1.0f;
}

void simulation(vec2 resolution) {
    vec2 uv = particleInfo.xy;
    vec2 speed = lookup_speed(uv, resolution);
    // vec2 speed = vec2(0.1,0.3);
    float speedRate = speed_rate(speed);

    vec2 nPos = vec2(particleInfo.xy + speed * speedFactor / resolution);
    nPos = clamp(nPos, vec2(0.001f), vec2(0.999f));
    // float dropped = drop(speedRate, uv) * is_in_flow_progress(resolution, nPos);
    float dropped = is_in_flow_progress(resolution, nPos);

    newInfo = mix(particleInfo, vec3(nPos, speedRate), dropped);
    aliveTime = mix(fullLife - segmentNum, age + 1.0f, dropped);
}

void freeze() {
    newInfo = particleInfo;
    aliveTime = age + 1.0f;
}

void rebirth() {
    newInfo = particleInfo;
    aliveTime = 0.0f;
}

void main() {
    vec2 resolution = vec2(textureSize(mask[1], 0));

    if(age < fullLife - segmentNum) {
        simulation(resolution);
    } else if(age == fullLife) {
        die(resolution);
    } else if(abs(fullLife - age) <= segmentNum) {
        freeze();
    } else {
        rebirth();
    }
}