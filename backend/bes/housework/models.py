import datetime
from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone
from django.conf import settings


class House(models.Model):
    """
    Object representing a shared place where people want to share houseworks.
    
    :param name: The place name (ex: Home, Holiday location, Grandma house, ...).
    :param users: The users who are sharing the place and associated houseworks.
    :param admin_user: The admin user.
    :param avatar: Name of the used avatar.
    :type name: models.CharField
    :type users: models.ManyToManyField
    :type admin_user: models.ForeignKey
    :type avatar: models.CharField
    """
    name = models.CharField(max_length=200)
    users = models.ManyToManyField(User)
    admin_user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='house_admin_set')
    avatar = models.CharField(max_length=200, blank=True, default=None, null=True)
    
    def __str__(self):
        return self.name

# L'expiration du token prend 7 jours
def default_expires_at():
    return timezone.now() + timezone.timedelta(days=7)

# Model pour gérer la création et l'acceptation d'invitation dans une house
class HouseInvitation(models.Model):
    """
    Model to manage the creation and acceptance of invitations to join a House.
    
    :param house: The house to which the invitation pertains.
    :param invited_by: The user who created the invitation.
    :param token: A unique UUID token used for invitation.
    :param created_at: The datetime when the invitation was created.
    :param expires_at: The datetime when the invitation expires.
    :type house: models.ForeignKey
    :type invited_by: models.ForeignKey
    :type token: models.UUIDField
    :type created_id: models.DateTimeField
    :type expires_id: models.DateTimeField
    """
    house = models.ForeignKey(House, on_delete=models.CASCADE, verbose_name='Related house')
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Inviting user')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, verbose_name='Unique invitation token')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Invitation creation date')
    expires_at = models.DateTimeField(default=default_expires_at, verbose_name='Invitation expiration date')

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Invitation to {self.house.name} by {self.invited_by.username}"



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
    :param action_date: The date when the log has been created.
    :param house: The place where something has been changed. 
    :type action_log: models.CharField
    :type action_date: models.DateField
    :type house: models.ForeignKey
    """
    action_log = models.CharField(max_length=500)
    action_date = models.DateField(auto_now_add=True)
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name_plural = "Histories"
        ordering = ["-action_date"]
    