#ifdef GL_ES
precision mediump float;
#endif

void main(){
    vec3 aColor = vec3(0.3, 0.5, 0.5);
    gl_FragColor = vec4(aColor, 0.5);
}