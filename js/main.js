import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


let container;
let camera;
let renderer;
let scene;
let controls;
var uio;
// var valu;

var modelName = "gltf/empire1.glb";
const mixers = [];
const clock = new THREE.Clock();

var url = "https://api.countapi.xyz/hit/moviequiz-hello.enricmor.eu/visits";

fetch(url)
  .then(response => response.json())
  .then(data => null);

function init() {


  container = document.querySelector("#scene-container");

  // Creating the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#323238");

  createCamera();
  createLights();
  loadModels(modelName);
  createControls();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const fov = 60;
  // const aspect = container.clientWidth / container.clientHeight;
  const near = 0.01;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, 1, near, far);
  camera.position.set(4, 9, 12);
}

function createLights() {
  const mainLight = new THREE.DirectionalLight(0xffffff, 3);
  mainLight.position.set(-1, 10, -18);

  const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 5);
  scene.add(mainLight, hemisphereLight);
}

function loadModels(modelName) {
  const loader = new GLTFLoader();

  const onLoad = (result, position) => {
    const model = result.scene;
    // model.position.copy(position);
    model.scale.set(3, 3, 3);
    model

    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);

    var i;
    for (i = 0; i < result.animations.length; i++) {

      const animation = result.animations[i];
      const action = mixer.clipAction(animation);
      action.play();
    }

    scene.add(model);
   
  };

  const onProgress = (progress) => { };

  const modelPosition = new THREE.Vector3(0, 0, 2.5);

  loader.load(
    modelName,
    (gltf) => onLoad(gltf, modelPosition),
    onProgress
  );

}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaFactor = 2.2;
  // renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}


function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enableZoom = true;
  // controls.maxPolarAngle = 0.95;
  // controls.minPolarAngle = 0.95;
  controls.enablePan = true;
  controls.screenSpacePanning = false;
}

function update() {
  const delta = clock.getDelta();
  mixers.forEach((mixer) => mixer.update(delta));
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill(); ctx.stroke(); } 

function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;  
}


var raycaster = new THREE.Raycaster();
raycaster.radius = 0.1;
// var inpt = document.createElement('input');
// inpt.setAttribute("id","myInput");
// // inpt.setAttribute("onKeyPress","checkKey(event)");
// inpt.onkeypress = checkKey(event);
// function checkKey(e) {
//   if (e.keyCode == 13) {
//       var uio = document.getElementById('myInput').value;
//   }
// }

// document.getElementById("answer-input").appendChild(inpt);


function onMouseClick(event){
  // const inpt = document.createElement('input');
  // const batn = document.createElement('btn');

  // //First, we need to get the mouse coordinates
  // document.getElementById("answer-input").appendChild(inpt);
  // document.getElementById("answer-input").appendChild(batn);


  
  var mouse = new THREE.Vector2();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 -1;
  mouse.y = ( event.clientY / window.innerHeight ) * 2-1 ;
  
  //Next, we need to set the raycaster's ray to the mouse coordinates
  
  raycaster.setFromCamera( mouse, camera );
  
  //Now, we need to create an array of objects to test for intersection
  
  var intersects = raycaster.intersectObjects( scene.children, true );

 
  //Finally, we check if an intersection has been found and if so, we add the annotation text to the model
  console.log(intersects.length,"intersect len")
  if ( intersects.length >= 2 ) {
    // uio=inpt.textContent;
    // console.log(uio);
    // uio = "hsais";
    // if(batn.click()== true){
    var x = makeTextSprite(window.valu);
    var intersectionPoint = intersects[0].point;
    console.log(intersectionPoint);
    x.position.set(intersectionPoint.x,intersectionPoint.y,intersectionPoint.z);
    console.log(x.position);

    scene.add(x);
  
  
  }

  // model.position( intersects[ 0 ].point );
  // scene.add( text );
  // }
  
  }
function render() {
  renderer.render(scene, camera);


  

//Next, we need to add an event listener to detect mouse clicks

window.addEventListener('click', onMouseClick);

//Finally, we define a function to handle the mouse click event

}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);

// Quizz logic
document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("start-button").disabled = true;
  setTimeout(function () {
    if (screen.width > 400) {
      document.getElementById("tip").style.display = 'block';
    }
    document.getElementById("quiz").style.display = 'contents';
    document.getElementById("list-container").style.display = 'none';
    document.getElementById("canvas3d").style.display = 'block';

    document.getElementById("question").style.display = 'block';
    document.getElementById("description").style.display = 'none';
    document.getElementById("start-button").style.display = 'none';
    document.getElementById("author-button").style.display = 'none';
    document.getElementById("title-h1").style.display = 'none';
    document.getElementById("subtitle").style.display = 'none';
    document.getElementById("feedback-info").style.display = 'contents';
    // var batn = document.createElement('button');
    // batn.innerHTML= "label";
    // batn.setAttribute("id","batn");
  
    //First, we need to get the mouse coordinates
  
    // document.getElementById("answer-input").appendChild(batn);
    // document.getElementById("batn").addEventListener("click", () => {
    //   setTimeout(function () {
    //   uio = inpt.textContent},200);
    // });
    
    init();
  }, 2000);
});


