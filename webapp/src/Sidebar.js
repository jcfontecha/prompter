// Sidebar.js
import React from 'react';

function Sidebar({ onDragStart }) {
  return (
    <div style={{ width: '200px', borderRight: '1px solid #ddd', padding: '10px' }}>
      <div
        draggable
        onDragStart={e => onDragStart(e, 'Node Type 1')}
      >
        Node Type 1
      </div>
    </div>
  );
}

export default Sidebar;
