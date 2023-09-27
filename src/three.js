import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import * as  dat from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050229);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.6
scene.add(ambientLight)

// Spot light
const mainSpotLight = new THREE.SpotLight(0xffffff, 0.8, 7, Math.PI * 1.1, 0.25, 1)
mainSpotLight.position.set(-2, 2, 2)
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

const main_key_words = ['5G/6G ', 'Sclicing ', 'Autonomus Computing  ', 'QoS ']
const secondary_key_words = ['DevOps ', 'Cloud ', 'Frontend ']

const text_material = new THREE.MeshStandardMaterial({
    color: 0xffffff
});
const create3DLetters = (text_material, words) => {
    const letters = []
    const loader = new FontLoader();
    loader.load('fonts/Ubuntu Mono_Regular.json', function (font) {
        words.forEach((word) => {
            for (let letter of word) {
                const letter_geometry = new TextGeometry(letter, {
                    font: font,
                    size: 0.1,
                    height: 0.005,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.01,
                    bevelOffset: 0,
                    bevelSegments: 5,
                });
                const letter_mesh = new THREE.Mesh(letter_geometry, text_material);
                letter_mesh.position.y = -.5
                scene.add(letter_mesh);
                letters.push(letter_mesh)
            }
        })
    });
    return letters;
}

const main_letters = create3DLetters(text_material, main_key_words);
const secondary_letters = create3DLetters(text_material, secondary_key_words);
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial({color: 0x2916F3})
material.roughness = 0.5
material.metalness = 0.3

const mini_sphere_material = new THREE.MeshStandardMaterial({color: 0xffffff})
mini_sphere_material.roughness = 0.5
mini_sphere_material.metalness = 0.3
// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// Objects
const big_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
let big_sphere_center = .8
const small_sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 32),
    material
)
scene.add(big_sphere, small_sphere)

for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 10; j++) {
        const mini_sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.01, 16, 16),
            mini_sphere_material
        )
        mini_sphere.position.x = -1 + 2 * i / 10
        mini_sphere.position.z = -1 + j / 2
        mini_sphere.position.y = -.2

        scene.add(mini_sphere)
    }

}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if (window.innerWidth < 425) {
        camera.position.y = 0.5
        big_sphere.position.y = -.5
        small_sphere.position.y = -.5
        big_sphere_center = 0
    } else {
        camera.position.y = 1
        big_sphere.position.y = 0
        small_sphere.position.y = 0
        big_sphere_center = .8
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
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


if (window.innerWidth < 425) {
    camera.position.y = 0.5
    big_sphere.position.y = -.5
    small_sphere.position.y = -.5
    big_sphere_center = 0
}

/**
 * Animate
 */
const clock = new THREE.Clock()
const spacing = 0.15
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    big_sphere.position.x = big_sphere_center + Math.cos(0.5 * elapsedTime) / 10 * Math.PI
    big_sphere.position.z = Math.sin(0.5 * elapsedTime) / 7 * Math.PI

    small_sphere.position.x = big_sphere.position.x + 1.2 * Math.cos(0.8 * elapsedTime)
    small_sphere.position.z = big_sphere.position.z - 1.5 * Math.sin(0.8 * elapsedTime)

    if (main_letters.length && secondary_letters.length) {
        main_letters.forEach((letter, index) => {
            letter.position.x = big_sphere.position.x + 0.54 * Math.cos(0.8 * elapsedTime - spacing * index)
            letter.position.z = big_sphere.position.z + 0.54 * Math.sin(0.8 * elapsedTime - spacing * index)
            letter.position.y = big_sphere.position.y

            letter.rotation.y = Math.PI / 2 - 0.8 * elapsedTime + spacing * index
        })
        secondary_letters.forEach((letter, index) => {
            letter.position.x = small_sphere.position.x + 0.27 * Math.cos(1 * elapsedTime - 1.8 * spacing * index)
            letter.position.z = small_sphere.position.z + 0.27 * Math.sin(1 * elapsedTime - 1.8 * spacing * index)
            letter.position.y = small_sphere.position.y

            letter.rotation.y = Math.PI / 2 - 1 * elapsedTime + 1.8 * spacing * index
        })
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()