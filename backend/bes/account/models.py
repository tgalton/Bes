# bes/account/models.py
from django.db import models
from django.contrib.auth.models import User
from housework.models import House


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
    :param avatar: The attached avatar. 
    :type user: models.ForeignKey
    :type avatar: models.ImageField
    """
    def user_directory_path(instance, filename):
        # File will be uploaded to MEDIA_ROOT/user_<id>/<filename>
        return "user_{0}/{1}".format(instance.user.id, filename)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to=user_directory_path)

    def __str__(self):
        return self.user.username
