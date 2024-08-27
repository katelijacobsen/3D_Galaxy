import * as THREE from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { HorizontalBlurShader } from "three/examples/jsm/shaders/HorizontalBlurShader";
import { VerticalBlurShader } from "three/examples/jsm/shaders/VerticalBlurShader";

// Set up the scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xff8cde, 0, 30);


//Create Texture for the sphere with image 
const texture = new THREE.TextureLoader().load( "/test_img.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

// Function to create a radial gradient texture (Background)
function createRadialGradientTexture() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas size. Make a 1:1 canvas first. 
  canvas.width = 512;
  canvas.height = 512;

  // Create radial gradient
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );

  // Define gradient colors
  gradient.addColorStop(0, "#F1DFE3");
  gradient.addColorStop(1, "#becef0");

  // Apply gradient to canvas. You already have defined the width and height in that case  you can just write canvas.height/width. 
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Create radial gradient background texture and set as scene background
scene.background = createRadialGradientTexture();

// Create our sphere; shape. Here you tell the size and how you want to define the material. This sphere is the one in the middle. The last units of the end are the ones that makes it round. 
const sphereGeometry = new THREE.SphereGeometry(2,54, 54);
const sphereMaterial = new THREE.MeshStandardMaterial({ map:texture, metalness:0.2, roughness:1 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
// Create our sphere; shape. You do the same.
const sphereGeometry2 = new THREE.SphereGeometry(0.5, 54, 54);
const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: "#0d3dc1", metalness:0.2, roughness:1 });
const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
sphere2.position.set(2, 1, 5); // Position the cube to the right of the sphere. Imagine it as the coordinates you want to place the sphere.
scene.add(sphere2);
// Create our sphere; shape
const sphereGeometry3 = new THREE.SphereGeometry(1, 54, 54);
const sphereMaterial3 = new THREE.MeshStandardMaterial({ color: "#ffffff", metalness:0.2, roughness:1 });
const sphere3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
sphere3.position.set(-7, -2, -2); // Position the cube to the right of the sphere
scene.add(sphere3);

// Create a cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6700CE" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//cube.position.set(15, 20, 0); // Position the cube to the right of the sphere

// Create a torus. Basically the rings around the sphere to make it look like a planet. 
const torusGeometry = new THREE.TorusGeometry(2.8, 0.1, 30, 500);
const torusMaterial = new THREE.MeshStandardMaterial({
  color: "#0d3dc1",
  metalness: 0.5,
  roughness: 0.2,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0, 0); // Position the torus to the left of the sphere
torus.rotation.set(2, 0, 0); // Position the torus to the left of the sphere
scene.add(torus);

// Create another torus
const torusGeometry2 = new THREE.TorusGeometry(3.5, 0.1, 30, 500);
const torusMaterial2 = new THREE.MeshStandardMaterial({
  color: "#0d3dc1",
  metalness: 0.5,
  roughness: 0.2,
});
const torus2 = new THREE.Mesh(torusGeometry2, torusMaterial2);
torus2.position.set(0, 0, 0);
torus2.rotation.set(2, 0, 0); // Position the torus to the left of the sphere
scene.add(torus2);
// Create another torus
const torusGeometry3 = new THREE.TorusGeometry(1.5, 0.05, 10, 8);
const torusMaterial3 = new THREE.MeshStandardMaterial({
  color: "#ffc800",
  metalness: 0.5,
  roughness: 0.2,
});
const torus3 = new THREE.Mesh(torusGeometry3, torusMaterial3);
torus3.position.set(-7, -2, -2);
torus3.rotation.set(5, 2, 0); // Position the torus to the left of the sphere
scene.add(torus3);

// Function to create a 3D star shape
function createStarShape(radius, innerRadius, numPoints) {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    const outerX = radius * Math.cos(i * step);
    const outerY = radius * Math.sin(i * step);
    const innerX = innerRadius * Math.cos((i + 0.5) * step);
    const innerY = innerRadius * Math.sin((i + 0.5) * step);

    if (i === 0) {
      shape.moveTo(outerX, outerY);
    } else {
      shape.lineTo(outerX, outerY);
    }
    shape.lineTo(innerX, innerY);
  }

  shape.closePath();
  return shape;
}

// Define the star. Here you need to create a function since it more of an complex object
function createStar(radius, innerRadius, numPoints, color, position) {
  const starShape = createStarShape(radius, innerRadius, numPoints);
  const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 100,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.025,
  };
  const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
  const starMaterial = new THREE.MeshStandardMaterial({ color: color, metalness:0.2, roughness:0.15 });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.set(position.x, position.y, position.z);
  scene.add(star);
  return star;
}

