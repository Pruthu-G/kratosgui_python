#!/usr/bin/env python3
import rospy
import threading
import asyncio
from std_msgs.msg import Float64MultiArray
from websockets import serve
from rospy_message_converter import json_message_converter
import json
import logging
from typing import Any, Type

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
)

class websocket_module:
    def __init__(self, topic_name: str, message_type: Type[Any], port: int):
        # rospy.init_node("kratosgui")
        self.lock = threading.Lock()
        self.port = port
        self.latest_message = None
        self.async_loop = asyncio.new_event_loop()
        self.loop_thread = threading.Thread(target=self._run_event_loop, daemon=True)
        self.rossub = rospy.Subscriber(topic_name, message_type, self.callback)
        self.server = None
        self.is_shutting_down = False
        rospy.on_shutdown(self.on_shutdown)

    def _run_event_loop(self):
        """Sets up and runs the event loop in the new thread"""
        asyncio.set_event_loop(self.async_loop)
        self.async_loop.create_task(self.async_main())
        try:
            self.async_loop.run_forever()
        finally:
            try:
                # Cancel all running tasks
                pending = asyncio.all_tasks(self.async_loop)
                for task in pending:
                    task.cancel()
                
                # Allow tasks to respond to cancellation
                self.async_loop.run_until_complete(
                    asyncio.gather(*pending, return_exceptions=True)
                )
                
                # Cleanup
                self.async_loop.run_until_complete(self.async_loop.shutdown_asyncgens())
                self.async_loop.close()
            except Exception as e:
                rospy.logerr(f"Error during event loop cleanup: {e}")

    async def async_send(self, websocket, path):
        """Handles sending messages to WebSocket clients"""
        rospy.loginfo("New WebSocket connection established.")
        try:
            while not self.is_shutting_down:
                with self.lock:
                    if self.latest_message:
                        try:
                            data = json_message_converter.convert_ros_message_to_json(self.latest_message)
                            rospy.loginfo(f"Sending data: {data}")
                            await websocket.send(json.dumps(data, indent=2))
                            self.latest_message = None
                        except Exception as e:
                            rospy.logerr(f"Error converting/sending message: {e}")
                await asyncio.sleep(0.2)
        except asyncio.CancelledError:
            rospy.loginfo("WebSocket connection cancelled")
            raise
        except Exception as e:
            rospy.logerr(f"Error in async_send: {e}")
        finally:
            rospy.loginfo("WebSocket connection closed")

    async def async_main(self):
        """Main async function that starts the WebSocket server"""
        try:
            rospy.loginfo(f"Starting WebSocket server on ws://localhost:{self.port}")
            self.server = await serve(self.async_send, "localhost", self.port)
            rospy.loginfo("WebSocket server is now active.")
            
            # Keep the server running until shutdown
            while not self.is_shutting_down:
                await asyncio.sleep(1)
                
        except asyncio.CancelledError:
            rospy.loginfo("Main loop cancelled, shutting down server...")
            raise
        except Exception as e:
            rospy.logerr(f"Error in async_main: {e}")
        finally:
            if self.server:
                self.server.close()
                await self.server.wait_closed()
            rospy.loginfo("WebSocket server shut down.")

    def callback(self, msg):
        """Callback function for ROS subscriber"""
        if not self.is_shutting_down:
            rospy.loginfo(f"Received message: {msg}")
            with self.lock:
                self.latest_message = msg

    def on_shutdown(self):
        """Handles clean shutdown of the module"""
        rospy.loginfo("Initiating shutdown sequence...")
        self.is_shutting_down = True
        
        if self.async_loop is not None and self.async_loop.is_running():
            try:
                # Cancel all running tasks
                for task in asyncio.all_tasks(self.async_loop):
                    self.async_loop.call_soon_threadsafe(task.cancel)
                
                # Stop the event loop
                self.async_loop.call_soon_threadsafe(self.async_loop.stop)
                
                # Wait for the thread to finish
                if self.loop_thread.is_alive():
                    self.loop_thread.join(timeout=5)
                    if self.loop_thread.is_alive():
                        rospy.logwarn("Thread shutdown timed out after 5 seconds")
            
            except Exception as e:
                rospy.logerr(f"Error during shutdown: {e}")
        
        rospy.loginfo("Shutdown complete.")

def main():
    try:
        #rospy.init_node("kratosgui", anonymous=True)
        rospy.loginfo("ROS node initialized.")
        
        websocket_bridge = websocket_module("/random", Float64MultiArray, 8765)
        websocket_bridge.loop_thread.start()
        rospy.loginfo("Async loop thread started.")
        
        rospy.spin()
    
    except Exception as e:
        rospy.logerr(f"Error in main: {e}")
        raise

if __name__ == "__main__":
    main()