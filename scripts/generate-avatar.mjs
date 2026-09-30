/** A procedural, unrigged stylized approximation of the supplied character.
 * Neutral PBR materials; no environment/background is embedded in the GLB.
 * Run: node scripts/generate-avatar.mjs
 */
import * as T from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFile } from 'node:fs/promises';

// GLTFExporter uses the browser FileReader API for its binary container.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => {this.result=result;this.onloadend?.();}); }
  readAsDataURL(blob) { blob.arrayBuffer().then(buffer=> {this.result=`data:${blob.type};base64,${Buffer.from(buffer).toString('base64')}`;this.onloadend?.();}); }
};
const root = new T.Group(); root.name='SekharAvatar';
const material = (color,roughness=.55,metalness=0) => new T.MeshStandardMaterial({color,roughness,metalness});
const skin=material('#df914e',.46),innerSkin=material('#c6783e',.63),hair=material('#201a17',.34),hairRidge=material('#302521',.42),shirt=material('#87b2f1',.7),shirtEdge=material('#709fe0',.7),white=material('#f7f4ed',.7),eye=material('#080e17',.1),tooth=material('#fffdf6',.3),mouth=material('#36120d',.8),tongue=material('#ce6250',.62),olive=material('#626b42',.75),metal=material('#bcc4c4',.25,.8),watchFace=material('#1e2724',.33,.2);
const sphereGeo=new T.SphereGeometry(1,40,28);
function ellipsoid(parent,name,mat,p,s){const o=new T.Mesh(sphereGeo,mat);o.name=name;o.position.set(...p);o.scale.set(...s);parent.add(o);return o;}
function tube(parent,name,mat,points,radius=.025){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const o=new T.Mesh(new T.TubeGeometry(curve,32,radius,7,false),mat);o.name=name;parent.add(o);return o;}
function capsule(parent,name,mat,a,b,r1,r2=r1){const va=new T.Vector3(...a),vb=new T.Vector3(...b);const mesh=new T.Mesh(new T.CylinderGeometry(r1,r2,va.distanceTo(vb),32,1),mat);mesh.name=name;mesh.position.copy(va).add(vb).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vb.clone().sub(va).normalize());parent.add(mesh);ellipsoid(parent,name+'End',mat,a,[r2,r2,r2]);ellipsoid(parent,name+'Top',mat,b,[r1,r1,r1]);return mesh;}
function flatShape(parent,name,mat,draw,z,position=[0,0,0]){const shape=new T.Shape();draw(shape);const geo=new T.ShapeGeometry(shape,24);const o=new T.Mesh(geo,mat);o.name=name;o.position.set(...position);o.position.z+=z;parent.add(o);return o;}
// Lower body is cropped at the upper thighs for the reference's portrait framing.
ellipsoid(root,'Trousers',white,[0,-.12,0],[.50,.49,.30]);
for(const side of [-1,1]) ellipsoid(root,'UpperThigh',white,[side*.235,-.38,.02],[.257,.35,.29]);
tube(root,'TrouserSeam',material('#dddcd7',.85),[[0,.02,.302],[0,-.2,.302],[0,-.64,.25]],.007);
const profile=[new T.Vector2(0,-.57),new T.Vector2(.42,-.57),new T.Vector2(.47,-.52),new T.Vector2(.47,-.22),new T.Vector2(.50,.15),new T.Vector2(.56,.33),new T.Vector2(.53,.45),new T.Vector2(.38,.57),new T.Vector2(.20,.60),new T.Vector2(0,.6)];
const torso=new T.Mesh(new T.LatheGeometry(profile,64),shirt);torso.name='Shirt';torso.position.y=.66;torso.scale.z=.60;root.add(torso);
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
 ellipsoid(root,'SleeveFold',shirtEdge,[side*.64,.49,.04],[.193,.10,.195]);
 capsule(root,'Forearm',skin,[side*.64,.43,.045],[side*.48,.03,.15],.107,.12);
 ellipsoid(root,'HandInPocket',skin,[side*.46,.065,.16],[.115,.13,.1]);
 tube(root,'TrouserPocket',material('#dfdfda',.8),[[side*.45,.02,.253],[side*.38,-.11,.284],[side*.36,-.25,.283]],.009);
}
// Olive strap, round metal bezel, dial and hands on the character's left wrist.
const watch=new T.Group();watch.name='Watch';watch.position.set(.53,.22,.24);watch.rotation.z=-.35;root.add(watch);
ellipsoid(watch,'OliveStrap',olive,[0,0,-.08],[.137,.06,.135]);
const bezel=new T.Mesh(new T.CylinderGeometry(.105,.105,.036,40),metal);bezel.rotation.x=Math.PI/2;watch.add(bezel);
const dial=new T.Mesh(new T.CylinderGeometry(.088,.088,.041,40),watchFace);dial.rotation.x=Math.PI/2;dial.position.z=.012;watch.add(dial);
tube(watch,'HourHand',metal,[[0,0,.036],[-.03,.022,.036]],.004);tube(watch,'MinuteHand',metal,[[0,0,.036],[.024,.059,.036]],.003);
// Oversized head with a narrower jaw and a broad, rounded forehead.
const head=new T.Group();head.name='Head';head.position.set(0,1.40,0);root.add(head);
const headMeshGeo=new T.SphereGeometry(1,64,48);const pos=headMeshGeo.attributes.position;
for(let i=0;i<pos.count;i++){const y=pos.getY(i);const taper=y<0?1+y*.18:1;pos.setXYZ(i,pos.getX(i)*.70*taper,pos.getY(i)*.76,pos.getZ(i)*.61*(y<0?1+y*.07:1));}headMeshGeo.computeVertexNormals();
const headMesh=new T.Mesh(headMeshGeo,skin);headMesh.name='Face';headMesh.position.y=.67;head.add(headMesh);
for(const side of [-1,1]){
 ellipsoid(head,'Ear',skin,[side*.655,.61,-.015],[.165,.24,.12]);
 ellipsoid(head,'InnerEar',innerSkin,[side*.703,.61,.071],[.085,.15,.037]);
 tube(head,'EarFold',skin,[[side*.72,.52,.111],[side*.75,.61,.113],[side*.72,.70,.11],[side*.66,.67,.118]],.025);
 ellipsoid(head,'Eye',eye,[side*.25,.76,.544],[.147,.17,.107]);
 ellipsoid(head,'EyeHighlight',tooth,[side*.25-.042,.811,.645],[.033,.034,.012]);
 ellipsoid(head,'EyeSmallHighlight',tooth,[side*.25+.044,.715,.639],[.012,.012,.007]);
 tube(head,'Eyebrow',hair,[[side*.12,.98,.536],[side*.23,1.03,.515],[side*.35,1.025,.467],[side*.40,.985,.439]],.046);
}
ellipsoid(head,'Nose',skin,[0,.58,.635],[.104,.081,.105]);
for(const side of [-1,1])ellipsoid(head,'Nostril',innerSkin,[side*.049,.545,.72],[.019,.009,.008]);
// Smile follows the curved surface of the face instead of hovering in front.
function faceShape(name,mat,draw,offset=.014){const mesh=flatShape(head,name,mat,draw,0);const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,.61*Math.sqrt(Math.max(.05,1-(x/.69)**2-((y-.67)/.75)**2))+offset);}mesh.geometry.computeVertexNormals();return mesh;}
faceShape('Smile',mouth,s=>{s.moveTo(-.31,.45);s.quadraticCurveTo(0,.35,.31,.45);s.bezierCurveTo(.26,.17,-.24,.16,-.31,.45);s.closePath();},.018);
faceShape('Teeth',tooth,s=>{s.moveTo(-.267,.425);s.quadraticCurveTo(0,.355,.267,.425);s.lineTo(.239,.345);s.quadraticCurveTo(0,.287,-.239,.345);s.closePath();},.028);
faceShape('Tongue',tongue,s=>{s.moveTo(-.155,.245);s.quadraticCurveTo(0,.292,.155,.245);s.quadraticCurveTo(0,.177,-.155,.245);s.closePath();},.032);
const smilePoints=[[-.31,.45],[-.25,.29],[0,.205],[.25,.29],[.31,.45]].map(([x,y])=>[x,y,.61*Math.sqrt(Math.max(.05,1-(x/.69)**2-((y-.67)/.75)**2))+.02]);tube(head,'SmileLip',material('#e49b58',.56),smilePoints,.016);
// Dense layered curls. The front-facing coils carry the reference's silhouette.
ellipsoid(head,'HairMass',hair,[0,1.18,-.08],[.755,.52,.66]);
ellipsoid(head,'BackHair',hair,[0,.79,-.31],[.665,.65,.40]);
let seed=61;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
for(let i=0;i<62;i++){
 const phi=random()*Math.PI*2,cosTheta=.05+random()*.95,sinTheta=Math.sqrt(1-cosTheta*cosTheta);
 const x=.74*sinTheta*Math.cos(phi),y=1.11+.49*cosTheta,z=-.055+.63*sinTheta*Math.sin(phi);
 if(z>.25&&y<1.21) continue;
 const size=.10+random()*.07;
 const curl=ellipsoid(head,'HairCurl',hair,[x,y,z],[size*1.25,size*.80,size]);curl.rotation.set(random()*1.7,random()*2,random()*3);
}
for(let row=0;row<3;row++)for(let col=0;col<6;col++){
 const x=(col-2.5)*.228+(row%2)*.04,y=1.05+row*.175+random()*.06,z=.39+(.12-row*.055)-Math.abs(x)*.18;
 const r=.095+random()*.032,points=[];
 for(let j=0;j<=27;j++){const a=-.6+(j/27)*Math.PI*1.8;const rr=r*(1-j/36);points.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr,z+j*.0017]);}
 tube(head,'SculptedCurl',hair,points,.043);
 const ridge=points.map(([px,py,pz])=>[px,py+.008,pz+.033]);tube(head,'CurlRidge',hairRidge,ridge,.007);
}
for(const side of [-1,1]){
 ellipsoid(head,'TempleHair',hair,[side*.61,.91,.10],[.15,.27,.21]);
 tube(head,'SideCurl',hair,[[side*.68,1.12,.28],[side*.74,.99,.29],[side*.71,.86,.32],[side*.63,.92,.34],[side*.68,1.00,.35]],.057);
}
root.userData={description:'Procedural unrigged approximation inspired by the supplied character reference. Materials support neutral lighting on both light and dark backgrounds.',author:'Sekhar portfolio'};
const exporter=new GLTFExporter();
const result=await exporter.parseAsync(root,{binary:true,onlyVisible:true});
await writeFile(new URL('../public/sekhar-avatar.glb',import.meta.url),Buffer.from(result));
console.log(`Saved public/sekhar-avatar.glb (${Math.round(result.byteLength/1024)} KB)`);
