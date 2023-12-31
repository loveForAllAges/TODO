from django.db import models


class Todo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    is_complete = models.BooleanField(default=False)
