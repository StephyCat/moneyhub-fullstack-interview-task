"use strict";

const R = require("ramda")

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src");
const should = chai.should();

chai.use(chaiHttp);

describe("POST /investments/export", () => {
  it("should GET an investment entry", (done) => {
    chai.request(server)
      .post("/investments/export")
      .end((err, res) => {
        const { text } = res;

        res.should.have.status(200);

        text.should.be.a("string");
        text.split("\n").should.have.lengthOf.above(2);
        R.head(text.split("\n")).should.equal("User,First Name,Last Name,Date,Holding,Value");

        done();
      });
  });
});
