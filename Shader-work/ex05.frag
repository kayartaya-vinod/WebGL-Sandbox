#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 p=gl_FragCoord.xy/u_mouse.xy;
    vec3 color=vec3(1.,0.,0.);
    
    // if(p.x<.5&&p.y<.5)color=vec3(1.0, 0.5686, 0.0);
    // if(p.x>.5&&p.y>.5)color=vec3(0.0745, 0.3255, 0.0745);
    // if(p.x<.5&&p.y>.5)color=vec3(0.1608, 0.6627, 0.8941);
    // if(p.x>.5&&p.y<.5)color=vec3(0.8314, 0.0, 1.0);
    
    // if(p.x>p.y)color=vec3(p,.0);
    // if(p.x<p.y)color=vec3(p,.0);
    
    gl_FragColor=vec4(p,0.,1.);
}
// to run this issue the following command from terminal:
// glslviewer ex03.frag

// to open the glslCanvas in VSCode,
// press cmd+shft+p and then type Show glslCanvas

