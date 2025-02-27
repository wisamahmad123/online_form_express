import mongoose from "mongoose"
import Form from "../models/Form.js"
import isEmailValid from "../libraries/isEmailValid.js"
import User from "../models/User.js"

class InviteController {
    async index(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: "FORM_ID_IS_REQUIRED" } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: 'INVALID_ID' } }

            // Check email not found
            const form = await Form.findOne({ _id: req.params.id, userId: req.jwt.id})
                                            .select('invites')
            if (!form) { throw { code: 400, message: "INVITES_NOT_FOUND" } }

            res.status(200)
                .json({
                    status: true,
                    message: "GET_INVITE_SUCCESS",
                    invites: form.invites
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }
    
    async store(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: "FORM_ID_IS_REQUIRED" } }
            if (!req.body.email) { throw { code: 400, message: "EMAIL_IS_REQUIRED" } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: 'INVALID_ID' } }

            // Cant invite user itself
            const user = await User.findOne({ _id: req.jwt.id, email: req.body.email })
            if (user) { throw { code: 400, message: "CANNOT_INVITE_YOURSELF" } }

            // Check email already invited
            const emailInvited = await Form.findOne({ _id: req.params.id, userId: req.jwt.id, invites: { "$in": req.body.email } })
            if (emailInvited) { throw { code: 400, message: "EMAIL_ALREADY_INVITED" } }

            // Check email is valid
            if (!isEmailValid(req.body.email)) { throw { code: 400, message: "EMAIL_NOT_VALID" } }

            const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id },
                { $push: { invites: req.body.email } },
                { new: true })
            if (!form) { throw { code: 404, message: "INVITE_FAILED" } }

            res.status(200)
                .json({
                    status: true,
                    message: "INVITE_SUCCESS",
                    email: req.body.email
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }

    async destroy(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: "FORM_ID_IS_REQUIRED" } }
            if (!req.body.email) { throw { code: 400, message: "EMAIL_IS_REQUIRED" } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: 'INVALID_ID' } }

            // Check email not found
            const emailExist = await Form.findOne({ _id: req.params.id, userId: req.jwt.id, invites: { "$in": req.body.email } })
            if (!emailExist) { throw { code: 400, message: "EMAIL_NOT_FOUND" } }

            const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id },
                { $pull: { invites: req.body.email } },
                { new: true })
            if (!form) { throw { code: 500, message: "REMOVE_INVITE_FAILED" } }

            res.status(200)
                .json({
                    status: true,
                    message: "REMOVE_INVITE_SUCCESS",
                    email: req.body.email
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }
}

export default new InviteController()