const express = require('express');

const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Where we connect to a new database.
const pool = new Pool( 
    {
      // TODO: Upon downloading program, user will need to enter their PostgreSQL username as password below:
      user: '',
      password: '',
      host: 'localhost',
      database: 'movies_db'
    },
    console.log(`Connected to the movies_db database.`)
  )
  
  pool.connect();