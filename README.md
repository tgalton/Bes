# Bes

Bes is a feminist application to share housework more equaly between people living in the same house.
The app is designed to be used on phone.

Bes is a egyptian home divinity. He is represented as a jovial and happy dwarf.

## Table of content

1. [Frontend](#frontend)
1. [Backend](#backend)
   1. [Setup](#setup-bes-backend)

## Frontend

TODO

## Backend

The application backend is coded in [Django](https://www.djangoproject.com/) in `bes\backend\bes` directory.

### Setup Bes backend

The application uses [Python 3.9](https://www.python.org/downloads/release/python-390/).
To manage the python environment and the dependencies, we use [Poetry](https://python-poetry.org/).
To install all dependencies, run `poetry install`.
Then to run the project, run `poetry run python manage.py runserver`.

If the database does not exist, run `poetry run python manage.py migrate`.
If you want to create a super user in the database, run `poetry run python manage.py createsuperuser`.
If change in models, dont forget to apply `poetry run python manage.py makemigrations`.

### Build server

From local terminal
`scp mysql_image.tar pi@192.168.1.29:/home/pi/`
`scp docker-compose.yml pi@192.168.1.29:/home/pi/`
`scp django_image.tar pi@192.168.1.29:/home/pi/`
`pscp C:/Users/galto/Documents/Bes/Bes/docker-compose.yml pi@192.168.1.29:/home/pi/`
`pscp C:/Users/galto/Documents/Bes/Bes/.env pi@192.168.1.29:/home/pi/`
From SSH to rasberry
`docker load -i /home/pi/django_image.tar`
`docker load -i /home/pi/angular_image.tar`
`docker load -i /home/pi/mysql_image.tar`
`docker-compose up -d`

Transmettre le code au rasberry
scp -r backend pi@192.168.1.29:/home/pi/backend
scp -r frontend pi@192.168.1.29:/home/pi/frontend
