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
inpt = sys.stdin.read()
print('<b>Message Body: </b>{:}<br/>'.format(inpt))

print("</body>")
print("</html>")
