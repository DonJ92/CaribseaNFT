function ChangeClass(className) {
    document.body.classList.remove('home');
    document.body.classList.remove('profile');
    document.body.classList.remove('search');
    document.body.classList.remove('activity');
    document.body.classList.remove('item');
    document.body.classList.remove('faq');
    document.body.classList.remove('upload');
    document.body.classList.remove('connect-wallet');

    // document.body.classList.remove('has-popup');

    AddClass(className);
}

function AddClass(className) {
    document.body.classList.add(className);
}

module.exports = {ChangeClass, AddClass};