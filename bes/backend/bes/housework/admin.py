from django.contrib import admin
from .models import House, HouseworkPossibleTask, HouseworkMadeTask, History

admin.site.register(House)
admin.site.register(HouseworkPossibleTask)
admin.site.register(HouseworkMadeTask)
admin.site.register(History)