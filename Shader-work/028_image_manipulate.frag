#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D u_image;

void main(){
    vec2 coord=gl_FragCoord.xy/u_resolution;
    vec3 color=vec3(0.);

    vec4 image = texture2D(u_image, coord);
    image.r += sin(coord.x * 90.);
    image.r += cos(coord.y * 90.);

    gl_FragColor=image;
}