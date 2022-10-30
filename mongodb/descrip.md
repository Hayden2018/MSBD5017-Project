## Structure

### Current DB

- There are three default database:
    - admin
    - config
    - local

### Project DB

- One database named mylink is used to store data used in project.

#### mylink

- Users:
    - dapp
```javascript
db.createUser(
    {
        user: 'dapp',
        pwd: 'msbd5017',
        roles: ["readWrite", "dbOwner"]
    }
)
```

## Operations:

### Connect

#### MongoDB Compass

- Connection URL:

> mongodb://dapp:msbd5017@124.223.197.77:27017/mylink

### Node.js

- See connection.js
    - has verified


## Server

- Ubuntu 20.04LTS 64bits
- CPU: 2 cores
- RAM: 4GB
- Storage: 60GB SSD
- Bandwidth: 6Mbps