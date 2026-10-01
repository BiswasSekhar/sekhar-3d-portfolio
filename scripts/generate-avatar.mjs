/** A procedural, unrigged stylized approximation of the supplied character.
 * Neutral PBR materials; no environment/background is embedded in the GLB.
 * Run: node scripts/generate-avatar.mjs
 */
import * as T from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// GLTFExporter uses the browser FileReader API for its binary container.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => {this.result=result;this.onloadend?.();}); }
  readAsDataURL(blob) { blob.arrayBuffer().then(buffer=> {this.result=`data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`;this.onloadend?.();}); }
};
const root = new T.Group(); root.name='BiswasHead';
const material = (color,roughness=.55,metalness=0) => new T.MeshStandardMaterial({color,roughness,metalness});
const skin=material('#d99462',.53),innerSkin=material('#bf794e',.63),hair=material('#201915',.30),hairRidge=material('#302521',.40),eye=material('#090e16',.12),tooth=material('#fffdf6',.3),mouth=material('#36120d',.8),tongue=material('#ce6250',.62);
const sphereGeo=new T.SphereGeometry(1,24,18);
function ellipsoid(parent,name,mat,p,s){const o=new T.Mesh(sphereGeo,mat);o.name=name;o.position.set(...p);o.scale.set(...s);parent.add(o);return o;}
function tube(parent,name,mat,points,radius=.025,segments=20,sides=6){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const o=new T.Mesh(new T.TubeGeometry(curve,segments,radius,sides,false),mat);o.name=name;parent.add(o);return o;}
// Export just the head; the app handles responsive positioning and scale.
// Sculpted face: broad forehead, soft cheeks, an oval jaw and gentle vertex blush.
const head=new T.Group();head.name='Head';head.position.set(0,1.40,0);root.add(head);
const headGeo=new T.SphereGeometry(1,48,32),positions=headGeo.attributes.position,colors=[];
for(let i=0;i<positions.count;i++){
 const u=positions.getX(i),v=positions.getY(i),w=positions.getZ(i);
 const width=.705*(v<0?1+v*.16:1-v*.018);
 const x=u*width,y=v*.775,z=w*.625;
 const front=Math.pow(Math.max(0,w),3);
 const cheeks=.041*Math.exp(-(((Math.abs(x)-.345)/.16)**2)-((y+.16)/.21)**2);
 const brow=.012*Math.exp(-(((y-.30)/.12)**2));
 positions.setXYZ(i,x,y,z+front*(cheeks+brow));
 const blush=front*.10*Math.exp(-(((Math.abs(x)-.37)/.15)**2)-((y+.18)/.17)**2);
 colors.push(1,1-blush*.40,1-blush*.55);
}
headGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));headGeo.computeVertexNormals();
const faceMat=skin.clone();faceMat.vertexColors=true;
const face=new T.Mesh(headGeo,faceMat);face.name='Face';face.position.y=.68;head.add(face);
for(const side of [-1,1]){
 ellipsoid(head,'Ear',skin,[side*.657,.59,-.008],[.163,.219,.120]);
 ellipsoid(head,'EarConcha',innerSkin,[side*.705,.595,.072],[.084,.139,.030]);
 tube(head,'EarHelix',skin,[[side*.683,.458,.098],[side*.755,.525,.101],[side*.757,.645,.102],[side*.704,.728,.097],[side*.654,.674,.103]],.020);
 ellipsoid(head,'EarTragus',skin,[side*.662,.56,.097],[.034,.047,.025]);
 // Smaller eyes sit naturally in the rounded face. Studio reflections provide catchlights.
 ellipsoid(head,'Eye',eye,[side*.250,.771,.570],[.123,.145,.071]);
 ellipsoid(head,'LowerLid',skin,[side*.250,.662,.562],[.128,.027,.030]);
 const browShape=new T.Shape();browShape.moveTo(side*.12,1.022);browShape.bezierCurveTo(side*.15,1.087,side*.285,1.089,side*.364,1.037);browShape.quadraticCurveTo(side*.40,1.005,side*.409,.986);browShape.bezierCurveTo(side*.31,1.016,side*.20,1.036,side*.12,1.022);
 const bGeo=new T.ExtrudeGeometry(browShape,{depth:.009,bevelEnabled:true,bevelSize:.010,bevelThickness:.007,bevelSegments:3,curveSegments:18});
 const bp=bGeo.attributes.position;for(let i=0;i<bp.count;i++){const x=bp.getX(i),y=bp.getY(i);bp.setZ(i,.625*Math.sqrt(Math.max(.05,1-(x/.705)**2-((y-.68)/.775)**2))+.019+bp.getZ(i));}bGeo.computeVertexNormals();
 const browMesh=new T.Mesh(bGeo,hair);browMesh.name='Eyebrow';head.add(browMesh);
}
ellipsoid(head,'NoseBridge',skin,[0,.664,.613],[.052,.115,.050]);
ellipsoid(head,'NoseTip',skin,[0,.582,.663],[.100,.066,.086]);
for(const side of [-1,1]){ellipsoid(head,'NoseWing',skin,[side*.066,.565,.655],[.046,.030,.048]);ellipsoid(head,'Nostril',innerSkin,[side*.052,.548,.703],[.017,.006,.008]);}
function surfaceZ(x,y){return .625*Math.sqrt(Math.max(.05,1-(x/.695)**2-((y-.68)/.775)**2))+.014;}
function faceShape(name,mat,draw,offset=.01){const shape=new T.Shape();draw(shape);const geo=new T.ShapeGeometry(shape,32),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,surfaceZ(x,y)+offset);}geo.computeVertexNormals();const mesh=new T.Mesh(geo,mat);mesh.name=name;head.add(mesh);return mesh;}
faceShape('Smile',mouth,s=>{s.moveTo(-.291,.434);s.quadraticCurveTo(0,.361,.291,.434);s.bezierCurveTo(.256,.164,-.244,.161,-.291,.434);s.closePath();},.012);
// Individual rounded teeth give the smile more depth than a flat white strip.
for(let i=0;i<8;i++){
 const a=-.238+i*.0595,b=a+.061,mid=(a+b)/2,top=.393+.37*mid*mid,bottom=.318+.36*mid*mid;
 faceShape('Tooth',tooth,s=>{s.moveTo(a,top);s.lineTo(b,top);s.lineTo(b,bottom+.014);s.quadraticCurveTo(mid,bottom-.008,a,bottom+.014);s.closePath();},.026);
}
faceShape('Tongue',tongue,s=>{s.moveTo(-.142,.240);s.quadraticCurveTo(0,.275,.142,.240);s.quadraticCurveTo(0,.192,-.142,.240);s.closePath();},.031);
const lowerLip=[[-.287,.425],[-.234,.294],[0,.201],[.234,.294],[.287,.425]].map(([x,y])=>[x,y,surfaceZ(x,y)+.019]);tube(head,'LowerLip',material('#db9464',.56),lowerLip,.014);
// Continuous swept curls, tapered tips and raised strand ridges replace the original rings.
const hairGroup=new T.Group();hairGroup.name='Hair';head.add(hairGroup);
const capGeo=new T.SphereGeometry(1,32,24),cp=capGeo.attributes.position;
for(let i=0;i<cp.count;i++){const x=cp.getX(i)*.758,z=cp.getZ(i)*.646-.070;let y=1.305+cp.getY(i)*.447;if(z>.05&&y<1.16)y=1.16+(y-1.16)*.13;cp.setXYZ(i,x,y,z);}capGeo.computeVertexNormals();
const cap=new T.Mesh(capGeo,hair);cap.name='HairCap';hairGroup.add(cap);
ellipsoid(hairGroup,'BackHair',hair,[0,.866,-.337],[.668,.551,.334]);
let seed=73;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
function sweepCurl(center,normal,size,turn){
 const n=new T.Vector3(...normal).normalize();
 const tangent=new T.Vector3(1,0,0).projectOnPlane(n).normalize();if(tangent.lengthSq()<.01)tangent.set(0,0,1).projectOnPlane(n).normalize();tangent.applyAxisAngle(n,turn);
 const bitangent=new T.Vector3().crossVectors(n,tangent).normalize(),base=new T.Vector3(...center),points=[];
 for(let i=0;i<=8;i++){const t=i/8,a=-.7+t*4.8,r=size*(1-.48*t);const point=base.clone().addScaledVector(tangent,Math.cos(a)*r).addScaledVector(bitangent,Math.sin(a)*r*.77).addScaledVector(n,.025+Math.sin(t*Math.PI)*size*.50+t*.040);points.push(point);}
 const curve=new T.CatmullRomCurve3(points),segments=24,sides=8,frames=curve.computeFrenetFrames(segments,false),verts=[],norms=[],indices=[];
 const at=(t,a,extra=0)=>{const index=Math.round(t*segments),p=curve.getPointAt(t);const r=size*.63*Math.pow(Math.sin(Math.PI*(.15+t*.84)),.60)*(1-t*.82)+.006;const u=frames.normals[index],v=frames.binormals[index];return p.addScaledVector(u,Math.cos(a)*(r+extra)).addScaledVector(v,Math.sin(a)*(r*.74+extra));};
 for(let i=0;i<=segments;i++)for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,p=at(i/segments,a);verts.push(p.x,p.y,p.z);const norm=frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i],Math.sin(a)).normalize();norms.push(norm.x,norm.y,norm.z);}
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('normal',new T.Float32BufferAttribute(norms,3));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new T.Mesh(geo,hair);mesh.name='SweptCurl';hairGroup.add(mesh);
 for(let ridge=0;ridge<2;ridge++){const angle=.1+ridge*1.16,ridgePoints=[];for(let i=0;i<=12;i++){const t=.05+i/12*.88;const p=at(t,angle,.002);ridgePoints.push([p.x,p.y,p.z]);}tube(hairGroup,'StrandRidge',hairRidge,ridgePoints,.0045,10,3);}
}
for(let i=0;i<70;i++){
 const a=random()*Math.PI*2,c=-.18+random()*1.15,s=Math.sqrt(1-c*c),x=.745*s*Math.cos(a),z=-.07+.63*s*Math.sin(a);let y=1.305+.443*c;
 if(z>.10&&y<1.18)y=1.18+random()*.04;
 const normal=[x/.758**2,(y-1.305)/.447**2,(z+.07)/.646**2];
 sweepCurl([x,y,z],normal,.14+random()*.042,random()*Math.PI*2);
}
// Larger flowing curls across the forehead, arranged as a varied wave rather than rows.
for(let i=0;i<8;i++){
 const x=(i-3.5)*.156,y=1.266+Math.sin(i*.93)*.038,z=.487-Math.abs(x)*.09;
 sweepCurl([x,y,z],[x*.3,.19,1],.145+random()*.042,-.9+random()*.8);
}
for(const side of [-1,1]){
 ellipsoid(hairGroup,'TempleHair',hair,[side*.628,.941,.105],[.118,.225,.148]);
 sweepCurl([side*.654,1.054,.274],[side*.7,.1,.7],.125,side*.8);
}
// Merge static head parts by material while retaining the head's turnable pivot.
root.updateMatrixWorld(true);
const inverseHead=head.matrixWorld.clone().invert(),groups=new Map();
head.traverse(node=>{if(node.isMesh){const parts=groups.get(node.material)??[];parts.push(node);groups.set(node.material,parts);}});
let mergedIndex=0;
for(const [mat,meshes] of groups){
 const geometries=meshes.map(mesh=>{const geometry=mesh.geometry.clone();geometry.applyMatrix4(inverseHead.clone().multiply(mesh.matrixWorld));geometry.deleteAttribute('uv');return geometry.index?geometry:mergeVertices(geometry);});
 const geometry=mergeGeometries(geometries,false);
 const mesh=new T.Mesh(geometry,mat);mesh.name='HeadSurface'+mergedIndex++;head.add(mesh);
 meshes.forEach(mesh=>mesh.removeFromParent());geometries.forEach(geometry=>geometry.dispose());
}
root.userData={description:'Lightweight head-only portrait with swept curls. Local stylized approximation of the reference; unrigged.',author:'Biswas portfolio',version:3};
const exporter=new GLTFExporter();
const result=await exporter.parseAsync(root,{binary:true,onlyVisible:true});
await mkdir(new URL('../public/models/',import.meta.url),{recursive:true});
await writeFile(new URL('../public/models/biswas-head-v3.glb',import.meta.url),Buffer.from(result));
console.log(`Saved public/models/biswas-head-v3.glb (${Math.round(result.byteLength/1024)} KB)`);
