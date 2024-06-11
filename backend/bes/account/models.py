# bes/account/models.py
from django.db import models
from django.contrib.auth.models import User
from housework.models import House
from django.conf import settings
import os

class HouseScore(models.Model):
    """
    Object that represents the score for a given user and house.
    
    :param user: The user that own the score. 
    :param house: The attached house. 
    :param current_score: The score.
    :type user: models.ForeignKey
    :type house: models.ForeignKey
    :type current_score: models.CharField
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    current_score = models.IntegerField()
    
    def __str__(self):
        return self.house.name
    

# Pour surcharger la classe utilisateur : https://testdriven.io/blog/django-custom-user-model/
class UserProfile(models.Model):
    """
    Object that contains additional information about a given user.
    
    :param user: The user that own the profile. 
    :param avatar: The attached avatar or the path as a string. 
    :type user: models.ForeignKey
    :type avatar: models.FilePathField
    """

    def user_directory_path(instance, filename):
        # File will be uploaded to MEDIA_ROOT/user_<id>/<filename>
        return os.path.join("user_{0}".format(instance.user.id), filename)
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    avatar = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.user.username