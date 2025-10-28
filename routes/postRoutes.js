const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();
const authMiddlware = require('../middleware/authenticate');
const extractFile = require('../middleware/mimeFileConfig');

// add a post, pass an extra mware for accepting files
//multer(storage).single("image") -> expect a single file from the property image in body and passing it to the configged obj
router.post("", 
    authMiddlware,
    extractFile, 
    postController.createPost);

// get all posts
router.get("", 
    postController.getAllPosts);

// get specific post
router.get('/:id', 
    postController.getSpecificPost);

// delete specific post
router.delete('/:id', 
    authMiddlware, 
    postController.deletePost);

// update specific post
router.put('/:id', 
    authMiddlware, 
    extractFile,
    postController.updatePost);

module.exports = router;