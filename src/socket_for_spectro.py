#!/usr/bin/env python3
import rospy
import websocket_module
from std_msgs.msg import Float64MultiArray
import config
if __name__=="__main__":
    socket_for_spectro=websocket_module.websocket_module(config.SPECTRO.topic,Float64MultiArray,8768)
    socket_for_spectro.loop_thread.start()
    rospy.spin()