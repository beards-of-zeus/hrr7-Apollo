[![Stories in Ready](https://badge.waffle.io/beards-of-zeus/hrr7-Apollo.png?label=ready&title=Ready)](https://waffle.io/beards-of-zeus/hrr7-Apollo)
# Homerow Apollo

![Homerow Apollo](./client/assets/home.png "Homerow Apollo")

## What is it? ##

In Homerow Apollo, you will be given a prompt to type, and a time limit to complete the prompt under.
Earn points and move on to the next level by correctly typing out the prompt within the time limit.
The best scores will earn a spot on the Leaderboard, so do your best!

## How to Get Started ##

Install dependencies:

1. From root directory, run ```npm install```.
2. From root directory, run ```bower install```.

Seeding the Database with Challenges and Game records:

1. In your Terminal, navigate to the server/ directory.
2. Enter the mongo shell by typing 'mongo' and hitting enter.
3. Create or switch to the database that you wish to use with Homerow Apollo with the ```use``` command (for example, ```use apollo```).
4. Seed the database with challenges by entering the following: ```load('seedBatch.js')```
5. Seed the database with game records by entering the following: ```load('seedGame.js')```
6. Exit the mongo shell with ctrl+c
7. Run the server and open the browser to localhost:8080

## Tools ##

- Angular
- Sass
- Bower
- Express
- Mongoose
- Node.js
- Grunt
- Morgan
- Method-Override
- Body-Parser
- CodeMirror
- Karma / Mocha / Chai / ng-mock (Unit Tests)
- Protractor / Jasmine (End to End Tests)

## Minimum Viable Product

- User can start a new Game.
- User can complete challenges by typing prompts into text fields.
- Score earned is based on how long it takes the User to complete each level.
- Game includes levels of increasing difficulty.
- Database holds Leaderboard of highest current scores.
- User can view the Leaderboard.

## Stretch Features

- User accounts
- Criteria-based/bonus challenges
- Report of words per minute or other performance breakdown
- Find source for challenge content
- Option to play Game with other programming languages
- D3 visualization of Leaderboard

##To set up Authorization (just for reference for now)
1.) Sign up for auth0 and use Angular and Node
2.) Follow set-up directions in both Angular and Node tabs
    -Be sure to include [] in landing page module.app
3.) From auth0 dashboard:

a.) go to App/API --> settings and enter http://localhost:8080, https://hfoster.auth0.com/login/callback into allowed callback URIs
b.) go to connections/social
    -turn on google and click on it
c.) go to https://console.developers.google.com/
    -In top menu, click on dropdown, and select 'create' (create project maybe?)
    -Enter a name for the project and then create
    -Go to APIs&Auth--> APIs --> API library --> Social APIs --> Google+ API --> enable --> back -->Enabled APIs --> Google+
    -Go to credentials --> add credentials -->OAuth 2.0 client ID
    -Select web application
    -Authorized JavaScript Origins: https://hfoster.auth0.com
    -Authorized Redirect URI https://hfoster.auth0.com/login/callback
    -Create
d.) Copy/paste clientid and client secret into auth0 menu from b.)
e.) save
