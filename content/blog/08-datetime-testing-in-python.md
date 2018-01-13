+++
title = "Datetime testing in Python"
feature_image_v_adjust = 12.5
feature_image = "/logo/python.png"
keywords = ["viisix", "viisix nghia", "viisix python test", "python datetime monkeypatch"]
summary = "How to do Unit Testing with Python functions related to current date time? This article will help you."
author = "Nghia Tr. Nguyen"
date = "2017-05-16T15:00:25+07:00"

+++

I have some trouble testing my Python functions because of their usage
of `datetime.datetime.now()` function. 
In this article mentioned our ways on how to do this kind of testing.

***If you have another solution for testing datetime? Let's us know :)***

Monkeypatch
-----------

Monkeypatch is a powerful tool. It help you to rewrite some functions
to return some special values that are being used by your tests. In this
case, we will use Monkeypatch to rewrite `datetime.datetime.now()` function
to return a specific timestamp.

First, we will create a fixture in the test folder, in `conftest.py` file

```python
import datetime
import pytest

@pytest.fixture
def freeze_datetime(monkeypatch):
    """Patch datetime.now function to return fixed timestamp."""
    original_datetime = datetime.datetime

    class FrozenDateTimeMeta(type):
        """Meta class for FrozenDateTime class."""
        def __instancecheck__(self, instance):
            return isinstance(instance, (original_datetime, FrozenDateTime))

    class FrozenDateTime(datetime.datetime):
        """Use freeze method to control result of datetime.datetime.now()."""
        __metaclass__ = FrozenDateTimeMeta

        @classmethod
        def freeze(cls, freezing_timestamp):
            """Freeze time at freezing_timestamp."""
            cls.frozen_time = freezing_timestamp

        @classmethod
        def now(cls, tz=None):
            """Return the frozen time."""
            return cls.frozen_time

    monkeypatch.setattr(datetime, 'datetime', FrozenDateTime)
    FrozenDateTime.freeze(original_datetime.now())
    return FrozenDateTime

```

Then, we use `freeze_datetime` like other testing fixtures. 
We will test it with a simple function. This function will
return the current datetime with 2 minutes fast.

```python
# Set fixed time at 2016-09-01 18:19:20.
FIXED_TIME = datetime.datetime(2016, 9, 1, 18, 19, 20)


def two_minutes_fast():
    """Return the current datetime with 2 minutes fast."""
    from dateutil.relativedelta import relativedelta
    return datetime.datetime.now() + relativedelta(minutes=2)


def test_ensure_fixed_datetime_work(freeze_datetime):
    """Test the patch_datetime_now fixture."""
    freeze_datetime.freeze(FIXED_TIME)
    assert datetime.datetime.now() == FIXED_TIME
    new_datetime = datetime.datetime(2016, 9, 1, 19, 20, 21)
    freeze_datetime.freeze(new_datetime)
    assert datetime.datetime.now() == new_datetime
    assert two_minutes_fast() == datetime.datetime(2016, 9, 1, 19, 22, 21)
```

Normal test
-----------

Sometime, you don't want to test with a special datetime value
but rather a current value. For example you may want to test the 
created time in a `User` object that will be written into database 
is current or not. We can test it with below code
 
```python
import datetime
import User

class TestUserModel(object):
    """ Unit tests for User class. """
    
    def test_should_add_new_users(self, fix_user_1):
        user_1 = User(fix_user_1)
        
        # Test code here
        datetime_now = datetime.datetime.now()
        datetime_delta_created_on = datetime_now - user_1.created_on
        assert round(datetime_delta_created_on.total_seconds()) == 0
    
```

That's it.
