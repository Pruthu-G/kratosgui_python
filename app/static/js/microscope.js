// Initialize ROS connection
const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090' // Replace with your WebSocket URL
});

// Subscribe to the ROS Image topic
const imageTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/camera/image_raw', // Replace with your topic
    messageType: 'sensor_msgs/Image'
});

// Get the canvas element
const canvas = document.getElementById('rosCanvas');
const context = canvas.getContext('2d');

// Set the canvas size
// canvas.width = 320;  // Update this based on your image resolution
// canvas.height = 480; // Update this based on your image resolution

// Function to handle incoming image messages
imageTopic.subscribe((message) => {
    console.log('Received image message:', {
        width: message.width,
        height: message.height,
        encoding: message.encoding,
        dataLength: message.data.length
    });
    
    // Ensure canvas matches image dimensions
    canvas.width = message.width;
    canvas.height = message.height;
    
    const imageData = context.createImageData(message.width, message.height);
    const view = new Uint8Array(message.data);
    
    for (let i = 0; i < view.length; i += 3) {
        const j = (i / 3) * 4;
        imageData.data[j] = view[i + 2];     // Red   (BGR -> RGB)
        imageData.data[j + 1] = view[i + 1]; // Green
        imageData.data[j + 2] = view[i];     // Blue
        imageData.data[j + 3] = 255;         // Alpha
    }
    
    context.putImageData(imageData, 0, 0);
});
