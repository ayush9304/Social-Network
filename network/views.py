from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import *


def index(request):
    posts = Post.objects.all().order_by('-date_created')
    followings = []
    suggestions = []
    if request.user.is_authenticated:
        followings = Follower.objects.filter(follower=request.user).values_list('user', flat=True)
        suggestions = User.objects.exclude(pk__in=followings).exclude(username=request.user.username).order_by("?")[:6]
    return render(request, "network/index.html", {
        "posts": posts,
        "suggestions": suggestions,
        "page": "all_posts"
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def profile(request, username):
    user = User.objects.get(username=username)
    posts = Post.objects.filter(creater=user)
    followings = []
    suggestions = []
    if request.user.is_authenticated:
        followings = Follower.objects.filter(follower=request.user).values_list('user', flat=True)
        suggestions = User.objects.exclude(pk__in=followings).exclude(username=request.user.username).order_by("?")[:6]
    return render(request, 'network/index.html', {
        "username": user,
        "posts": reversed(posts),
        "suggestions": suggestions,
        "page": "profile",
        "profile": True,
        "follower": False
    })

def create_post(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            text = request.POST.get('text')
            pic = request.FILES.get('picture')
            try:
                post = Post.objects.create(creater=request.user, content_text=text, content_image=pic)
                print(f"//////////////////////////////text: {text}///////////////////////////////")
                print(f"//////////////////////////////pic: {pic}///////////////////////////////")
                print(f"//////////////////////////////post: {post}///////////////////////////////")
                return HttpResponseRedirect(reverse('index'))
            except Exception as e:
                return HttpResponse(e)