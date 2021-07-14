#!/usr/bin/python3

print("Cache-Control: no-cache")
print("Content-type: application/json")
print()

from datetime import datetime
import pytz
import sys
import cgi
import os
import json

tz = pytz.timezone('America/Los_Angeles')
now = datetime.now(tz)
date = now.strftime("%m/%d/%Y %H:%M:%S")
ip = os.environ['REMOTE_ADDR']

json_obj = {
    "message": "Hello World",
    "date": date,
    "CurrentIP": ip
}
result = json.dumps(json_obj)
print(result)
