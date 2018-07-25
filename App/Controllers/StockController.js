'use strict';

const DB         = require( '../Controllers/DB' );
const LikeModel  = require( '../Models/LikeModel' );
const axios      = require( 'axios' );

const APIKEY = process.env.ALPHAVANTAGE;
const APIURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&apikey=${APIKEY}&symbol=`;

module.exports = class StockController {

  constructor ( req ) {
    new DB( ).connect( );
    this.likeModel = new LikeModel( );
  }

  async setNewLike ( symbol,IP ) {
    const results = await this.likeModel.likeASymbol( symbol, IP );
    return results;
  }

  async getOneStock ( req ) {
    const query = {
      symbol : req.query.stock,
      like   : req.query.like === undefined ? false : req.query.like !== 'false',
      IP     : req.ip
    };
    // Stores one like in the database for the stock linked to this IP if a "like" query parameter
    // has been passed and if there is no likes for the stock linked to the given IP yet.
    if ( query.like ) {
      const newLike = await this.setNewLike( query.symbol, query.IP );
    }

    // Retrieves the number of likes for the given symbol from the database.
    const likes = await this.likeModel.getLikes( query.symbol );

    // Retrieves the stock data from the external API and returns a JSON object with
    // the values for the stock name, price on close, and number of likes for the given stock.
    const results = await axios.get( APIURL+query.symbol )
      .then( res => {
        const symbol     = res.data[ 'Meta Data' ][ '2. Symbol' ]; 
        const allPrices  = res.data[ 'Time Series (Daily)' ];
        const lastPrices = Object.keys( allPrices );
        const lastClose  = allPrices[ lastPrices[ 0 ] ][ '4. close' ];
        return { 'stockData' : { stock: symbol, price: lastClose, likes: likes } } 
      } )
      .catch( error => {
        console.log( 'Error trying to get JSON data.\n\n', error );
        return { 'ERROR': 'Something went wrong while trying to access stock data. Please, try again.' }
      } );

    return results;
  }

  async getTwoStocks ( req ) {
    const query = {
      symbol : req.query.stock,
      like   : req.query.like === undefined ? false : req.query.like !== 'false',
      IP     : req.ip
    };

    // Stores one like in the database for both stocks linked to this IP if a "like" query parameter
    // has been passed and if there aren't likes for the stocks linked to the given IP yet.
    if ( query.like ) {
      const newLike1st = await this.setNewLike( query.symbol[ 0 ], query.IP );
      const newLike2nd = await this.setNewLike( query.symbol[ 1 ], query.IP );
    };

    // Retrieves the number of likes for the given symbols from the database.
    const likes1 = await this.likeModel.getLikes( query.symbol[ 0 ] );
    const likes2 = await this.likeModel.getLikes( query.symbol[ 1 ] );

    // Retrieves the stock data from the external API and returns a JSON object with
    // the values for the stock names, prices on close, and number of likes for both stocks.
    const results = await axios.all( [
      axios.get( APIURL+query.symbol[ 0 ] ),
      axios.get( APIURL+query.symbol[ 1 ] )
    ] )
      .then( axios.spread( ( res1,res2 ) => {
        const symbol1     = res1.data[ 'Meta Data' ][ '2. Symbol' ]; 
        const symbol2     = res2.data[ 'Meta Data' ][ '2. Symbol' ]; 
        const allPrices1  = res1.data[ 'Time Series (Daily)' ];
        const allPrices2  = res2.data[ 'Time Series (Daily)' ];
        const lastPrices1 = Object.keys( allPrices1 );
        const lastPrices2 = Object.keys( allPrices2 );
        const lastClose1  = allPrices1[ lastPrices1[ 0 ] ][ '4. close' ];
        const lastClose2  = allPrices2[ lastPrices2[ 0 ] ][ '4. close' ];
        return {
          'stockData' : [
            { stock : symbol1, price : lastClose1, rel_likes : likes1-likes2 },
            { stock : symbol2, price : lastClose2, rel_likes : likes2-likes1 }
          ]
        };
      } ) )
      .catch( error => {
        console.log( 'Error trying to get JSON data.\n\n', error );
        return { 'ERROR': 'Error trying to get JSON data' };
      } );

    return results;

  }

}