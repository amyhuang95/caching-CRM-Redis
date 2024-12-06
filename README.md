# Redis Integration for Customer Relationship Management System

This project demonstrates how Redis can be integrated into the Customer Relationship Management System developed in the [previous enhanced CRM project](https://github.com/amyhuang95/enhanced_CRM_mongoDB) to optimize the speed of retrieving recently added or viewed information. In this project, MongoDB is used as the primary database, and Redis is utilized as an in-memory key-value store for caching purposes. ([link to video demonstration](https://northeastern-my.sharepoint.com/:v:/g/personal/huang_hsin_northeastern_edu/EUxC8m0_kQBDuI1q3cF3MFYBW5CfiQ61mzbAeIOGx-T5gA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&email=qiao.yuqi%40northeastern.edu&e=hK9dq5))

## Conceptual Model (UML Class Diagram)

**In-memory key-value storage:**
The five most recently added or viewed opportunities for each customer are cached in Redis. This caching mechanism supports the feature of displaying the most recent opportunities for each customer efficiently.

![UML Class Diagram](diagrams/uml.png)

## Logical Model

### MongoDB Schema

![Logical Model Diagram](diagrams/logical_model.png)

([link](https://lucid.app/lucidchart/2da1e4e2-e400-4acb-af34-0afa0a122638/edit?view_items=JWWowJgIFUbH&invitationId=inv_f5a92ee0-36d3-4dac-9cdf-52bdf0759fc8) to Lucidchart)

### Redis Schema

<!--
Describe the Redis data structures that you are going to use to implement the functionalities you described in the previous point. (example To implement the most viewed products I will use a Redis sorted set with key "mostViewed:userId", product ids as the values and a score of the number of views of the product.). You can use/describe more than one data structure, you will need to implement at least one.
 -->

#### Data structure description

To implement the caching of recently added or viewed **5** opportunities for each customer, Redis **sorted set** is used.

The key is `recentOppty:customer_id`, which represents the opportunities of a specific customer.

The value is a list of unique opportunity IDs with the timestamps as their scores.

The set is updated whenever an opportunity is added, viewed/edited, or deleted.

#### Redis Commands for CRUD Operations

Initialization:

```Redis
FLUSHALL
```

Get the list of 5 recently added or viewed opportunities for customer with id `customer_id`:

```Redis
ZREVRANGE recentOppty:<customer_id> 0 4
```

When an opportunity `oppty_id` is added for a customer `customer_id`:

```Redis
ZADD recentOppty:<customer_id> <timestamp> <oppty_id>
```

When opportunity `oppty_id` is viewed/updated for customer `customer_id`:

```Redis
ZADD recentOppty:<customer_id> <timestamp> <oppty_id>
```

When an opportunity `oppty_id` is deleted for customer `customer_id`:

```Redis
ZREM recentOppty:<customer_id> <oppty_id>
```

## Databases Setup & Caching System

This project uses MongoDB as the primary database and Redis as the caching layer. To use the databases, install the required tools, clone this repository, navigate to this project's directory, and run the following commands in the terminal.

1. Tools required:

   - [MongoDB](https://www.mongodb.com/try/download/community) for the database server. By default, MongoDB runs on `localhost:27017`. Below commands assume this configuration.
   - [MongoDB Compass](https://www.mongodb.com/try/download/compass) for viewing the data in a user interface.
   - [Redis](https://redis.io/download) for the caching server. By default, Redis runs on `localhost:6379`.
   - [RedisInsight](https://redislabs.com/redis-enterprise/redis-insight/) for viewing the data in a user interface. To use, run the server and go to http://localhost:8001 in your browser.

2. `index.js` contains the code to interact with MongoDB and Redis. To run the code, execute the following commands:

   ```bash
   npm install
   node index.js
   ```

---

_This project was developed as part of the course CS 5200 Database Management Systems taught by Professor John Alexis Guerra Gomez at Northeastern University (Oakland)._
