const router = require('express').Router();
let Video = require('../models/video');
const auth = require('../middleware/auth');



router.get('/', async (req, res) => {
    try{
        const videos = await Video.find();
        res.json(videos.map(vid => ({
            collectionId: vid.collectionId,
            url: vid.url,
            name: vid.name,
            startSeconds: vid.startSeconds,
            endSeconds: vid.endSeconds,
            userId: vid.userId,
            id: vid._id
        })));
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})

router.get('/uservideos', auth, async (req, res) => {
    try{
        const videos = await Video.find({ userId: req.user });
        res.json(videos.map(vid => ({
            collectionId: vid.collectionId,
            url: vid.url,
            name: vid.name,
            startSeconds: vid.startSeconds,
            endSeconds: vid.endSeconds,
            userId: vid.userId,
            id: vid._id
        })));
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})

router.post('/add', auth, async (req, res) => {
    try{
        const newVideo = new Video({
            ...req.body,
            userId: req.user   
        });

        const savedVideo = await newVideo.save();
        res.json({
            collectionId: savedVideo.collectionId,
            url: savedVideo.url,
            name: savedVideo.name,
            startSeconds: savedVideo.startSeconds,
            endSeconds: savedVideo.endSeconds,
            userId: savedVideo.userId,
            id: savedVideo._id
        });
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
    
})

router.get('/:id', async (req, res) => {
    try{
        const video = await Video.findById(req.params.id)
        res.json({
            collectionId: video.collectionId,
            url: video.url,
            name: video.name,
            startSeconds: video.startSeconds,
            endSeconds: video.endSeconds,
            userId: video.userId,
            id: video._id
        });
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})

router.delete('/delete/:id', auth, async (req, res) => {
    const video = await Video.findOne({userId: req.user, _id: req.params.id });
    if (!video)
        return res.status(404).json({ errors: "A video with that id for that user wasn't found."})
    
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);
    res.json({
        collectionId: deletedVideo.collectionId,
        url: deletedVideo.url,
        name: deletedVideo.name,
        startSeconds: deletedVideo.startSeconds,
        endSeconds: deletedVideo.endSeconds,
        userId: deletedVideo.userId,
        id: deletedVideo._id
    });
})

router.put('/edit/:id', auth, async (req, res) => {
    const video = await Video.findOne({userId: req.user, _id: req.params.id });
    if (!video)
        return res.status(404).json({ errors: "A video with that id for that user wasn't found."})
    
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true});
    res.json({
        collectionId: updatedVideo.collectionId,
        url: updatedVideo.url,
        name: updatedVideo.name,
        startSeconds: updatedVideo.startSeconds,
        endSeconds: updatedVideo.endSeconds,
        userId: updatedVideo.userId,
        id: updatedVideo._id
    });
})

module.exports = router;