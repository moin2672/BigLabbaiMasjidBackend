const Street = require("../models/street");

exports.createStreet = (req, res, next) => {
  // const street=req.body;
  console.log(req.body);
  const street = new Street({
    streetName: req.body.streetName,
    creator: req.userData.userId,
  });
  console.log("street=", street);
  console.log("street=", street);
  street
    .save()
    .then((createdStreet) => {
      console.log("street added success");
      console.log(createdStreet._id);
      res.status(201).json({
        message: "Street added successfully!",
        streetId: createdStreet._id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Creating a Street failed!" });
    });
};

exports.updateStreet = (req, res, next) => {
  const street = new Street({
    _id: req.body._id,
    streetName: req.body.streetName,
    creator: req.userData.userId,
  });
  Street.updateOne({ _id: req.params.id, creator: req.userData.userId }, street)
    .then((result) => {
      console.log("updateStreet");
      console.log(result);
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Street updated successfully!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Updating a Street failed!" });
    });
};

exports.getStreets = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  const streetQuery = Street.find();
  let fetchedStreets;
  if (pageSize && currentPage) {
    streetQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  streetQuery
    .then((documents) => {
      fetchedStreets = documents;
      return Street.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Street fetched successfully",
        streets: fetchedStreets,
        maxStreets: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Streets failed!" });
    });
};

exports.getStreet = (req, res, next) => {
  Street.findById(req.params.id)
    .then((street) => {
      if (street) {
        res.status(200).json({ street: street });
      } else {
        res.status(404).json({ message: "Street not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Street failed!" });
    });
};

exports.getStreetsOnly = (req, res, next) => {
  Street.find({ creator: req.userData.userId })
    .select({ streetName: 1, _id: 0 })
    .then((street) => {
      if (street) {
        res.status(200).json({ streetsOnly: street });
      } else {
        res.status(404).json({ message: "Extracting streets only not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching streets only failed!" });
    });
};

exports.deleteStreet = (req, res, next) => {
  Street.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      // console.log("onDelete")
      // console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Street Deleted successfully!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Deleting the Street failed!" });
    });
};

exports.searchStreet = (req, res, next) => {
  console.log(req.query);

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  const searchText = req.query.searchtext;

  console.log(req.query);
  console.log(searchText);

  let streetQuery = Street.find();
  let fetchedStreets;

  if (searchText) {
    console.log("inside");
    console.log(searchText);
    if (searchText != "") {
      var regexValue = ".*" + searchText.toLowerCase().trim() + ".*";
      const CheckValue = new RegExp(regexValue, "i");

      streetQuery = Street.find({ streetName: CheckValue });
    }
  }

  streetQuery
    .then((streets) => {
      streetsCount = streets.length;
      console.log("inside streets - Count");
      // console.log(streetsCount)
      if (pageSize && currentPage) {
        streetQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        // console.log("inside pagination")
      }
      streetQuery
        .clone()
        .then((streets) => {
          fetchedStreets = streets;
          // console.log("inside streets")
          //console.log(streets.length)
          //console.log(fetchedStreets.length)
        })
        .then((count) => {
          console.log("inside count");
          // console.log(count)
          // FOR DUMMY USE 'COUNT = '
          if (searchText != "" || typeof searchText != "undefined") {
            count = fetchedStreets.length;
            // console.log(count)
          }
          // console.log("streetsCount=",streetsCount)
          // console.log("count=",count)
          res.status(200).json({
            message: "Filtered Streets fetched successfully",
            streets: fetchedStreets,
            maxStreets: streetsCount,
          });
        })
        .catch((error) => {
          console.log(error); //console.log("Unable to get filtered streets")
          res
            .status(500)
            .json({ message: "Failed to fetch filtered Streets!" });
        });
    })
    .catch((error) => {
      console.log(error);
      console.log("Unable to get streetsCount");
      res.status(500).json({ message: "Failed to fetch Streets Count!" });
    });
};

exports.getStreetsTotalcount = (req, res, next) => {
  console.log("streets count");

  Street.count()
    .then((totalCount) => {
      res.status(200).json({
        message: "Total no of Streets fetched successfully",
        totalStreets: totalCount,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Fetching Total no of Streets failed!" });
    });
};
