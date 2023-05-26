import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { Flow } from 'three/addons/modifiers/CurveModifier.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x04021C );


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.3
scene.add(ambientLight)

// Spot light
const mainSpotLight = new THREE.SpotLight(0xffffff, 0.8, 7, Math.PI * 0.1, 0.25, 1)
mainSpotLight.position.set(-2, 2, 0)
scene.add(mainSpotLight)

mainSpotLight.target.position.x = 0.8
scene.add(mainSpotLight.target)

// const spotLightHelper = new THREE.SpotLightHelper(mainSpotLight)
// scene.add(spotLightHelper)

const SpotLight2 = new THREE.SpotLight(0xffffff, 0.5, 2.5, Math.PI * 0.2, 0.25, 1)
SpotLight2.position.set(3, 0, -.5)
scene.add(SpotLight2)

// const spotLightHelper2 = new THREE.SpotLightHelper(SpotLight2)
// scene.add(spotLightHelper2)

const curveHandles = [];
// const initialPoints = [
//     { x: 0.3, y: 0, z: - 0.3 },
//     { x: 0.3, y: 0, z: 0.3 },
//     { x: - 0.3, y: 0, z: 0.3 },
//     { x: - 0.3, y: 0, z: - 0.3 },
// ];

// const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
// const boxMaterial = new THREE.MeshBasicMaterial();

// for ( const handlePos of initialPoints ) {

//     const handle = new THREE.Mesh( boxGeometry, boxMaterial );
//     handle.position.copy( handlePos );
//     curveHandles.push( handle );
//     // scene.add( handle );

// }

// const curve = new THREE.CatmullRomCurve3(
//     curveHandles.map( ( handle ) => handle.position )
// );

const elipse = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	1, 1,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	2 * Math.PI                // aRotation
);
// curve.curveType = 'centripetal';
// curve.closed = true;

const points = elipse.getPoints( 50 );
const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints( points ),
    new THREE.LineBasicMaterial( { color: 0x00ff00 } )
);
scene.add( line );

const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
const boxMaterial = new THREE.MeshBasicMaterial();

for ( const handlePos of points ) {

    const handle = new THREE.Mesh( boxGeometry, boxMaterial );
    handle.position.copy( handlePos );
    curveHandles.push( handle );
    // scene.add( handle );

}

const curve = new THREE.CatmullRomCurve3(
    curveHandles.map( ( handle ) => handle.position )
);


let flow, objectToCurve

const loader = new FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const geometry = new TextGeometry( 'Hello three.js!', {
            font: font,
            size: 0.2,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5,
        } );

        geometry.rotateX( Math.PI );
        geometry.rotateY( Math.PI );

        const material = new THREE.MeshStandardMaterial( {
            color: 0xffffff
        } );

        objectToCurve = new THREE.Mesh( geometry, material );

        flow = new Flow( objectToCurve );
        flow.updateCurve( 0, curve );
        scene.add( flow.object3D );
    } );

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial({ color: 0x2917F3 })
material.roughness = 0.5
material.metalness = 0.3
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Objects
const big_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const small_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    material
)
small_sphere.position.x = 1.3
small_sphere.position.z = .5

scene.add(big_sphere,small_sphere)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false;
controls.enablePan = false;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    big_sphere.rotation.y = 0.1 * elapsedTime
    big_sphere.position.x = .8 + Math.cos(0.5 * elapsedTime)/10*Math.PI
    big_sphere.position.z = Math.sin(0.5 * elapsedTime)/7*Math.PI

    small_sphere.rotation.y = 0.1 * elapsedTime
    small_sphere.position.x = 1.3 + Math.cos(1 * elapsedTime)/15*Math.PI
    small_sphere.position.z = .5 +Math.sin(1 * elapsedTime)/10*Math.PI
    if ( flow ) {
        flow.moveAlongCurve( 0.001 );
        // flow.object3D.position.x = big_sphere.position.x
        // flow.object3D.position.y = big_sphere.position.z
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()