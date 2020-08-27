#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_buffer0;
uniform sampler2D u_buffer1;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 v_texcoord;

#define ITERATIONS 9

float diffU=.25;
float diffV=.05;
float f=.1;
float k=.063;

float random(in float x){
    return fract(sin(x)*43758.5453123);
}

float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

void main(){
    vec2 st=v_texcoord;
    // st.y = 1.0 - st.y;
    
    #ifdef BUFFER_0
    // PING BUFFER
    //
    //  Note: Here is where most of the action happens. But need's to read
    //  te content of the previous pass, for that we are making another buffer
    //  BUFFER_1 (u_buffer1)
    vec2 pixel=1./u_resolution;
    
    float kernel[9];
    kernel[0]=.707106781;
    kernel[1]=1.;
    kernel[2]=.707106781;
    kernel[3]=1.;
    kernel[4]=-6.82842712;
    kernel[5]=1.;
    kernel[6]=.707106781;
    kernel[7]=1.;
    kernel[8]=.707106781;
    
    vec2 offset[9];
    offset[0]=pixel*vec2(-1.,-1.);
    offset[1]=pixel*vec2(0.,-1.);
    offset[2]=pixel*vec2(1.,-1.);
    
    offset[3]=pixel*vec2(-1.,0.);
    offset[4]=pixel*vec2(0.,0.);
    offset[5]=pixel*vec2(1.,0.);
    
    offset[6]=pixel*vec2(-1.,1.);
    offset[7]=pixel*vec2(0.,1.);
    offset[8]=pixel*vec2(1.,1.);
    
    vec2 texColor=texture2D(u_buffer1,st).rb;
    
    vec2 uv=st;
    float t=u_time;
    uv-=u_mouse/u_resolution;
    float pct=random(u_time);
    float srcTexColor=smoothstep(.999+pct*.0001,1.,1.-dot(uv,uv))*random(st)*pct;
    
    vec2 lap=vec2(0.);
    
    for(int i=0;i<ITERATIONS;i++){
        vec2 tmp=texture2D(u_buffer1,st+offset[i]).rb;
        lap+=tmp*kernel[i];
    }
    
    float F=f+srcTexColor*.025-.0005;
    float K=k+srcTexColor*.025-.0005;
    
    float u=texColor.r;
    float v=texColor.g+srcTexColor*.5;
    
    float uvv=u*v*v;
    
    float du=diffU*lap.r-uvv+F*(1.-u);
    float dv=diffV*lap.g+uvv-(F+K)*v;
    
    u+=du*.6;
    v+=dv*.6;
    
    gl_FragColor=vec4(clamp(u,0.,1.),1.-u/v,clamp(v,0.,1.),1.);
    
    #elif defined(BUFFER_1)
    // PONG BUFFER
    //
    //  Note: Just copy the content of the BUFFER0 so it can be
    //  read by it in the next frame
    //
    gl_FragColor=texture2D(u_buffer0,st);
    #else
    // Main Buffer
    vec3 color=vec3(0.);
    color=texture2D(u_buffer1,st).rgb;
    // color.r = 1.;
    
    gl_FragColor=vec4(color,1.);
    #endif
}