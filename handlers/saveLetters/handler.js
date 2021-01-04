
module.exports.saveLetters = (event, context, callback) => {
    console.log('Save Letters was called!');
    console.log(event);
    context.done(null, '');
}