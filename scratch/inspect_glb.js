const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '../frontend/public/models/Business_Female_02_Facial.glb');

try {
  const data = fs.readFileSync(glbPath);
  const chunkLength = data.readUInt32LE(12);
  const jsonStr = data.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonStr);
  
  console.log('--- Nodes in GLTF ---');
  if (gltf.nodes) {
    gltf.nodes.forEach((node, index) => {
      console.log(`Node ${index}: Name: "${node.name || ''}", Mesh Index: ${node.mesh !== undefined ? node.mesh : 'none'}, Translation: ${JSON.stringify(node.translation)}, Scale: ${JSON.stringify(node.scale)}, Rotation: ${JSON.stringify(node.rotation)}`);
    });
  }

  console.log('\n--- Scenes in GLTF ---');
  if (gltf.scenes) {
    gltf.scenes.forEach((scene, index) => {
      console.log(`Scene ${index}: Name: "${scene.name || ''}", Nodes: ${JSON.stringify(scene.nodes)}`);
    });
  }

  console.log('\n--- Accessors/Buffers (checking Mesh bounding boxes if available) ---');
  if (gltf.meshes && gltf.meshes[0] && gltf.meshes[0].primitives && gltf.meshes[0].primitives[0]) {
    const prim = gltf.meshes[0].primitives[0];
    const posAccessorIndex = prim.attributes.POSITION;
    if (gltf.accessors && gltf.accessors[posAccessorIndex]) {
      const accessor = gltf.accessors[posAccessorIndex];
      console.log(`POSITION Accessor min: ${JSON.stringify(accessor.min)}, max: ${JSON.stringify(accessor.max)}`);
    }
  }

} catch (err) {
  console.error('Error:', err);
}