document.getElementById("author-button").addEventListener("click", () => {
  document.getElementById("author-button").disabled = true;
  setTimeout(function () {
    if (screen.width > 400) {
      document.getElementById("tip").style.display = 'block';
    }
    document.getElementById("quiz").style.display = 'contents';
    document.getElementById("canvas3d").style.display = 'none';
    document.getElementById("list-container").style.display = 'block';
    
    document.getElementById("question").style.display = 'block';
    document.getElementById("description").style.display = 'none';
    document.getElementById("author-button").style.display = 'none';
    document.getElementById("tip").innerHTML = 'Select a model';
    document.getElementById("start-button").style.display = 'none';
    document.getElementById("title-h1").style.display = 'none';
    document.getElementById("subtitle").style.display = 'none';
    document.getElementById("feedback-info").style.display = 'contents';
    
    if( document.getElementById("author-button").disabled = true){
    document.getElementById("submit-text").placeholder = "Input a question";
    document.getElementById("hint").style.height = "150px";

    console.log(questions);
    var data = [];
    for (var i = 0; i < questions.length; i++) { 
      // console.log(questions[i]);
      data.push(questions[i].file); 
      // document.getElementById("hint").innerHTML = data[i];
      document.querySelector('#hint').innerHTML = '<ul><li>'+data.join('</li><li>')+'</li></ul>';
      // console.log(data)/
     }
    // const data = questions.[i]
    // document.getElementById("hint").innerHTML = "select a model";
     }

    init();
  }, 2000);
});

