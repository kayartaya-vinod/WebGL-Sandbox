#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st,float pct){
    return smoothstep(pct-.02,pct,st.y)-
    smoothstep(pct,pct+.02,st.y);
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution;
    // float c=st.x;
    // float c=pow(st.x,5.);
    // float c=smoothstep(.1,.9,st.x);
    float c=clamp(st.x,0.,1.);
    vec3 color=vec3(c);
    
    float pct=plot(st,c);
    color=(1.-pct)*color+pct*vec3(0.,1.,0.);
    gl_FragColor=vec4(color,1.);
}
// to run this issue the following command from terminal:
// glslviewer ex03.frag

// to open the glslCanvas in VSCode,
// press cmd+shft+p and then type Show glslCanvas

