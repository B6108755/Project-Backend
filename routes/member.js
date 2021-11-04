var expressFunction = require('express');
const router = expressFunction.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

var Schema = require("mongoose").Schema;
const memberScherma = Schema({
    title: String,
    firstname: String,
    lastname: String,
    sid: String,
    major: String,
    facebook: String,
    tell: String,
    file: String,
    img: String,
}, {
    collection: 'members'
});

let Member
try {
    Member = mongoose.model('members')
} catch (error) {
    Member = mongoose.model('members', memberScherma);
}

const makeHash = async (plainText) => {
    const result = await bcrypt.hash(plainText, 10);
    return result;
}

const insertMember = (dataMember) => {
    return new Promise((resolve, reject) => {
        var new_member = new Member({
            title: dataMember.title,
            firstname: dataMember.firstname,
            lastname: dataMember.lastname,
            sid: dataMember.sid,
            major: dataMember.major,
            facebook: dataMember.facebook,
            tell: dataMember.tell,
            file: dataMember.file,
            img: dataMember.img,
        });
        new_member.save((err, data) => {
            if (err) {
                reject(new Error('Cannot insert member to DB!'))
            } else {
                resolve({ message: 'member added successfully' });
            }
        });
    });
}
router.route('/addmember').post((req, res) => {
    console.log('add');

    insertMember(req.body)
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
        })
})

const getMember = () => {
    return new Promise(
        (resolve, reject) => {
            Member.find({}, (err, data) => {
                if (err) {
                    reject(new Error('Cannot get members!'));
                } else {
                    if (data) {
                        resolve(data)
                    } else {
                        reject(new Error('Cannot get members!'))
                    }
                }
            })
        }
    );
}

router.route('/getmember').get((req, res) => {
    console.log('get');
    getMember().then(result => {
        res.status(200).json(result);
    })
        .catch(err => {
            console.log(err);
        })
})

const deleteMember = (MemberID) => {
    return new Promise((resolve, reject) => {
        var new_member = new Member(
            MemberID
        );
        new_member.deleteOne(MemberID, (err, data) => {

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

router.route('/deletemember').post((req, res) => {
    console.log("express delete member");
    console.log(req.body._id);
    deleteMember({ _id: req.body._id }).then(result => {
        console.log(result);
        res.status(200).json(result);
    })
        .catch(err => {
            console.log(err);
        })
})

router.route('/updatemember').post((req, res) => {

    var query = { "_id": req.body._id };

    Member.findByIdAndUpdate(query, {
        "title": req.body.title,
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "sid": req.body.sid,
        "major": req.body.major,
        "facebook": req.body.facebook,
        "tell": req.body.tell,
        "file": req.body.file,
        "img": req.body.img

    }, { new: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
    });

})

module.exports = router