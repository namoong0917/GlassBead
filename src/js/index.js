import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const $result = document.getElementById("result");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  50,
  $result.clientWidth / $result.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 500);
camera.lookAt(1, 1, 1);

const renderer = new THREE.WebGLRenderer({
  canvas: $result,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setSize($result.clientWidth, $result.clientHeight);

// GlassBead
const ballGeo = new THREE.SphereGeometry(1, 64, 32);
const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  ior: 1.7, // 굴절률
  thickness: 0.2, // 두께 (클수록 유리뒷쪽이 왜곡되어보임)
  reflectivity: 1,
  specularIntensity: 1,

  // wireframe: true,

  transparent: true,
  opacity: 1,
  transmission: 1,
  envMapIntensity: 1,
});
console.log(material);
const glassBead = new THREE.Mesh(ballGeo, material);
scene.add(glassBead);
renderer.render(scene, camera); // scene 과 camera 정보를 담아 화면에 출력 연결

// 배경 관리
const loader = new RGBELoader().setPath("../../src/asset/");
// 배경
const bgTexture = loader.load("fireplace_4k.hdr", () => {
  const rt = new THREE.WebGLCubeRenderTarget(bgTexture.image.height);
  rt.fromEquirectangularTexture(renderer, bgTexture);
  scene.background = rt.texture;
});
// 도형 반사
loader.load("fireplace_4k.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

// 움직이게
// OrbitContorls
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 1;
controls.maxDistance = 8;
// controls.maxPolarAngle = Math.PI / 3;

controls.autoRotate = true;
controls.autoRotateSpeed = 1;

controls.enableDamping = true;

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// 반응형
window.addEventListener("resize", () => {
  // 1. 카메라의 종횡비
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // 카메라 속성 업데이트

  // 2. 렌더러의 크기
  renderer.setSize(window.innerWidth, window.innerHeight);
});
