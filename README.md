# Moneyhub Tech Test - Investments and Holdings

At Moneyhub we use microservices to partition and separate the concerns of the codebase. In this exercise we have given you an example `admin` service and some accompanying services to work with. In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature has been received

## Requirements

- An admin is able to generate a csv formatted report showing the values of all user holdings
    - The report should be sent to the `/export` route of the investments service
    - The investments service expects the csv report to be sent as json
    - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
    - The holding should be the name of the holding account given by the financial-companies service
    - The holding value can be calculated by `investmentTotal * investmentPercentage`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages)
- Make effective use of git

We prefer:
- Functional code 
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes
All of you work should take place inside the `admin` microservice

For the purposes of this task we would assume there are sufficient security middleware, permissions access and PII safe protocols, you do not need to add additional security measures as part of this exercise.

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around *1-2 hours* working on it

## Deliverables
**Please make sure to update the readme with**:

- Your new routes
- How to run any additional scripts or tests you may have added
- Relating to the task please add answers to the following questions;
    1. How might you make this service more secure?
    2. How would you make this solution scale to millions of records?
    3. What else would you have liked to improve given more time?
  

On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.

## Getting Started

Please clone this service and push it to your own github (or other) public repository

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

Use Postman or any API tool of you choice to trigger your endpoints (this is how we will test your new route).

### Existing routes
We have provided a series of routes 

Investments - localhost:8081
- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082
- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083
- `/investments/:id` get an investment record by id

### Stephy's submissions

#### New route:
```
POST http://localhost:8083/investments/export
```

###### Expected response:
```
User,First Name,Last Name,Date,Holding,Value
1,Billy,Bob,2020-01-01,The Small Investment Company,1400
2,Sheila,Aussie,2020-01-01,"The Big Investment Company, The Small Investment Company",20000
1,Billy,Bob,2020-02-01,The Small Investment Company,1300
2,Sheila,Aussie,2020-02-01,"The Big Investment Company, The Small Investment Company",22000
1,Billy,Bob,2020-03-01,The Small Investment Company,12000
2,Sheila,Aussie,2020-03-01,"The Big Investment Company, The Small Investment Company, Capital Investments",21500
3,John,Smith,2020-03-01,"The Big Investment Company, Capital Investments",150000
```

#### Running tests:
```
npm test
```

#### How might you make this service more secure?
Use JWT to protect the route. Also check the access privileges of the user specified in JWT.

#### How would you make this solution scale to millions of records?
<ol start="1">
  <li>Construct a background worker</li>
  <li>Fetch a small amount of entries (e.g. 1000)</li>
  <li>Pipe the output and write to a file write stream</li>
  <li>The temporary output file can be stored in AWS S3</li>
  <li>Therefore, when user calls the API endpoint to export the report, they can download the report once it is ready. Relevant progress management can be introduced.</li>
</ol>

#### What else would you have liked to improve given more time?
* Introduce a generic handler to intercept the HTTP response, in order to format the response body more efficiently and thus centralize the exception handling.
* To handle file upload as multipart/form-data.
* Batch processing on investment entries.
* Separating route definitions & controller actions from `src/index.js`.
