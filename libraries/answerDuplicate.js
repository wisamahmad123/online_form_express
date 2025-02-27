const answerDuplicate = async (answer) => {

    var seen = new Set();
    const d = answer.some((answer) => {
        if(seen.has(answer.questionId)) {
            // duplicate
            return true;
        }
        seen.add(answer.questionId);

    })
    return d
}

export default answerDuplicate