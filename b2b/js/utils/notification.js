function showAlert(text, type) {
    var n = noty({
        text: text,
        type: type,
        dismissQueue: true,
        layout: 'bottomRight',
        theme: 'defaultTheme',
        timeout: 3000,
        maxVisible: 1,
        killer: true
    });
}