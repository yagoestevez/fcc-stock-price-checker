'use strict';

const mongoose   = require( 'mongoose' );
const { Schema } = require( 'mongoose' );

module.exports = class LikeModel {

  constructor ( ) {
    this.LikeSchema = new Schema( {
      symbol : { type: String, required: true },
      likes  : { type: Number, required: true },
      IPs    : [ String ]
    } );

    this.Likes = mongoose.model( 'Likes', this.LikeSchema );
  };

  // Returns the number of likes for the given symbol or 0 of no likes were returned.
  async getLikes ( symbol ) {
    const results = await this.Likes.find( { symbol } ).select( { likes: 1, _id: 0 } );
    return results[0] !== undefined ? results[0].likes : 0;
  };

  // Returns the number of likes for the given symbol or 0 of no likes were returned.
  async getLikesForIP ( symbol,ip ) {
    const results = await this.Likes.find( { symbol, IPs: ip } ).select( { likes: 1, _id: 0 } );
    return results[0] !== undefined ? results[0].likes : 0;
  };

  // Stores one like for the given symbol per IP and returns the results or false if no
  async likeASymbol ( symbol,ip ) {
    const likes = await this.getLikesForIP ( symbol,ip );
    if ( !likes ) {
      const results = await this.Likes.update(
        { symbol },
        {
          $push : { IPs   : ip },
          $inc  : { likes : 1  }
        },
        { upsert: true }
      );
      return results;
    } else {
      return false;
    }
  };

}