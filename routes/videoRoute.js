const router = require('express').Router();
let Video = require('../models/video');


router.get('/', (req, res) => {
    Video.find()
    .then(videos => res.json(videos))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', (req, res) => {
    let newvideo = new Video(req.body);
    
    newvideo.save()
        .then(() => res.json(newvideo))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.get('/:id', (req, res) => {
    Video.findById(req.params.id)
        .then(video => res.json(video))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.delete('/:id', (req, res) => {
    Video.findByIdAndDelete(req.params.id)
        .then(() => res.json('Video deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.put('/:id', (req, res) => {
    Video.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, result) => {
        if (err){
            res.status(400).json('Error: ' + err);
        }else{
            res.json(result);
        }
    })
})

module.exports = router;