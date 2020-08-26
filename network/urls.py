
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("n/login", views.login_view, name="login"),
    path("n/logout", views.logout_view, name="logout"),
    path("n/register", views.register, name="register"),
    path("<str:username>", views.profile, name='profile'),
    path('n/createpost', views.create_post, name="createpost"),
    path('n/post/<int:id>/like', views.like_post, name="likepost"),
    path('n/post/<int:id>/unlike', views.unlike_post, name="unlikepost")
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
