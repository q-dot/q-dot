# API Documentation

## Schema

Schema includes 3 tables shown below:

**Restaurants Table**

|field name    |field type                        |
|--------------|----------------------------------|
|id            |integer, auto increasing          |
|image         |string, url link                  |
|name          |string, restaurant name           |
|phone         |string, restaurant number         |
|nextPosition   |integer, current queue count      |
|status        |string, current queue status      |
|createdAt     |string, restaurant creation date  |
|updatedAt     |string, restaurant updated date   |


**Queues Table**

|field name    |field type                        |
|--------------|----------------------------------|
|id            |integer, auto increasing          |
|position      |integer, queue position           |
|size          |integer, customer group size      |
|restaurantId  |integer, restaurant id            |
|customerId    |integer, customer id              |
|createdAt     |string, queue creation date       |
|updatedAt     |string, queue updated date        |


**Customers Table**

|field name    |field type                        |
|--------------|----------------------------------|
|id            |integer, auto increasing          |
|name          |string, restaurant name           |
|mobile        |string, customer mobile number    |
|email         |string, customer email address    |
|createdAt     |string, customer creation date    |
|updatedAt     |string, customer updated date     |


## /restaurants

**Return a list of all the restaurants in the database**

GET request to '/restaurants' returns a list of all the restaurants in the database. The list contains restaurant objects with the restaurant's id, name, phone, image and current queue count. There is a timestamp for when the restaurant was created in the database and a timestamp for the last time it was updated.

Example:

```
request.get('https://q-dot.herokuapp.com/restaurants');

//response

[
    {
        "id": 2,
        //returns an unique integer
        "name": "Subway",
        //returns a string, name of restaurant
        "phone": "(123) 456-7990",
        //returns a string, phone number of restaurant
        "nextPosition": 0,
        //returns an integer, total number of people who queued
        "total_wait": 3,
        //returns an integer, total wait time for restaurant
        "average_wait": 3,
        //returns an integer, average wait time of restaurant
        "status": "Open",
        //returns a string, either "Open" or "Close", reflecting 
        "image": "../images/subway.jpg",
         //returns a string, url for the restaurant image
        "createdAt": "2017-10-06T19:23:08.999Z",
        //returns a string, showing date of when restaurant info was created in db
        "updatedAt": "2017-10-06T19:23:08.999Z"
        //returns a string, showing date of when restaurant info was updated in db
    },
    {
        "id": 3,
        "name": "Chipotle",
        "phone": "(132) 456-7990",
        "nextPosition": 0,
        "total_wait": 3,
        "average_wait": 3,
        "status": "Closed",
        "image": "../images/chipotle.jpg",
        "createdAt": "2017-10-06T19:23:09.019Z",
        "updatedAt": "2017-10-06T19:23:09.019Z"
    },
]

```

### /restaurants?restaurantId=[restaurantId]

**Returns information of a selected restaurant in database, including detailed queue information**

GET request to '/restaurants?restaurantId=[restaurantId]' returns information of a selected restaurant in the database, including the restaurant's id, image, name, phone, current queue count, and current queue information.

Current queue information includes the position, size of the group, and customer information.

Accepts the restaurant id as part of the query string.

Example:

```
request.get('https://q-dot.herokuapp.com/restaurants?restaurantId=1');

//response:

{
    "id": 3,
    "name": "Chipotle",
    "phone": "(132) 456-7990",
    "nextPosition": 0,
    "total_wait": 3,
    "average_wait": 3,
    "status": "Closed",
    "image": "../images/chipotle.jpg",
    "createdAt": "2017-10-06T19:23:09.019Z",
    "updatedAt": "2017-10-06T19:23:09.019Z"
    "queues": [
        {
            "id": 1,
            "position": 1,
            "size": 1,
            "wait": 10,
            "createdAt": "2017-10-03T19:01:10.743Z",
            "updatedAt": "2017-10-03T19:01:10.743Z",
            "restaurantId": 1,
            "customerId": 1,
            "customer": {
                "id": 1,
                "name": "Tiffany",
                "mobile": "(234) 563-9762",
                "email": null,
                "createdAt": "2017-10-03T19:01:10.702Z",
                "updatedAt": "2017-10-03T19:01:10.702Z"
            }
        },
        {
            "id": 3,
            "position": 2,
            "size": 4,
            "wait": 20,
            "createdAt": "2017-10-03T19:01:10.764Z",
            "updatedAt": "2017-10-03T19:01:10.764Z",
            "restaurantId": 1,
            "customerId": 3,
            "customer": {
                "id": 3,
                "name": "Eugene",
                "mobile": "(975) 097-8967",
                "email": "eugene@gmail.com",
                "createdAt": "2017-10-03T19:01:10.724Z",
                "updatedAt": "2017-10-03T19:01:10.724Z"
            }
        }
    ]
}

```

