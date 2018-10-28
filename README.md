# MultiPass

## About

MultiPass is a blockchain based course and study records management app with the target audience being students and teachers. Developed as a bachelor thesis project at the Faculty of Computer Science, University Vienna.

### Used Technologies and Libraries

* MongoDB
* Node.js / Express.js
* React
* Material-UI
* MultiChain
* Webpack4

This project has been developed and tested only on the Microsoft Windows platform (Windows 10)

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/) v8 LTS
* [MultiChain](https://www.multichain.com/download-install/) v1.0.5
* [MongoDB](https://www.mongodb.com/download-center#community) v4.0
* [Git](https://git-scm.com/downloads)

### Installation (Local)

#### Clone the repository
```bash
git clone git@github.com:roman-karaba/MultiPass.git
```

#### MongoDB setup
After installing MongoDB, it is recommended to add its installation location to your PATH. This enables you to use commands like `mongod` or `mongo` to start the database and gain access to its CLI respectively.
Note: dont forget to create the `C:\data\db` directories

Run MongoDB (should be running at `127.0.0.1:27017` or `localhost:27017`) 

#### MultiChain setup
Follow the installation guide on https://www.multichain.com/download-install/

Afted installing the MultiChain server, it is necessary to add its directory into your PATH for the next steps.

Create a test chain to initialize its directory structure and run it (you can delete it afterwards)
```bash
multichain-util create testchain
multichaind testchain -daemon
```
Terminate the testchain instance and navigate into the MultiChain folder at `C:\Users\%USERNAME%\AppData\Roaming\MultiChain`. If not present create `multichain.conf` and add the line
`autosubscribe=streams`. (Optionally delete the testchain folder)

Create our MultiPass multichain
```bash
multichain-util create multipass
multichaind multipass -daemon
```
You might notice that you get an output 
```bash
MultiChain 1.0.5 Daemon (latest protocol 10011)

Looking for genesis block...
Genesis block found

Other nodes can connect to this node using:
multichaind multipass@"ip.ad.dr.ess:PORT"

Listening for API requests on port "API-PORT" (local only - see rpcallowip setting)

Node ready.
```
The IP address will be set to the address of your machine, and the port number is set **randomly**. You have to set the port number in `MultiChain/Backend/src/multichainOptions.js` to the port number from **your** console output.

The password for the chain is also generated when creating the multipass multichain instance. Go to `C:\Users\%USERNAME%\AppData\Roaming\MultiChain\multipass` and copy the generated password from the `multichain.conf` file and set it in `multichainOptions.js`

#### Frontend & Backend setup

The repository has two main subdirectories `MultiPass\Frontend` and `MultiPass\Backend`. Install npm packages in both of those directories.

```bash
nom install -g webpack
cd Backend
npm install
cd ../Frontend
npm install
```
### Running the app

1. Run MongoDB -> open a console and execute `mongod` (or start it by running the .exe file)
2. Run the multipass MultiChain node -> `multichaind multipass -daemon`
3. Run Backend -> navigate to the Backend directory and execute `npm run backend`
4. Initialize backend -> execute `npm run initapp` in the Backend directory
5. Run Frontend -> navigate to the Frontend directory and execute `npm run frontend`

The app should be now running with the frontend at `localhost:8080` and backend at `localhost:3000`

You should be now able to login as a teacher into the app with the credentials:
```
UserId: 12345678
password: teacher
```

Or as a student
```
MatriculationID: 01301624
password: secret
```
### Global Deployment
The global deployment follows the same steps as the local installation. The only main difference is to set the IP address on top of the appService.js filem located in Frontend\src\scripts\ to the IP address of the system where the backend is installed.

## Directory Structure
|-- Backend                                                                
|   |-- docs                                                               
|   |   |-- exsistingUsers.json                                            
|   |   |-- userStructure.json                                             
|   |-- package-lock.json                                                  
|   |-- package.json                                                       
|   |-- src                                                                
|   |   |-- authHandler.js                                                 
|   |   |-- chainInfo.js                                                   
|   |   |-- dataClasses                                                    
|   |   |   |-- Course.js                                                  
|   |   |-- dataHandler.js                                                 
|   |   |-- helpers.js                                                     
|   |   |-- initApp.js                                                     
|   |   |-- multichainOptions.js                                           
|   |   |-- server.js                                                      
|   |   |-- testinitChain.js                                               
|   |   |-- usersJSON.js                                                   
|   |-- webpack.config.js                                                  
|-- Frontend                                                               
|   |-- LICENSE.md                                                         
|   |-- package-lock.json                                                  
|   |-- package.json                                                       
|   |-- public                                                             
|   |   |-- apple-icon.png                                                 
|   |   |-- favicon.ico                                                    
|   |   |-- index.html                                                     
|   |   |-- manifest.json                                                  
|   |-- src                                                                
|       |-- assets                                                         
|       |   |-- img                                                        
|       |   |   |-- bg-faculty.jpg                                         
|       |   |-- jss                                                        
|       |   |   |-- material-kit-react                                     
|       |   |   |   |-- components                                         
|       |   |   |   |   |-- badgeStyle.jsx                                 
|       |   |   |   |   |-- buttonStyle.jsx                                
|       |   |   |   |   |-- cardBodyStyle.jsx                              
|       |   |   |   |   |-- cardFooterStyle.jsx                            
|       |   |   |   |   |-- cardHeaderStyle.jsx                            
|       |   |   |   |   |-- cardStyle.jsx                                  
|       |   |   |   |   |-- courseCardStyle.jsx                            
|       |   |   |   |   |-- customDropdownStyle.jsx                        
|       |   |   |   |   |-- customInputStyle.jsx                           
|       |   |   |   |   |-- customLinearProgressStyle.jsx                  
|       |   |   |   |   |-- customTabsStyle.jsx                            
|       |   |   |   |   |-- footerStyle.jsx                                
|       |   |   |   |   |-- headerLinksStyle.jsx                           
|       |   |   |   |   |-- headerStyle.jsx                                
|       |   |   |   |   |-- iconButtonStyle.jsx                            
|       |   |   |   |   |-- infoStyle.jsx                                  
|       |   |   |   |   |-- navPillsStyle.jsx                              
|       |   |   |   |   |-- paginationStyle.jsx                            
|       |   |   |   |   |-- parallaxStyle.jsx                              
|       |   |   |   |   |-- snackbarContentStyle.jsx                       
|       |   |   |   |   |-- typographyStyle.jsx                            
|       |   |   |   |-- customCheckboxRadioSwitch.jsx                      
|       |   |   |   |-- imagesStyles.jsx                                   
|       |   |   |   |-- modalStyle.jsx                                     
|       |   |   |   |-- popoverStyles.jsx                                  
|       |   |   |   |-- tooltipsStyle.jsx                                  
|       |   |   |   |-- views                                              
|       |   |   |       |-- createCoursePageStyle.jsx                      
|       |   |   |       |-- findCoursePageStyle.jsx                        
|       |   |   |       |-- loginPage.jsx                                  
|       |   |   |       |-- myCoursesPageStyle.jsx                         
|       |   |   |       |-- myCoursesStyle.jsx                             
|       |   |   |       |-- studyRecordsPageStyle.jsx                      
|       |   |   |-- material-kit-react.jsx                                 
|       |   |-- scss                                                       
|       |       |-- core                                                   
|       |       |   |-- _misc.scss                                         
|       |       |   |-- _mixins.scss                                       
|       |       |   |-- _variables.scss                                    
|       |       |   |-- mixins                                             
|       |       |   |   |-- _colored-shadows.scss                          
|       |       |   |-- variables                                          
|       |       |       |-- _bootstrap-material-design-base.scss           
|       |       |       |-- _bootstrap-material-design.scss                
|       |       |       |-- _brand.scss                                    
|       |       |       |-- _colors-map.scss                               
|       |       |       |-- _colors.scss                                   
|       |       |       |-- _functions.scss                                
|       |       |       |-- _shadow.scss                                   
|       |       |       |-- _variables.scss                                
|       |       |-- material-kit-react.css                                 
|       |       |-- material-kit-react.scss                                
|       |       |-- plugins                                                
|       |           |-- _plugin-nouislider.scss                            
|       |           |-- _plugin-react-datetime.scss                        
|       |           |-- _plugin-react-slick.scss                           
|       |-- components                                                     
|       |   |-- Badge                                                      
|       |   |   |-- Badge.jsx                                              
|       |   |-- Card                                                       
|       |   |   |-- Card.jsx                                               
|       |   |   |-- CardBody.jsx                                           
|       |   |   |-- CardFooter.jsx                                         
|       |   |   |-- CardHeader.jsx                                         
|       |   |-- Clearfix                                                   
|       |   |   |-- Clearfix.jsx                                           
|       |   |-- CourseCard                                                 
|       |   |   |-- CourseCard.jsx                                         
|       |   |-- CustomButtons                                              
|       |   |   |-- Button.jsx                                             
|       |   |   |-- IconButton.jsx                                         
|       |   |-- CustomDropdown                                             
|       |   |   |-- CustomDropdown.jsx                                     
|       |   |-- CustomInput                                                
|       |   |   |-- CustomInput.jsx                                        
|       |   |-- CustomLinearProgress                                       
|       |   |   |-- CustomLinearProgress.jsx                               
|       |   |-- CustomTabs                                                 
|       |   |   |-- CustomTabs.jsx                                         
|       |   |-- Footer                                                     
|       |   |   |-- Footer.jsx                                             
|       |   |-- Grid                                                       
|       |   |   |-- GridContainer.jsx                                      
|       |   |   |-- GridItem.jsx                                           
|       |   |-- Header                                                     
|       |   |   |-- Header.jsx                                             
|       |   |   |-- HeaderLinks.jsx                                        
|       |   |   |-- MultiPassHeaderLinks.jsx                               
|       |   |-- InfoArea                                                   
|       |   |   |-- InfoArea.jsx                                           
|       |   |-- NavPills                                                   
|       |   |   |-- NavPills.jsx                                           
|       |   |-- Pagination                                                 
|       |   |   |-- Pagination.jsx                                         
|       |   |-- Parallax                                                   
|       |   |   |-- Parallax.jsx                                           
|       |   |-- Snackbar                                                   
|       |   |   |-- SnackbarContent.jsx                                    
|       |   |   |-- snackbarTypes.js                                       
|       |   |-- Typography                                                 
|       |       |-- Danger.jsx                                             
|       |       |-- Info.jsx                                               
|       |       |-- Muted.jsx                                              
|       |       |-- Primary.jsx                                            
|       |       |-- Quote.jsx                                              
|       |       |-- Small.jsx                                              
|       |       |-- Success.jsx                                            
|       |       |-- Warning.jsx                                            
|       |-- index.js                                                       
|       |-- logo.svg                                                       
|       |-- routes                                                         
|       |   |-- index.jsx                                                  
|       |-- scripts                                                        
|       |   |-- appService.js                                              
|       |-- views                                                          
|           |-- CreateCoursePage                                           
|           |   |-- CreateCoursePage.jsx                                   
|           |-- FindCoursePage                                             
|           |   |-- FindCoursePage.jsx                                     
|           |-- LoginPage                                                  
|           |   |-- LoginPage.jsx                                          
|           |-- MyCoursesPage                                              
|           |   |-- MyCourses.jsx                                          
|           |   |-- MyCoursesPage.jsx                                      
|           |-- SignupPage                                                 
|           |   |-- SignupPage.jsx                                         
|           |-- StudyRecordsPage                                           
|               |-- StudyRecordsPage.jsx                                   
|-- README.md                                                              

## The project is developed with using linux style 
I ran into an issue with file endings on windows and changing the following settings solved the issue (Note: you may not have encounter the problem)
```bash
git config --global core.safecrlf false
git config --global core.autocrlf false
```