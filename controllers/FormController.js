
import mongoose from "mongoose";
import Form from "../models/Form.js";
import User from "../models/User.js";

class FormController {
    async index(req, res) { 
        try{
            const limit = req.query.limit ? parseInt(req.query.limit) : 10
            const page  = req.query.page ? req.query.page : 1
            
            const options = {
                page: page,
                limit: limit,
            };
            
            let find = { userId: req.jwt.id };
    
            //query
            const forms = await Form.paginate(find, options);
            if(!forms) { throw { code: 404, message: "FORM_DATA_NOT_FOUND" } }

            res.status(200).json({
                status: true,
                message: "LIST_FORM",
                forms
            })
            
        } catch (err){
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }

    async store(req, res) {
        //simpan sebuah task baru
        try {
            //create questions
            const newForm = new Form({
                userId: req.jwt.id,
                title: "Untitled Form",
                description: null,
                questions: [],
                public: true
            });
            const form = await newForm.save();
            if(!form) { throw { code: 500, message: "FAILED_CREATE_FORM" } }

            res.status(200).json({
                status: true,
                message: "SUCCESS_CREATE_FORM",
                form
            })
        } catch (err) {
            if(!err.code) { err.code = 500 }
            res.status(err.code).json({
                status: false,
                message: err.message,
            })
        }
    }
    
    async show(req, res) {
        try{
            //show one form
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            const form = await Form.findOne({ _id: req.params.id, userId: req.jwt.id });
            if(!form) { throw { code: 404, message: "FORM_NOT_FOUND" } }

            res.status(200).json({
                status: true,
                message: "FORM_FOUND",
                form
            })
        } catch (err) {
            if(!err.code) { err.code = 500 }
            res.status(err.code).json({
                status: false,
                message: err.message,
            })
        }
    }

    async update(req, res) {
        try{
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            //update form
            const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, 
                                                    req.body, 
                                                    { new: true });
            if(!form) { throw { code: 500, message: "FORM_UPDATE_FAILED" } }

            return res.status(200).json({ 
                status: true,
                message: 'FORM_UPDATE_SUCCESS',
                form
            });
        } catch (err){
            if(!err.code) { err.code = 500 }
            return res.status(err.code).json({ 
                status: false,
                message: err.message 
            });
        }
    }

    async destroy(req, res) {
        //delete form
        try{
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            const form = await Form.findOneAndDelete({ _id: req.params.id, userId: req.jwt.id });
            if(!form) { throw { code: 500, message: "FORM_DELETE_FAILED" } }

            return res.status(200).json({
                status: true,
                message: 'FORM_DELETE_SUCCESS',
                form
            });
        }
        catch (err){
            return res.status(err.code || 500)
                    .json({
                        status: false,
                        message: err.message
                    });
        }
    }

    async showToUser(req, res) {
        try{
            //show one form
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            const form = await Form.findOne({ _id: req.params.id });
            if(!form) { throw { code: 404, message: "FORM_NOT_FOUND" } }

            if(req.jwt.id != form.userId && form.public === false) {
                const user = await User.findOne({ _id: req.jwt.id })

                if(!form.invites.includes(user.email)) { throw { code: 400, message: "YOU_ARE_NOT_INVITED" } }
            }
            form.invites = []
            res.status(200).json({
                status: true,
                message: "FORM_FOUND",
                form
            })
        } catch (err) {
            if(!err.code) { err.code = 500 }
            res.status(err.code).json({
                status: false,
                message: err.message,
            })
        }
    }


}

export default new FormController();
