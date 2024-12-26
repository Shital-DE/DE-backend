const mongoose = require('mongoose');

const filestore = process.env.filestorecollection;
const fsfiles = process.env.fsfilescollection;
const fschunks = process.env.fschunkscollection;

//Filestore
const filestoreSchema = new mongoose.Schema({});
const filestoremodel = mongoose.model(filestore, filestoreSchema);

//fs.files
const fsfilesSchema = new mongoose.Schema({});
const fsfilesModel = mongoose.model(fsfiles, fsfilesSchema);

// fschunks.chunks
const fschunksSchema = new mongoose.Schema({});
const fschunksModel = mongoose.model(fschunks, fschunksSchema);

module.exports = { filestoremodel, fsfilesModel, fschunksModel }




