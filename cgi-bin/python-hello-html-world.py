#!/usr/bin/python3


print("Cache-Control: no-cache")
print("Content-type: text/html")
print()

from datetime import datetime;
import pytz
import sys;
import cgi;
import os;
print("<html>")
print("<head>")
print("<title>Hello, Python!</title>")
print("</head>")
print("<body>")

print("<h1>Rudy was here - Hello, Python!</h1>")
print("<p>This page was generated with Python</p>")

tz = pytz.timezone('America/Los_Angeles')
now = datetime.now(tz)
date = now.strftime("%m/%d/%Y %H:%M:%S")
print('<p>Current Time: {:}</p>'.format(date))
print('<p>Your IP Address: {:s}</p>'.format(os.environ['REMOTE_ADDR']))

print("</body>")
print("</html>")
