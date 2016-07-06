from src.track4U import Track4U
import json
from threading import Timer

INDEX_URL = 'https://student.apps.utah.edu/uofu/stu/ClassSchedules/main'
SEMESTER_NO = '1168';

tracker = Track4U(INDEX_URL, SEMESTER_NO)

def run():
  with open('requests.json') as req_json:
    reqs = json.load(req_json)
  tracker.query_seats(reqs)
  Timer(10, run).start()
  
run()
