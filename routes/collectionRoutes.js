const router = require('express').Router();
let Collection = require('../models/collection');
let Video = require('../models/video');
const auth = require('../middleware/auth');
const ObjectId = require('mongoose').Types.ObjectId;
router.get('/', async (req, res) => {
    try{
        const collections = await Collection.find();
        res.json(collections.map(col => ({
            color: col.color,
            name: col.name,
            userId: col.userId,
            id: col._id
        })));
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})

router.get('/usercollections', auth, async (req, res) => {
    try{
        const collections = await Collection.find({ userId: req.user });
        res.json(collections.map(col => ({
            color: col.color,
            name: col.name,
            userId: col.userId,
            id: col._id
        })));
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})

router.get('/usercollectionsfull', auth, async (req, res) => {
    try{
        let collections = await Collection.find({ userId: req.user }).populate('videos');
        collections = collections.map(({ color, name, userId, _id, videos  }) => ({
            color,
            name,
            userId,
            id: _id,
            videos: videos.map(({ collectionId, url, name, startSeconds, endSeconds, userId, _id }) => ({
                collectionId,
                url,
                name,
                startSeconds,
                endSeconds,
                userId,
                id: _id
            })) 
        }));
        let uncategorizedVideos = await Video.find({ userId: req.user, collectionId: null });
        uncategorizedVideos = uncategorizedVideos.map(({ collectionId, url, name, startSeconds, endSeconds, userId, _id }) => ({
            collectionId,
            url,
            name,
            startSeconds,
            endSeconds,
            userId,
            id: _id
        }));
        collections.unshift({
            color: JSON.stringify({r:'200', g: '200', b: '200', a: '1'}),
            name: 'Uncategorized',
            userId: req.user,
            id: null,
            videos: uncategorizedVideos
        });
        res.json(collections);
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})

router.get('/:id', async (req, res) => {
    try{
        const collection = await Collection.findById(req.params.id);
        res.json({
            color: collection.color,
            name: collection.name,
            userId: collection.userId,
            id: collection._id
        });
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})



router.post('/add', auth, async (req, res) => {
    try{

        const newCollection = new Collection({
            ...req.body,
            userId: req.user   
        });

        const savedCollection = await newCollection.save();
        res.json({
            color: savedCollection.color,
            name: savedCollection.name,
            userId: savedCollection.userId,
            id: savedCollection._id
        });
    }catch(err){
        res.status(500).json({ errors: err.message });
    }
    
})

router.delete('/delete/:id', auth, async (req, res) => {
    const collection = await Collection.findOne({userId: req.user, _id: req.params.id });
    if (!collection)
        return res.status(404).json({ errors: "A collection with that id for that user wasn't found."})
    
    // remove all the videos from the collection
    const updatedVideos = await Video.updateMany(
        { _id: { $in: collection.videos } },
        { $set: { collectionId: null } }
    );

    //console.log(updatedVideos);
    
    const deletedCollection = await Collection.findByIdAndDelete(req.params.id);
    res.json({
        color: deletedCollection.color,
        name: deletedCollection.name,
        userId: deletedCollection.userId,
        id: deletedCollection._id
    });
})

router.put('/edit/:id', auth, async (req, res) => {
    const collection = await Collection.findOne({userId: req.user, _id: req.params.id });
    if (!collection)
        return res.status(404).json({ errors: "A collection with that id for that user wasn't found."})
    
    const updatedCollection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true});
    res.json({
        color: updatedCollection.color,
        name: updatedCollection.name,
        userId: updatedCollection.userId,
        id: updatedCollection._id
    });
})



router.put('/move/:videoId', auth, async (req, res) => {
    try{
        const { fromCollection, fromIndex, toCollection, toIndex } = req.body;
        let updatedVideo, updatedCollectionFrom, updatedCollectionTo;
        let canUpdateFrom = false, canUpdateTo = false, 
        fromCollectionNull = (fromCollection === null), toCollectionNull = (toCollection === null);

        // validation steps

        let collectionFrom, collectionTo; // will contain the from and to Collection objects from the DB
        const video = await Video.findOne({ userId: req.user, _id: req.params.videoId });
        if (!video)
            return res.status(404).json({ errors: "A video with that id for that user wasn't found."})
        
        if (fromCollection){
            // removing the video from the from collection
            collectionFrom = await Collection.findOne({ userId: req.user, _id: fromCollection });
            if (!collectionFrom)
                return res.status(404).json({ errors: "The fromCollection wasn't found."});

                // console.log(collectionFrom.videos);
                // console.log(video._id);
                
            // if (video.collectionId !== collectionFrom._id) // the other chack doesn't seem to work
            //     return res.status(404).json({ errors: "The fromCollection doesn't contain that video."});
            
            canUpdateFrom = true;
            
        }else if (fromCollectionNull){
            // removing from the null collection
            // ensure that the video collection Id is null
            if (video.collectionId !== null)
                return res.status(400).json({ errors: "That video isn't in the null collection."});
            
            canUpdateFrom = true;
        }else{
            return res.status(400).json({ errors: "Must specify a fromCollection."});
        }
        
        
        if (toCollection){
            
            // adding the video to the to collection
            collectionTo = await Collection.findOne({ userId: req.user, _id: toCollection });
            if (!collectionTo)
                return res.status(404).json({ errors: "The toCollection wasn't found."});

            if (toIndex !== 0 && !toIndex){
                return res.status(400).json({ errors: "Must specify a toIndex."});
            }
            canUpdateTo = true;

        }else if (toCollectionNull){
            // moving a video into the null collection or none
            if (toIndex || toIndex === 0){
                // cannot index in the null collection, disregard
            }
            canUpdateTo = true;
        }else {
            return res.status(400).json({ errors: "Must specify a toCollection."});
        }


        // updating steps


        if (canUpdateFrom && canUpdateTo){
            // update the from collection
            if (fromCollectionNull){
                updatedCollectionFrom = null;
            }else{
                updatedCollectionFrom = await collectionFrom.updateOne({ $pull: { videos: video._id }}, { new: true});
            }
            // update the to collection and the video
            if (toCollectionNull){
                updatedCollectionTo = null;
                updatedVideo = await video.updateOne({ collectionId: null });
            }else{
                updatedCollectionTo = await collectionTo.updateOne({ 
                    $push: { 
                        videos: { 
                            $each: [video._id], 
                            $position: toIndex
                        } 
                    }
                }, { new: true });
                updatedVideo = await video.updateOne({ collectionId: collectionTo._id });
            }
        }

        res.json({
            updatedCollectionFrom,
            updatedCollectionTo,
            updatedVideo
        });

    }catch(err){
        res.status(500).json({ errors: err.message });
    }
})





module.exports = router;