import requests
from bs4 import BeautifulSoup
import json
from pymongo import MongoClient
from threading import Thread

class QuerySeat:
  def __init__(self, indexUrl, semesterNo):
    self.semesterNo = semesterNo
    self.baseUrl = indexUrl + '/' + semesterNo + '/'

  def connectDB(self):
    client = MongoClient('mongodb://localhost:27017/')
    self.db = client.track4u
    self.users = db.users
    self.queries = db.queries

# assume reqs is json with sub->cat->sect->email
  def query_seats(self, reqs):
    for subj, cat_sect_email in reqs.iteritems():
      for cat, sect_email in cat_sect_email.iteritems():
        subj_cat = subj + " " + cat
        url = self.seats_url_builder(subj, cat)
        # self.check_cat_sect_seats(subj_cat, sect_email, url, self.notify)
        Thread(target=self.check_cat_sect_seats, args=(subj_cat, sect_email, url, self.notify)).start()

  def notify(self, subj_cat, emails):
    for email, sects in emails.iteritems():
      print "nofitying users " + email + ', saying ' + subj_cat + ': ' + ' '.join(sects) + ' are available';


  # this function should be async with a callback
  def check_cat_sect_seats(self, subj_cat, sect_email, url, callback):
    print 'Entering ' + subj_cat
    soup = self.build_soup(url);
    table = soup.find('table', attrs={'class': 'main-table'})
    rows = table.find('tbody').find_all('tr')
    mailing_list = {}
    for row in rows:
      row_tds = row.find_all('td')
      sect = row_tds[3].get_text()
      avail_seats = int(row_tds[7].get_text())
      if sect in sect_email and avail_seats > 0:
        self.generate_mailling_list(sect_email[sect], sect, mailing_list)
    callback(subj_cat, mailing_list);


  def generate_mailling_list(self, emails, sect, mailing_list):
    for email in emails:
      if email not in mailing_list:
        mailing_list[email] = []
      mailing_list[email].append(sect);


  def build_soup(self, url):
    result = requests.get(self.baseUrl + url)
    return BeautifulSoup(result.content,'html.parser')

  def dump_json(self, tree_json, postfix):
    filename = 'data/' + self.semesterNo + postfix
    with open(filename, 'wb') as outfile:
      json.dump(tree_json, outfile)
    print "Dumped " + filename

  def seats_url_builder(self, subj, cat):
    return 'sections.html?subj=' + subj + '&catno=' + cat
