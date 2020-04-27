// Put your three.js codes below
(function() {
    // Prepare stage scene
    const scene = new THREE.Scene();

    // Add actors of this scene

    // Axes helper
    const axes = new THREE.AxesHelper( 20 );
    scene.add( axes );

    // Ground
    const planeGeometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true; 

    plane.rotation.x = -0.5 * Math.PI;
    plane.name = 'floor';
    scene.add( plane );
  
    // Add camera
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // Add PhysicsEngine
    const physicsEngine = new PhysicsEngine( scene, camera );
    physicsEngine.initialize();
    physicsEngine.mock( 10 );

    let groundShape = new CANNON.Plane();
    groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      material: physicsEngine.physicsMaterial
    });
    // setFromAxisAngle 旋轉 x 軸 -90 度
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    physicsEngine.world.add( groundBody );

    const world = physicsEngine.world;

    // Creeper
    let creeper = new Creeper( 0.19, 10, scene, world );

    // Add navigation tool
    const navTool = new NavigationTool( camera, physicsEngine.sphereBody );
    navTool.attach( scene );
  
    // Set up stage light
    // 設置環境光提供輔助柔和白光
    const ambientLight = new THREE.AmbientLight( 0x404040 );
    scene.add( ambientLight );

    // 點光源
    const pointLight = new THREE.PointLight( 0xf0f0f0, 1, 100 ); // 顏色, 強度, 距離
    pointLight.castShadow = true; // 投影
    pointLight.position.set( -30, 30, 30 );
    scene.add( pointLight );
  
    // Set up renderer
    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xeeeeee, 1.0 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
    document.body.appendChild( renderer.domElement );

    // Start rendering.
    function render() {
      requestAnimationFrame( render );

      navTool.update( scene, () => {
        physicsEngine.update( navTool );
        creeper.update();
      });
      renderer.render( scene, camera );
    }
  
    render();

    window.addEventListener( 'resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );
    });

    const animateBtn = document.getElementById( 'animate' );

    animateBtn.addEventListener( 'click', function() {
        creeper.toggleAnimate();
    });

  //  const rayHelper = new RayHelper();

  //   renderer.domElement.addEventListener( 'dblclick', function( event ) {
  //     rayHelper.detach( scene );

  //     const raycaster = new THREE.Raycaster();
  //     const mouse = new THREE.Vector2()
  
  //     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  //     mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  
  //     raycaster.setFromCamera( mouse.clone(), camera );
      
  //     rayHelper.attach( raycaster, scene );

  
  //     const intersects = raycaster.intersectObjects( creeper.children );
  
  //     console.log( intersects );
  
  //     const result = intersects[0];
  
  //     if( !result ) return;

  //     console.log( result );

  //     const hitPoint = result.point;
  //     const backVec = hitPoint.clone().add( raycaster.ray.direction.clone().setLength( 10000 ) );
  //     const backVecH = backVec.projectOnPlane( new THREE.Vector3( 0, 1, 0 ) );
  //     backVecH.normalize();

  //     const backwardVec = backVecH.multiplyScalar( 5 );
  //     const newPos = creeper.position.clone().add( backwardVec );
  //     creeper.position.set( newPos.x, newPos.y, newPos.z );
  // });

  const resetBtn = document.getElementById( 'reset' );
  resetBtn.addEventListener( 'click', function() {
    creeper.dispose();

    creeper = new Creeper( 0.19, 10, scene, world );
  });

})();