### /restaurants?restaurantId=[restaurantId]&status=[status]

**To update status of the restaurant's queue**

PATCH request to /restaurants will update the status of the restaurant that indicates if it is accepting more customers to add to queue. It should always be either 'Open' or 'Closed'.

Example:

```
request.patch('https://q-dot.herokuapp.com/restaurants?restaurantId=1&status=Open');

//response

Successful Request:
200 - "Status for restaurant with id [restaurantId] is now [status]"

Failed Request:
400 - 'Bad Request' (if the parameters are incorrect)
418 - 'Update for restaurant status failed' (Unknown error)

```

## /queues

**To add customer to a queue of a restaurant**

POST request to '/queues' will add a customer to the queue of a restaurant. Expected data in request is a JSON object including the name, mobile, email (optional), size and restaurantId. 

If the restaurant is open, the response is an object that includes the customer name, mobile, email (if provided), size, position and queueId. If the restaurant is closed, the response will be a string 'Restaurant has closed the queue.'

Example:

```

requestBody = {
    "name": "John", 
    //name should be a string
    "mobile": "1234550284",
    //mobile should be a string
    "email": "test@gmail.com",
    //email should be a string
    "size": 2,
    //size should be a number
    "restaurantId": 4 
    //restaurantId should be a number
}

request.post('https://q-dot.herokuapp.com/queues', requestBody);

//response

Successful Response:


200 - {
    "name": "John",
    //name will be a string
    "mobile": "1234550284",
    //mobile will be a string
    "email": "test@gmail.com",
    //email will be a string
    "queueId": 6,
    //queueId will be a number
    "size": 2,
    //size will be a number
    "position": 4,
    //position will be a number
    "queueInFrontCount": 3,
    //queueInFrontCount will be a number
    "wait": 10,
    "queueInFrontList": [
        {
            "id": 2,
            "size": 1,
            "wait": 3,
            "position": 1,
            "createdAt": "2017-10-04T22:46:20.345Z",
            "updatedAt": "2017-10-04T22:46:20.345Z",
            "restaurantId": 2,
            "customerId": 2
        },
        {
            "id": 4,
            "size": 4,
            "wait": 3,
            "position": 2,
            "createdAt": "2017-10-04T22:46:20.361Z",
            "updatedAt": "2017-10-04T22:46:20.361Z",
            "restaurantId": 2,
            "customerId": 4
        },
        {
            "id": 5,
            "size": 2,
            "wait": 3,
            "position": 3,
            "createdAt": "2017-10-05T05:01:36.260Z",
            "updatedAt": "2017-10-05T05:01:36.260Z",
            "restaurantId": 2,
            "customerId": 5
        },
    ]
}

200 - 'Restaurant has closed the queue' (if restaurant closed the queue in the interim time)
200 - 'Already added' (If the request was made more than once)

Failed Response:
400 - 'Bad Request' (if the parameters are incorrect)
418 - 'Request Failed' (Unknown error)

```
**To remove customer from a queue of a restaurant**

PUT request to '/queues?queueId=[queueId]' will remove a customer from the queue of a restaurant.

The response is a string stating the status of the change.

Example:

```

request.put('https://q-dot.herokuapp.com/queues?queueId=1');

//response

Successful Response:

If someone was removed from the queue succesfully, it will send an updated queue for that restaurant as stated below
200 - {
    "count": 2,
    "rows": [
        {
            "id": 4,
            "size": 2,
            "wait": 10,
            "position": 4,
            "createdAt": "2017-10-06T19:32:19.853Z",
            "updatedAt": "2017-10-06T19:32:19.853Z",
            "restaurantId": 1,
            "customerId": 8
        },
        {
            "id": 6,
            "size": 2,
            "wait": 20,
            "position": 6,
            "createdAt": "2017-10-06T19:32:30.997Z",
            "updatedAt": "2017-10-06T19:32:52.343Z",
            "restaurantId": 1,
            "customerId": 10
        }
    ]
};

200 - 'Already removed' (in case the request was made more than once)

Failed Response:
400 - 'Bad Request' (if the parameters are incorrect)
418 - ''Failed to change position - Unknown Error'

```
### /queues?queueId=[queueId]

