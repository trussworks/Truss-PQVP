# Truss Prototype - Developed for the State of CA. RFI: CDT-ADPQ-0117 - PQVP DS-AD

Prototype URL: https://demo.pqvp.truss.works

This project is licensed under the terms of the GPLv3 license.

Key features include:
* Sign-up
* Login
* Profile creation
* Alerting based on geographic areas from [IGEMS](https://igems.doi.gov)
* Data visualization of alerts

# Approach Overview
The following is a summary of the approach used by TrussWorks Inc. (Truss) to create the working prototype.

## About us:

Truss excels at building complex software infrastructure in high-compliance industries to deliver superior user experiences for our clients. We were a core part of the elite engineering team that fixed Healthcare.gov and built the Marketplace Lite application to enable a more efficient user signup experience, ultimately enabling 11M citizens to access healthcare for the first time. Silicon Valley startups, Fortune 200 corporations and US federal agencies recognize Truss for our uncanny discipline that enables us to ship product under severe constraints.

We are experts in customer research, DevOps, UX design and rapid iteration / agile techniques that accelerate development teams while reducing the risk of costly errors. Based in San Francisco and Oakland, the Truss team has decades of engineering and management leadership to both transform legacy systems and build core scalability for fast-growing startups. In short, our processes are as sustainable as our software.

Truss leveraged human-centered design techniques to create the prototype design. The team worked collaboratively to develop multiple iterations of the prototype, incorporating feedback from interviews and usability testing.

## Project organization:
Truss assigned one leader and gave that person authority and responsibility and held that person accountable for the quality of the prototype submitted.
* Truss realizes that in order for work to move quickly through blockers that a decision maker needs to be identified who can be an authoritative driver where required. As an engineering driven organization, we chose the Technical Architect as this person. We understand that ownership requires being open to inputs from the team while being able to make informed decisions based on often-incomplete information.

Truss engaged a multi-disciplinary and collaborative team to design and develop the prototype. We employ a model that everyone on the team should be able to fill multiple roles and all user stories should be handled by whichever team member becomes available. The following roles were held by one or more team members:
* Product Manager: Nic Wissman
* Technical Architect: Mark Ferlatte
* Interaction Designer/User Researcher/Usability Tester: Nic Wissman, Jamie Kennedy, Breanne Boland
* Front End Web Developer: Emily Chen, Macrae Linton, Mark Ferlatte, Mojo Talantikite
* Backend Web Developer: Emily Chen, Macrae Linton, Mark Ferlatte, Mojo Talantikite, Mike Kania
* DevOps Engineer: Mike Kania, Mojo Talantikite, Mark Ferlatte
* Agile Coach: Nic Wissman, Mark Ferlatte
* Business Analyst: Nic Wissman, Jamie Kennedy, Macrae Linton

After using the first week to plan the design approach and technical requirements, the team conducted two one-week sprint cycles to complete development and testing.

## Human-centered design approach:

The following human-centered design techniques were used:
* Frame your design challenge
* Build a Team
* Secondary Research
* User Interviews
* Expert Interviews
* Usability Testing

1. Before we initiated any design or development, we went through the exercise of
  * Framing the challenge we were designing for as a question
  * Identifying the impact, possible solutions, and constraints around this challenge
  * Reframing the challenge based on the details identified.
2. This allowed us to get a better understanding of the types of data we would need to collect during our research efforts.
3. The team conducted secondary research by reviewing examples of notification tools which use similar features including Pagerduty and Hazard Alert.
4. Fifteen interviews were conducted with citizens across multiple age, location, and gender demographics while designing the tool. The inputs from these interviews were used to inform and validate our design approach prior to any development activity.
5. We white-boarded out the user flows and updated them based on research. Once we had all features defined we outlined the workflow and turned that into user stories.
6. Regarding experts, we interviewed a NOAA employee as well as a firefighter to determine the types of folks who would send emergency notifications. We also interfaced with an employee of ArcGIS to get a better understanding of how the technology works.
7. Usability testing
  * As a non-programmer within the team, the Product Manager, Nic Wissman, did continual usability testing and filed new user stories throughout the development process.
  * Other team members also identified usability improvements and filed stories which were reviewed by the team and accepted or rejected during planning and grooming sessions.
  * Additionally we conducted user testing with people within the organization but outside the assigned team to provide valuable feedback which was iterated upon to achieve the delivered prototype.

Design style guide: [Neat](http://neat.bourbon.io) was used as the grid system to ensure a consistent and responsive design. Templates and style guides were procured from the draft [U.S. Web Design Standards](https://standards.usa.gov) site. Leveraging these sources facilitated our ability to maintain compliance with Section 508 of the Americans with Disabilities Act and WCAG 2.0. 

## Agile development approach:
The team conducted three one-week sprint cycles to complete design, development, and testing. Several technologies were used to ensure the prototype works on multiple devices with a responsive design, including Neat, Leaflet, and React.js. All platforms used to create and run the prototype are openly licensed and free of charge

* Modern and open-source technologies include: Docker, React, Redux, JSON Web Tokens, webpack, and Terraform.
* Infrastructure as a Service (IaaS) was run on AWS using: Terraform, ECS, SNS, etc.
* Automated unit tests used Jest and the Go built-in unit testing library;
* We did browser testing using Selenium and Sauce Labs to emulate different devices and OSs as well as manually tested the prototype on iPhone/Android mobile OS.
* Our continuous integration system, Circle CI, also deployed into ECS after tests passed on master.
* Configuration management: Terraform
* Continuous monitoring: AWS Cloudwatch and Route53 Health Check
* Container deployment:ECS / Docker

Project management tools used include Pivotal Tracker, Slack, GitHub, and Zoom. The team used Pivotal Tracker to create a prioritized list of user stories and to track bugs and issues. The project can be accessed in its entirety [here](https://www.pivotaltracker.com/projects/1969823)

## Application architecture

The application is structured as a single page JavaScript client application with a Go API server. Swagger was used to document the API server, these documents can be found at https://demo.pqvp.truss.works/docs. The client (found in `client`) is served to the browser by the Go server on the first request.

The client is written in modern JavaScript with [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org). It uses [Leaflet](http://leafletjs.com) for map rendering and the [ESRI Leaflet](https://github.com/Esri/esri-leaflet) module to interact with [ArcGIS](http://www.arcgis.com/). Once logged in, client requests are authorized using [JSON Web Tokens](https://jwt.io). Both the signup and login pages authorize the customer to use the application. Once logged in, the client profile pages uses the `/api/profile` endpoint to fetch and update the customer's profile. If the customer is an admin (note: for the purposes of the prototype's ease of use, all customers are admins), they can access the send alert view, which uses the /api/alert endpoint along with ArcGIS data to notify customers.

The server (found in `server`) is written in Go and uses PostgreSQL with the PostGIS extension as its database. It provides a small number of API endpoints under `/api`, as well as serving the client application and its own docs under `/docs`. The main entrypoint is `server/src/pqvp/pqvp.go`. The majority of the app is the URL handlers in `handlers.go`and the database access in `db.go`. `alert.go` integrates with our SMS and email gateways, `auth.go` sets up the JSON Web Tokens, and `middleware.go` provides the authentication middleware.

## Run application locally in a Docker container
### Running locally on Ubuntu 16.04
Clone the repository and run Ubuntu setup script which will install the following dependencies
 * [nodenv](https://github.com/nodenv/nodenv) - [Node.js](https://nodejs.org/en/) virtual environment manager
 * [yarn](https://yarnpkg.com/en/) - JavaScript package manage
 * [docker](https://www.docker.com/) - build, run, test, and deploy applications inside software containers

**Requirements**
  * `sudo` privileges to be able to install software and run `docker` commands

**Installation**
```
git clone https://github.com/trussworks/Truss-PQVP.git
cd Truss-PQVP
./bin/setup-dev-ubuntu1604.sh
```

**Start local Docker container**
running docker on Ubuntu 16.04 requires root
```
sudo bin/local-docker.sh pqvp-demo
```
### Running locally on macOS Sierra

**Requirements**
 * [Homebrew](https://brew.sh/) needs to be installed and will be used to install all the required software dependencies
 * [Docker for Mac](https://docs.docker.com/docker-for-mac/install/) need to be installed to run the development docker container

**Installation**
```
brew update
brew install nodenv yarn
git clone https://github.com/trussworks/Truss-PQVP.git
cd Truss-PQVP
nodenv install
```
**Start local Docker container**

```make local_docker```

### Testing application locally
The docker container runs on [http://localhost:80/](http://localhost:80/) . The PostgreSQL database runs locally inside the Docker container, which means database state does not persist between builds. Logs can be viewed using by running `docker logs -f pqvp-demo`

SMS alerts use AWS SNS while email alerts use SendGrid. Developers using the local Docker container will be unable to send these notifications until a proper AWS environment is configured and attached to the Docker container. Similarly for sending emails for SendGrid. Environment variables that are expected:

SENDGRID_API_KEY
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

Users must make sure their AWS credentials give them access to the AWS SNS service.

# Notable Prototype Features
Because we are submitting a prototype, certain features have been roughed in but not finalized. Additionally some decsisions made for the sake of the prototype would not be made if designing a production application.

  * Duplicate emails will not be accepted
  * There are no password restrictions 
  * Every user is an admin ( no additional auth)
  * Push notifications require a native mobile app. Since there was not an easy way to deliver this to the government as a usable prototype, this has not been included. You can review the Truss app 'Leave Now' [in the apple store] (https://appsto.re/us/xT3qH.i) if you would like to see an example of how we would have incorporated those features.
  * Geolocation requires a native mobile app. Since there was not an easy way to deliver this to the government as a usable prototype, this has not been included. You can review the Truss app 'Leave Now' [in the apple store](https://appsto.re/us/xT3qH.i) if you would like to see an example of how we would have incorporated those features.
  * Users are not able to update email addresses in the prototype 
  * Change Password functionality is not hooked up 
  * Language selection is not functional 
  * We are able to provide support for MS Edge but not IE 11. All other major browsers (including mobile) were tested and have full support.
  *

## Licensing
Copyright (C) 2017 Truss Works, Inc.
This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA

## Questions?
[Contact Nic Wissman](nic@truss.works)
