from pymongo import MongoClient


client = MongoClient('mongodb://localhost:27017/')
db = client.track4u
users = db.users
queries = db.queries

print queries.find({'subject': 'CS'}).count();
