// Node.js
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

async function fetchCompletion(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function Node({ node, handleEditing, handleAccept }) {
  const [mouseDownPosition, setMouseDownPosition] = useState(null);
  const [inputValue, setInputValue] = useState(node.content || '');

  const handleMouseDown = useCallback((e) => {
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseUp = useCallback((e) => {
    const mouseUpPosition = { x: e.clientX, y: e.clientY };
    const distanceMoved = Math.hypot(
      mouseUpPosition.x - mouseDownPosition.x,
      mouseUpPosition.y - mouseDownPosition.y
    );
    if (distanceMoved < 5) {
      handleEditing(node.id);
    }
    setMouseDownPosition(null);
  }, [handleEditing, mouseDownPosition, node.id]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleAcceptClick = async () => {
    const completion = await fetchCompletion(inputValue);
    handleAccept(node.id, completion);
  };

  return (
    <motion.div
      style={{ ...nodeStyles, width: node.width, height: node.height }}
      initial={{ x: node.x, y: node.y }}
      whileTap={{ scale: 1.1 }}
      drag={true}
      dragMomentum={false}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {node.isEditing ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <input type="text" placeholder="Type here..." style={{ width: '80%', marginBottom: '10px' }} value={inputValue} onChange={handleInputChange} />
          <button onClick={(e) => { e.stopPropagation(); handleAcceptClick(); }}>Accept</button>
        </div>
      ) : (
        node.content
      )}
    </motion.div>
  );
}

const nodeStyles = {
  padding: '8px',
  background: '#fff',
  borderRadius: '4px',
  position: 'absolute',
};

const resizeHandleStyles = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: '10px',
  height: '10px',
  backgroundColor: 'black',
  cursor: 'nwse-resize',
};

export default Node;
