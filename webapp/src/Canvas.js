// Canvas.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

const nodeStyles = {
  padding: '8px',
  background: '#fff',
  borderRadius: '4px',
  position: 'absolute',
};

function Canvas() {
  const [nodes, setNodes] = useState([]);
  const [mouseDownPosition, setMouseDownPosition] = useState(null);

  const handleDragStart = (e, nodeType) => {
    // Optionally, you could store the node type being dragged
  };

  const handleDrop = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newNode = {
      id: Math.random().toString(),  // Generate a random ID (you'd want something more robust in a real app)
      x,
      y,
      content: 'New Node',
    };
    setNodes([...nodes, newNode]);
  };

  const handleEditing = (id) => {
    setNodes(nodes.map(node =>
      node.id === id ? { ...node, isEditing: true } : node
    ));
  };

  const handleAccept = (id) => {
    setNodes(nodes.map(node =>
      node.id === id ? { ...node, isEditing: false } : node
    ));
  };

  const handleMouseDown = (e) => {
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e, id) => {
    const mouseUpPosition = { x: e.clientX, y: e.clientY };
    const distanceMoved = Math.hypot(
      mouseUpPosition.x - mouseDownPosition.x,
      mouseUpPosition.y - mouseDownPosition.y
    );
    if (distanceMoved < 5) {
      handleEditing(id);
    }
    setMouseDownPosition(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onDragStart={handleDragStart} />
      <div
        style={{ flex: 1, position: 'relative', background: '#f0f0f0' }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}  // Necessary to allow onDrop to work
      >
        {nodes.map(node => (
          <motion.div
            style={nodeStyles}
            initial={{ x: node.x, y: node.y }}
            whileTap={{ scale: 1.1 }}  // Scale up slightly while dragging
            drag={true}  // This makes the node draggable
            dragMomentum={false}  // Disables the inertia effect
            onMouseDown={handleMouseDown}
            onMouseUp={(e) => handleMouseUp(e, node.id)}  // Pass node.id to handleMouseUp
          >
            {node.isEditing ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <input type="text" placeholder="Type here..." style={{ width: '80%', marginBottom: '10px' }} />
                <button onClick={(e) => { e.stopPropagation(); handleAccept(node.id); }}>Accept</button>
              </div>
            ) : (
              node.content
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Canvas;
