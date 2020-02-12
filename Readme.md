# Student Enrollment app Demo
   Server Side For Student Enrollment Application using NodeJS

---
## Requirements

For development, you will only need Node.js and a node global package, npm or yarn, installed in your environement.

### Node and NPM
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/))and the [official NPM website](https://npmjs.org/)..

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.5.0

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
---

## Install

    $ git clone https://github.com/Muhammad-Saad-01/Server-Side-For-Student-Enrollment-Application-using-NodeJS
    $ cd Server-Side-For-Student-Enrollment-Application-using-NodeJS
    $ npm install

## Configuration 

make config folder and then dev.env and write needed data for the following

Open `dev.env` then edit it with your settings. You will need:

> PORT, JWT_SECRET, MONGODB_URL

    - JWT_SECRET is JSON web token encoding string
    - MONGODB_URL is the MongoDB Connection String
    - PORT is the Port Number the Server listen on it 
     
   ### Example  
```javascript
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017/student-enrollment-app
JWT_SECRET=helloWorld
```
## Running the project
---
#### For Dev mode
    > npm run dev

#### For Run Mode
    > npm run start
    
## Test Your Work through Postman like the following document
[Postman Final Preview](https://documenter.getpostman.com/view/8654587/SVfUsSXe)
