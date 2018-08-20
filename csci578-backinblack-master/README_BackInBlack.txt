Compiling the project: No compilation is necessary
Setting up the project:
 - Install NodeJS, MongoDB, and Yarn (in any order)
 - - NodeJS: run the following script
     curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
     sudo apt-get install -y nodejs
 - - MongoDB
     sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
	 echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
	 sudo apt-get update
	 sudo apt-get install -y mongodb-org=3.6.3 mongodb-org-server=3.6.3 mongodb-org-shell=3.6.3 mongodb-org-mongos=3.6.3 mongodb-org-tools=3.6.3
 - Create the folder /data/db, this is the default data directory for MongoDB
 - From the ui folder, run `npm install` to resolve dependencies if necessary
Starting the project: 
 - Start MongoDB by typing `sudo mongod`
 - In a different terminal, navigate to the ui folder and run `node express/server.js`
 - Navigate to `localhost:8080` in your preferred web browser (We have tested in Chrome, Firefox, and Safari)