**Returns detailed queue information of a selected customer in database, including customer information**

GET request to '/queues?queueId=[queueId]' will return detailed queue information of a selected customer, including his/her information.

Accepts the queue id as part of the query string.

Example:

```
request.get('https://q-dot.herokuapp.com/queues?queueId=3');

//response

Successful Request:

{
    "name": "Eugene",
    //returns a string, represents name of customer
    "mobile": "(975) 097-8967",
    //returns a string, represents mobile number of customer
    "email": "eugene@gmail.com",
    //returns a string, represents email address of customer
    "queueId": 3,
    //returns an unique integer, represents queue id
    "size": 4,
    //returns an integer, represents the group size of the customer's reservation
    "position": 2,
    //returns an integer, represents the queue number that was given to the customer 
    "wait": 6,
    //returns an integer, represents the wait time for the customer
    "queueInFrontCount": 1,
    //returns an integer, represents the number of customers in front of this customer
    "queueInFrontList": [
    //returns an array, represents details of all the customers in front of this customer
        {
            "id": 1,
            //returns an unique integer, represents the queue id
            "size": 1,
            //returns an integer, represents the group size of the customer's reservation
            "wait": 3,
            //returns an integer, represents the wiat time for that customer
            "position": 1,
            //returns an integer, represents the queue number given to this customer
            "createdAt": "2017-10-03T19:01:10.743Z",
            //returns a string, represents the date that the queue was created in the database
            "updatedAt": "2017-10-03T19:01:10.743Z",
            //returns a string, represents the date that the queue was updated in the database
            "restaurantId": 1,
            //returns an integer, represents the id of the restaurant
            "customerId": 1
            //returns an integer, represents the id of the customer in the queue
        }
    ]
}

Failed Request:
400 - 'Bad Request' (if the parameters are incorrect)
418 - 'Unknown Error - Check customerId' (Unknown error)

```
## /manager?username=[username]&password=[password]

**To create a new manager account**

POST request to /manager?username=[username]&password=[password] creates a new manager login in the database.

Manager password is salted and hashed with SHA512.

Example:

```
request.post('https://q-dot-staging.herokuapp.com/manager?username=johnnydepp&password=hunter3');

//Response

Successful Request:

[
    {
        "id": 4,
        "username": "johnnydepp",
        "passwordHash": "c134906ac85b09f6cec023f4d158057fcb05f5f9de40aa5e4dd335cd618daccbe1828521813678be25b9f92e6378107282b7d9562d3b734b38d1634cc35eb904",
        "passwordSalt": "29e080567e5b83345f42ae48ab3a373f",
        "updatedAt": "2017-10-09T01:43:30.615Z",
        "createdAt": "2017-10-09T01:43:30.615Z"
    },
    true
]

Failed Request:
400 - 'Bad Request' (if username or password is not provided)
```

## /dummydata

**To insert dummy data into database**

POST request to '/dummydata' drops all tables and adds dummy data to the database.

Does not accept any arguments as part of query string or body.

Dummy data includes:

```
request.post('https://q-dot.herokuapp.com/dummydata');

3 Restaurants:

[
    {name: 'Tempest', phone: '(123) 456-7890', image: '../images/tempest.png', 'nextPosition': 0, status: 'Open'},
    {name: 'Subway', phone: '(123) 456-7990', image: '../images/subway.png', 'nextPosition': 0, status: 
    'Open'},
    {name: 'Chipotle', phone: '(132) 456-7990', image: '../images/chipotle.png', 'nextPosition': 1, status: 'Closed'}
]

4 Customers:

[
    {name: 'tiffany', mobile: '2345639762'},
    {name: 'Neha', mobile: '(786) 987-4567', email: 'nez@gmail.com'}, 
    {name: 'Eugene', mobile: '(975) 097-8967', email: 'eugene@gmail.com'}, 
    {name: 'Johnny', mobile: '(456) 730-5746'}
]

4 Queues:

[
    {customerId: 1, restaurantId: 1, position: 1, size: 1},
    {customerId: 2, restaurantId: 2, position: 1, size: 1},
    {customerId: 3, restaurantId: 1, position: 2, size: 4},
    {customerId: 4, restaurantId: 2, position: 2, size: 4}
]

1 Manager Account:

[
  {
    username: 'johnny',
    password: 'hunter2'
  }
]
```
