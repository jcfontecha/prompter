// Canvas.js
import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import Node from './Node';

function useNodeHandlers(setNodes) {
  const handleEditing = useCallback((id) => {
    setNodes(nodes => nodes.map(node =>
      node.id === id ? { ...node, isEditing: true } : node
    ));
  }, [setNodes]);

  const handleAccept = useCallback((id, completion) => {
    setNodes(nodes => nodes.map(node =>
      node.id === id ? { ...node, isEditing: false, content: completion } : node
    ));
  }, [setNodes]);

  return {
    handleEditing,
    handleAccept
  };
}

function Canvas() {
  const [nodes, setNodes] = useState([]);

  const nodeHandlers = useNodeHandlers(setNodes);

  const handleDragStart = (e, nodeType) => {
    // Your drag start logic here
  };

  const handleDrop = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newNode = {
      id: Math.random().toString(),
      x,
      y,
      content: 'New Node',
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onDragStart={handleDragStart} />
      <div
        style={{ flex: 1, position: 'relative', background: '#f0f0f0' }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {nodes.map(node => (
          <Node key={node.id} node={node} {...nodeHandlers} />
        ))}
      </div>
    </div>
  );
}

export default Canvas;
