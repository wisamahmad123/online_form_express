import mongoose from "mongoose"
import Form from "../models/Form.js"
import Answers from "../models/Answers.js"
import answerDuplicate from "../libraries/answerDuplicate.js"
import questionRequiredButEmpty from "../libraries/questionRequireButEmpty.js"
import optionValueNotExist from "../libraries/optionValueNotExist.js"
import questionIdIsNotValid from "../libraries/questionIdIsNotValid.js"
import emailNotValid from "../libraries/emailNotValid.js"


class AnswerController {
    async store(req, res) {
        try {
            if (!req.params.formId) { throw { code: 400, message: 'FORM_ID_IS_REQUIRED' } }
            if (!mongoose.Types.ObjectId.isValid(req.params.formId)) { throw { code: 400, message: 'INVALID_ID' } }

            const form = await Form.findById(req.params.formId)

            const isDuplicate = await answerDuplicate(req.body.answers)
            if (isDuplicate) { throw { code: 400, message: 'ANSWER_DUPLICATE' } }

            const questionRequiredEmpty = await questionRequiredButEmpty(form, req.body.answers)
            if (questionRequiredEmpty) { throw { code: 400, message: 'QUESTION_REQUIRED_EMPTY' } }

            const optionNotExist = await optionValueNotExist(form, req.body.answers)
            if (optionNotExist.length > 0) { throw { code: 400, message: 'OPTION_NOT_EXIST', question: optionNotExist[0].question } }

            const questionNotExist = await questionIdIsNotValid(form, req.body.answers)
            if (questionNotExist) { throw { code: 400, message: 'QUESTION_ID_NOT_VALID', question: questionNotExist } }

            const emailIsNotValid = await emailNotValid(form, req.body.answers)
            if (emailIsNotValid.length > 0) { throw { code: 400, message: 'EMAIL_IS_NOT_VALID', question: emailIsNotValid[0].question } }

            let fields = {}
            req.body.answers.forEach(answers => {
                fields[answers.questionId] = answers.value
            })
            const answers = await Answers.create({
                userId: req.jwt.id,
                formId: req.params.formId,
                ...fields
            })
            if(!answers) { throw { code: 500, message: 'ANSWER_CREATE_FAILED' } }

            res.status(200)
                .json({
                    status: true,
                    message: 'ANSWERS_SUCCESS',
                    answers
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                    question: err.question || null
                })
        }
    }
}

export default new AnswerController()