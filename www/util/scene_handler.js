var SceneObject = function(scene, camera) {

	var scene_id = 10;
	var static_objects = new Array();
	var dynamic_objects = new Array();
	var lightArray = new Array();
	var username;
	var light_count;
	
	var parent = new THREE.Object3D();
	var blinds_t1;
	var blinds_t2;
	var totalLuminosity;

	var createScene = function(room) {
		loadObjBuilding('./models/room.obj', './models/room.mtl');

		loadObjWithCoordinates('tv', 19, -20, 1, 0); 
		loadObjWithCoordinates('splitac', 19, -23, 15, 0);
		loadObjWithCoordinates('switch1', 20, -21, 15, 0);
		loadObjWithCoordinates('switch2', 20, -21, 15, 0);
		//loadObjWithCoordinates('switch3', 19, -23, -55, 0);

        loadStaticObjects(room);
        loadCalibrationLights();
        //loadObjects(room);
		
		
        return parent;
	}

    var loadStaticObjects = function(room) {
		//loadFloor(room);
	}

	var loadCalibrationLights = function() {
		
		var sphere = new THREE.CircleGeometry( 5.0, 32 );

		var entryLight = new THREE.PointLight( 0xffffff);
		entryLight.add( new THREE.Mesh( sphere.clone(), new THREE.MeshBasicMaterial( { color: 0x1C110A} ) ) );
		entryLight.position.y = 31.3;
		entryLight.position.z = 0;
		entryLight.position.x = 5;
		entryLight.intensity = 0.01;
		entryLight.rotation.x = Math.PI/2;
		entryLight.name="one";
 		scene.add(entryLight);
			
		var light3 = entryLight.clone();
		light3.position.y = 31.3;
		light3.position.z = 5;
		light3.position.x = 34;
		light3.intensity = 0.01;
		//scene.add(light3);
		
		var light4 = entryLight.clone();
		light4.position.y = 31.3;
		light4.position.z = 5;
		light4.position.x = -25;
		light4.intensity = 0.01;
		//scene.add(light4);
		
		
	}
    
    var loadObjBuilding = function(objModel, mtlModel) {
        /*var tex = new THREE.ImageUtils.loadTexture( './texture/plasterTexture.jpg' );
         tex.wrapS = THREE.RepeatWrapping;
         tex.wrapT = THREE.RepeatWrapping;
         tex.repeat.set( 8, 8 );*/
        
        var loader = new THREE.OBJMTLLoader();
        loader.load(objModel, mtlModel, function(object) {
                    object.position.x = 20;
                    object.position.y = -20;
					object.position.z = 0;

                    object.scale.set(10, 10, 10);
                    object.name="room";
                    object.matrixAutoUpdate = false;
                    object.updateMatrix();
		      /*for(var i=0;i<object.children.length;i++)
                     {
                         var object3d = object.children[i];
                         if(object3d instanceof THREE.Mesh){
				object3d.material.side = THREE.DoubleSide;
object3d.geometry.computeFaceNormals();
                     object3d.geometry.computeVertexNormals();
                     object3d.geometry.computeTangents();
                     object3d.geometry.computeBoundingSphere();
                         }
                     }*/

//Following is a TBD
//All Material should be moved to corresponding ShaderMaterial
//so that the load goes to GPU rather than CPU
/*object.traverse( function ( child ) {

    if ( child instanceof THREE.Mesh) {

if(!(child.material instanceof THREE.MeshLambertMaterial)){

var material = new THREE.ShaderMaterial( {

    uniforms: shader.uniforms,
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader

} );

        child.material = material;
}

    }

} );*/


                    /*for(var i=0;i<object.children.length;i++)
                     {
                     var object3d = object.children[i];
                     if(object3d instanceof THREE.Mesh){
                     //	object3d.material.color.setHSL(0.5,0.9,0.5);
                     if(object3d.material instanceof THREE.MeshLambertMaterial){
                     //console.log("Lambert "+object3d.material.name);
                     }
                     object3d.material.side = THREE.DoubleSide;
                     object3d.material.map = tex;
                     object3d.material.shininess = 1;
                     object3d.geometry.computeFaceNormals();
                     object3d.geometry.computeVertexNormals();
                     object3d.geometry.computeTangents();
                     object3d.geometry.computeBoundingSphere();
                     }else
                     if(object3d instanceof THREE.Object3D)
                     {
                     for(j=0;j<object3d.children.length;j++){
                     if(object3d.children[j].material instanceof THREE.MeshLambertMaterial){
                     //console.log("Lambert "+object3d.children[j].material.name);
                     }
                     //	object3d.children[j].material.color.setHSL(0.5,0.9,0.5);
                     object3d.children[j].material.side = THREE.DoubleSide;
                     object3d.children[j].material.map = tex;
                     object3d.children[j].geometry.computeFaceNormals();
                     object3d.children[j].geometry.verticesNeedUpdate = true;
                     object3d.name = "";
                     object3d.children[j].name = "outerwall"
                     
                     if(object3d.children[j].material instanceof THREE.MeshPhongMaterial)
                     {
                     object3d.children[j].material.shininess = 1;
                     if(object3d.children[j].material.map != null){
                     //object3d.children[j].material.map.minFilter = THREE.NearestFilter;
                     object3d.children[j].material.map.needsUpdate = true;
                     }
                     }
                     //console.log("changed");
                     }
                     }
                     
                     }*/
                    parent.add(object);
                    }, onProgress, onError);
        //camera.position.set(0,0,-15);
        //camera.rotation.set(0,0,0);
        document.getElementById('loader').style.display='none';
    }
    
    var loadObjGeneral = function(objModel, mtlModel) {
        //var tex = new THREE.ImageUtils.loadTexture( './model/dining/normal-chair2.png' );
        var objchild;
        var loader = new THREE.OBJMTLLoader();
        loader.load(objModel, mtlModel, function(object) {
                    object.position.x = -2.5;
                    object.position.y = -1.2;
                    object.rotation.y=-Math.PI/2;
                    object.scale.set(10, 10, 10);
                    object.matrixAutoUpdate = false;
                    object.updateMatrix();
                    /*for(var i=0;i<object.children.length;i++){
                     objchild = object.children[i];
                     if(objchild instanceof THREE.Mesh)
                     {
                     objchild.material.side = THREE.DoubleSide;
                     objchild.material.shiniess = 1;
                     //objchild.material.shading = THREE.SmoothShading;
                     //objchild.material.normalMap = tex;
                     
                     }else if (objchild instanceof THREE.Object3D){
                     for(var j=0;j<objchild.children.length;j++){
                     objchild.children[j].material.side = THREE.DoubleSide;
                     objchild.children[j].material.shininess = 1;
                     //objchild.children[j].material.shading = THREE.SmoothShading;
                     //objchild.children[j].material.normalMap = tex;
                     
                     }
                     }
                     }*/
                    parent.add(object);
                    });
    }
    
    var onProgress = function(){
        
    }
    var onError = function(){
        
    }
    
    var loadObjWithCoordinates = function(model,dx,dy,dz,rotation) {
        var loader = new THREE.OBJMTLLoader();
        loader.load('./models/'+model+'.obj', './models/'+model+'.mtl', function(object) {
                        object.position.x = dx;
                        object.position.y = dy;
                        object.position.z = dz;
                        object.rotation.y = rotation;
                        object.scale.set(10, 10, 10);
                        object.name = model;
                        //object.userData = model_type;
                        object.matrixAutoUpdate = false;
                        object.updateMatrix();/*
                        for(var i=0;i<object.children.length;i++){
                        objchild = object.children[i];
                        if(objchild instanceof THREE.Mesh)
                        {
                        objchild.material.side = THREE.DoubleSide;
                        objchild.material.shininess = 1;
                        }else if (objchild instanceof THREE.Object3D){
                        for(var j=0;j<objchild.children.length;j++){
                        objchild.children[j].material.side = THREE.DoubleSide;
                        objchild.children[j].material.shininess = 1;
                        }
                        }
                        }*/
                        parent.add(object);
                        console.log("New Object loaded "+model);
                        });
        }

	return {
		 scene_id : scene_id,
		 static_obj : static_objects,
		 dynamic_obj : dynamic_objects,
		 username : username,
		 light_count : light_count,
		 blinds_t1 : blinds_t1,
		 blinds_t2 : blinds_t2,
		 createScene : createScene
	}
}
