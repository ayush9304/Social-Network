from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    profile_pic = models.ImageField(upload_to='profile_pic/', null=True)
    bio = models.TextField(max_length=160, null=True)
    cover = models.ImageField(upload_to='covers/', null=True)

    def __str__(self):
        return self.username

class Post(models.Model):
    creater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    date_created = models.DateTimeField(timezone.now)
    content_text = models.CharField(max_length=140)
    content_image = models.ImageField(upload_to='posts/', null=True)

    def __str__(self):
        return f"Post ID: {self.id} (creater: {self.creater})"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commenters')
    comment_content = models.TextField(max_length=90)
    comment_time = models.DateTimeField(timezone.now)

    def __str__(self):
        return f"Post: {self.post} | Commenter: {self.commenter}"
    
class Followers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    followers = models.ManyToManyField(User, blank=True, related_name='following')

    def __str__(self):
        return f"User: {self.user}"
    
class Likes(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likers')
    likers = models.ManyToManyField(User, blank=True, related_name='likes')

    def __str__(self):
        return f"Post[{self.post}]"
    