/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const db = [];

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const new_db = db.map((obj) => ({
        _id: obj._id,
        title: obj.title,
        commentcount: obj.comments.length,
      }));
      return res.json(new_db);
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.json("missing required field title");
      }
      const largest_id =
        db.length > 0 ? Math.max(...db.map((obj) => obj._id)) : 0;
      const new_book = {
        _id: (largest_id + 1).toString(),
        title: title,
      };
      db.push({ ...new_book, comments: [] });
      return res.json(new_book);
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      db.splice(0, db.length);
      return res.json("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book = db.filter((item) => item._id === bookid)[0];
      if (!book) {
        return res.json("no book exists");
      }
      return res.json(book);
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.json("missing required field comment");
      }
      //json res format same as .get
      let book = db.filter((book) => book._id === bookid)[0];
      if (!book) {
        return res.json("no book exists");
      }
      book.comments.push(comment);
      return res.json(book);
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const index = db.findIndex((book) => book._id === bookid);
      if (index === -1) {
        return res.json("no book exists");
      }
      db.splice(index, 1);
      return res.json("delete successful");
    });
};
