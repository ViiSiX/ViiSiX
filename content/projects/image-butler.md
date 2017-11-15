+++
avatar = "image-butler.png"
project_url = "https://github.com/ViiSiX/ImageButler"
summary = "Simple image server built on Flask."
keywords = ["viisix", "flask", "image server"]
date = "2017-11-11T00:57:34+07:00"
title = "Image Butler"

+++

### What is Image Butler
It's a simple image server written based on Flask framework.

### Installation
Using pip

```bash
pip install ImageButler
```

### Configuration & Environment Variables

Create image_butler.conf referring following example:

```text
SQLALCHEMY_DATABASE_URI = 'sqlite:////<path-to-your>/ImageButler.db'
SERVER_NAME = 'image.local-domain:5000'
REDISLITE_PATH = '<path-to-your>/ImageButler.rdb'
REDISLITE_WORKER_PID = '<path-to-your>/workers.pid'
```

Export environment variables:

```bash
export FLASK_APP=imagebutler
export IMAGEBUTLER_CONFIGS=path/to/your/image_butler.conf
```

For others configuration please referring to documents of Flask, Flask-Login, Flask-SQLAlchemy... (please check requirements.txt).

### Usage

Please go to the [project's repository](https://github.com/ViiSiX/ImageButler) for more information.