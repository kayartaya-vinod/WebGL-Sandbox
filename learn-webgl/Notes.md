* OpenGL - created in 1992
* Written in C
* WebGL is OpenGL on Browser
* https://caniuse.com/#search=webgl2
* vertex - In geometry, a vertex is a point where two or more curves, lines or edges meet. As a consequence of this definition, the point where two lines meet to form an angle and the corners of polygons and polyhedra are vertices.


## Steps involved in a WebGL program

* create vertexData
* create a buffer
* load vertexData into buffer
* create a vertex shader
* create a fragment shader
* create a program
* attach shaders to program
* enable vertex attributes
* draw


## notes continued...

* uniforms are global variables
* they have to be assigned in your Javascript after gl.useProgram(..)