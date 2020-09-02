let User = require("../models/user");

// Require dev dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../routes/user");
let should = chai.should();

chai.use(chaiHttp);

let defaultUser = {
  name: "vrush23@gmail.com",
  password: "vvv123"
};

let token;

// parent block
describe("User", () => {
  beforeEach(done => {
    chai
      .request(app)
      .post("/users")
      .send(defaultUser)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  beforeEach(done => {
    chai
      .request(app)
      .post("/login")
      .send(defaultUser)
      .end((err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
  });
  afterEach(done => {
    // After each test we truncate the database
    User.remove({}, err => {
      done();
    });
  });

  describe("/get users", () => {
    it("should fetch all users successfully", done => {
      chai
        .request(app)
		.get("/user/:userId")
		.set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("users");
          done();
        });
    });
  });
});