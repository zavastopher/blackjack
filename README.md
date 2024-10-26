<center><img src="./frontend/src/static/images/bjlogo.png" alt="black jack logo" width="100em" ></center>

# <center> Black Jack 

## <center> Group P: Final Project

<center>

| Chris Zavala | Kyla Winborne | Quinn Mathews |
|--------------|-------------  |-------        |
|   czavala2   |  kjwinbor     | qdmatthe      |

</center>

---
### What Works
---
#### Frontend: 
When it comes to our frontend, all of our webpages function
as intended, with full navigation and functionality. The 
pages in our application scale to desktop or mobile view,
allowing users to access it through multiple ways. All of
our pages have complete CSS and JS files, allowing them to
be dynamic and stylish. 
<br>
#### Backend:
When it comes to our backend, almost everything we have is
in complete working order. All of our API methods have been 
thruoughly tested and function as intended. Our MariaDB database
also functions as needed, saving the information of all users 
registered into the system. The token we use for verifying sessions
also works as intended, allowing us to verify valid login sessions
and provide security to our API methods. Our system's Service Worker
also functions as intended, allowing the user to only access the
options page, the splash page, and the game page. If the user tries
to see any other pages while offline, they are met with the offline
user page. Our BlackJack application is also installable, and functions
exactly the same as it does in browser, and contains a manifest that 
functions as intended. 
  
---

### What does not Work
---
#### Frontend:
In regards to the frontend, nothing is not working as intended.
<br>
#### Backend:
In regards to our backend, nothing is not working as it should be.

---
### Authentication Process
---
For our authentication process, we use a token to store the
data of the current user but also an authorization JS module
that we import into each js file that corresponds to an HTML 
page. That file contains the login, logout, sign up, and get current
user API methods, which we use to check the user every time a page is
opened, which creates constant authentication.
Our system also uses middleware to verify sessions for all methods
that require authentication. 

---
### Caching Strategy
---
So for our application the core idea was that, in offline mode, the
user would only be able to access the splash page, the options menu,
and the game board which basically meant that they could play the 
game without logging in. So, for caching we added the routes for
/game, /offline, /, and /options so that the user was able to access
those. In the service worker cache method, we keep caches only on the
game since the game would actually have data that needed to be kept
track of. The other pages, being mostly static, did not require any
caching so they remained at the default.

---
### ERD
---
![](../FinalProject/frontend/src/static/images/ERD.png)

---
### Pages
---
| Pages | HTML Status | CSS Status | JS Status | Linked | Wireframe | Offline Function |
|-------|-------------|------------|-----------|--------|-----------|------------------|
|Splash Page Not Logged In | Complete | Complete | Complete | Yes | [Wireframe](../Proposal/Wireframes/SplashPageWireFrame.png)| Allows user to access the game and options pages |
|Sign Up Page | Complete | Complete | Complete | Yes | [Wireframe](../Proposal/Wireframes/Create_account_default_success.png)| Inaccessible | 
|Login | Complete | Complete | Complete | Yes | [Wireframe](../Proposal/Wireframes/Sign_in_wireframe_correct.png)| Inaccessible |
|Splash Page Logged in | Complete | Complete | Complete | Yes | [Wireframe](../Proposal/Wireframes/SplashPageWireFrame.png)|  Inaccessible |
|Game Play Page | Complete | Complete | Complete | Yes | [Wireframe](../Proposal/Wireframes/GamPlayPageWireFrame.png)| Allows user to play the game without having to log in |
|Settings Page| Complete | Complete | Complete | Yes | [Wireframe](../Proposal/Wireframes/SettingsPageWireFrame.png) | Lets the user opt in to notifications |
|Leader Board| Complete | Complete | Complete | Yes | [Wireframe](../Proposal/Wireframes/leaderboard.png)|  Inaccessible |
|Offline page| Complete | Complete | Complete | Yes | | Indicates that the user cannot access the page in offline mode |

---
### API Endpoints
---
|Method|Route|Description|
|------|-----|-----------|
|POST  |/login| Recieves a username and password in the request body and 
returns 200 if the login is valid or 401 if not. The method also throws
a 400 error if the authentication fails.|
|POST  |/logout| Logs the user out of the system, removing the token 
containing the user info.|
|POST  |/createAccount| Recieves a form containing the details for a user 
that needs to be created. If the form contains valid info then a 200 
response is returned. If the email or username is already in the system,
or the password does not match the confirm password field, it throws a 
400 error. Otherwise, it throws a 401 error. |
|PUT  |/postScore| Recieves a highscore and username to update the 
leaderboard databbase. If the user cannot be found, it returns a 400 
error. Otherwise, it returns 200.|
|GET   |/getScore| Retrieves the highscore value stored in the database 
for the current user. If the user cannot be found, it returns a 404 
status. Otherwise, it returns a 200.|
|GET   |/leaderboard/:username| Retrieves the leaderboard containing the 
top ten highscores and the user ranking for the username provided. 
Returns a 400 if the leaderboard cannot be
retrieved, and a 200 if successful.|
|GET   |/getCurrentUser| Current authenticated user from the token in the
system.|

---
### Team Member Contributions
---
|Task|Status|Assigned|
|----|------|---------|
|Service Worker| COMPLETE|Kyla|
|Cache API| COMPLETE | Kyla |
|Make app installable|COMPLETE|Chris|
|Testing|COMPLETE|Chris, Quinn, Kyla|
|Blackjack Offline Client|COMPLETE| Quinn|
|Final Project Report|COMPLETE|Kyla|
|Frontend and Backend Linking| COMPLETE|Chris|
|Authentication | COMPLETE | Kyla |
|BlackJack Client|COMPLETE|Quinn|
|Backend Debugging and Testing|COMPLETE|Chris and Kyla|
|Database Installation|COMPLETE|Chris|
|API Initialization|COMPLETE|Chris|
|API Testing | COMPLETE | Kyla |
|BlackJack Client|COMPLETE|Quinn|
|Frontend Navigation Initialization|COMPLETE|Kyla|
|Frontend Styling |COMPLETE| Chris |

---
### Environment File Template
---
*Copy and paste the text below into your .env file, replace the 
API_SECRET_KEY with a random hexadecimal string and the root password 
with a secure password, ideally another hexadecimal string. See [This 
Random Number Generator](https://numbergenerator.org/
random-32-digit-hex-codes-generator)*

*Add your secret key here*
API_SECRET_KEY=*"your_secret_key_here"*

*Add the root password here*
MYSQL_ROOT_PASSWORD="your-root-password-here"
MYSQL_DATABSE=blackjack
MYSQL_USER=blackjackclient
*Add the user password here for development we are using the same 
password but best practice is to set a unique password or restrict user 
access rights*
MYSQL_PASSWORD=blackjack

DB_ENGINE=mysql
DB_HOST=database
DB_PROT=3306
DB_CHARSET=utf8mb4