// How many stars do you want to add to the scene? Array.
const stars = [];
for (let i = 0; i < 49; i++) {
  //say how many you want to have on your index
  const position = {
    //positioning the stars
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 25,
    z: (Math.random() - 0.5) * 20,
  };
  //from here you create the shape of the star (define how the star should look like)
  const star = createStar(0.1, 0.17, 5, "#ffc800", position);
  stars.push(star);
}

//Define Star with an different shape
function createStar2(radius, innerRadius, numPoints, color, position) {
  const starShape2 = createStarShape(radius, innerRadius, numPoints);
  const extrudeStarSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 100,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.025,
  };

  const star2Geometry = new THREE.ExtrudeGeometry(
    starShape2,
    extrudeStarSettings
  );
  const starMaterial2 = new THREE.MeshStandardMaterial({ color: color, metalness:0.2, roughness:0.15 });
  const star2 = new THREE.Mesh(star2Geometry, starMaterial2);
  star2.position.set(position.x, position.y, position.z);
  scene.add(star2);
  return star2;
}
// How many stars do you want to add to the scene? Array.
const stars2 = [];
for (let i = 0; i < 50; i++) {
  //say how many you want to have on your index
  const position = {
    //positioning the stars
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 25,
    z: (Math.random() - 0.5) * 20,
  };
  //from here you create the shape of the star (define how the star should look like)
  const star2 = createStar2(0.1, 0.2, 4, "#43affd", position);
  stars2.push(star2);
}

// Define the size of your sphere
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Add Light to the scene
const light = new THREE.PointLight(0xff8cf5, 100, 100);
light.position.set(1, 3, 3); // X, Y, Z Coordinates //LeftRight / UpDown / FrontBack
scene.add(light);

// Add ambient light to reduce shadow contrast
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Camera: What we are looking at? Add Your const sizes
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 15;
scene.add(camera);

// Render with canvas (go to index HTML and add canvas with class)
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });

// Renderer it out. Define how big our canvas is. Also, include your const = sizes to your renderer
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);


//Add the glow
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.268, // strength
  0.5, // radius
   0.8 // threshold
);
composer.addPass(bloomPass);

//Add the blur pass (I set it to 0 for just comparing)
const hBlur = new ShaderPass(HorizontalBlurShader);
const vBlur = new ShaderPass(VerticalBlurShader);
hBlur.uniforms["h"].value = 0.0 / window.innerWidth;
vBlur.uniforms["v"].value = 0.0 / window.innerHeight;
composer.addPass(hBlur);
composer.addPass(vBlur);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false; // Prevents from moving
controls.enableZoom = false; // Prevents from zooming
controls.autoRotate = true; // Auto Spinning
controls.autoRotateSpeed = 1;

// Resize your object. This EventListener runs every time you drag the window's width
window.addEventListener("resize", () => {
  console.log(window.innerWidth);
  // Changeable sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera. ProjectionMatrix has been added due to updating the aspect ratio to ensure that the camera's projection is changeable.
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer. (Add the PixelRatio for maintaining the balance of the performance quality. Though it is not the most important part)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);

  // Update composer
  composer.setSize(sizes.width, sizes.height);
});

// Animation loop
const loop = () => {
  controls.update(); // Smooth Animation when moving w/controls

  // Rotate each object individually
  sphere.rotation.x += 0.002;
  sphere.rotation.y += 0.002;

  torus.rotation.x += 0.002;
  torus.rotation.y += 0.002;
  torus.rotation.z += 0.002;

  torus2.rotation.x += 0.007;
  torus2.rotation.y += 0.007;
  torus2.rotation.z += 0.007;

  torus3.rotation.x += 0.007;
  torus3.rotation.y += 0.007;
  torus3.rotation.z += 0.007;

  cube.rotation.x += 0.002;
  cube.rotation.y += 0.002;

  stars.forEach((star, index) => {
    star.rotation.x += 0.0002 * (index + 1);
    star.rotation.y += 0.0002 * (index + 1);
  });
  stars2.forEach((star, index) => {
    star.rotation.x += 0.0003 * (index + 1);
    star.rotation.y += 0.0003 * (index + 1);
  });

  composer.render();
  window.requestAnimationFrame(loop);
};
loop();

// Timeline (Compare it as keyframes)
const timeline = gsap.timeline({ defaults: { duration: 0.7 } });
const timeline2 = gsap.timeline({ defaults: { duration: 4 } });
timeline.fromTo(torus2.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // Each Objects = Keyframe
timeline.fromTo(torus.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // Each Objects = Keyframe
timeline.fromTo(sphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // Each Objects = Keyframe
timeline.fromTo(cube.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 }); // Each Objects = Keyframe
timeline2.fromTo("nav", { y: "100%" }, { y: "0%" });
timeline2.fromTo("h1", { opacity: 0 }, { opacity: 1 });

// Change Color
let mouseDown = false;
// Make an Array
let rgb = [];

window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      100,
    ];

    // Animation changing color when moving mouse
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(sphere.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

