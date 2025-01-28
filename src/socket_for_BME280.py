#!/usr/bin/env python3
import rospy
import websocket_module
from sensor_msgs.msg import Joy
from std_msgs.msg import Float64MultiArray
if __name__=="__main__":
    socket_for_arm=websocket_module.websocket_module("/w8765",Float64MultiArray,8765)
    socket_for_arm.loop_thread.start()
    rospy.spin()