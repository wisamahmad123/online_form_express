import mongoose from "mongoose"
import Form from "../models/Form.js"

class OptionController {

    async store(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: 'FORM_ID_IS_REQUIRED' } }
            if (!req.params.questionId) { throw { code: 400, message: 'QUESTION_ID_IS_REQUIRED' } }
            if (!req.body.option) { throw { code: 400, message: 'OPTION_IS_REQUIRED' } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: 'INVALID_ID' } }
            if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 400, message: 'INVALID_QUESTION_ID' } }

            const option =  {
                id: new mongoose.Types.ObjectId(),
                value: req.body.option
            }
            //update
            const form = await Form.findOneAndUpdate({
                _id: req.params.id,
                userId: req.jwt.id,

            }, { $push: { "questions.$[indexQuestion].options": option } },
                {
                    arrayFilters: [{ "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId) }],
                    new: true
                })

            if (!form) { throw { code: 404, message: 'OPTION_ADD_FAILED' } }

            return res.status(200)
                .json({
                    status: true,
                    message: 'OPTION_CREATE_SUCCESS',
                    option
                })
        } catch (err) {
            return res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message
                })
        }
    }

    async update(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: 'FORM_ID_IS_REQUIRED' }; }
            if (!req.params.questionId) { throw { code: 400, message: 'QUESTION_ID_IS_REQUIRED' }; }
            if (!req.params.optionId) { throw { code: 400, message: 'OPTION_ID_IS_REQUIRED' }; }
            if (!req.body.option) { throw { code: 400, message: 'OPTION_VALUE_IS_REQUIRED' }; }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: 'INVALID_FORM_ID' }; }
            if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 400, message: 'INVALID_QUESTION_ID' }; }
            if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) { throw { code: 400, message: 'INVALID_OPTION_ID' }; }
    
            const form = await Form.findOneAndUpdate(
                { 
                    _id: req.params.id, 
                    userId: req.jwt.id 
                },
                { 
                    $set: { "questions.$[indexQuestion].options.$[indexOption].value": req.body.option } 
                },
                { 
                    arrayFilters: [
                        { 'indexQuestion.id': new mongoose.Types.ObjectId(req.params.questionId) },
                        { 'indexOption.id': new mongoose.Types.ObjectId(req.params.optionId) }
                    ],
                    new: true 
                }
            );
    
            if (!form) { throw { code: 404, message: 'OPTION_UPDATE_FAILED' }; }
            
            return res.status(200).json({
                status: true,
                message: 'OPTION_UPDATE_SUCCESS',
                option: {
                    id: req.params.optionId,
                    value: req.body.option
                }
            })
        } catch (err) {
            
            return res.status(err.code || 500).json({
                status: false,
                message: err.message
            });
        }
    }

    async destroy(req, res) {
        try {
            if (!req.params.id) { throw { code: 400, message: 'FORM_ID_IS_REQUIRED' } }
            if (!req.params.questionId) { throw { code: 400, message: 'QUESTION_ID_IS_REQUIRED' } }
            if (!req.params.optionId) { throw { code: 400, message: 'OPTION_ID_IS_REQUIRED' } }
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: 'INVALID_ID' } }
            if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 400, message: 'INVALID_QUESTION_ID' } }
            if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) { throw { code: 400, message: 'INVALID_OPTION_ID' } }

            //delete form
            const form = await Form.findOneAndUpdate({
                _id: req.params.id,
                userId: req.jwt.id,

            }, { $pull: { "questions.$[indexQuestion].options": { id: req.params.optionId } } },
                {
                    arrayFilters: [{ "indexQuestion.id": req.params.questionId }],
                    new: true
                })

            if (!form) { throw { code: 404, message: 'OPTION_DELETE_FAILED' } }

            return res.status(200).json({
                status: true,
                message: 'OPTION_DELETE_SUCCESS',
                form
            })
        } catch (err) {
            return res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message
                })
        }
    }
}

export default new OptionController()