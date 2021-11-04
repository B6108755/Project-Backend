var expressFunction = require('express')
const router = expressFunction.Router()
const authorization = require('./../config/authorize')


const mongoose = require('mongoose')

var Schema = require('mongoose').Schema


const eventSchema = Schema({
    title : String,
    body : String,
    file : String,
    img : String,
    urllink : String
}, {
    collection : 'eventdata'
})

let Events;

try {
    Events = mongoose.model('eventdata')
} catch (error) {
    Events = mongoose.model('eventdata', eventSchema)
}

const getOneEvent = (id) => {
    return new Promise((resolve, reject) => {
        Events.findOne({_id:id} ,(err, data) =>{
            if(err){
                reject(new Error('Cannot find Event'))
            }else {
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot find username!'))
                }
            }
        })
    })
}
router.route('/getone/:id')
    .get((req, res) => {
        getOneEvent(req.params.id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(404).json({message: 'Not Found'})
        })
    })


const getEvent = () => {
    return new Promise((resolve, reject) => {
        Events.find({} , (err, data) => {
            if(err){
                reject(new Error('Cannot get Data'))
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot get Data'))
                }
            }
        })
    })
}

router.route('/get')
    .get((req, res) => {
        getEvent()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(404).json({message: 'Not Found'})
        })
    })



const addEvent = (eventData) => {
    return new Promise((resolve, reject) => {
        var new_event = new Events(
            eventData
        )
        new_event.save((err, data) => {
            if(err){
                reject(new Error('Cannot insert Event'))
            }else{
                resolve({message : 'Successfully'})
            }
        })
    })
}


router.route('/add')
    .post(authorization ,(req, res) => {
        addEvent(req.body)
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(400).json({message : 'Cannot insert Event'})
            })
    })



const deleteEvent = (eventData) => {
    var del_event = new Events(
        eventData
    );
    return new Promise((resolve, reject) => {
        del_event.deleteOne(eventData, (err, data) => {
            if (err) {
                reject(new Error('Cannot delete member!'));
            } else {
                if (data) {
                    resolve(data)
                } else {
                    reject(new Error('Cannot delete member!'))
                }
            }
        }
        );
    });
}

router.route('/delete/:id')
    .delete(authorization, (req, res) => {
        console.log("express delete member");
        console.log(req.params.id);
        deleteEvent({_id : req.params.id})
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err =>{
                res.status(401).json(err)
            })
    })





module.exports = router
    