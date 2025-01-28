#!/usr/bin/env python3
import rospy
import websocket_module
from std_msgs.msg import Float64MultiArray
if __name__=="__main__":
    rospy.init_node("temperature",anonymous=True)
    socket_for_arm=websocket_module.websocket_module("/vitals",Float64MultiArray,8769)
    socket_for_arm.loop_thread.start()
    rospy.spin()