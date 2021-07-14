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
q_str = os.environ['QUERY_STRING']
print('<b>Query String: </b>{:}<br/>'.format(q_str))
parse_str = urllib.parse.parse_qs(q_str)
for keys in parse_str:
    print('{:}: {:}<br/>'.format(keys, parse_str[keys]))

print("</body>")
print("</html>")
