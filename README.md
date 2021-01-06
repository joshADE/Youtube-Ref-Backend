# Youtube-Ref-Backend
> The backend server needed to run [Youtube-Ref](https://github.com/joshADE/Youtube-Ref-Frontend)


# Technologies used
* [Node JS](https://nodejs.org/en/) (Javascript runtime environment)
* [Express](https://expressjs.com/) (Backend framework for Node Js)
* [MongoDB](https://www.mongodb.com/) (Database)

# Requirements

* Node JS (version 15.x and above)
* NPM (version 7.x and above)
* GIT (version 2.x and above)

# Getting Started

## Clone Repository

Clone the repository to your computer.


```
git clone https://github.com/joshADE/Youtube-Ref-Backend.git
```

## Installation

1. cd to the project directory.
2. run `npm install` to install dependencies.

```
npm install
```

## Setup Environment Variables

Create .env file in the root folder of the project. Add the below environment variables to the file.

* MONGODB_URI

Example:
```
    MONGODB_URI=mongodb.url.connection.string //used for connecting to mongodb
```

* JWT_SECRET

Example:
```
    JWT_SECRET=`&L94*B:3,uYe3FEzHFq //determines the secret used when creating the jwt token
```

# Running project locally

run the following command

```
npm start

```

Open up http://localhost:5000/ in a browser to see the app


# License

This project is open-sourced under MIT Licence. Read the LICENSE file for more information.

