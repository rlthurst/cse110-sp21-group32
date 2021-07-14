#!/usr/bin/python3

print("Cache-Control: no-cache")
print("Content-type: text/html")
print()

import sys;
import cgi;
import os;

print("<html><head><title>Environment Variables</title></head>")
print("<body><h1 align=center>Environment Variables</h1>")
print("<hr/>")

for param in os.environ.keys():
    print('<b>{:s}</b>: {:s}<br/>'.format(param, os.environ[param]))

print("</body>")
print("</html>")
