import requests
from bs4 import BeautifulSoup
import json
from threading import Thread

class Track4U:
  def __init__(self, indexUrl, semesterNo):
    self.semesterNo = semesterNo;
    self.baseUrl = indexUrl + '/' + semesterNo + '/'

  # run once per semester
  def build_subj_cat_url(self):
    soup = self.build_soup('index.html');
    subj_list = soup.find_all('ul', attrs={'class': 'subject-list'})
    
    subj_url = {}
    for subj in subj_list:
      a = subj.find('a')
      subj_url[a.get_text()] = a['href']

    # subj_url = {'PRT' : 'class_list.html?subject=PRT'}

    print "Generated subj_url dict\n------------------------"
    subj_cat_url = {}
    threads = [Thread(self.multithread_fetch_cat_sect, (subj_cat_url, subj, url)) for subj, url in subj_url.iteritems()]
    [x.start() for x in threads]
    [x.join() for x in threads]
    
    self.dump_json(subj_cat_url, '_sects.json');
    return subj_cat_url

  def multithread_fetch_cat_sect(self, subj_cat_url, subj, url):
      cat_sects = self.fetch_cat_sect(subj, url)
      if isinstance(cat_sects, dict):
        subj_cat_url[subj] = cat_sects
      else:
        self.fetch_special_subj_cat(cat_sects, subj_cat_url)

  def fetch_cat_sect(self, subj, url):
    print "Entering the site of " + subj
    soup = self.build_soup(url);
    cat_table = soup.find('table', attrs={'id': 'classDetailsTable'})
    if cat_table is None:
      container = soup.find('div', attrs={'id': 'uu-skip-target'})
      a_s = container.find_all('a');
      return a_s;
    cat_rows = cat_table.find_all((lambda tag: tag.name == 'tr' 
      and (tag.get('class') == ['even'] or tag.get('class') == ['odd'])))
    print "  Fetched all cat rows"

    cat_sects = {}
    for row in cat_rows:
      row_tds = row.find_all('td')
      cat = row_tds[2].find('a').get_text()
      sect = row_tds[3].get_text()
      if cat not in cat_sects:
        cat_sects[cat] = []
      cat_sects[cat].append(sect)

    print "  Generated cat_sects dict"
    return cat_sects

  def fetch_special_subj_cat(self, a_s, subj_cat_url):
    for a in a_s:
      cat = a.get_text()
      url = a['href']
      subj_cat_url.setdefault(cat, []).append(self.fetch_cat_sect(cat, url[url.index('class_list'):]))

# ------------------------------------------------------------------------------------------
  

# ------------------------------- utils ----------------------------------------------------
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

# ------------------------------------------------------------------------------------------
  # def build_cat_sect(self, subj_cat_url):
  #   subj_cat_sect = {}
  #   for subj, cat_url in subj_cat_url.iteritems():
  #     cat_sect = {}
  #     for cat in cat_url:
  #       cat_sect[cat] = self.fetch_cat_sects(subj_cat_url[subj][cat])
  #     subj_cat_sect[subj] = cat_sect

  #   self.dump_json(subj_cat_sect, '_sects.json')
  #   return subj_cat_sect


  # def fetch_subj_cat(self, subj, url):
  #   print "Entering the site of " + subj
  #   soup = self.build_soup(url);
  #   cat_table = soup.find('table', attrs={'id': 'classDetailsTable'})
  #   if cat_table is None:
  #     container = soup.find('div', attrs={'id': 'uu-skip-target'})
  #     a_s = container.find_all('a');
  #     return a_s;
  #   cat_rows = cat_table.find_all((lambda tag: tag.name == 'tr' 
  #     and (tag.get('class') == ['even'] or tag.get('class') == ['odd'])))
  #   print "  Fetched all course number rows"

  #   cat_to_url = {}
  #   for row in cat_rows:
  #     row_tds = row.find_all('td')
  #     a = row_tds[2].find('a')
  #     cat_to_url[a.get_text()] = a['href']

  #   print "  Generated cat_to_url dict"
  #   return cat_to_url

  # def fetch_cat_sects(self, url):
  #   soup = self.build_soup(url);
  #   table = soup.find('table', attrs={'class': 'table'})
  #   rows = table.find_all('tr')
  #   sects = []

  #   for row in rows:
  #     row_tds = row.find_all('td')
  #     if len(row_tds) > 0:
  #       sects.append(row_tds[3].get_text())
  #   return sects;

