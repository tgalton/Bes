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
    
    def __str__(self):
        return self.name


class HouseworkPossibleTask(models.Model):
    """
    Object representing a task that has to be done by people in a house.
    
    :param name: The task name (ex: Dishes, Cooking, ...).
    :param house: The place where the task has to be done. 
    :param duration: The time the task ordinary takes to be done. 
    :param difficulty: The difficulty of the task. 
    :type name: models.CharField
    :type house: models.ForeignKey
    :type duration: models.IntegerField
    :type difficulty: models.IntegerField
    """
    name = models.CharField(max_length=200)
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    duration = models.IntegerField()
    difficulty = models.IntegerField()
    
    def __str__(self):
        return self.name


class HouseworkMadeTask(models.Model):
    """
    Object representing a task that has been done by someone in a house.
    
    :param name: The task name (ex: Dishes, Cooking, ...).
    :param score: The evaluated value of the task.
    :param date: The date when the task has been done.
    :param duration: The time the task ordinary takes to be done. 
    :param difficulty: The difficulty of the task. 
    :param user: The person who has done the task.
    :param house: The place where the task has been done. 
    :type name: models.CharField
    :type score: models.IntegerField
    :type date: models.DateTimeField
    :type duration: models.IntegerField
    :type difficulty: models.IntegerField
    :type user: models.ForeignKey
    :type house: models.ForeignKey
    """
    name = models.CharField(max_length=200)
    score = models.IntegerField()
    date = models.DateTimeField()
    duration = models.IntegerField()
    difficulty = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name
    

class History(models.Model):
    """
    Object that keep trace of changes done by users.
    
    :param action_log: A log that explains who changes what.
    :param house: The place where something has been changed. 
    :type action_log: models.CharField
    :type house: models.ForeignKey
    """
    action_log = models.CharField(max_length=500)
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    