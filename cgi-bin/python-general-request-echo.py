#!/usr/bin/python3

print("Cache-Control: no-cache")
print("Content-type: text/html")
print()

import sys;
import cgi;
import os;
import urllib.parse

print("<html>")
print("<body>")

protocol = os.environ['SERVER_PROTOCOL']
method = os.environ['REQUEST_METHOD']
q_str = os.environ['QUERY_STRING']
inpt = sys.stdin.read()
print('<b>HTTP Protocol: </b>{:}<br/>'.format(protocol))
print('<b>HTTP Method: </b>{:}<br/>'.format(method))
print('<b>Query String: </b>{:}<br/>'.format(q_str))
print('<b>Message Body: </b>{:}<br/>'.format(inpt))
print("</body>")
print("</html>")
