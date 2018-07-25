'use strict';

const express         = require( 'express' );
const router          = express.Router();
const StockController = require( './Controllers/StockController' );

const ROOT   = '/';
const API    = '/api/stock-prices';
const stocks = new StockController( );

router.get( ROOT, ( req,res ) => {
  res.render( 'index' );
} );

router.get( API, async ( req,res ) => {
  if ( Array.isArray( req.query.stock ) ) {
    if ( req.query.stock.length === 2 ) {
      const result = await stocks.getTwoStocks( req );
      res.send( result );
    }
  } else if ( req.query.stock ) {
    const result = await stocks.getOneStock( req );
    res.send( result );
  } else {
    res.status( 400 ).send( 'Error: A stock symbol must be provided: e.g. /api/stock-prices?stock=goog' );
  }
} );

module.exports = router;