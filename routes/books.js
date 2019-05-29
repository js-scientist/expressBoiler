var express = require("express");
const bodyParser = require("body-parser");
const Books = require("../models/book");
const bookRouter = express.Router();
const mongoose = require("mongoose");
bookRouter.use(bodyParser.json());
var authenticate = require("../authenticate");
//routes here
bookRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
  })
  .get(authenticate.verifyUser, (req, res, next) => {
    Books.find({}).then(books => {
      res.json(books);
    });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Books.create(req.body)
      .then(
        book => {
          console.log("Book Created ", book);
          res.json(book);
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT not supported on /books");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Books.remove({})
      .then(
        resp => {
          res.json(resp);
          res.end("All Books Deleted");
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

module.exports = bookRouter;
