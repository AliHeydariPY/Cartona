from django.contrib import admin
from .models import (
    Product, Images, Types, TypesValues,
    Features, FrequentlyAskedQuestions
)

class ImageInline(admin.TabularInline):
    model = Images
    extra = 1

class TypesValuesInline(admin.TabularInline):
    model = TypesValues
    extra = 1

class TypesInline(admin.StackedInline):
    model = Types
    extra = 1
    inlines = [TypesValuesInline]

class FeaturesInline(admin.TabularInline):
    model = Features
    extra = 1

class FAQInline(admin.StackedInline):
    model = FrequentlyAskedQuestions
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'discounted_price', 'created_time', 'updated_time']
    inlines = [ImageInline, TypesInline, FeaturesInline, FAQInline]
    search_fields = ['name']
    list_filter = ['created_time', 'discount_period']

admin.site.register(Images)
admin.site.register(Types)
admin.site.register(TypesValues)
admin.site.register(Features)
admin.site.register(FrequentlyAskedQuestions)
