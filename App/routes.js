'use strict';

const express = require( 'express' );
const router  = express.Router();
const Library = require( './Controllers/Library' );

const ROOT    = '/';
const API     = '/api/stock-prices';
const library = new Library( );

router.get( ROOT, ( req,res ) => {
  res.render( 'index' );
} );

router.get( API, ( req,res ) => {
  // TODO
} );