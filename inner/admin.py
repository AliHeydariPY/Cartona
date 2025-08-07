from django.contrib import admin
from .models import (
    Product, Images, Types, TypesValues,
    Features, FrequentlyAskedQuestions
)

# Inline برای Images
class ImageInline(admin.TabularInline):
    model = Images
    extra = 1

# Inline برای TypesValues
class TypesValuesInline(admin.TabularInline):
    model = TypesValues
    extra = 1

# Inline برای Types
class TypesInline(admin.StackedInline):
    model = Types
    extra = 1
    inlines = [TypesValuesInline]

# Inline برای Features
class FeaturesInline(admin.TabularInline):
    model = Features
    extra = 1

# Inline برای FAQs
class FAQInline(admin.StackedInline):
    model = FrequentlyAskedQuestions
    extra = 1

# مدل اصلی Product همراه با روابط وابسته
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'discounted_price', 'created_time', 'updated_time']
    inlines = [ImageInline, TypesInline, FeaturesInline, FAQInline]
    search_fields = ['name']
    list_filter = ['created_time', 'discount_period']

# برای مدل‌های مستقل اگر بخوای جداگونه نمایش داده بشن
admin.site.register(Images)
admin.site.register(Types)
admin.site.register(TypesValues)
admin.site.register(Features)
admin.site.register(FrequentlyAskedQuestions)
