// Cena 3D do topo: pérolas, um anel dourado e uma fita rosé que respondem ao mouse e à rolagem.
// Só é carregada quando o navegador tem WebGL; sem ele fica o fundo em CSS.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export async function iniciar(el, { reduzido, mouse }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  el.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, 0, 14);

  // ambiente para os reflexos: uma "sala" de painéis claros e quentes
  const pmrem = new THREE.PMREMGenerator(renderer);
  const sala = new THREE.Scene();
  sala.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0xf3e2d7, side: THREE.BackSide })));
  [[0xffffff, [0, 12, 0], [20, .5, 20]], [0xffe7c4, [-14, 2, 4], [.5, 10, 14]], [0xf2c1b4, [14, -2, -4], [.5, 10, 14]], [0xffffff, [0, 0, 14], [10, 6, .5]]]
    .forEach(([c, p, s]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(...s), new THREE.MeshBasicMaterial({ color: c })); m.position.set(...p); sala.add(m); });
  cena.environment = pmrem.fromScene(sala, .04).texture;

  const luz = new THREE.DirectionalLight(0xfff1e6, 1.6); luz.position.set(5, 8, 6); cena.add(luz);
  cena.add(new THREE.AmbientLight(0xf6dcd0, .5));

  const grupo = new THREE.Group(); cena.add(grupo);

  const perola = cor => new THREE.MeshPhysicalMaterial({ color: cor, roughness: .18, metalness: .05, clearcoat: 1, clearcoatRoughness: .08, iridescence: .6, iridescenceIOR: 1.3, sheen: 1, sheenColor: new THREE.Color(0xffe4d6) });
  const ouro = new THREE.MeshPhysicalMaterial({ color: 0xd8b073, metalness: 1, roughness: .22, clearcoat: .6 });
  const rose = new THREE.MeshPhysicalMaterial({ color: 0xd9a294, metalness: .85, roughness: .25, clearcoat: 1 });

  const esfera = new THREE.SphereGeometry(1, 64, 64);
  const objetos = [];
  const add = (malha, pos, escala, vel) => { malha.position.set(...pos); malha.scale.setScalar(escala); malha.userData = { base: new THREE.Vector3(...pos), vel, fase: Math.random() * 6.28 }; grupo.add(malha); objetos.push(malha); return malha; };

  add(new THREE.Mesh(esfera, perola(0xf1d4c7)), [3.2, .6, 0], 2.1, .6);
  add(new THREE.Mesh(esfera, perola(0xfaf0ea)), [.9, -2.4, 1.5], .75, 1);
  add(new THREE.Mesh(esfera, perola(0xe7b9a9)), [5.6, -2.6, -1], .55, 1.3);
  add(new THREE.Mesh(esfera, ouro), [1.6, 2.9, -1.5], .42, 1.1);
  add(new THREE.Mesh(esfera, perola(0xf6e2d8)), [6.2, 2.8, -2], .9, .8);
  const anel = add(new THREE.Mesh(new THREE.TorusGeometry(1.6, .12, 32, 160), ouro), [3.2, .6, 0], 1.75, .3);
  anel.rotation.set(1.2, .3, 0);
  const fita = add(new THREE.Mesh(new THREE.TorusKnotGeometry(.8, .16, 220, 32, 2, 3), rose), [-.3, 1.9, -2.5], .8, .7);

  // brilhos
  const qtd = 140, pos = new Float32Array(qtd * 3);
  for (let i = 0; i < qtd; i++) { pos[i * 3] = (Math.random() - .3) * 16; pos[i * 3 + 1] = (Math.random() - .5) * 10; pos[i * 3 + 2] = (Math.random() - .5) * 6; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const brilhos = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xc19a5b, size: .06, transparent: true, opacity: .8, depthWrite: false }));
  grupo.add(brilhos);

  const ajusta = () => {
    const w = el.clientWidth, h = el.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const estreito = w < 960;
    grupo.position.set(estreito ? -1.2 : 0, estreito ? 3.2 : 0, estreito ? -7 : 0);
    renderer.domElement.style.opacity = estreito ? '.38' : '1';
  };
  ajusta(); addEventListener('resize', ajusta);

  let mx = 0, my = 0, sx = 0, sy = 0, rolagem = 0;
  if (mouse) addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  addEventListener('scroll', () => { rolagem = Math.min(1.5, scrollY / innerHeight); }, { passive: true });

  let visivel = true, raf = 0;
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel && !raf && !reduzido) raf = requestAnimationFrame(quadro); }).observe(el);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visivel && !raf && !reduzido) raf = requestAnimationFrame(quadro); });

  const relogio = new THREE.Clock();
  function quadro() {
    raf = 0;
    const t = relogio.getElapsedTime();
    sx += (mx - sx) * .05; sy += (my - sy) * .05;
    objetos.forEach(o => {
      const { base, vel, fase } = o.userData;
      o.position.x = base.x + Math.sin(t * .4 * vel + fase) * .15 + sx * vel * .8;
      o.position.y = base.y + Math.cos(t * .5 * vel + fase) * .22 - sy * vel * .6 + rolagem * vel * 1.2;
    });
    anel.rotation.z = t * .25; anel.rotation.x = 1.2 + sy * .5 + rolagem * .8;
    fita.rotation.x = t * .3; fita.rotation.y = t * .2;
    brilhos.rotation.y = t * .03; brilhos.position.y = rolagem * 1.5;
    grupo.rotation.y = sx * .25; grupo.rotation.x = sy * .12;
    renderer.render(cena, camera);
    if (visivel && !document.hidden && !reduzido) raf = requestAnimationFrame(quadro);
  }
  quadro();
}
