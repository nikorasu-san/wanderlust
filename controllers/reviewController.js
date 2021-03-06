const db = require("../models")

module.exports = {
    findByCountryId: function (req, res) {
        db
            .Review
            .find({ countryCode: req.params.id, isArchived: false })
            .then(dbReview => res.json(dbReview))
            .catch(err => res.status(422).json(err));
    },
    findByReviewId: function (req, res) {
        db
            .Review
            .findById(req.params.id)
            .then(dbReview => res.json(dbReview))
            .catch(err => res.status(422).json(err))
    },
    create: function (req, res) {
        db
            .Review
            .create(req.body.data)
            .then(dbReview => {
                return db
                    .User
                    .findOneAndUpdate({
                        _id: req.body.data.userId
                    }, {
                            $push: {
                                review: dbReview._id
                            }
                        }, { new: true })
            })
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(422).json(err))
    },
    findAllCodes: function (req, res) {
        db
            .Review
            .find({ isArchived: false }, {
                "_id": 0,
                "countryCode": 1
            })
            .then(codes => res.json(codes))
    },
    archiveReview: function (req, res) {
        db.Review.findByIdAndUpdate(req.params.id, { isArchived: true })
            .then(dbReview => res.json(dbReview))
            .catch(err => res.status(422).json(err))
    },
    editReview: function (req, res) {
        db.Review.findByIdAndUpdate(req.body._id, { review: req.body.review, img: req.body.img, displayName: req.body.displayName })
            .then(dbReview => res.json(dbReview))
            .catch(err => res.status(422).json(err))
    }
}