//SCENE
const scene = new THREE.Scene();

//CAMERA
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;

//RENDER
const renderer	= new THREE.WebGLRenderer({
    antialias	: true
});

//BACKGROUND
// const loader = new THREE.TextureLoader();
//   const texture = loader.load(
//     '../img/Malaysia.jpeg',
//     () => {
//       const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
//       rt.fromEquirectangularTexture(renderer, texture);
//       scene.background = rt;
//     });


//STAR FIELD
starGeo = new THREE.Geometry();
for(let i=0;i<30000;i++) {
  star = new THREE.Vector3(
    Math.random() * 1000 - 300,
    Math.random() * 1000 - 300,
    Math.random() * 1000 - 300
  );
  star.velocity = 0;
  star.acceleration = 0.02;
  starGeo.vertices.push(star);
}

let sprite = new THREE.TextureLoader().load( '../img/star.png' );
let starMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.5,
  map: sprite
});

stars = new THREE.Points(starGeo,starMaterial);
scene.add(stars);


function animate1() {
  starGeo.vertices.forEach(point => {
    point.velocity += point.acceleration
    point.z -= point.velocity;
        
        
        if (point.z < -200) {
          point.z = 200;
          point.velocity = 0;
        }

  });

  starGeo.verticesNeedUpdate = true;
  stars.rotation.y +=0.006;

  renderer.render(scene, camera);
  requestAnimationFrame(animate1);
}

animate1();



//MOUSE EVENTS
const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 5, window.innerHeight / 2 );
document.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'wheel', onMouseWheel, false );
window.addEventListener( 'resize', onResize, false );



renderer.setSize(window.innerWidth, window.innerHeight);
// const bodycanvas = document.body.appendChild(renderer.domElement);
// document.getElementById("demo").innerHTML = bodycanvas;
document.body.appendChild(renderer.domElement);



//Shapes-----------------------------------------------

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )
const material = new THREE.MeshNormalMaterial({wireframe : false})
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere);
sphere.position.x = 40;



const geometry1 = new THREE.OctahedronGeometry(10,10,10,10)
const material1 = new THREE.MeshNormalMaterial({wireframe : true})
const sphere1 = new THREE.Mesh(geometry1, material1)
scene.add(sphere1);
sphere1.position.x = 0;


const geometry2 = new THREE.IcosahedronGeometry(10,0)
const material2 = new THREE.MeshNormalMaterial({wireframe : false})
const sphere2 = new THREE.Mesh(geometry2, material2)
scene.add(sphere2);
sphere2.position.x = -40;

//------------------------------------------------------

camera.position.z = 70;
const domEvents = new THREEx.DomEvents(camera, renderer.domElement)
let sphereClicked = true
const onDocumentMouseDown = (event) => {
    if (event.target == sphere && !sphereClicked){
        material.wireframe = true
        sphereClicked = true
    }
    else if (event.target == sphere1 && !sphereClicked){
        material1.wireframe = false
        sphereClicked = true
    }
    else if (event.target == sphere2 && !sphereClicked){
        material2.wireframe = true
        sphereClicked = true
    }
     else {
        material.wireframe = false
        material1.wireframe = true
        material2.wireframe = false
        sphereClicked = false
    }
        
}


//---------------------------------------------
function onMouseMove( event ) {

	mouse.x = ( event.clientX - windowHalf.x );
	mouse.y = ( event.clientY - windowHalf.x );

}

function onMouseWheel( event ) {

  camera.position.z += event.deltaY * 0.1; // move camera along z-axis

}

function onResize( event ) {

	const width = window.innerWidth;
	const height = window.innerHeight;
  
  windowHalf.set( width / 2, height / 2 );
	
  camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize( width, height );
				
}
//--------------------------------------

domEvents.addEventListener(sphere, 'mousedown', onDocumentMouseDown ,false )
domEvents.addEventListener(sphere1, 'mousedown', onDocumentMouseDown ,false )
domEvents.addEventListener(sphere2, 'mousedown', onDocumentMouseDown ,false )



// controls = new THREE.OrbitControls(camera, renderer.domElement)
// controls.minDistance = 1
// controls.maxDistance = 1000


const animate = () => {
    target.x = ( 1 - mouse.x ) * 0.001;
    target.y = ( 1 - mouse.y ) * 0.001;
  
    camera.rotation.x += 0.05 * ( target.y - camera.rotation.x );
    camera.rotation.y += 0.05 * ( target.x - camera.rotation.y );

    
    
    requestAnimationFrame(animate)
    


    // sphere.rotation.x += 0.02
    sphere.rotation.y += 0.1
    // sphere.rotation.z += 0.02

    sphere1.rotation.z += 0.02
    sphere1.rotation.x += 0.02
    sphere1.rotation.y += 0.02

    // sphere2.rotation.y += 0.02
    // sphere2.rotation.z += 0.02
    sphere2.rotation.x += 0.1

    // controls.update()
    renderer.render(scene, camera)
}

animate()