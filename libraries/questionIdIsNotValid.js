const questionIdIsNotValid = async (form, answers) => {
    const found = answers.filter((answer) => {
        let question = form.questions.some((question) => question.id == answer.questionId)

        if (question === false) {
            return true
        }
    })
    console.log(found)
    return found.length > 0 ? found[0].questionId : false

}

export default questionIdIsNotValid