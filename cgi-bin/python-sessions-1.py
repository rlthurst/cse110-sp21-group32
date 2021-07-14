#!/usr/bin/python3

print("Cache-Control: no-cache")
print("Content-type: text/html")
print()

import sys;
import cgi;
import os;
import requests

print("<html>")
print("<head><title>Python Sessions</title></head>\n")
print("<body>")
print("<h1>Python Sessions Page 1</h1>")
name = sys.stdin.read()
print(name)
s = requests.Session()
def sendUser():
    print('cringe')
 #   s.post('https://pageus.site/cgi-bin/python-sessions-2.py', name)



print("<br />")
print("<a onclick=\"sendUser()\" href=\"/cgi-bin/python-sessions-2.py\">Session Page 2</a>")
print("<br />")
print("<a href=\"/python-session.html\">Python CGI Form</a>")
print("<br /><br />")

print("<form action=\"/cgi-bin/python-destroy-session.py\" method=\"get\">")
print("<button type=\"submit\">Destroy Session</button>")
print("</form>")

print("</body>")
print("</html>")
