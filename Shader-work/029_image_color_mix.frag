#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D u_image;

void main(){
    vec2 coord=gl_FragCoord.xy/u_resolution;
    vec3 color=vec3(1, 0, 0.);
    vec4 image = texture2D(u_image, coord);
    
    // color = image.rgg;

    color = mix(color, image.rgg, image.a);

    gl_FragColor=vec4(color, 1.);
}