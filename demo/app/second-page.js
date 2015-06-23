function pageLoaded(args) {
	console.log('test');
    var page = args.object;
}

function pageNavigatedTo(args) {
    var page = args.object;
    console.log('navigated to ');
    page.bindingContext = page.navigationContext;
}

exports.pageNavigatedTo = pageNavigatedTo;

exports.pageLoaded = pageLoaded;
