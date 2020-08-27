#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    // gl_FragColor = vec4(vec2(u_mouse), 0.5, 1.0);
    // gl_FragColor = vec4(abs(cos(u_time)), abs(sin(u_time)), 0.5, 1.0);

    vec2 st = gl_FragCoord.xy/u_resolution;
    if(st.x<.2) st.x = 0.0;
    if(st.x>.8) st.x = 0.0;
    if(st.y<.2) st.y = 0.0;
    if(st.y>.8) st.y = 0.0;

    gl_FragColor = vec4(st, 0.0, 1.0);
}
// to run this issue the following command from terminal:
// glslviewer ex03.frag

// to open the glslCanvas in VSCode,
// press cmd+shft+p and then type Show glslCanvas