const questions = [
  { 'file': 'gltf/empire1.glb', 'hint-button': 'Sci-Fi movie where a fifty-foot gorilla goes on a rampage, destroying everything in his past and kidnapping a beautiful young actress in New York City.', 'hint': 'Name this organ', 'answers': ['heart', 'kong'] },
  { 'file': 'gltf/axe.glb', 'hint-button': 'Horror movie where Jack Nicholson descends into madness in an isolated hotel and tries to kill his family.', 'hint': '2. Movie from 1980', 'answers': ['shining', 'resplandor'] },
  { 'file': 'gltf/neuralyzer.glb', 'hint-button': 'Sci-Fi movie where Tommy Lee Jones and Will Smith work at an ultra-secret organization that patrols alien immigrants on Earth and protects the safety of ordinary citizens.', 'hint': '3. Movie from 1997', 'answers': ['men', 'black'] },
  { 'file': 'gltf/spinner1.glb', 'hint-button': 'Sci-Fi movie where Leonardo DiCaprio is a skilled thief, who is the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.', 'hint': '4. Movie from 2010', 'answers': ['inception', 'origen'] },
  { 'file': 'gltf/horse.glb', 'hint-button': 'Crime movie of a 1940s New York Mafia family that struggle to protect their empire from rival families as the leadership switches from the father.', 'hint': '5. Movie from 1972', 'answers': ['godfather', 'padrino'] },
  { 'file': 'gltf/ticket.glb', 'hint-button': 'A Tim Burton movie where an eccentric chocolatier launches a worldwide contest to select an heir to his candy empire.', 'hint': '6. Movie from 2005', 'answers': ['charlie', 'chocolate', 'factory', 'willy', 'wonka'] },
  { 'file': 'gltf/pottery.glb', 'hint-button': 'Romantic movie where a gunned lover comes back as a ghost in order to protect her girlfriend from danger.', 'hint': '7. Movie from 1990', 'answers': ['ghost'] },
  { 'file': 'gltf/steps_bevel.glb', 'hint-button': 'Fantasy movie where a British kid learns that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own.', 'hint': '8. Movie from 2001', 'answers': ['harry', 'potter', 'philosopher'] },
  { 'file': 'gltf/dead_head_bevel.glb', 'hint-button': 'Thriller by Brad Pitt and Morgan Freeman. A serial killer begins murdering people according to the seven deadly sins.', 'hint': '9. Movie from 1995', 'answers': ['se7en', 'seven', '7'] },
  { 'file': 'gltf/bed.glb', 'hint-button': 'Fantasy movie set in Middle-earth, the story tells of the Dark Lord Sauron who seeks the One Ring, which contains part of his soul, in order to return to power.', 'hint': '10. Movie from 2001', 'answers': ['lord', 'rings', 'fellowship', 'señor', 'anillos', 'comunidad'] },
  { 'file': 'gltf/unicorn.glb', 'hint-button': 'Sci-Fi movie where Harrison Ford is a retired cop in Los Angeles in 2019. L.A. has become a pan-cultural dystopia of corporate advertising, pollution and flying automobiles, as well as replicants, human-like androids with short life spans built by the Tyrell Corporation for use in dangerous off-world colonization.', 'hint': '11. Movie from 1982', 'answers': ['blade', 'runner'] },
  { 'file': 'gltf/potatoes.glb', 'hint-button': 'Black and white comedy where the main actor wrote, directed, produced, edited, starred in, and composed the music for most of his films.', 'hint': '12. Movie from 1925', 'answers': ['gold', 'rush', 'charlie', 'charles', 'chaplin'] },
  // { 'file': 'gltf/bone.glb', 'hint': '12. Movie from 1968', 'answers': ['space', 'odissey'] },
  // { 'file': 'gltf/platform8.glb', 'hint': '3. Movie from 2018', 'answers': ['platform', 'hoyo'] },
  // { 'file': 'gltf/spoon.glb', 'hint': '4. Movie from 1999', 'answers': ['matrix', 'reloaded', 'revolution'] },
]
var questions_count = 0;
var guessed = 0;
document.getElementById("submit-button").addEventListener("click", () => {

  var answer = document.getElementById("submit-text").value.toLowerCase().split(' ');

  var intersection = answer.filter(function (n) {
    return questions[questions_count]['answers'].indexOf(n) !== -1;
  });

  if (intersection.length > 0) {
    if (questions_count == questions.length - 1) {
      window.location.href = '/congrats.html?g=' + guessed.toString();
      // document.getElementById("guessed").innerHTML = guessed.toString();
    }

    document.getElementById("submit-button").disabled = true;


    document.getElementById("feedback").style.opacity = '1';
    document.getElementById("feedback").innerHTML = 'Great! Next question';
    document.getElementById("feedback").style.color = '#06D6A0';
    document.getElementById("feedback").style.borderStyle = 'solid';
    document.getElementById("feedback").style.color = '#06D6A0';
    document.getElementById("spinner").style.display = 'block';
    document.getElementById("scene-container").style.opacity = 0;
    document.getElementById("quiz2").style.opacity = 0;


    var url = "https://api.countapi.xyz/hit/moviequiz-q" + questions_count + ".enricmor.eu/visits"

    fetch(url)
      .then(response => response.json())
      .then(data => null);

    scene.clear();

    setTimeout(function () {
      document.getElementById("feedback").style.opacity = '0';

      questions_count += 1;
      guessed +=1
      document.getElementById("submit-text").value = '';
      document.getElementById("hint").innerHTML = questions[questions_count]['hint'];
      $('[data-toggle="tooltip"]').attr("data-original-title", questions[questions_count]['hint-button']);

      createLights();
      loadModels(questions[questions_count].file);
      createControls();
      document.getElementById("tip").style.display = 'none';
      document.getElementById("submit-button").disabled = false;
      document.getElementById("scene-container").style.opacity = 1;
      document.getElementById("spinner").style.display = 'none';
      document.getElementById("quiz2").style.opacity = 1;
    }, 2000);
  } else {
    document.getElementById("feedback").style.opacity = '1';
    document.getElementById("feedback").style.color = '#EF476F';
    document.getElementById("feedback").style.borderStyle = 'solid';
    document.getElementById("feedback").style.borderRadius = '#EF476F';
    document.getElementById("feedback").innerHTML = 'Oops, try again!';

  }
});

document.getElementById("nextquestion").addEventListener("click", () => {

    if (questions_count == questions.length - 1) {
      window.location.href = '/congrats.html?g=' + guessed.toString();
      // document.getElementById("guessed").innerHTML = guessed.toString();
    }

    document.getElementById("nextquestion").style.pointerEvents = 'none';


    document.getElementById("feedback").style.opacity = '1';
    document.getElementById("feedback").innerHTML = 'Skipping...';
    document.getElementById("feedback").style.color = '#F8FFE5';
    document.getElementById("feedback").style.borderStyle = 'solid';
    document.getElementById("spinner").style.display = 'block';
    document.getElementById("scene-container").style.opacity = 0;
    document.getElementById("quiz2").style.opacity = 0;


    var url = "https://api.countapi.xyz/hit/moviequiz-q" + questions_count + ".enricmor.eu/visits"

    fetch(url)
      .then(response => response.json())
      .then(data => null);

    scene.clear();

    setTimeout(function () {
      document.getElementById("feedback").style.opacity = '0';

      questions_count += 1;
      document.getElementById("submit-text").value = '';
      document.getElementById("hint").innerHTML = questions[questions_count]['hint'];
      $('[data-toggle="tooltip"]').attr("data-original-title", questions[questions_count]['hint-button']);

      createLights();
      loadModels(questions[questions_count].file);
      createControls();
      document.getElementById("tip").style.display = 'none';
      document.getElementById("nextquestion").style.pointerEvents = 'auto';
      document.getElementById("scene-container").style.opacity = 1;
      document.getElementById("spinner").style.display = 'none';
      document.getElementById("quiz2").style.opacity = 1;
    }, 2000);
});
