from django.db import models
from django.contrib.auth.models import User


class House(models.Model):
    """
    Object representing a shared place where people want to share houseworks.
    
    :param name: The place name (ex: Home, Holiday location, Grandma house, ...).
    :param users: The users who are sharing the place and associated houseworks.
    :type name: models.CharField
    :type users: models.ManyToManyField
    """
    name = models.CharField(max_length=200)
    users = models.ManyToManyField(User)


class HouseworkPossibleTask(models.Model):
    """
    Object representing a task that has to be done by people in a house.
    
    :param name: The task name (ex: Dishes, Cooking, ...).
    :param score: The evaluated value of the task.  
    :param house: The place where the task has to be done. 
    :type name: models.CharField
    :type score: models.IntegerField
    :type house: models.ForeignKey
    """
    name = models.CharField(max_length=200)
    score = models.IntegerField()
    house = models.ForeignKey(House, on_delete=models.CASCADE)


class HouseworkMadeTask(models.Model):
    """
    Object representing a task that has been done by someone in a house.
    
    :param name: The task name (ex: Dishes, Cooking, ...).
    :param score: The evaluated value of the task.
    :param date: The date when the task has been done.
    :param user: The person who has done the task.
    :param house: The place where the task has been done. 
    :type name: models.CharField
    :type score: models.IntegerField
    :type date: models.DateTimeField
    :type user: models.ForeignKey
    :type house: models.ForeignKey
    """
    name = models.CharField(max_length=200)
    score = models.IntegerField()
    date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    house = models.ForeignKey(House, on_delete=models.CASCADE)