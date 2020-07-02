var container, stats;
var camera, scene, renderer;
var depthMaterial, effectComposer, depthRenderTarget;
var ssaoPass;
var group;
var depthScale = 1.0;
var postprocessing = { enabled : false, renderMode: 0 };
var effectFXAA, dpr;

init();
animate();

//var isMobile = 'ontouchstart' in window;
//var pixelRatioScale = isMobile?.5:1;
//Initializing function
function init() {
	//document.getElementById("applicationLoading").style.display = "block";
	//Checking for WebGL support on Browser
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	
	clock = new THREE.Clock();

	container = document.createElement( 'div' );
	container.id='webglcanvas';
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
	//camera.target = new THREE.Vector3(0, 0, -120);
	camera.position.set(0,0,320);

	//MAIN SCENE
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0xffffff, 1000, 10000 );
	
	//ambient = new THREE.AmbientLight( 0x404040 );
	//scene.add( ambient );
	
	scene_obj = new SceneObject(scene, camera);
	parent = scene_obj.createScene(0);
	//parent.rotation.y=-Math.PI/2;
	scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
	scene.fog.color.setHSL( 0.6, 0, 1 );
	
	scene.add(parent);

	controls = createControls(camera);
	controls.enabled=true;

	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	//hemiLight.color.setHSL( 0.6, 1, 0.6 );
	//hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 30, 200, 0 );
	scene.add( hemiLight );

/*var vertexShader = document.getElementById( 'vertexShader' ).textContent;
				var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
				var uniforms = {
					topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
					bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
					offset:		 { type: "f", value: 33 },
					exponent:	 { type: "f", value: 0.6 }
				};
				uniforms.topColor.value.copy( hemiLight.color );
scene.fog.color.copy( uniforms.bottomColor.value );*/


	//var ambiLight = new THREE.AmbientLight( 0xffffff);
	//ambiLight.intensity = 0.01;
	//scene.add( ambiLight );

	//scene.add(camera);

//****************RENDERING*****************

	//projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();
	renderer = new THREE.WebGLRenderer({antialias:true});
	container.appendChild( renderer.domElement );
	//renderer.setPixelRatio( pixelRatioScale * window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight);
	//renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.setClearColor( 0xCCE6FF, 1 );
	renderer.gammaInput=true;
	renderer.gammaOutput=true;

	//renderer.setFaceCulling("back", "ccw");	
	
	/*	composer = new WAGNER.Composer( renderer, { useRGBA: false } );
		vignettePass = new WAGNER.Vignette2Pass();
		vignettePass.params.reduction = 2;
		FXAAPass = new WAGNER.FXAAPass();
		var bufferSize = isMobile?256:512;
		bloomPass = new WAGNER.MultiPassBloomPass( bufferSize, bufferSize );
		bloomPass.params.blurAmount = isMobile?.5:1;
		rgbSplitPass = new WAGNER.RGBSplitPass();
		rgbSplitPass.params.delta.set( pixelRatioScale * 20, pixelRatioScale * 20 );
		/*var sL = new ShaderLoader()
		sL.add( 'depth-vs', 'vertex-shaders/packed-depth-vs.glsl' );
		sL.add( 'depth-fs', 'fragment-shaders/packed-depth-fs.glsl' );
		sL.load();
		sL.onLoaded( function() {
			depthMaterial = new THREE.ShaderMaterial( {
				uniforms: {
					mNear: { type: 'f', value: camera.near },
					mFar: { type: 'f', value: camera.far }
				},
				vertexShader: this.get( 'depth-vs' ),
				fragmentShader: this.get( 'depth-fs' ),
				shading: THREE.SmoothShading
			} );
		} );*/

	// STATS
	/*stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement )*/

	/*onMouseDownPosition = new THREE.Vector2();

	document.addEventListener( 'dblclick', onDocumentDoubleClick, false );*/
	document.addEventListener( 'click', onDocumentClick, false );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	//document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	//document.addEventListener( 'keyup', onDocumentKeyUp, false );
	//controls = createControls(camera);
	//controls.enabled=true;
	//controls.target.set(-4.39,0.45,7.01);
	renderer.gammaInput=true;
	renderer.gammaOutput=true;
	//Window event
	window.addEventListener( 'resize', onWindowResize, false );

    initPostprocessing();
}

function initPostprocessing() {
    
    dpr = 1;
    if (window.devicePixelRatio !== undefined) {
        dpr = window.devicePixelRatio;
    }
    
				// Setup render pass
				var renderPass = new THREE.RenderPass( scene, camera );
    var effectBloom = new THREE.BloomPass( 1, 15, 2, 512 );
    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
    effectBloom.clear = true;
    
				// Setup depth pass
				var depthShader = THREE.ShaderLib[ "depthRGBA" ];
				var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
    
				depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader,
                                                         uniforms: depthUniforms, blending: THREE.NoBlending } );
    
				var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
				depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth*dpr, window.innerHeight*dpr, pars );
    
				// Setup SSAO pass
				ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
				ssaoPass.renderToScreen = true;
				//ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
				ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget;
				ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
				ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
				ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
				ssaoPass.uniforms[ 'onlyAO' ].value = ( postprocessing.renderMode == 1 );
				ssaoPass.uniforms[ 'aoClamp' ].value = 0.4;
				ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;
    
    
    effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth*dpr), 1 / (window.innerHeight*dpr));
    effectFXAA.renderToScreen = false;
    
    effectCopy.renderToScreen = false;
    
				// Add pass to effect composer
				effectComposer = new THREE.EffectComposer( renderer );
				effectComposer.addPass( renderPass );
    effectComposer.addPass( effectCopy );
    effectComposer.addPass( effectFXAA );
				effectComposer.addPass( ssaoPass );
    effectComposer.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
    effectComposer.addPass( effectBloom );

}

