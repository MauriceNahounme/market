const Thing = require("../models/thing");
const fs = require("fs");
const thing = require("../models/thing");

exports.getAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(400).json({ error }));
};

exports.createThing = (req, res, next) => {
  const thingObjet = JSON.parse(req.body.thing);
  delete thingObjet._id;
  const thing = new Thing({
    ...thingObjet,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet bien enregistré" }))
    .catch((error) => res(400).json({ error }));
};

exports.modifyThing = (req, res, next) => {
  const thingObjet = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Thing.updateOne({ _id: req.params.id }, { ...thingObjet, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet bien modifié" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteOneThing = (req, res) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      const filename = thing.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet bien supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};
