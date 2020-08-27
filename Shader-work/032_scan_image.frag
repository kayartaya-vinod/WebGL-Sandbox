#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform sampler2D u_image;

float size=5.;
float speed=5.;
bool flip=false;

void main(){
    vec2 coord=gl_FragCoord.xy/u_resolution;
    vec3 color=vec3(1,0,0.);
    vec4 image=texture2D(u_image,coord);
    
    if(flip) {
        image.a=sin(floor(coord.x*size)-u_time*speed);
    }
    else {
        image.a=sin(floor(coord.x*size)-u_time*speed);
    }
    
    gl_FragColor=image;
}