function onDocumentMouseDown( event ) {
	var target = event.target || event.srcElement;
	if(target.nodeName != 'CANVAS'){
		controls.enabled=false;
	}else{
		controls.enabled=true;
	}
}


function onDocumentClick( event ) {
	var target = event.target || event.srcElement;
	if(target.nodeName != 'CANVAS')
	{
		//controls.enabled=false;
		return;
	}
	//controls.enabled=true;
	switch (event.which) {
        case 1:
            //alert('Left Mouse button pressed.');
			var vector = new THREE.Vector3();
			vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
			vector.unproject( camera );
			raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );
			var intersects = raycaster.intersectObjects( scene.children , true);
			if ( intersects.length > 0 ) {
				if ((intersects[ 0 ].object.parent.parent.name != "")) {
					var name = intersects[ 0 ].object.parent.parent.name;
					switch(name){
						case "tv":
							hideAllControls();
							var check = true;//checkTvConfigAvailability();
							if(check){
								$('#tvControl').css("right", "0px");
							}else{
								$('#tvConfigPanel').css("left", "50%");
								check = true;
							}
							break;
						case "room":
							hideAllControls();
							break;
						case "splitac":
							hideAllControls();
							$('#containerAC').css("left", "10%");
							break;
						case "switch":
							break;
					}
				}
			}
	        break;
//--------------------------------------------------------------------------------------------------	            
        case 2:
            alert('Middle Mouse button pressed.');
            break;
//--------------------------------------------------------------------------------------------------
        case 3:
            //alert('Right Mouse button pressed.');
			var vector = new THREE.Vector3();
			vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
			vector.unproject( camera );
			raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );
			var intersects = raycaster.intersectObjects( scene.children , true);
			if ( intersects.length > 0 ) {
				if ((intersects[ 0 ].object.parent.parent.name != "")) {
					var name = intersects[ 0 ].object.parent.parent.name;
					/*switch(name){
						case "tv":
							//$('#tvControl').css("visibility", "visible");
							$('#tvControl').css("right", "0px");
							break;
						case "room":
							$('#acControl').slideUp(1000);
							$('#tvControl').css("right", "-1000px");
							break;
						case "splitac":
							$('#acControl').slideDown(1000);
							$('#acControl').css("visibility", "visible");
							break;
						case "switch":
							break;
					}*/
				}
			}
            break;
        default:
            alert('You have a strange Mouse!');
    }
}

function hideAllControls(){
	$('#tvControl').css("right", "-1000px");
	$('#acControl').css("bottom", "-1000px");
	$('#tvConfigPanel').css("left", "-300%");
}


$(document).ready(function(){

	$(function() {
		//FastClick.attach(document.body);
	});

});     

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	//cameraControl.handleResize();
}

function animate() {
	requestAnimationFrame( animate );
	//renderer.render( scene, camera );
	render();
	//keyupdate();
	//TWEEN.update();
	//stats.update();
	//controls.update();

}


function createControls(camera){   
  	cameraControl = new THREE.OrbitControls(camera);
    cameraControl.zoomSpeed = 5;
    cameraControl.enableZoom = true;
    cameraControl.enablePan = true;
	cameraControl.enableRotate = true;
	cameraControl.rotateSpeed = 0.5;
	//cameraControl.minPolarAngle =  Math.PI/2.7;
	//cameraControl.maxPolarAngle =  Math.PI-Math.PI/2.3;
	cameraControl.minDistance = 0;
	cameraControl.maxDistance = 80;
	//cameraControl.minAzimuthAngle = -Math.PI/7.5; // radians
	//cameraControl.maxAzimuthAngle = Math.PI/7.5; // radians
	
	cameraControl.addEventListener( 'change', render );
	return cameraControl;
}

function render() {

	//composer.reset();
	//composer.render( scene, camera );
		//composer.pass( vignettePass );	
		//composer.pass( rgbSplitPass );
		//composer.pass( bloomPass );
		//composer.pass( FXAAPass );
		//composer.toScreen();
    if ( postprocessing.enabled ) { 
		// Render depth into depthRenderTarget
		scene.overrideMaterial = depthMaterial;
		renderer.render( scene, camera, depthRenderTarget, true );

		// Render renderPass and SSAO shaderPass
		scene.overrideMaterial = null;
		effectComposer.render();
	} else {
		renderer.clear();
		renderer.render( scene, camera );
	}
}
