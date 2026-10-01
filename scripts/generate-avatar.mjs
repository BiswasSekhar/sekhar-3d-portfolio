/** A procedural, unrigged stylized approximation of the supplied character.
 * Neutral PBR materials; no environment/background is embedded in the GLB.
 * Run: node scripts/generate-avatar.mjs
 */
import * as T from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// GLTFExporter uses the browser FileReader API for its binary container.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => {this.result=result;this.onloadend?.();}); }
  readAsDataURL(blob) { blob.arrayBuffer().then(buffer=> {this.result=`data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`;this.onloadend?.();}); }
};
const root = new T.Group(); root.name='SekharAvatar';
const material = (color,roughness=.55,metalness=0) => new T.MeshPhysicalMaterial({color,roughness,metalness,clearcoat:metalness ? .2 : .08,clearcoatRoughness:.4});
const skin=material('#d99462',.53),innerSkin=material('#bf794e',.63),hair=material('#201915',.30),hairRidge=material('#302521',.40),shirt=material('#8cafeb',.88),shirtEdge=material('#7399d5',.85),white=material('#f7f4ed',.7),eye=material('#090e16',.12),tooth=material('#fffdf6',.3),mouth=material('#36120d',.8),tongue=material('#ce6250',.62),olive=material('#626b42',.75),metal=material('#bcc4c4',.25,.8),watchFace=material('#1e2724',.33,.2);
const sphereGeo=new T.SphereGeometry(1,40,28);
function ellipsoid(parent,name,mat,p,s){const o=new T.Mesh(sphereGeo,mat);o.name=name;o.position.set(...p);o.scale.set(...s);parent.add(o);return o;}
function tube(parent,name,mat,points,radius=.025,segments=32,sides=7){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const o=new T.Mesh(new T.TubeGeometry(curve,segments,radius,sides,false),mat);o.name=name;parent.add(o);return o;}
function capsule(parent,name,mat,a,b,r1,r2=r1){const va=new T.Vector3(...a),vb=new T.Vector3(...b);const mesh=new T.Mesh(new T.CylinderGeometry(r1,r2,va.distanceTo(vb),32,1),mat);mesh.name=name;mesh.position.copy(va).add(vb).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vb.clone().sub(va).normalize());parent.add(mesh);ellipsoid(parent,name+'End',mat,a,[r2,r2,r2]);ellipsoid(parent,name+'Top',mat,b,[r1,r1,r1]);return mesh;}
function flatShape(parent,name,mat,draw,z,position=[0,0,0]){const shape=new T.Shape();draw(shape);const geo=new T.ExtrudeGeometry(shape,{depth:.009,steps:1,bevelEnabled:true,bevelSize:.010,bevelThickness:.008,bevelSegments:3,curveSegments:24});const o=new T.Mesh(geo,mat);o.name=name;o.position.set(...position);o.position.z+=z;parent.add(o);return o;}
// Lower body is cropped at the upper thighs for the reference's portrait framing.
ellipsoid(root,'Trousers',white,[0,-.12,0],[.50,.34,.30]);
for(const side of [-1,1]) {
 const leg=new T.Mesh(new T.CylinderGeometry(.253,.235,.55,40),white);
 leg.name='UpperThigh';leg.position.set(side*.235,-.39,.01);leg.scale.z=1.13;root.add(leg);
}
tube(root,'TrouserSeam',material('#dddcd7',.85),[[0,.02,.302],[0,-.2,.302],[0,-.64,.25]],.007);
const profile=[new T.Vector2(0,-.57),new T.Vector2(.42,-.57),new T.Vector2(.47,-.52),new T.Vector2(.47,-.22),new T.Vector2(.50,.15),new T.Vector2(.56,.33),new T.Vector2(.53,.45),new T.Vector2(.38,.57),new T.Vector2(.20,.60),new T.Vector2(0,.6)];
const smoothProfile = new T.CatmullRomCurve3(profile.map(p=>new T.Vector3(p.x,p.y,0))).getPoints(70).map(p=>new T.Vector2(Math.max(0,p.x),p.y));
const torso=new T.Mesh(new T.LatheGeometry(smoothProfile,80),shirt);torso.name='Shirt';torso.position.y=.66;torso.scale.z=.60;root.add(torso);
ellipsoid(root,'Neck',skin,[0,1.30,0],[.22,.38,.23]);
// Open shirt neck, placket, pointed collar, curved pocket and buttons.
flatShape(root,'OpenCollar',skin,s=>{s.moveTo(-.18,1.28);s.lineTo(.18,1.28);s.lineTo(0,.92);s.closePath();},.315);
for(const side of [-1,1]) {flatShape(root,'Collar',shirtEdge,s=>{s.moveTo(side*.20,1.31);s.lineTo(side*.37,1.17);s.lineTo(side*.21,.99);s.lineTo(side*.05,1.17);s.closePath();},.347);}
tube(root,'ShirtPlacket',shirtEdge,[[0,.93,.315],[0,.58,.316],[0,.22,.292],[0,.10,.26]],.018);
for(let i=0;i<5;i++){const y=.90-i*.17;ellipsoid(root,'Button',tooth,[.022,y,.332],[.029,.029,.011]);ellipsoid(root,'ButtonHole',shirtEdge,[.022,y,.345],[.006,.008,.002]);}
flatShape(root,'ChestPocket',shirt,s=>{s.moveTo(.20,.89);s.lineTo(.40,.89);s.lineTo(.39,.66);s.quadraticCurveTo(.30,.60,.21,.66);s.closePath();},.318);
tube(root,'PocketStitch',shirtEdge,[[.20,.89,.325],[.21,.68,.325],[.30,.635,.327],[.39,.68,.325],[.40,.89,.325]],.004);
tube(root,'PocketTop',shirtEdge,[[.20,.88,.327],[.30,.88,.337],[.40,.88,.32]],.008);
for(const side of [-1,1]){
 capsule(root,'Sleeve',shirt,[side*.49,1.02,0],[side*.64,.51,.04],.17,.22);
 ellipsoid(root,'SleeveFold',shirtEdge,[side*.64,.49,.04],[.185,.077,.181]);
 capsule(root,'Forearm',skin,[side*.64,.43,.045],[side*.49,.055,.095],.107,.12);
 ellipsoid(root,'HandInPocket',skin,[side*.455,.065,.05],[.104,.14,.088]);
 tube(root,'TrouserPocket',material('#dfdfda',.8),[[side*.45,.02,.253],[side*.38,-.11,.284],[side*.36,-.25,.283]],.009);
}
// Olive strap, round metal bezel, dial and hands on the character's left wrist.
const watch=new T.Group();watch.name='Watch';watch.position.set(.53,.22,.24);watch.rotation.z=-.35;root.add(watch);
ellipsoid(watch,'OliveStrap',olive,[0,0,-.08],[.137,.06,.135]);
const bezel=new T.Mesh(new T.CylinderGeometry(.105,.105,.036,40),metal);bezel.rotation.x=Math.PI/2;watch.add(bezel);
const dial=new T.Mesh(new T.CylinderGeometry(.088,.088,.041,40),watchFace);dial.rotation.x=Math.PI/2;dial.position.z=.012;watch.add(dial);
tube(watch,'HourHand',metal,[[0,0,.036],[-.03,.022,.036]],.004);tube(watch,'MinuteHand',metal,[[0,0,.036],[.024,.059,.036]],.003);
// Sculpted face: broad forehead, soft cheeks, an oval jaw and gentle vertex blush.
const head=new T.Group();head.name='Head';head.position.set(0,1.40,0);root.add(head);
const headGeo=new T.SphereGeometry(1,96,64),positions=headGeo.attributes.position,colors=[];
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
const capGeo=new T.SphereGeometry(1,64,40),cp=capGeo.attributes.position;
for(let i=0;i<cp.count;i++){const x=cp.getX(i)*.758,z=cp.getZ(i)*.646-.070;let y=1.305+cp.getY(i)*.447;if(z>.05&&y<1.16)y=1.16+(y-1.16)*.13;cp.setXYZ(i,x,y,z);}capGeo.computeVertexNormals();
const cap=new T.Mesh(capGeo,hair);cap.name='HairCap';hairGroup.add(cap);
ellipsoid(hairGroup,'BackHair',hair,[0,.866,-.337],[.668,.551,.334]);
let seed=73;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
function sweepCurl(center,normal,size,turn){
 const n=new T.Vector3(...normal).normalize();
 const tangent=new T.Vector3(1,0,0).projectOnPlane(n).normalize();if(tangent.lengthSq()<.01)tangent.set(0,0,1).projectOnPlane(n).normalize();tangent.applyAxisAngle(n,turn);
 const bitangent=new T.Vector3().crossVectors(n,tangent).normalize(),base=new T.Vector3(...center),points=[];
 for(let i=0;i<=8;i++){const t=i/8,a=-.7+t*4.8,r=size*(1-.48*t);const point=base.clone().addScaledVector(tangent,Math.cos(a)*r).addScaledVector(bitangent,Math.sin(a)*r*.77).addScaledVector(n,.025+Math.sin(t*Math.PI)*size*.50+t*.040);points.push(point);}
 const curve=new T.CatmullRomCurve3(points),segments=38,sides=12,frames=curve.computeFrenetFrames(segments,false),verts=[],norms=[],indices=[];
 const at=(t,a,extra=0)=>{const index=Math.round(t*segments),p=curve.getPointAt(t);const r=size*.63*Math.pow(Math.sin(Math.PI*(.15+t*.84)),.60)*(1-t*.82)+.006;const u=frames.normals[index],v=frames.binormals[index];return p.addScaledVector(u,Math.cos(a)*(r+extra)).addScaledVector(v,Math.sin(a)*(r*.74+extra));};
 for(let i=0;i<=segments;i++)for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,p=at(i/segments,a);verts.push(p.x,p.y,p.z);const norm=frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i],Math.sin(a)).normalize();norms.push(norm.x,norm.y,norm.z);}
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setAttribute('normal',new T.Float32BufferAttribute(norms,3));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new T.Mesh(geo,hair);mesh.name='SweptCurl';hairGroup.add(mesh);
 for(let ridge=0;ridge<4;ridge++){const angle=.1+ridge*.58,ridgePoints=[];for(let i=0;i<=18;i++){const t=.05+i/18*.88;const p=at(t,angle,.002);ridgePoints.push([p.x,p.y,p.z]);}tube(hairGroup,'StrandRidge',hairRidge,ridgePoints,.0045,16,4);}
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
// Merge each hair material into one mesh to keep the detailed hair inexpensive to draw.
for(const mat of [hair,hairRidge]){
 const meshes=hairGroup.children.filter(node=>node.isMesh&&node.material===mat),geometries=[];
 hairGroup.updateMatrixWorld(true);
 for(const mesh of meshes){const geo=mesh.geometry.clone();geo.applyMatrix4(mesh.matrix);geo.deleteAttribute('uv');geometries.push(geo);hairGroup.remove(mesh);}
 if(geometries.length){const merged=mergeGeometries(geometries,false);const mesh=new T.Mesh(merged,mat);mesh.name=mat===hair?'SculptedHair':'HairStrands';hairGroup.add(mesh);geometries.forEach(g=>g.dispose());}
}
// Fine cloth folds are geometric, so they remain visible while rotating.
for(const side of [-1,1]){
 tube(root,'CuffSeam',shirtEdge,[[side*.49,.55,.15],[side*.60,.56,.216],[side*.75,.53,.163]],.009);
 tube(root,'ShirtFold',shirtEdge,[[side*.22,.25,.283],[side*.31,.28,.269],[side*.40,.25,.23]],.006);
 tube(root,'ShirtHem',shirtEdge,[[side*.04,.106,.266],[side*.25,.102,.252],[side*.42,.122,.167]],.005);
}
root.userData={description:'Version 2: locally sculpted procedural portrait avatar, with continuous tapered curls, strand ridges, cheek shaping, individual teeth and smooth cloth surfaces. Inspired by the reference; unrigged.',author:'Sekhar portfolio',version:2};
const exporter=new GLTFExporter();
const result=await exporter.parseAsync(root,{binary:true,onlyVisible:true});
await mkdir(new URL('../public/models/',import.meta.url),{recursive:true});
await writeFile(new URL('../public/models/sekhar-v2.glb',import.meta.url),Buffer.from(result));
console.log(`Saved public/models/sekhar-v2.glb (${Math.round(result.byteLength/1024)} KB)`);
