#!/usr/bin/env python3
import rospy
import websocket_module
from std_msgs.msg import Float64MultiArray
import config
if __name__=="__main__":
    rospy.init_node("npk")
    socket_for_arm=websocket_module.websocket_module(config.NPK.topic,Float64MultiArray,8766)
    socket_for_arm.loop_thread.start()
    rospy.spin()