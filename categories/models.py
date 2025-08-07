from django.db import models
from user.models import StoreKeeper

class ProductCategory(models.Model):
    storekeeper = models.ForeignKey(StoreKeeper, on_delete=models.CASCADE, related_name='categories')
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='categories/%Y/%m/%d/')

    def save(self, *args, **kwargs):
        if self.title:
            self.title = self.title.lstrip()
        if self.description:
            self.description = self.description.lstrip()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"
        db_table = "categories"
