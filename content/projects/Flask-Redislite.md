+++
avatar = "flask-redislite.png"
project_url = "https://github.com/ViiSiX/FlaskRedislite"
summary = "A Flask extension that allows you to use Flask with Redislite. It can also help you using redis-collections and rq."
keywords = ["viisix", "flask", "redis", "redislite"]
date = "2017-11-08T09:40:23+07:00"
title = "Flask Redislite"
+++

### What is Flask-Redislite
Flask-Redislite is a [Flask](http://flask.pocoo.org) extension to integrate Flask with [Redislite](https://github.com/yahoo/redislite), 
also integrated with [redis-collections](https://redis-collections.readthedocs.io) and [rq](http://python-rq.org).

### Installation
Install Flask-Redislite using `pip`.
```bash
pip install Flask-Redislite
```

Choose the path for your Redislite `data` and `pid` file, then include to your application config.
```text
REDISLITE_PATH = '<path/to/redislite/file.rdb>'
REDISLITE_WORKER_PID = '<path/to/redislite/file.pid>'
```
Create new redis instance within your application
```python
from flask import Flask
from flask_redislite import FlaskRedis

app = Flask(__name__)

rdb = FlaskRedis(app)

@app.route("/")
def hello():
    rdb.connection.set('foo1', 'bar1')
    return rdb.connection.get('foo1')
    
```
### Get code

Please visit project's [Github repository](https://github.com/ViiSiX/FlaskRedislite).
