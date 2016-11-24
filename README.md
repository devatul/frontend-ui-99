#Dathena Frontend User Interface
## The project
This is the code for the user interface of Dathena. Most of the code is located in the reactjs
folder.

## Building the project
We need to install the external packages first:

    npm install

The project is then ready to run and will, by default, be deployed on localhost:3000:

    npm start

In short:

    npm install && npm start

## Packaging for deployment
Firstly, generates the package bundle:

    npm run build

Then, create an archive with the project:

    tar cf deploy.tar.bz2 assets dist

In short:

    npm run build && tar cf deploy.tar.bz2 assets dist
