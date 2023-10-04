import React from 'react';
import { motion } from 'framer-motion';

const nodeStyles = {
    padding: '8px',
    background: '#fff',
    borderRadius: '4px',
    position: 'absolute',
};

function Canvas() {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#f0f0f0' }}>
            <motion.div
                style={{ ...nodeStyles, left: '100px', top: '100px' }}
                initial={{ scale: 1 }}
                whileTap={{ scale: 1.1 }}  // Scale up slightly while dragging
                drag={true}  // This makes the node draggable
                dragMomentum={false}  // Disables the inertia effect
            >
                Node 1
            </motion.div>
            <motion.div
                style={{ ...nodeStyles, left: '200px', top: '200px' }}
                initial={{ scale: 1 }}
                whileTap={{ scale: 1.1 }}  // Scale up slightly while dragging
                drag={true}  // This makes the node draggable
                dragMomentum={false}  // Disables the inertia effect
            >
                Node 2
            </motion.div>
        </div>
    );
}

export default Canvas;
