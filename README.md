# Rentsy
Web application for renting objects within the University made for and by students.

### Prerrequisites
All the listed prerrequisites must be installed in order to use the application. 
* <a href="https://nodejs.org/en/">Node.js</a>
* <a href="https://www.npmjs.com/get-npm">npm</a> `(Node Package Manager)`
* <a href="https://www.mongodb.com/download-center">MongoDB</a> 

### Installation
* Clone repository using git
    ```bash
    $ git clone https://github.com/jodorganistaca/Rentsy.git
    ```

* Install dependencies from package.json
    ```bash
    $ npm install
    ```
    If it shows an error try it as superuser
    ```bash
    $ sudo npm install
    ```

### Running the application
* Before starting the application make sure you have mongodb installed and running, if not run it using this command.
    ``` bash
    $ sudo service mongod start
    ```
* Run application
    ``` bash
    $ npm start
    ```
 * The application uses Microsoft OAuth, therefore is required, inside a file named .env in root directory of the project:
  ```basj
    DB_NAME = <mongo_db_name>
    DB_PORT = <mongo_db_port>
    APP_ID = <microsoft_app_id>
    APP_PASSWORD = <microsoft_app_password>
    APP_SCOPES = <microsoft_app_scopes>
    REDIRECT_URI = <microsoft authorized redirect_uri>
   ```

### Application Usage
* Go to your browser go to http://localhost:3000

### **License**
**Rentsy** is a open-source software licensed under the MIT License.
