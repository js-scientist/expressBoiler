var express = require("express");
const bodyParser = require("body-parser");
const Books = require("../models/book");
const singleBook = express.Router();
const mongoose = require("mongoose");
const uuidv4 = require("uuid/v4");
var authenticate = require("../authenticate");

singleBook.use(bodyParser.json());

singleBook
  .route("/:bookId")
  .get((req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        book => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /Books/" + req.params.bookId);
  })
  .put((req, res, next) => {
    Books.findByIdAndUpdate(
      req.params.bookId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(
        book => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    Books.findByIdAndRemove(req.params.bookId)
      .then(
        resp => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

singleBook
  .route("/:bookId/chapters")
  .get((req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        book => {
          if (book != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book.chapters);
          } else {
            err = new Error("book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        book => {
          if (book != null) {
            book.chapters.push({
              name: req.body.name,
              description: req.body.description
            });
            book.save().then(
              book => {
                Books.findById(book._id).then(book => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(book);
                });
              },
              err => next(err)
            );
          } else {
            err = new Error("book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        book => {
          if (book != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            // res.json(book.chapters);
            const chapter = book.chapters.id(req.body._id);
            // returns a matching subdocument
            chapter.set(req.body); // updates the chapter while keeping its schema
            // chapter.zipCode = req.body.zipCode; // individual fields can be set directly

            book
              .save() // saves document with subdocuments and triggers validation
              .then(book => {
                res.send({ book });
              });
          } else {
            err = new Error("book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    Books.findById(req.params.bookId)
      .then(
        book => {
          if (book != null) {
            book.chapters.id(req.body._id).remove();
            console.log("removed ", book);

            book.save().then(
              book => {
                Books.findById(book._id).then(book => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(book);
                });
              },
              err => next(err)
            );
          } else {
            err = new Error("book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

module.exports = singleBook;