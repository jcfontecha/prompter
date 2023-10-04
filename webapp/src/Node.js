// Node.js
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';  // Import icons

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

function Node({ node, handleEditing, handleAccept, handleDelete }) {
  const [mouseDownPosition, setMouseDownPosition] = useState(null);
  const [inputValue, setInputValue] = useState(node.content || '');
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {node.isEditing ? (
        <div>
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <input type="text" placeholder="Type here..." style={{ width: '80%', marginBottom: '10px' }} value={inputValue} onChange={handleInputChange} />
          </div>
          <div style={menuStyles}>
            <button style={buttonStyles}
              onClick={(e) => { e.stopPropagation(); handleAcceptClick(); }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FaCheck color="#aaa" />
            </button>
          </div>
        </div>
      ) : (
        <div>
            {node.content}

            {isHovered && (
              <div style={menuStyles}>
                <button style={buttonStyles}
                  onClick={(e) => { e.stopPropagation(); handleEditing(node.id); }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FaEdit color="#aaa" />
                </button>
                <button style={buttonStyles}
                  onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FaTimes color="#aaa" />
                </button>
              </div>
            )}
        </div>
      )}
    </motion.div>
  );
}

const nodeStyles = {
  padding: '8px',
  background: '#fff',
  borderRadius: '4px',
  position: 'absolute',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',  // Optional: adds a subtle shadow to the node
};

const menuStyles = {
  position: 'absolute',
  bottom: '0',
  right: '8px',
  display: 'flex',
  marginBottom: '-20px',  // Add this line to move the menu below the node
};

const buttonStyles = {
  background: 'white',
  border: 'none',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',  // Adds a small drop shadow
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
};

export default Node;
