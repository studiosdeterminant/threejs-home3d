var container;
var camera, scene, renderer;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;
var parent;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var controls;
var ambient;

var raycaster;
var selectedObject; //Variable for storing the selected Object
var totalObjects = 0;	//----Total no. of objects in scene

var cameraControl;
var clock;

//var projector;
var mouse = { x: 0, y: 0, z: 0.5 };
var mouseNew = { x: 0, y: 0, z: 0.5 };
var ray;
var item_id;
var item_type;

var tcontrol;
var Transformcontrols = new Array();
var position = { x : 0, y: -1.2, z: 0 };
var target = { x : 0, y:-1.2, z: 0 };
var tween = null;

var rotatePressed = false;
var lightInstance = false;

var h, s, l;

var lightIntensity = 2.5;
var light_switch = { "OFF": 0, "ON": 1 };
var switch_state = light_switch.ON;

var SCENE_STATE = { "NONE": 0, "HOME": 1, "MENU": 2, "ITEM_ADD": 3, "TRANSFORM":4,"CUSTOMIZE":5 };
var currentState = SCENE_STATE.HOME;


var obstacles = [];
//var keyboard = new THREEx.KeyboardState();


var video, videoImage, videoImageContext, videoTexture;

var camStand;
var helper;
var wallSettings = false;
var stats;

var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;
var finalRotationY;

var rotationActive = false;
var keyPressed = false;

var VIEW_STATE = { "WALK": 0, "TOP": 1 };
var currentView = VIEW_STATE.WALK;

var composer;
var vignettePass;
var FXAAPass;
var bloomPass;
var rgbSplitPass;

var longitude = 0;
var latitude = 0;
var savedX;
var savedY;
var savedLongitude;
var savedLatitude;
var selectedObject = null;


//---------
var mouse3D, isMouseDown = false, onMouseDownPosition;
var radious = 50, theta = 45, onMouseDownTheta = 45, phi = 60, onMouseDownPhi = 60;
